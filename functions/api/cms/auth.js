function htmlResponse(html, { status = 200, headers = {} } = {}) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function base64UrlEncode(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function base64UrlDecode(text) {
  const padded = text.replaceAll('-', '+').replaceAll('_', '/') + '==='.slice((text.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function randomHex(bytes = 16) {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return [...data].map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCookie(request, name) {
  const raw = request.headers.get('Cookie') || '';
  const parts = raw.split(';').map(p => p.trim());
  for (const part of parts) {
    if (!part) continue;
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (key !== name) continue;
    return decodeURIComponent(part.slice(idx + 1));
  }
  return '';
}

function renderMessagePage({ title, message }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 0; padding: 28px; }
      .box { max-width: 720px; margin: 0 auto; }
      code { background: #f3f3f3; padding: 2px 6px; border-radius: 6px; }
    </style>
  </head>
  <body>
    <div class="box">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
    </div>
  </body>
</html>`;
}

function renderAuthCompletePage({ cmsOrigin, provider, payload, isError }) {
  const serializedPayload = JSON.stringify(payload);
  const successOrError = isError ? 'error' : 'success';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Authentication complete</title>
  </head>
  <body>
    <script>
      (function () {
        var cmsOrigin = ${JSON.stringify(cmsOrigin)};
        var provider = ${JSON.stringify(provider)};
        var payload = ${serializedPayload};
        var opener = window.opener;

        if (!opener) {
          document.body.textContent = 'This window was opened without an opener. Please close it and try again.';
          return;
        }

        function post(msg) {
          opener.postMessage(msg, cmsOrigin);
        }

        // NetlifyAuthenticator handshake:
        // 1) We announce we are ready ("authorizing:github").
        // 2) The CMS window echoes it back to us.
        // 3) We respond with the final success/error message.
        post('authorizing:' + provider);

        window.addEventListener('message', function (e) {
          if (e.origin !== cmsOrigin) return;
          if (e.data !== 'authorizing:' + provider) return;

          post('authorization:' + provider + ':${successOrError}:' + JSON.stringify(payload));
          window.close();
        });
      })();
    </script>
  </body>
</html>`;
}

function parseAllowedHosts(env) {
  const fallback = ['lonestarfauxscapes.com', 'www.lonestarfauxscapes.com'];
  const raw = typeof env.CMS_ALLOWED_HOSTS === 'string' ? env.CMS_ALLOWED_HOSTS : '';
  const list = raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return list.length > 0 ? list : fallback;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const baseUrl = url.origin;

  const provider = url.searchParams.get('provider') || 'github';
  if (provider !== 'github') {
    return htmlResponse(
      renderMessagePage({
        title: 'Unsupported provider',
        message: `Only "github" is supported (got "${provider}").`,
      }),
      { status: 400 },
    );
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return htmlResponse(
      renderMessagePage({
        title: 'Server not configured',
        message:
          'Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET. Add them as Cloudflare Pages environment variables.',
      }),
      { status: 500 },
    );
  }

  const redirectUri = `${baseUrl}${url.pathname}`;
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');

  // Start OAuth flow
  if (!code) {
    const scope = url.searchParams.get('scope') || 'repo';
    const siteId = url.searchParams.get('site_id');

    if (!siteId) {
      return htmlResponse(
        renderMessagePage({
          title: 'Missing site_id',
          message: 'Decap CMS did not provide a site_id. Please try again.',
        }),
        { status: 400 },
      );
    }

    const allowedHosts = parseAllowedHosts(env);
    if (!allowedHosts.includes(siteId)) {
      return htmlResponse(
        renderMessagePage({
          title: 'Unauthorized site',
          message: `This OAuth endpoint is not allowed to serve site_id "${siteId}".`,
        }),
        { status: 403 },
      );
    }

    const cmsOrigin = `https://${siteId}`;
    const nonce = randomHex(16);
    const statePayload = { nonce, provider, scope, cmsOrigin, ts: Date.now() };
    const encodedState = base64UrlEncode(JSON.stringify(statePayload));

    const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
    authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    authorizeUrl.searchParams.set('scope', scope);
    authorizeUrl.searchParams.set('state', encodedState);

    return new Response(null, {
      status: 302,
      headers: {
        Location: authorizeUrl.toString(),
        'Set-Cookie': `decap_cms_oauth_nonce=${encodeURIComponent(
          nonce,
        )}; HttpOnly; Secure; SameSite=Lax; Path=${url.pathname}; Max-Age=600`,
      },
    });
  }

  // Handle OAuth callback
  if (!stateParam) {
    return htmlResponse(
      renderMessagePage({
        title: 'Authentication failed',
        message: 'Missing OAuth state parameter. Please close this window and try again.',
      }),
      { status: 400 },
    );
  }

  let statePayload;
  try {
    statePayload = JSON.parse(base64UrlDecode(stateParam));
  } catch {
    return htmlResponse(
      renderMessagePage({
        title: 'Authentication failed',
        message: 'Invalid OAuth state parameter. Please close this window and try again.',
      }),
      { status: 400 },
    );
  }

  const cookieNonce = getCookie(request, 'decap_cms_oauth_nonce');
  if (!cookieNonce || cookieNonce !== statePayload.nonce) {
    return htmlResponse(
      renderMessagePage({
        title: 'Authentication failed',
        message: 'OAuth state mismatch. Please close this window and try again.',
      }),
      { status: 400 },
    );
  }

  const cmsOrigin = typeof statePayload.cmsOrigin === 'string' ? statePayload.cmsOrigin : '';
  if (!cmsOrigin) {
    return htmlResponse(
      renderMessagePage({
        title: 'Authentication failed',
        message: 'Missing CMS origin in OAuth state. Please close this window and try again.',
      }),
      { status: 400 },
    );
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      state: stateParam,
    }),
  });

  const tokenJson = await tokenResponse.json().catch(() => null);
  if (!tokenResponse.ok || !tokenJson?.access_token) {
    console.error('GitHub token exchange failed:', tokenJson);
    return htmlResponse(
      renderAuthCompletePage({
        cmsOrigin,
        provider,
        payload: { message: 'Failed to complete GitHub authentication' },
        isError: true,
      }),
      { status: 502 },
    );
  }

  const payload = {
    token: tokenJson.access_token,
    provider: 'github',
  };

  return htmlResponse(renderAuthCompletePage({ cmsOrigin, provider, payload, isError: false }), {
    status: 200,
    headers: {
      'Set-Cookie': `decap_cms_oauth_nonce=; HttpOnly; Secure; SameSite=Lax; Path=${url.pathname}; Max-Age=0`,
    },
  });
}

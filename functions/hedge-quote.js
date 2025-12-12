function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeText(value, { maxLength }) {
  if (value === undefined || value === null) return '';
  const text = String(value).trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

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

function renderResultPage({ title, message, detailHtml = '' }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background: #050a07; color: #f5f5f5; }
      .wrap { max-width: 760px; margin: 0 auto; padding: 48px 20px; }
      .card { background: rgba(10, 20, 15, 0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 22px; }
      h1 { margin: 0 0 12px; font-size: 28px; }
      p { margin: 0 0 14px; color: rgba(245,245,245,0.88); line-height: 1.6; }
      .detail { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08); color: rgba(245,245,245,0.75); font-size: 14px; }
      a { color: #4caf50; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(message)}</p>
        ${detailHtml ? `<div class="detail">${detailHtml}</div>` : ''}
        <p><a href="/index.html">Back to home</a></p>
      </div>
    </div>
  </body>
</html>`;
}

async function sendResendEmail({ env, subject, text, replyTo }) {
  const resendKey = env.RESEND_API_KEY;
  const toEmail = env.TO_EMAIL;
  if (!resendKey || !toEmail) {
    return { ok: false, error: 'Missing RESEND_API_KEY or TO_EMAIL' };
  }

  const fromEmail = env.FROM_EMAIL || 'onboarding@resend.dev';
  const fromName = env.FROM_NAME || 'Lone Star Faux Scapes';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: toEmail,
      subject,
      text,
      reply_to: replyTo || undefined,
    }),
  });

  if (!response.ok) {
    const vendorError = await response.text().catch(() => '(no details)');
    console.error('Resend error:', vendorError);
    return { ok: false, error: 'Resend API error' };
  }

  return { ok: true };
}

export async function onRequestPost({ request, env }) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return htmlResponse(
      renderResultPage({
        title: 'Invalid submission',
        message: 'Please go back and try again.',
      }),
      { status: 400 },
    );
  }

  const honeypot = normalizeText(formData.get('website'), { maxLength: 200 });
  if (honeypot) {
    return htmlResponse(
      renderResultPage({
        title: 'Request received',
        message: 'Thanks! We received your request. Expect a reply within one business day.',
      }),
    );
  }

  const customerName = normalizeText(formData.get('customerName'), { maxLength: 80 });
  const customerPhone = normalizeText(formData.get('customerPhone'), { maxLength: 40 });
  const customerEmail = normalizeText(formData.get('customerEmail'), { maxLength: 254 });
  const customerBusiness = normalizeText(formData.get('customerBusiness'), { maxLength: 120 });

  if (!customerName || !customerPhone || !customerEmail) {
    return htmlResponse(
      renderResultPage({
        title: 'Missing information',
        message: 'Name, phone, and email are required.',
      }),
      { status: 400 },
    );
  }

  const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const remoteIp = request.headers.get('CF-Connecting-IP') || '';
  const userAgent = request.headers.get('User-Agent') || 'Unknown';
  const referer = request.headers.get('Referer') || 'Unknown';

  const fields = [];
  for (const [key, value] of formData.entries()) {
    if (key === 'website') continue;
    if (typeof value !== 'string') continue;
    fields.push([key, normalizeText(value, { maxLength: 500 })]);
  }
  fields.sort((a, b) => a[0].localeCompare(b[0]));

  const fieldLines = fields.map(([key, value]) => `${key}: ${value || '(empty)'}`).join('\n');

  const emailBody = `
New hedge quote request (website):

Contact:
- Name: ${customerName}
- Phone: ${customerPhone}
- Email: ${customerEmail}
- Business: ${customerBusiness || 'Not provided'}

Configuration (raw form fields):
${fieldLines}

---
Submitted at: ${submittedAt} (Central Time)
IP: ${remoteIp || 'Unknown'}
User-Agent: ${userAgent}
Referer: ${referer}
  `.trim();

  const result = await sendResendEmail({
    env,
    subject: `[HEDGE QUOTE] ${customerName}`,
    text: emailBody,
    replyTo: customerEmail,
  });

  if (!result.ok) {
    return htmlResponse(
      renderResultPage({
        title: 'Something went wrong',
        message: 'Please call (760) 978-7335 or try again in a few minutes.',
        detailHtml: 'If you keep seeing this, it usually means the server email settings are missing.',
      }),
      { status: 502 },
    );
  }

  return htmlResponse(
    renderResultPage({
      title: 'Request received',
      message: 'Thanks! We received your request. Expect a reply within one business day.',
      detailHtml:
        'We’ll review your configuration and send a tailored quote (and a render if needed).',
    }),
  );
}

export function onRequestGet() {
  return htmlResponse(
    renderResultPage({
      title: 'Not found',
      message: 'This endpoint only accepts quote submissions.',
    }),
    { status: 404 },
  );
}


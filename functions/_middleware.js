import { GONE_ROUTE_PATHS } from '../config/indexing-rules.js';

const PERMANENT_REDIRECT = 301;
const GONE_ROUTES = new Set(GONE_ROUTE_PATHS.map(pathname => pathname.toLowerCase()));

const LEGACY_REDIRECTS = new Map([
  ['/privacy-wall', '/residential'],
  ['/privacy-wall/', '/residential'],
  ['/privacy-wall.html', '/residential'],
  ['/commercial-fire-retardant-tested-artificial-solutions', '/commercial'],
  ['/commercial-fire-retardant-tested-artificial-solutions/', '/commercial'],
  ['/commercial-fire-retardant-tested-artificial-solutions.html', '/commercial'],
  ['/residential-fire-retardant-tested-artificial-solutions', '/commercial'],
  ['/residential-fire-retardant-tested-artificial-solutions/', '/commercial'],
  ['/residential-fire-retardant-tested-artificial-solutions.html', '/commercial'],
  [
    '/blog/2026-01-03-artificial-living-walls-the-ultimate-guide-to-main',
    '/blog/2026-01-31-artificial-living-walls-for-the-texas-summers',
  ],
  [
    '/blog/2026-01-03-artificial-living-walls-the-ultimate-guide-to-main/',
    '/blog/2026-01-31-artificial-living-walls-for-the-texas-summers',
  ],
  [
    '/blog/2026-01-03-artificial-living-walls-the-ultimate-guide-to-main.html',
    '/blog/2026-01-31-artificial-living-walls-for-the-texas-summers',
  ],
  ['/commercial-wall-covering', '/commercial-wall'],
  ['/commercial-wall-covering/', '/commercial-wall'],
  ['/commercial-wall-covering.html', '/commercial-wall'],
  ['/artificial-living-wall', '/living-wall'],
  ['/artificial-living-wall/', '/living-wall'],
  ['/artificial-living-wall.html', '/living-wall'],
]);

function redirectTo(url, pathname) {
  const nextUrl = new URL(url.toString());
  nextUrl.pathname = pathname;
  return Response.redirect(nextUrl.toString(), PERMANENT_REDIRECT);
}

function normalizePathname(pathname) {
  const lowerPath = pathname.toLowerCase();
  if (lowerPath.length <= 1) return lowerPath;
  return lowerPath.replace(/\/+$/, '');
}

function shouldReturnGone(pathname) {
  const normalizedPath = normalizePathname(pathname);
  return GONE_ROUTES.has(pathname.toLowerCase()) || GONE_ROUTES.has(normalizedPath);
}

function goneResponse(pathname) {
  return new Response(`Gone: ${pathname}\n`, {
    status: 410,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  if (shouldReturnGone(url.pathname)) {
    return goneResponse(url.pathname);
  }

  const canonical = new URL(url.toString());
  let changed = false;

  // Task 4: force HTTPS.
  if (canonical.protocol === 'http:') {
    canonical.protocol = 'https:';
    changed = true;
  }

  // Canonicalize to apex domain.
  if (canonical.hostname === 'www.lonestarfauxscapes.com') {
    canonical.hostname = 'lonestarfauxscapes.com';
    changed = true;
  }

  const legacyRedirect = LEGACY_REDIRECTS.get(canonical.pathname);
  if (legacyRedirect) {
    canonical.pathname = legacyRedirect;
    changed = true;
  } else if (canonical.pathname === '/admin/index.html') {
    // Keep Decap CMS admin path stable.
    canonical.pathname = '/admin/';
    changed = true;
  } else if (canonical.pathname.endsWith('.html')) {
    // Task 1: normalize .html URLs to extensionless canonical routes.
    const withoutExtension = canonical.pathname.slice(0, -5);
    canonical.pathname = !withoutExtension || withoutExtension === '/index' ? '/' : withoutExtension;
    changed = true;
  }

  // Task 5: remove trailing slash except homepage and admin.
  if (canonical.pathname.length > 1 && canonical.pathname.endsWith('/') && canonical.pathname !== '/admin/') {
    canonical.pathname = canonical.pathname.replace(/\/+$/, '');
    changed = true;
  }

  if (changed) {
    return Response.redirect(canonical.toString(), PERMANENT_REDIRECT);
  }

  return next();
}

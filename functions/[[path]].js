// Answers 410 Gone for the retired URLs and passes every other request to the
// static files. Pages runs it only for the paths in app/public/_routes.json.
//
// The list is Table C of REDIRECTS.md (GONE_ROUTE_PATHS in
// config/indexing-rules.js, minus /lighthouse-report, which 301s to
// /installation in _redirects). Keep _routes.json in step; tests/redirects.test.ts
// fails when they drift.

const GONE = new Set([
  '/hero-backup',
  '/hero-backup.html',
  '/lighthouse-report.json',
  '/lh-scores.json',
  '/navbar-component',
  '/navbar-component.html',
  '/navbar-universal',
  '/navbar-universal.html',
  '/roadmap',
  '/roadmap.html',
  '/sample-page/feed',
  '/understanding-responsible-gambling-practices-a',
  '/mastering-advanced-casino-strategies-a',
  '/seasonal-shifts-how-trends-influence-gambling',
]);

const BODY = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>410 Gone | Lone Star Faux Scapes</title>
</head>
<body>
<h1>410 Gone</h1>
<p>This page has been removed.</p>
<p><a href="/">Lone Star Faux Scapes</a></p>
</body>
</html>
`;

export async function onRequest({ request, next }) {
  const { pathname } = new URL(request.url);
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (!GONE.has(path.toLowerCase())) return next();

  return new Response(request.method === 'HEAD' ? null : BODY, {
    status: 410,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

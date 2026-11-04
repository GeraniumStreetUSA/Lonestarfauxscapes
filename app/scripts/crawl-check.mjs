// Crawls a running copy of the site and checks redirects, status codes and head tags.
// Nothing is followed (redirect: 'manual') and nothing is POSTed: every request is a
// GET, plus one OPTIONS preflight on /api/contact. No form is ever submitted.
//
//   node scripts/crawl-check.mjs [baseUrl] [--dist <dir>] [--quiet]
//
// Default base is http://localhost:8788, the port of
//   npx wrangler pages dev app/dist --port 8788      (run from the repo root so it finds functions/)
// Wrangler emulates _redirects, _headers, _routes.json and the Functions.
//
// What it checks
//   A  every route in dist/sitemap.xml, every dist/**/*.html page and every
//      Table A URL of REDIRECTS.md: 200, a self canonical and the robots meta the
//      table expects. A preview build (ALLOW_INDEXING not 1) is noindex everywhere,
//      so then the robots check expects "noindex, nofollow" on every page.
//   B  every Table B source (bare, .html, trailing slash) and the Search Console
//      strays: one 301 to the right path, and that path answers 200
//   C  every Table C path: 410 with X-Robots-Tag noindex
//   N  a random unknown path (and one with a slash): 404
//   P  Pages' own redirects: /<route>.html 301 and /<route>/ 308 to /<route>, /admin to /admin/
//   F  the function endpoints, method handling only
// Exit code 1 if anything fails.

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const base = (args.find((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--dist') ?? 'http://localhost:8788').replace(/\/+$/, '');
const dist = path.resolve(option('--dist') ?? path.join(appRoot, 'dist'));
const quiet = flag('--quiet');
const ORIGIN = 'https://lonestarfauxscapes.com';

/* What to request */

async function htmlPaths(dir, prefix = '') {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === 'admin' || entry.name.startsWith('.') || entry.name === 'assets') continue;
      found.push(...(await htmlPaths(path.join(dir, entry.name), `${prefix}/${entry.name}`)));
    } else if (entry.name.endsWith('.html')) {
      const name = entry.name.slice(0, -5);
      found.push(name === 'index' && prefix === '' ? '/' : `${prefix}/${name}`);
    }
  }
  return found;
}

const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapPaths = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
const distPaths = await htmlPaths(dist);
const homeHtml = await readFile(path.join(dist, 'index.html'), 'utf8');
const previewBuild = /<meta name="robots" content="noindex, nofollow"/.test(homeHtml);

const tableA = (await readFile(path.join(appRoot, '..', 'REDIRECTS.md'), 'utf8'))
  .split('\n')
  .flatMap((line) => {
    const row = /^\| (\d+) \| `([^`]+)` \| `[^`]*` \|[^|]*\| ([^|]*) \|/.exec(line);
    return row && Number(row[1]) <= 89 ? [{ n: Number(row[1]), path: row[2], indexable: row[3].trim() }] : [];
  });
const fixture = JSON.parse(await readFile(path.join(appRoot, 'tests/fixtures/redirect-tables.json'), 'utf8'));

// Table A rows by kind: 1-77 pages, 78 the CMS, 79 /admin, 80-83 functions, 84-89 files.
const pageRoutes = new Map(); // route path -> expected robots ('index' | 'noindex')
for (const route of new Set([...sitemapPaths, ...distPaths])) {
  pageRoutes.set(route, sitemapPaths.has(route) ? 'index' : 'noindex');
}
for (const row of tableA) {
  if (row.n <= 77) pageRoutes.set(row.path, row.indexable === 'yes' ? 'index' : 'noindex');
}
const files = tableA.filter((row) => row.n >= 84).map((row) => row.path);

/* Results */

const results = [];
const record = (group, urlPath, ok, detail) => results.push({ group, urlPath, ok, detail });

async function get(urlPath, init = {}) {
  const response = await fetch(base + urlPath, { redirect: 'manual', ...init });
  const body = init.method === 'OPTIONS' || response.status === 204 ? '' : await response.text();
  return { status: response.status, headers: response.headers, body };
}

/** The path a Location header points at, whether relative or absolute. */
const locationPath = (headers) => {
  const location = headers.get('location');
  return location === null ? null : new URL(location, base + '/').pathname;
};

/** Runs async jobs a few at a time. */
async function pool(items, size, job) {
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) await job(items[next++]);
    }),
  );
}

const metaContent = (html, name) => {
  const tag = new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i').exec(html);
  return tag ? tag[1] : null;
};
const canonicalOf = (html) => /<link\s+rel="canonical"\s+href="([^"]*)"/i.exec(html)?.[1] ?? null;

/* A: pages */

await pool([...pageRoutes], 8, async ([route, expected]) => {
  const { status, headers, body } = await get(route);
  const problems = [];
  if (status !== 200) problems.push(`status ${status}${headers.get('location') ? ` -> ${headers.get('location')}` : ''}`);
  const canonical = canonicalOf(body);
  const wantCanonical = route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`;
  if (status === 200 && canonical !== wantCanonical) problems.push(`canonical ${canonical ?? 'missing'}, want ${wantCanonical}`);
  const robots = metaContent(body, 'robots');
  const wantRobots = previewBuild ? 'noindex, nofollow' : expected === 'index' ? 'index, follow' : 'noindex, follow';
  if (status === 200 && robots !== wantRobots) problems.push(`robots "${robots}", want "${wantRobots}"`);
  record('A', route, problems.length === 0, problems.length === 0 ? `200 ${robots}` : problems.join('; '));
});

// The CMS: served at /admin/, noindex by meta and header.
{
  const { status, headers, body } = await get('/admin/');
  const problems = [];
  if (status !== 200) problems.push(`status ${status}`);
  if (!/noindex/.test(metaContent(body, 'robots') ?? '')) problems.push('no robots noindex meta');
  if (!/noindex/.test(headers.get('x-robots-tag') ?? '')) problems.push('no X-Robots-Tag noindex');
  record('A', '/admin/', problems.length === 0, problems.length === 0 ? '200 noindex (meta + header)' : problems.join('; '));
}

// Static files from Table A.
await pool(files, 6, async (file) => {
  const { status } = await get(file);
  record('A', file, status === 200, `${status}`);
});

/* B: legacy redirects */

const targetStatus = new Map();
async function targetIs200(target) {
  if (!targetStatus.has(target)) targetStatus.set(target, (await get(target)).status);
  return targetStatus.get(target);
}

const legacy = fixture.redirects.flatMap((entry) => entry.from.map((from) => ({ from, to: entry.to })));
await pool(legacy, 8, async ({ from, to }) => {
  const { status, headers } = await get(from);
  const where = locationPath(headers);
  const problems = [];
  if (status !== 301) problems.push(`status ${status}, want 301`);
  if (where !== to) problems.push(`Location ${headers.get('location')}, want ${to}`);
  if (problems.length === 0) {
    const final = await targetIs200(to);
    if (final !== 200) problems.push(`target ${to} answers ${final}`);
  }
  record('B', from, problems.length === 0, problems.length === 0 ? `301 -> ${to} -> 200` : problems.join('; '));
});

/* C: gone */

const gone = fixture.gone.flatMap((p) => (/\.(html|json)$/.test(p) ? [p] : [p, `${p}/`]));
await pool(gone, 8, async (p) => {
  const { status, headers } = await get(p);
  const noindex = /noindex/.test(headers.get('x-robots-tag') ?? '');
  const ok = status === 410 && noindex;
  record('C', p, ok, `${status}${noindex ? ' noindex' : ' NO X-Robots-Tag'}${status === 301 ? ` -> ${headers.get('location')}` : ''}`);
});

/* N: unknown */

const random = Math.random().toString(36).slice(2, 10);
for (const p of [`/no-such-page-${random}`, `/no-such-page-${random}/`, `/blog/no-such-post-${random}`]) {
  const { status, body } = await get(p);
  record('N', p, status === 404, `${status}${status === 404 && /<h1/.test(body) ? ' (404 page body)' : ''}`);
}

/* P: Pages' own redirects, for every route */

await pool([...pageRoutes.keys()].filter((route) => route !== '/'), 8, async (route) => {
  for (const [variant, want] of [[`${route}.html`, [301]], [`${route}/`, [301, 308]]]) {
    const { status, headers } = await get(variant);
    const where = locationPath(headers);
    const ok = want.includes(status) && where === route;
    record('P', variant, ok, `${status}${headers.get('location') ? ` -> ${headers.get('location')}` : ''}`);
  }
});
{
  const { status, headers } = await get('/admin');
  record('P', '/admin', status === 308 && locationPath(headers) === '/admin/', `${status} -> ${headers.get('location')}`);
}

/* F: function endpoints, method handling only (no POST, nothing is sent) */

{
  const hedge = await get('/hedge-quote');
  record('F', 'GET /hedge-quote', hedge.status === 404 && /noindex/.test(hedge.headers.get('x-robots-tag') ?? ''), `${hedge.status} ${hedge.headers.get('x-robots-tag') ?? 'no X-Robots-Tag'}`);
  const contactGet = await get('/api/contact');
  record('F', 'GET /api/contact', [404, 405].includes(contactGet.status), `${contactGet.status} (POST only)`);
  const preflight = await get('/api/contact', { method: 'OPTIONS', headers: { Origin: ORIGIN } });
  record('F', 'OPTIONS /api/contact', preflight.status === 204, `${preflight.status} ${preflight.headers.get('access-control-allow-methods') ?? ''}`);
  const auth = await get('/api/cms/auth?provider=none');
  record('F', 'GET /api/cms/auth?provider=none', auth.status === 400, `${auth.status} (function is routed; rejected before any OAuth step)`);
}

/* Report */

const order = ['A', 'B', 'C', 'N', 'P', 'F'];
results.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group) || a.urlPath.localeCompare(b.urlPath));
const width = Math.max(...results.map((r) => r.urlPath.length), 4);
console.log(`crawl ${base}   dist ${dist}   ${previewBuild ? 'PREVIEW build (noindex everywhere)' : 'LIVE build (indexing on)'}\n`);
console.log(`${'GRP'}  ${'RESULT'}  ${'PATH'.padEnd(width)}  DETAIL`);
for (const r of results) {
  if (quiet && r.ok) continue;
  console.log(`${r.group}    ${r.ok ? 'pass  ' : 'FAIL  '}  ${r.urlPath.padEnd(width)}  ${r.detail}`);
}

const names = { A: 'pages and files', B: 'legacy redirects', C: 'gone (410)', N: 'unknown (404)', P: 'Pages .html and slash redirects', F: 'function endpoints' };
console.log('\nSUMMARY');
let failed = 0;
for (const group of order) {
  const rows = results.filter((r) => r.group === group);
  const bad = rows.filter((r) => !r.ok).length;
  failed += bad;
  console.log(`  ${group}  ${names[group].padEnd(32)} ${String(rows.length - bad).padStart(3)} pass  ${String(bad).padStart(3)} fail`);
}
console.log(`  total ${results.length}: ${results.length - failed} pass, ${failed} fail`);
process.exit(failed === 0 ? 0 : 1);

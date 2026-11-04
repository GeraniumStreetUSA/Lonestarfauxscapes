import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { allRoutes } from '../src/routes.ts';

/**
 * public/_redirects, public/_headers, public/_routes.json and
 * functions/[[path]].js, checked without Cloudflare. The matcher below follows
 * the one Wrangler and Pages use for _redirects: a rule matches the whole path,
 * `*` is one splat that matches anything (slashes too), `:name` matches one
 * path segment, the first matching rule wins, the query string is ignored.
 * Static and dynamic rule limits are Pages' own (2000 and 100).
 */

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const redirectsText = read('../public/_redirects');
const headersText = read('../public/_headers');
const routesJson = JSON.parse(read('../public/_routes.json')) as { version: number; include: string[]; exclude: string[] };
const fixture = JSON.parse(read('./fixtures/redirect-tables.json')) as {
  redirects: { from: string[]; to: string }[];
  gone: string[];
};

interface Rule {
  source: string;
  destination: string;
  status: number;
  dynamic: boolean;
  regex: RegExp;
}

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function parseRedirects(text: string): Rule[] {
  const rules: Rule[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;
    const parts = line.split(/\s+/);
    assert.ok(parts.length === 2 || parts.length === 3, `bad rule: ${line}`);
    const [source, destination, status] = parts;
    const pattern = source
      .split('*')
      .map(escapeRegex)
      .join('(?<splat>.*)')
      .replace(/:(\w+)/g, (_match, name: string) => `(?<${name}>[^/]+)`);
    rules.push({
      source,
      destination,
      status: status === undefined ? 302 : Number(status),
      dynamic: /[*:]/.test(source),
      regex: new RegExp(`^${pattern}$`),
    });
  }
  return rules;
}

const rules = parseRedirects(redirectsText);

/** The first rule that matches a path, with its destination filled in; null for none. */
function redirectFor(path: string): { to: string; status: number; rule: Rule } | null {
  for (const rule of rules) {
    const match = rule.regex.exec(path);
    if (!match) continue;
    const groups = match.groups ?? {};
    const to = rule.destination.replace(/:(\w+)/g, (whole, name: string) => groups[name] ?? whole);
    return { to, status: rule.status, rule };
  }
  return null;
}

const routes = allRoutes();
const routePaths = new Set(routes.map((route) => route.path));
// Files the build puts in dist/ that a visitor can reach: one .html per route and the CMS entry.
const servedPaths = new Set([...routePaths, '/admin/']);

interface Outcome {
  status: number;
  to?: string;
}

/** What a visitor gets for a path: _redirects first, then Pages' own file lookup. */
function resolve(path: string): Outcome {
  const redirect = redirectFor(path);
  if (redirect) return { status: redirect.status, to: redirect.to };
  if (servedPaths.has(path)) return { status: 200 };
  if (path === '/admin') return { status: 308, to: '/admin/' };
  // No dir/index.html but dir.html exists: Pages 308s the slash away.
  if (path.length > 1 && path.endsWith('/') && routePaths.has(path.slice(0, -1))) {
    return { status: 308, to: path.slice(0, -1) };
  }
  return { status: 404 };
}

/** Every redirect source in the fixture, with its target. */
const legacy = fixture.redirects.flatMap((entry) => entry.from.map((from) => ({ from, to: entry.to })));

/** Table A of REDIRECTS.md, every row (89 URLs), read from the file itself. */
const tableA = read('../../REDIRECTS.md')
  .split('\n')
  .flatMap((line) => {
    const row = /^\| (\d+) \| `([^`]+)` \|/.exec(line);
    return row && Number(row[1]) <= 89 ? [row[2]] : [];
  })
  // The table has the same URL under /admin/ and /admin; the second is a native 308, checked below.
  .filter((path) => path !== '/admin');

test('Table A and the fixture were read', () => {
  assert.equal(tableA.length, 88);
  assert.equal(fixture.redirects.length, 31);
  assert.equal(legacy.length, 89);
  assert.equal(fixture.gone.length, 14);
});

test('_redirects stays inside the Pages limits and every rule is a 301', () => {
  assert.ok(rules.filter((rule) => !rule.dynamic).length <= 2000);
  assert.ok(rules.filter((rule) => rule.dynamic).length <= 100);
  assert.equal(rules.length, 90);
  assert.deepEqual(rules.filter((rule) => rule.status !== 301), []);
  const sources = rules.map((rule) => rule.source);
  assert.equal(new Set(sources).size, sources.length, 'duplicate source');
  assert.ok(!redirectsText.includes('\u2014'), 'em-dash in _redirects');
});

test('the only dynamic rule is /*.html, and it is last, below every explicit rule', () => {
  const dynamic = rules.filter((rule) => rule.dynamic);
  assert.deepEqual(dynamic.map((rule) => rule.source), ['/*.html']);
  assert.equal(rules[rules.length - 1].source, '/*.html');
  assert.equal(rules.some((rule) => rule.source === '/:path/'), false, 'no global trailing-slash rule');
});

test('every legacy source (bare, .html, trailing slash) 301s to its target in one hop', () => {
  for (const { from, to } of legacy) {
    const first = resolve(from);
    assert.deepEqual(first, { status: 301, to }, from);
    // The target answers 200 itself: no second hop.
    assert.deepEqual(resolve(to), { status: 200 }, `${from} -> ${to}`);
  }
});

test('every legacy target is a real route or /admin/', () => {
  for (const { to } of fixture.redirects) assert.ok(servedPaths.has(to), to);
});

test('every legacy page has all three variants, except the two entry points', () => {
  for (const entry of fixture.redirects) {
    if (entry.to === '/' || entry.to === '/admin/') {
      assert.equal(entry.from.length, 1);
      continue;
    }
    const base = entry.from[0];
    assert.deepEqual(entry.from, [base, `${base}.html`, `${base}/`]);
  }
});

test('no redirect target is itself a redirect source (no chains)', () => {
  for (const rule of rules) {
    if (rule.dynamic) continue;
    assert.equal(redirectFor(rule.destination), null, `${rule.source} -> ${rule.destination}`);
  }
  // The global rule lands on the slashless path of every route.
  for (const path of routePaths) {
    if (path === '/') continue;
    assert.deepEqual(resolve(`${path}.html`), { status: 301, to: path }, `${path}.html`);
    assert.deepEqual(resolve(path), { status: 200 }, path);
  }
});

test('/index.html goes to /, /admin/index.html to /admin/, and /admin/ is not redirected', () => {
  assert.deepEqual(resolve('/index.html'), { status: 301, to: '/' });
  assert.deepEqual(resolve('/admin/index.html'), { status: 301, to: '/admin/' });
  assert.equal(redirectFor('/admin/'), null);
  assert.deepEqual(resolve('/admin/'), { status: 200 });
  assert.deepEqual(resolve('/admin'), { status: 308, to: '/admin/' });
});

test('no Table A URL is redirected by _redirects', () => {
  for (const path of tableA) assert.equal(redirectFor(path), null, path);
});

test('no route in the manifest is redirected, with or without a trailing slash', () => {
  for (const path of routePaths) {
    assert.equal(redirectFor(path), null, path);
    if (path !== '/') assert.equal(redirectFor(`${path}/`), null, `${path}/`);
  }
});

test('/privacy-wall is a page, not a redirect', () => {
  assert.ok(routePaths.has('/privacy-wall'));
  assert.deepEqual(resolve('/privacy-wall'), { status: 200 });
  assert.deepEqual(resolve('/privacy-wall.html'), { status: 301, to: '/privacy-wall' });
  assert.equal(rules.some((rule) => rule.source.startsWith('/privacy-wall')), false);
});

test('suburb pages, /case-studies, /commercial-resources and /lighthouse-report keep the owner decisions', () => {
  for (const path of ['/plano', '/frisco', '/irving', '/arlington', '/sugar-land', '/the-woodlands', '/commercial-resources']) {
    assert.deepEqual(resolve(path), { status: 200 }, path);
  }
  assert.deepEqual(resolve('/case-studies'), { status: 200 });
  assert.deepEqual(resolve('/projects'), { status: 301, to: '/case-studies' });
  assert.deepEqual(resolve('/lighthouse-report'), { status: 301, to: '/installation' });
});

test('the two Search Console strays 301 in one hop to the NFPA post', () => {
  const target = '/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery';
  assert.ok(routePaths.has(target));
  for (const stray of [
    `${target}-explained`,
    '/graph-nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery-explained',
  ]) {
    assert.deepEqual(resolve(stray), { status: 301, to: target }, stray);
    assert.deepEqual(resolve(`${stray}.html`), { status: 301, to: target }, `${stray}.html`);
    assert.deepEqual(resolve(`${stray}/`), { status: 301, to: target }, `${stray}/`);
  }
});

test('blog and case-study folders sit next to their index pages without a clash', (t) => {
  for (const index of ['/blog', '/case-studies']) {
    assert.deepEqual(resolve(index), { status: 200 });
    assert.deepEqual(resolve(`${index}/`), { status: 308, to: index });
    const children = routes.filter((route) => route.path.startsWith(`${index}/`));
    // CASE_STUDY_ROUTES is empty until the case-study pages land; the model still covers /case-studies itself.
    if (children.length === 0 && index === '/case-studies') t.diagnostic('no /case-studies/<slug> routes in the manifest yet');
    else assert.ok(children.length > 0, index);
    for (const child of children) {
      assert.deepEqual(resolve(child.path), { status: 200 }, child.path);
      assert.deepEqual(resolve(`${child.path}/`), { status: 308, to: child.path }, `${child.path}/`);
    }
  }
});

/* 410s: functions/[[path]].js and public/_routes.json */

type Handler = (context: { request: Request; next: () => Promise<Response> | Response }) => Promise<Response>;
const { onRequest } = (await import(new URL('../../functions/[[path]].js', import.meta.url).href)) as {
  onRequest: Handler;
};

const PASSED = new Response('static', { status: 200 });
const call = (path: string, method = 'GET') =>
  onRequest({ request: new Request(`https://lonestarfauxscapes.com${path}`, { method }), next: () => PASSED });

/** Whether a _routes.json pattern matches a path: exact, or a trailing `/*` prefix. */
const routesJsonMatches = (path: string) =>
  routesJson.include.some((pattern) =>
    pattern.endsWith('/*') ? path.startsWith(pattern.slice(0, -1)) : pattern === path,
  );

test('every Table C path answers 410 with noindex, with and without a trailing slash', async () => {
  for (const path of fixture.gone) {
    const variants = /\.(html|json)$/.test(path) ? [path] : [path, `${path}/`];
    for (const variant of variants) {
      const response = await call(variant);
      assert.equal(response.status, 410, variant);
      assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/, variant);
      assert.match(await response.text(), /410 Gone/, variant);
    }
  }
  const head = await call('/roadmap', 'HEAD');
  assert.equal(head.status, 410);
  assert.equal(await head.text(), '');
});

test('every other path, including /lighthouse-report and every route, is passed on', async () => {
  const paths = ['/lighthouse-report', '/lighthouse-report.html', '/unknown-page', '/roadmap-2', '/blog/roadmap', '/', ...routePaths];
  for (const path of paths) assert.equal(await call(path), PASSED, path);
});

test('_routes.json runs Functions for /api/*, /hedge-quote and the Table C paths only', () => {
  assert.equal(routesJson.version, 1);
  assert.deepEqual(routesJson.exclude, []);
  assert.ok(routesJson.include.length <= 100);
  // The existing endpoints: functions/api/contact.js, functions/api/cms/auth/*, functions/hedge-quote.js.
  for (const path of ['/api/contact', '/api/cms/auth', '/api/cms/auth/refresh', '/hedge-quote']) {
    assert.ok(routesJsonMatches(path), path);
  }
  for (const path of fixture.gone) {
    assert.ok(routesJsonMatches(path), path);
    if (!/\.(html|json)$/.test(path)) assert.ok(routesJsonMatches(`${path}/`), `${path}/`);
  }
  // Everything else is static.
  for (const path of [...routePaths, '/admin/', '/assets/x.js', '/lighthouse-report', '/sitemap.xml', '/robots.txt']) {
    assert.ok(!routesJsonMatches(path), path);
  }
  assert.ok(!routesJson.include.some((pattern) => pattern === '/*'), 'no catch-all include');
});

test('no Table C path is redirected by _redirects (a .html one is taken by the function first)', () => {
  for (const path of fixture.gone) {
    if (path.endsWith('.html')) assert.equal(redirectFor(path)?.rule.source, '/*.html', path);
    else assert.equal(redirectFor(path), null, path);
    assert.ok(!routePaths.has(path.replace(/\.html$/, '')), path);
  }
});

/* _headers */

interface HeaderBlock {
  pattern: string;
  headers: Map<string, string>;
}

function parseHeaders(text: string): HeaderBlock[] {
  const blocks: HeaderBlock[] = [];
  for (const raw of text.split('\n')) {
    if (raw.trim() === '' || raw.trim().startsWith('#')) continue;
    if (/^\s/.test(raw)) {
      const block = blocks[blocks.length - 1];
      assert.ok(block, `header before a pattern: ${raw}`);
      const colon = raw.indexOf(':');
      block.headers.set(raw.slice(0, colon).trim().toLowerCase(), raw.slice(colon + 1).trim());
    } else {
      blocks.push({ pattern: raw.trim(), headers: new Map() });
    }
  }
  return blocks;
}

const headerBlocks = parseHeaders(headersText);
const blockFor = (pattern: string) => headerBlocks.find((block) => block.pattern === pattern);

test('_headers: security headers on /*, and no Cache-Control there', () => {
  const all = blockFor('/*');
  assert.ok(all);
  for (const name of ['x-content-type-options', 'x-frame-options', 'strict-transport-security', 'referrer-policy', 'permissions-policy']) {
    assert.ok(all.headers.has(name), name);
  }
  assert.equal(all.headers.has('cache-control'), false);
  assert.ok(!headersText.includes('\u2014'), 'em-dash in _headers');
});

test('_headers: hashed assets are immutable for a year, and no rule has a duplicate pattern', () => {
  assert.equal(blockFor('/assets/*')?.headers.get('cache-control'), 'public, max-age=31536000, immutable');
  const patterns = headerBlocks.map((block) => block.pattern);
  assert.equal(new Set(patterns).size, patterns.length);
  // Unhashed files are never immutable.
  for (const pattern of ['/fonts/*', '/images/*', '/favicon/*']) {
    assert.doesNotMatch(blockFor(pattern)?.headers.get('cache-control') ?? '', /immutable/, pattern);
  }
});

test('_headers: pages.dev hosts are noindex', () => {
  for (const pattern of ['https://:project.pages.dev/*', 'https://:version.:project.pages.dev/*']) {
    assert.match(blockFor(pattern)?.headers.get('x-robots-tag') ?? '', /noindex/, pattern);
  }
});

test('_headers: every noindex route and the CMS carry X-Robots-Tag noindex', () => {
  for (const route of routes) {
    if (route.robots !== 'noindex') continue;
    assert.match(blockFor(route.path)?.headers.get('x-robots-tag') ?? '', /noindex/, route.path);
  }
  assert.match(blockFor('/admin/*')?.headers.get('x-robots-tag') ?? '', /noindex/);
  // /admin/* already matches /admin/: a second rule would double the header value.
  assert.equal(blockFor('/admin/'), undefined);
});

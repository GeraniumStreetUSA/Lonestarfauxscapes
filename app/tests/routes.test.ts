import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { allRoutes, findRoute, resolveRoute } from '../src/routes.ts';
import { buildHead, buildSitemap, canonicalUrl } from '../src/lib/seo.ts';

const routes = allRoutes();

/** Table A rows 1-28 and 66-77 of REDIRECTS.md: the static pages, read from the file itself. */
const tableA = readFileSync(new URL('../../REDIRECTS.md', import.meta.url), 'utf8')
  .split('\n')
  .flatMap((line) => {
    const row = /^\| (\d+) \| `([^`]+)` \|/.exec(line);
    if (!row) return [];
    const n = Number(row[1]);
    return (n >= 1 && n <= 28) || (n >= 66 && n <= 77) ? [row[2]] : [];
  });

test('REDIRECTS.md Table A rows 1-28 and 66-77 were read (40 static pages)', () => {
  assert.equal(tableA.length, 40);
});

test('every Table A static path, and /privacy-wall, is in the manifest exactly once', () => {
  for (const path of [...tableA, '/privacy-wall']) {
    assert.equal(routes.filter((route) => route.path === path).length, 1, path);
  }
});

test('paths are slashless, absolute and unique', () => {
  const seen = new Set<string>();
  for (const { path } of routes) {
    assert.ok(path.startsWith('/'), path);
    assert.ok(path === '/' || !path.endsWith('/'), path);
    assert.ok(!seen.has(path), `duplicate ${path}`);
    seen.add(path);
  }
});

/*
 * Titles over 65 and descriptions over 160 characters. These are the live
 * pages' own, tuned against Search Console, so they are kept as they are
 * (reported to the owner) rather than rewritten. Anything new must fit.
 */
const LONG_TITLES = new Set([
  '/living-wall',
  '/commercial-resources',
  '/case-studies/austin-high-end-residential-privacy',
  '/case-studies/houston-restaurant-hedges',
  '/case-studies/houston-storefront-hedges',
]);
const LONG_DESCRIPTIONS = new Set<string>([]);

test('titles are at most 65 characters and descriptions at most 160, bar the listed exceptions', () => {
  for (const route of routes) {
    assert.ok(route.title.length > 0 && route.description.length > 0, route.path);
    if (!LONG_TITLES.has(route.path)) assert.ok(route.title.length <= 65, `${route.path} title ${route.title.length}`);
    if (!LONG_DESCRIPTIONS.has(route.path)) {
      assert.ok(route.description.length <= 160, `${route.path} description ${route.description.length}`);
    }
  }
  for (const path of [...LONG_TITLES, ...LONG_DESCRIPTIONS]) assert.ok(findRoute(path), `${path} is not a route`);
  for (const path of LONG_TITLES) assert.ok(findRoute(path)!.title.length > 65, `${path} no longer needs its exception`);
  for (const path of LONG_DESCRIPTIONS) {
    assert.ok(findRoute(path)!.description.length > 160, `${path} no longer needs its exception`);
  }
});

test('no em-dash in a title or description', () => {
  for (const route of routes) assert.doesNotMatch(route.title + route.description, /\u2014/, route.path);
});

test('robots and sitemap flags: suburbs, legal, utility pages and 404 are noindex and out of the sitemap', () => {
  const noindex = [
    '/plano', '/frisco', '/irving', '/arlington', '/sugar-land', '/the-woodlands',
    '/terms', '/privacy', '/sitemap', '/hedge-builder-residential', '/hedge-builder-commercial', '/404',
  ];
  for (const route of routes) {
    assert.equal(route.robots === 'noindex', noindex.includes(route.path), route.path);
    assert.equal(route.sitemap, route.robots === 'index', route.path);
  }
});

test('sitemap.xml lists exactly the indexable sitemap routes', () => {
  const xml = buildSitemap(routes);
  const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = routes.filter((r) => r.sitemap && r.robots === 'index').map((r) => canonicalUrl(r.path));
  assert.deepEqual(listed, expected);
  assert.ok(listed.includes('https://lonestarfauxscapes.com/'), 'home keeps its trailing slash');
  assert.ok(!listed.includes('https://lonestarfauxscapes.com/plano'));
  assert.equal(new Set(listed).size, listed.length);
});

test('an unknown path gets the 404 route; a trailing slash is ignored', () => {
  assert.equal(resolveRoute('/no-such-page').path, '/404');
  assert.equal(resolveRoute('/dallas/').path, '/dallas');
  assert.equal(resolveRoute('/').path, '/');
});

test('head: noindex everywhere unless indexing is allowed; canonical is absolute', () => {
  const dallas = findRoute('/dallas')!;
  const plano = findRoute('/plano')!;
  assert.match(buildHead(dallas, { allowIndexing: false }), /content="noindex, nofollow"/);
  assert.match(buildHead(dallas, { allowIndexing: true }), /content="index, follow"/);
  assert.match(buildHead(plano, { allowIndexing: true }), /content="noindex, follow"/);
  assert.match(buildHead(dallas, { allowIndexing: true }), /<link rel="canonical" href="https:\/\/lonestarfauxscapes\.com\/dallas" \/>/);
  assert.match(buildHead(findRoute('/')!, { allowIndexing: true }), /<link rel="canonical" href="https:\/\/lonestarfauxscapes\.com\/" \/>/);
});

test('head: one JSON-LD graph that parses, with the business once and FAQPage on the homepage only', () => {
  for (const route of routes) {
    const head = buildHead(route, { allowIndexing: true });
    const blocks = [...head.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)];
    assert.equal(blocks.length, 1, route.path);
    const types = (JSON.parse(blocks[0][1]) as { '@graph': { '@type': string }[] })['@graph'].map((n) => n['@type']);
    assert.equal(types.filter((t) => t === 'HomeAndConstructionBusiness').length, 1, route.path);
    assert.equal(types.includes('FAQPage'), route.path === '/', route.path);
    assert.equal(types.includes('BreadcrumbList'), route.breadcrumbs.length > 0, route.path);
  }
});

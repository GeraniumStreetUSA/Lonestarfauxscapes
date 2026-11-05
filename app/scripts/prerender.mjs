// Writes one static HTML page per route into dist/, plus sitemap.xml,
// robots.txt and llms.txt.
//
//   npm run build   (client build -> server build -> legacy assets -> this)
//
// Each page is dist/index.html (the client build's template) with the route's
// head tags inserted, #root filled with the server-rendered page, and a
// modulepreload for the route's own JS chunk (read from the Vite manifest).
//   /          -> dist/index.html
//   /dallas    -> dist/dallas.html          (Cloudflare Pages serves it at /dallas)
//   /blog/x    -> dist/blog/x.html
//   /404       -> dist/404.html             (Pages answers unknown paths with it, status 404)
// ALLOW_INDEXING=1 lets pages be indexed; anything else is a noindex preview.
// Fails the build if a page renders empty or without exactly one <h1>.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(appRoot, 'dist');
const distSsr = path.join(appRoot, 'dist-ssr');

const allowIndexing = process.env.ALLOW_INDEXING === '1';

const ssr = await import(pathToFileURL(path.join(distSsr, 'entry-server.js')).href);
const routes = ssr.allRoutes();

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const ROOT = '<div id="root"></div>';
if (!template.includes(ROOT) || !template.includes('</head>')) {
  throw new Error('dist/index.html is not the client build template (already prerendered? run npm run build again)');
}
const manifest = JSON.parse(await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));

/**
 * The client manifest entry for a lazy page, matched by its source file
 * (`src/pages/routes/<name>.tsx`) or else the server chunk's name. A page
 * module that only re-exports another (a placeholder) is merged away by the
 * bundler and has no entry: it gets no preload, which costs speed, not
 * correctness, so that is a warning.
 */
function pageEntry(route) {
  const match = /import\(\s*["'][^"']*?([^/"']+)\.js["']\s*\)/.exec(route.load.toString());
  if (!match) throw new Error(`${route.path}: cannot read the page chunk from its load()`);
  // The bundler suffixes a clashing chunk name with a number (case-studies2).
  const name = match[1].replace(/(?<=[a-z])\d+$/, '');
  // Prefer the route module itself (src/pages/routes/<name>.tsx): a bare name
  // can clash with another module (case-studies vs data/case-studies.ts).
  const bySource =
    Object.entries(manifest).find(([key, chunk]) => chunk.isDynamicEntry && key === `src/pages/routes/${name}.tsx`) ??
    Object.entries(manifest).find(
      ([key, chunk]) => chunk.isDynamicEntry && /\.(tsx|ts)$/.test(key) && path.basename(key).replace(/\.(tsx|ts)$/, '') === name,
    );
  const entry = bySource?.[1] ?? Object.values(manifest).find((chunk) => chunk.isDynamicEntry && chunk.name === name);
  if (!entry) console.warn(`prerender: ${route.path} has no page chunk named ${name} (placeholder?), no preload`);
  return entry ?? null;
}

/** Preload tags for a page chunk, its static imports and its CSS. */
function preloadTags(route) {
  const files = new Set();
  const styles = new Set();
  const visit = (chunk) => {
    if (files.has(chunk.file)) return;
    files.add(chunk.file);
    (chunk.css ?? []).forEach((css) => styles.add(css));
    (chunk.imports ?? []).forEach((key) => visit(manifest[key]));
  };
  const entry = pageEntry(route);
  if (entry) visit(entry);
  // The template already loads the entry's own files.
  const fresh = (file) => !template.includes(`/${file}"`);
  return [
    ...[...styles].filter(fresh).map((file) => `<link rel="stylesheet" crossorigin href="/${file}" />`),
    ...[...files].filter(fresh).map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`),
  ];
}

/** Where a route's HTML goes under dist/. */
function outputFile(routePath) {
  if (routePath === '/') return path.join(dist, 'index.html');
  return path.join(dist, `${routePath.slice(1)}.html`);
}

function check(route, html) {
  const problems = [];
  if (html.trim() === '') problems.push('empty #root');
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) problems.push(`${h1s} <h1> elements (expected 1)`);
  return problems.map((problem) => `${route.path}: ${problem}`);
}

const failures = [];
const pages = [];
for (const route of routes) {
  const { html } = await ssr.render(route.path);
  const problems = check(route, html);
  if (problems.length > 0) {
    failures.push(...problems);
    continue;
  }
  const head = [ssr.buildHead(route, { allowIndexing }), ...preloadTags(route)].join('\n    ');
  pages.push({
    file: outputFile(route.path),
    // A function replacement: the markup may contain `$` sequences.
    page: template.replace('</head>', () => `  ${head}\n  </head>`).replace(ROOT, () => `<div id="root">${html}</div>`),
  });
}
if (failures.length > 0) {
  console.error(`prerender failed:\n${failures.map((line) => `  ${line}`).join('\n')}`);
  process.exit(1);
}

for (const { file, page } of pages) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, page);
}

await writeFile(path.join(dist, 'sitemap.xml'), ssr.buildSitemap(routes));
await writeFile(path.join(dist, 'robots.txt'), ssr.buildRobotsTxt());
await writeFile(path.join(dist, 'llms.txt'), ssr.buildLlmsTxt(routes));
await rm(distSsr, { recursive: true, force: true });

const indexable = routes.filter((route) => route.sitemap && route.robots === 'index').length;
console.log(
  `prerender: ${pages.length} pages, ${indexable} in sitemap.xml, ${allowIndexing ? 'indexing allowed' : 'noindex preview (ALLOW_INDEXING is not 1)'}`,
);

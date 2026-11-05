import { BUSINESS_ID, buildBusinessNode } from '../data/home-schema.ts';
import { BUSINESS, SITE_URL } from '../data/site.ts';
import type { Route } from '../routes.ts';

/**
 * Everything that goes in <head>, plus sitemap.xml, robots.txt and llms.txt,
 * built from the route manifest. scripts/prerender.mjs writes the head into
 * each page's HTML; no React component renders any of it.
 */

export interface HeadOptions {
  /** True only for the live build (ALLOW_INDEXING=1); false keeps every page out of search. */
  allowIndexing: boolean;
}

/** The absolute URL of a route; the homepage keeps its trailing slash. */
export function canonicalUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** The robots meta value: a preview build is `noindex, nofollow` everywhere. */
export function robotsContent(route: Route, opts: HeadOptions): string {
  if (!opts.allowIndexing) return 'noindex, nofollow';
  return route.robots === 'index' ? 'index, follow' : 'noindex, follow';
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The shared @graph: site, this page, the business, the trail, then the page's own nodes. */
export function buildGraph(route: Route) {
  const url = canonicalUrl(route.path);
  const trail = route.breadcrumbs;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: BUSINESS.name,
        inLanguage: 'en-US',
        publisher: { '@id': BUSINESS_ID },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: route.title,
        description: route.description,
        inLanguage: 'en-US',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': BUSINESS_ID },
        ...(trail.length > 0 ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
      },
      buildBusinessNode(),
      ...(trail.length > 0
        ? [
            {
              '@type': 'BreadcrumbList',
              '@id': `${url}#breadcrumb`,
              itemListElement: trail.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.label,
                item: canonicalUrl(crumb.href),
              })),
            },
          ]
        : []),
      ...(route.schema?.() ?? []),
    ],
  };
}

/** The <head> tags for one page, as an HTML string. */
export function buildHead(route: Route, opts: HeadOptions): string {
  const url = canonicalUrl(route.path);
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const graph = JSON.stringify(buildGraph(route)).replace(/</g, '\\u003c');
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${robotsContent(route, opts)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${route.type === 'post' ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="${BUSINESS.name}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<script type="application/ld+json">${graph}</script>`,
  ].join('\n    ');
}

/** The routes search engines should see: indexable and flagged for the sitemap. */
export function sitemapRoutes(routes: readonly Route[]): Route[] {
  return routes.filter((route) => route.sitemap && route.robots === 'index');
}

export function buildSitemap(routes: readonly Route[]): string {
  const urls = sitemapRoutes(routes).map((route) => `  <url>\n    <loc>${canonicalUrl(route.path)}</loc>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

/** Same rules as the live site's robots.txt. */
export function buildRobotsTxt(): string {
  return `User-agent: *\nAllow: /\n\nDisallow: /admin/\nDisallow: /api/\nDisallow: /hedge-quote\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

export function buildLlmsTxt(routes: readonly Route[]): string {
  const pages = sitemapRoutes(routes).map(
    (route) => `- [${route.title}](${canonicalUrl(route.path)}): ${route.description}`,
  );
  return [
    `# ${BUSINESS.name}`,
    '',
    `> Artificial hedges, living walls, fence extensions and privacy walls, installed in Texas: Dallas, Fort Worth, Houston, Austin and San Antonio. A ${BUSINESS.parent.name} brand. Phone ${BUSINESS.phoneDisplay}, email ${BUSINESS.email}.`,
    '',
    '## Pages',
    '',
    ...pages,
    '',
  ].join('\n');
}

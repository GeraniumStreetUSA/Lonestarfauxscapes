export const NON_PRODUCTION_HTML_FILES = Object.freeze([
  'hero-backup.html',
  'lighthouse-report.html',
  'navbar-component.html',
  'navbar-universal.html',
  'roadmap.html',
]);

export const SITEMAP_EXCLUDED_STATIC_PAGES = Object.freeze([
  '404.html',
  ...NON_PRODUCTION_HTML_FILES,
  'hedge-builder-commercial.html',
  'hedge-builder-residential.html',
  'privacy.html',
  'sitemap.html',
  'terms.html',
]);

export const GONE_ROUTE_PATHS = Object.freeze([
  '/hero-backup',
  '/hero-backup.html',
  '/lighthouse-report',
  '/lighthouse-report.html',
  '/lighthouse-report.json',
  '/lh-scores.json',
  '/navbar-component',
  '/navbar-component.html',
  '/navbar-universal',
  '/navbar-universal.html',
  '/roadmap',
  '/roadmap.html',
  '/sample-page/feed',
  '/sample-page/feed/',
  // Gambling spam pages (injected before site cleanup — never part of codebase)
  '/understanding-responsible-gambling-practices-a',
  '/understanding-responsible-gambling-practices-a/',
  '/mastering-advanced-casino-strategies-a',
  '/mastering-advanced-casino-strategies-a/',
  '/seasonal-shifts-how-trends-influence-gambling',
  '/seasonal-shifts-how-trends-influence-gambling/',
]);

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { SITEMAP_EXCLUDED_STATIC_PAGES } from '../config/indexing-rules.js';
import {
  buildCanonicalUrl,
  normalizeRoutePath,
  resolveCanonicalValue,
  resolveRobotsDirective,
  routeFromFilename,
  shouldIncludeGeneratedRouteInSitemap,
  shouldIncludeStaticRouteInSitemap,
} from '../seo/foundation.js';

const SITE_URL = (process.env.SITE_URL || 'https://lonestarfauxscapes.com').replace(/\/+$/, '');
const ALLOW_INDEXING = process.env.ALLOW_INDEXING !== 'false';
const CONTENT_DIR = './content/blog';
const CASE_STUDIES_CONTENT_DIR = './content/case-studies';
const POSTS_JSON = './content/posts.json';
const DATE_PREFIX_SLUG_REGEX = /^\d{4}-\d{2}-\d{2}-(.+)$/;
const EXCLUDED_STATIC_PAGES = new Set(SITEMAP_EXCLUDED_STATIC_PAGES);

const resolveContentRobots = (frontmatter) =>
  resolveRobotsDirective(frontmatter?.robots, {
    noindex: frontmatter?.noindex === true,
  });

const shouldIncludeContentEntry = ({ routePath, frontmatter }) =>
  shouldIncludeGeneratedRouteInSitemap(routePath, {
    robots: resolveContentRobots(frontmatter),
    noindex: frontmatter?.noindex === true,
    canonical: frontmatter?.canonical,
  });

const getStaticPagePriority = (routePath) => {
  const route = normalizeRoutePath(routePath);
  if (route === '/') return '1.0';
  if (route === '/products' || route === '/locations') return '0.9';
  if (route === '/blog' || route === '/case-studies') return '0.8';
  return '0.8';
};

const sanitizeFrontmatterSlug = (value) => {
  if (typeof value !== 'string') return '';

  return value
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const stripDatePrefixFromSlug = (slug) => {
  const match = String(slug || '').match(DATE_PREFIX_SLUG_REGEX);
  return match ? match[1] : String(slug || '');
};

const loadLegacySlugSet = () => {
  const slugs = new Set();
  if (!fs.existsSync(POSTS_JSON)) return slugs;

  try {
    const parsed = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf-8'));
    if (!Array.isArray(parsed)) return slugs;

    for (const post of parsed) {
      const slug = typeof post?.slug === 'string' ? post.slug.trim() : '';
      if (slug) slugs.add(slug);
    }
  } catch (error) {
    console.warn(`Could not parse legacy slugs from ${POSTS_JSON}: ${error.message}`);
  }

  return slugs;
};

const resolvePostSlug = ({ frontmatterSlug, fileSlug, legacySlugSet }) => {
  const explicitSlug = sanitizeFrontmatterSlug(frontmatterSlug);
  if (explicitSlug) return explicitSlug;
  if (legacySlugSet.has(fileSlug)) return fileSlug;

  const timelessSlug = stripDatePrefixFromSlug(fileSlug);
  return timelessSlug || fileSlug;
};

const toIsoDateKey = (value, fallbackDate = new Date()) => {
  if (typeof value === 'string') {
    const dateMatch = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateMatch) return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallbackDate.toISOString().slice(0, 10);
  }

  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function generateSitemap() {
  console.log('Generating sitemap...');
  const legacySlugSet = loadLegacySlugSet();
  const todayIsoDate = new Date().toISOString().slice(0, 10);

  // Get all HTML files in root (static pages)
  const staticHtmlFiles = fs
    .readdirSync('.')
    .filter(f => f.endsWith('.html') && !f.includes('backup'))
    // Not public pages (or should never be indexed)
    .filter(f => !EXCLUDED_STATIC_PAGES.has(f));
  const staticPages = staticHtmlFiles
    .map(file => {
      const route = routeFromFilename(path.resolve(file));
      return {
        file,
        route,
      };
    })
    .filter(page => shouldIncludeStaticRouteInSitemap(page.route));

  // Build blog post URLs directly from markdown to avoid stale posts.json.
  let blogPosts = [];
  if (fs.existsSync(CONTENT_DIR)) {
    try {
      blogPosts = fs
        .readdirSync(CONTENT_DIR)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const fullPath = path.join(CONTENT_DIR, file);
          const raw = fs.readFileSync(fullPath, 'utf-8');
          const { data } = matter(raw);
          const isDraft = data.draft === true || data.published === false;
          const fileSlug = file.replace(/\.md$/, '');
          const slug = resolvePostSlug({
            frontmatterSlug: data.slug,
            fileSlug,
            legacySlugSet,
          });
          const dateKey = toIsoDateKey(data.date || fs.statSync(fullPath).mtime);
          const isPublished = !isDraft && dateKey <= todayIsoDate;
          const routePath = `/blog/${slug}`;

          return {
            slug,
            date: dateKey,
            isPublished,
            updated: toIsoDateKey(data.updated || data.date || fs.statSync(fullPath).mtime),
            includeInSitemap: shouldIncludeContentEntry({
              routePath,
              frontmatter: data,
            }),
            canonical: resolveCanonicalValue(data.canonical, routePath),
          };
        })
        .filter(post => post.isPublished && post.includeInSitemap)
        .sort((a, b) => b.date.localeCompare(a.date));
    } catch (e) {
      console.log('No blog posts found');
    }
  }

  // Build case study URLs directly from markdown source.
  let caseStudies = [];
  if (fs.existsSync(CASE_STUDIES_CONTENT_DIR)) {
    try {
      caseStudies = fs
        .readdirSync(CASE_STUDIES_CONTENT_DIR)
        .filter(file => file.endsWith('.md') && !file.startsWith('_'))
        .map(file => {
          const fullPath = path.join(CASE_STUDIES_CONTENT_DIR, file);
          const raw = fs.readFileSync(fullPath, 'utf-8');
          const { data } = matter(raw);
          const isDraft = data.draft === true || data.published === false;
          const fileSlug = file.replace(/\.md$/, '');
          const slug = sanitizeFrontmatterSlug(data.slug) || fileSlug;
          const dateKey = toIsoDateKey(data.date || fs.statSync(fullPath).mtime);
          const isPublished = !isDraft && dateKey <= todayIsoDate;
          const routePath = `/case-studies/${slug}`;

          return {
            slug,
            date: dateKey,
            isPublished,
            updated: toIsoDateKey(data.updated || data.date || fs.statSync(fullPath).mtime),
            includeInSitemap: shouldIncludeContentEntry({
              routePath,
              frontmatter: data,
            }),
            canonical: resolveCanonicalValue(data.canonical, routePath),
          };
        })
        .filter(entry => entry.isPublished && entry.slug && entry.includeInSitemap)
        .sort((a, b) => b.date.localeCompare(a.date));
    } catch (e) {
      console.log('No case studies found');
    }
  }

  const isoDateOnly = date => date.toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
`;

  // Add static pages
  for (const page of staticPages) {
    const url = buildCanonicalUrl(page.route);
    const priority = getStaticPagePriority(page.route);
    const lastmod = isoDateOnly(fs.statSync(path.resolve(page.file)).mtime);
    sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  }

  // Add blog posts
  if (blogPosts.length > 0) {
    sitemap += `
  <!-- Blog Posts -->
`;
    for (const post of blogPosts) {
      const postDate = new Date(post.updated || post.date).toISOString().split('T')[0];
      sitemap += `  <url>
    <loc>${post.canonical}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }
  }

  // Add case studies
  if (caseStudies.length > 0) {
    sitemap += `
  <!-- Case Studies -->
`;
    for (const study of caseStudies) {
      const studyDate = new Date(study.updated || study.date).toISOString().split('T')[0];
      sitemap += `  <url>
    <loc>${study.canonical}</loc>
    <lastmod>${studyDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }
  }

  sitemap += `</urlset>`;

  // Write sitemap
  fs.writeFileSync('./sitemap.xml', sitemap);
  console.log('  Generated: sitemap.xml');

  // Generate robots.txt
  const robots = ALLOW_INDEXING
    ? `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /hedge-quote

Sitemap: ${SITE_URL}/sitemap.xml
`
    : `User-agent: *
Disallow: /
`;
  fs.writeFileSync('./robots.txt', robots);
  console.log('  Generated: robots.txt');

  console.log('Sitemap generation complete!');
}

generateSitemap();

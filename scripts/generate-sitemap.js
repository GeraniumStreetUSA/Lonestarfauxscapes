import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = (process.env.SITE_URL || 'https://lonestarfauxscapes.com').replace(/\/+$/, '');
const ALLOW_INDEXING = process.env.ALLOW_INDEXING !== 'false';
const CONTENT_DIR = './content/blog';
const EXCLUDED_STATIC_PAGES = new Set([
  '404.html',
  'hero-backup.html',
  'lighthouse-report.html',
  'navbar-component.html',
  'navbar-universal.html',
  'privacy.html',
  'roadmap.html',
  'terms.html',
]);

function generateSitemap() {
  console.log('Generating sitemap...');

  // Get all HTML files in root (static pages)
  const staticHtmlFiles = fs
    .readdirSync('.')
    .filter(f => f.endsWith('.html') && !f.includes('backup'))
    // Not public pages (or should never be indexed)
    .filter(f => !EXCLUDED_STATIC_PAGES.has(f));

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

          return {
            slug: file.replace(/\.md$/, ''),
            date: data.date || fs.statSync(fullPath).mtime.toISOString(),
            isDraft,
          };
        })
        .filter(post => !post.isDraft)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (e) {
      console.log('No blog posts found');
    }
  }

  const isoDateOnly = date => date.toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
`;

  // Add static pages
  for (const file of staticHtmlFiles) {
    const pageKey = file.replace('.html', '');
    const url = file === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${pageKey}`;
    const priority = pageKey === 'index' ? '1.0' : pageKey === 'products' ? '0.9' : '0.8';
    const lastmod = isoDateOnly(fs.statSync(path.resolve(file)).mtime);
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
      const postDate = new Date(post.date).toISOString().split('T')[0];
      sitemap += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
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

import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://lonestarfauxscapes.com';
const POSTS_JSON = './content/posts.json';

function generateSitemap() {
  console.log('Generating sitemap...');

  // Get all HTML files in root (static pages)
  const staticPages = fs.readdirSync('.')
    .filter(f => f.endsWith('.html') && !f.includes('backup') && f !== 'roadmap.html')
    .map(f => f.replace('.html', ''));

  // Get blog posts if they exist
  let blogPosts = [];
  if (fs.existsSync(POSTS_JSON)) {
    try {
      blogPosts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf-8'));
    } catch (e) {
      console.log('No blog posts found');
    }
  }

  const today = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
`;

  // Add static pages
  for (const page of staticPages) {
    const url = page === 'index' ? SITE_URL : `${SITE_URL}/${page}`;
    const priority = page === 'index' ? '1.0' : page === 'products' ? '0.9' : '0.8';
    sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
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
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync('./robots.txt', robots);
  console.log('  Generated: robots.txt');

  console.log('Sitemap generation complete!');
}

generateSitemap();

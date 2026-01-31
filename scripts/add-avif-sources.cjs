/**
 * Add AVIF sources to existing <picture> elements
 * AVIF should be the first source for maximum savings
 */

const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'commercial.html',
  'dallas.html',
  'gallery.html',
  'products.html',
  'fence-extensions.html',
  'living-wall.html',
  'residential.html',
  'artificial-hedge.html'
];

function addAvifToPicture(html) {
  // Pattern to find <picture> elements with WebP sources but no AVIF
  // Match: <source srcset="path/file-400w.webp 400w, path/file-800w.webp 800w..." type="image/webp">
  const webpSourcePattern = /(<picture[^>]*>)\s*(<source\s+srcset="([^"]+)"[^>]*type="image\/webp"[^>]*>)/g;

  return html.replace(webpSourcePattern, (match, pictureTag, webpSource, webpSrcset) => {
    // Check if AVIF source already exists right before this
    if (html.includes('type="image/avif"') && html.indexOf('type="image/avif"') < html.indexOf(match)) {
      return match; // Already has AVIF
    }

    // Convert webp srcset to avif srcset
    const avifSrcset = webpSrcset.replace(/\.webp/g, '.avif');

    // Create AVIF source (same pattern as webp but with avif type)
    const avifSource = webpSource
      .replace(webpSrcset, avifSrcset)
      .replace('type="image/webp"', 'type="image/avif"');

    // Return picture tag + AVIF source + original WebP source
    return `${pictureTag}\n                <source srcset="${avifSrcset}" sizes="(max-width: 480px) 400px, (max-width: 1024px) 800px, 1200px" type="image/avif">\n                ${webpSource}`;
  });
}

function processFile(filename) {
  const filepath = path.join(__dirname, '..', filename);

  if (!fs.existsSync(filepath)) {
    console.log(`  Skipping ${filename} (not found)`);
    return;
  }

  let html = fs.readFileSync(filepath, 'utf8');
  const originalLength = html.length;

  // Count existing picture elements
  const pictureCount = (html.match(/<picture/g) || []).length;
  const existingAvifCount = (html.match(/type="image\/avif"/g) || []).length;

  html = addAvifToPicture(html);

  const newAvifCount = (html.match(/type="image\/avif"/g) || []).length;

  if (html.length !== originalLength) {
    fs.writeFileSync(filepath, html);
    console.log(`  ${filename}: Added ${newAvifCount - existingAvifCount} AVIF sources (${pictureCount} pictures total)`);
  } else {
    console.log(`  ${filename}: No changes needed (${existingAvifCount} AVIF sources already present)`);
  }
}

console.log('Adding AVIF sources to <picture> elements...\n');

for (const file of htmlFiles) {
  processFile(file);
}

console.log('\nDone!');

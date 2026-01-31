const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const blogFiles = fs.readdirSync('./blog').filter(f => f.endsWith('.html')).map(f => `blog/${f}`);
const allFiles = [...htmlFiles, ...blogFiles];

let count = 0;

allFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // Remove skip-link anchor tag (handles various formats)
    const originalLength = content.length;
    content = content.replace(/<a[^>]*class="skip-link"[^>]*>.*?<\/a>\s*/gi, '');
    content = content.replace(/<a[^>]*href="#main-content"[^>]*class="skip-link"[^>]*>.*?<\/a>\s*/gi, '');

    if (content.length !== originalLength) {
      fs.writeFileSync(file, content, 'utf8');
      count++;
      console.log(`Updated: ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});

console.log(`\nRemoved skip-link from ${count} files`);

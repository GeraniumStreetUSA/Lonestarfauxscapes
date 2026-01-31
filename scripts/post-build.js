import fs from 'fs';
import path from 'path';

const DIST_DIR = './dist';
const allowIndexing = process.env.ALLOW_INDEXING === 'true';

// Files to copy to dist after vite build
const filesToCopy = [
  { src: './sitemap.xml', dest: 'sitemap.xml' },
  { src: './robots.txt', dest: 'robots.txt' },
  { src: './_headers', dest: '_headers' },
  { src: './admin/config.yml', dest: 'admin/config.yml' },
  { src: './content/posts.json', dest: 'content/posts.json' },
  // JavaScript files (not bundled due to missing type="module")
  { src: './utils.js', dest: 'utils.js' },
  { src: './index.js', dest: 'index.js' },
  { src: './nav.js', dest: 'nav.js' },
  { src: './reveal.js', dest: 'reveal.js' },
  { src: './magnetic.js', dest: 'magnetic.js' },
  { src: './split-text.js', dest: 'split-text.js' },
  { src: './card-effects.js', dest: 'card-effects.js' },
  { src: './reactive-effects.js', dest: 'reactive-effects.js' },
  { src: './prefetch.js', dest: 'prefetch.js' },
  { src: './script.js', dest: 'script.js' },
  // CSS files
  { src: './style.css', dest: 'style.css' },
  { src: './navbar.css', dest: 'navbar.css' },
  { src: './enhancements.css', dest: 'enhancements.css' },
  { src: './navbar-universal.css', dest: 'navbar-universal.css' },
];

// Directories to copy recursively
const dirsToCopy = [
  { src: './images', dest: 'images' },
  { src: './favicon', dest: 'favicon' },
];

// Helper function to copy directory recursively
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function applyRobotsHeader(content) {
  const robotsLine = '  X-Robots-Tag: noindex, nofollow';
  const lines = content.split(/\r?\n/);

  if (allowIndexing) {
    return lines.filter(line => line.trim().toLowerCase() !== 'x-robots-tag: noindex, nofollow').join('\n');
  }

  const hasRobotsLine = lines.some(
    line => line.trim().toLowerCase() === 'x-robots-tag: noindex, nofollow',
  );
  if (hasRobotsLine) return lines.join('\n');

  const blockIndex = lines.findIndex(line => line.trim() === '/*');
  if (blockIndex === -1) {
    lines.push('', '/*', robotsLine);
  } else {
    lines.splice(blockIndex + 1, 0, robotsLine);
  }

  return lines.join('\n');
}

console.log('Running post-build tasks...');

// Copy individual files
for (const file of filesToCopy) {
  if (fs.existsSync(file.src)) {
    const destPath = path.join(DIST_DIR, file.dest);
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (file.src === './_headers') {
      const content = fs.readFileSync(file.src, 'utf-8');
      const updated = applyRobotsHeader(content);
      fs.writeFileSync(destPath, updated);
    } else {
      fs.copyFileSync(file.src, destPath);
    }
    console.log(`  Copied: ${file.src} -> ${destPath}`);
  } else {
    console.log(`  Skipped (not found): ${file.src}`);
  }
}

// Copy directories
for (const dir of dirsToCopy) {
  const destPath = path.join(DIST_DIR, dir.dest);
  if (fs.existsSync(dir.src)) {
    copyDirRecursive(dir.src, destPath);
    console.log(`  Copied directory: ${dir.src} -> ${destPath}`);
  } else {
    console.log(`  Skipped directory (not found): ${dir.src}`);
  }
}

console.log('Post-build complete!');

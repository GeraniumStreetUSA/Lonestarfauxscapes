import fs from 'fs';
import path from 'path';

const DIST_DIR = './dist';
// Indexing is enabled by default. Set ALLOW_INDEXING=false for temporary blocks.
const allowIndexing = process.env.ALLOW_INDEXING !== 'false';
const MANAGED_GLOBAL_NOINDEX_START = '# BEGIN managed-global-noindex';
const MANAGED_GLOBAL_NOINDEX_END = '# END managed-global-noindex';
const MANAGED_GLOBAL_NOINDEX_BLOCK = `${MANAGED_GLOBAL_NOINDEX_START}
/*
  X-Robots-Tag: noindex, nofollow
${MANAGED_GLOBAL_NOINDEX_END}`;
const MANAGED_GLOBAL_NOINDEX_REGEX = new RegExp(
  `\\n?${MANAGED_GLOBAL_NOINDEX_START}[\\s\\S]*?${MANAGED_GLOBAL_NOINDEX_END}\\n?`,
  'g',
);

// Files to copy to dist after vite build
const filesToCopy = [
  { src: './sitemap.xml', dest: 'sitemap.xml' },
  { src: './robots.txt', dest: 'robots.txt' },
  { src: './_headers', dest: '_headers' },
  { src: './public/_redirects', dest: '_redirects' },
  { src: './admin/config.yml', dest: 'admin/config.yml' },
  { src: './content/posts.json', dest: 'content/posts.json' },
  { src: './content/case-studies.json', dest: 'content/case-studies.json' },
  // JavaScript files (not bundled due to missing type="module")
  { src: './utils.js', dest: 'utils.js' },
  { src: './index.js', dest: 'index.js' },
  { src: './nav.js', dest: 'nav.js' },
  { src: './reveal.js', dest: 'reveal.js' },
  { src: './scroll-progress.js', dest: 'scroll-progress.js' },
  { src: './magnetic.js', dest: 'magnetic.js' },
  { src: './split-text.js', dest: 'split-text.js' },
  { src: './card-effects.js', dest: 'card-effects.js' },
  { src: './reactive-effects.js', dest: 'reactive-effects.js' },
  { src: './prefetch.js', dest: 'prefetch.js' },
  { src: './script.js', dest: 'script.js' },
  { src: './case-study-proofs.js', dest: 'case-study-proofs.js' },
  { src: './cro.js', dest: 'cro.js' },
  // CSS files
  { src: './style.css', dest: 'style.css' },
  { src: './navbar.css', dest: 'navbar.css' },
  { src: './enhancements.css', dest: 'enhancements.css' },
  { src: './navbar-universal.css', dest: 'navbar-universal.css' },
  { src: './cro.css', dest: 'cro.css' },
  { src: './homepage-motion.css', dest: 'homepage-motion.css' },
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
  const cleaned = content.replace(MANAGED_GLOBAL_NOINDEX_REGEX, '').replace(/\n{3,}/g, '\n\n').trimEnd();

  if (allowIndexing) {
    return `${cleaned}\n`;
  }

  return `${cleaned}\n\n${MANAGED_GLOBAL_NOINDEX_BLOCK}\n`;
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

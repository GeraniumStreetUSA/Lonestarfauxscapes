/**
 * One-off compression for the 4 oversized source originals flagged by Ahrefs.
 * Idempotent: skips any file already below its target size.
 * Preserves filenames so existing `<img src>` references still resolve.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'images');
const MAX_WIDTH = 1600;

const TARGETS = [
  { file: 'commercial/commercial-1.png',                                 kind: 'png', maxBytes: 400 * 1024 },
  { file: 'commercial/commercial-3.jpg',                                 kind: 'jpg', maxBytes: 300 * 1024 },
  { file: 'blog/fire-rated-artificial-hedge-texas-highrise-balcony.png', kind: 'png', maxBytes: 400 * 1024 },
  { file: 'living_walls/living-wall-2.jpg',                              kind: 'jpg', maxBytes: 300 * 1024 },
];

async function compress({ file, kind, maxBytes }) {
  const src = path.join(ROOT, file);
  if (!fs.existsSync(src)) {
    console.log(`  SKIP (missing): ${file}`);
    return;
  }
  const before = fs.statSync(src).size;
  if (before <= maxBytes) {
    console.log(`  SKIP (already small): ${file} = ${(before/1024).toFixed(0)}KB`);
    return;
  }

  const buf = fs.readFileSync(src);
  let pipeline = sharp(buf).resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' });

  if (kind === 'png') {
    pipeline = pipeline.png({ quality: 85, compressionLevel: 9, palette: true });
  } else {
    pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true });
  }

  const out = await pipeline.toBuffer();
  fs.writeFileSync(src, out);
  const after = fs.statSync(src).size;
  console.log(`  OK: ${file}  ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB (-${(100*(1-after/before)).toFixed(0)}%)`);
}

(async () => {
  console.log('Compressing 4 oversized source originals...');
  for (const t of TARGETS) await compress(t);
  console.log('Done.');
})().catch(e => { console.error(e); process.exit(1); });

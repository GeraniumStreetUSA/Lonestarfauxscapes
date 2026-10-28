// Responsive image variants for the homepage, from real install photos only
// (owner rule: never generate images).
//
//   node scripts/make-images.mjs
//
// Sources: the Texas case-study originals, copied into public/images/ with
// kebab-case names (from ../public/case-studies/), plus two uncaptioned
// system-card photos read from the repo's ../images/ folder.
//
// Writes public/images/<name>-<w>.{avif,webp} at 480, 768 and 1200 w (never
// wider than the source or crop) and src/data/image-manifest.json, which the
// <Picture> component reads for width, height and srcset. Sharp comes from the
// repo root's node_modules so the app does not carry it as a dependency.

import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..');
const repoRoot = path.resolve(appRoot, '..');
const require = createRequire(path.join(repoRoot, 'package.json'));
const sharp = require('sharp');

const WIDTHS = [480, 768, 1200];
const outDir = path.join(appRoot, 'public/images');
const manifestPath = path.join(appRoot, 'src/data/image-manifest.json');

/** In-app originals (paths relative to the app). */
const austin06 = 'app/public/images/austin-boxwood-privacy-wall-06.avif';
const austin08 = 'app/public/images/austin-boxwood-privacy-wall-08.avif';
const austin05 = 'app/public/images/austin-boxwood-privacy-wall-05.avif';
const austin07 = 'app/public/images/austin-boxwood-privacy-wall-07.avif';
const restaurant04 = 'app/public/images/houston-restaurant-hedge-04.avif';
const restaurant05 = 'app/public/images/houston-restaurant-hedge-05.avif';
const storefront04 = 'app/public/images/houston-storefront-hedge-04.avif';
const storefront05 = 'app/public/images/houston-storefront-hedge-05.avif';

/** crop: { left, top, width, height } in source pixels. */
const IMAGES = [
  // Hero: the documented Austin job at 16:10 (trims the bare dirt in the
  // foreground), plus a 4:5 phone crop on the wall and oaks.
  {
    name: 'hero-austin-boxwood-wall',
    src: austin06,
    crop: { left: 0, top: 56, width: 1200, height: 750 },
  },
  {
    name: 'hero-austin-boxwood-wall-phone',
    src: austin06,
    crop: { left: 250, top: 0, width: 717, height: 896 },
  },
  // The Austin job story after the hero: before, install, after (full 4:3
  // frames, same job, same photographer).
  { name: 'austin-before', src: austin05 },
  { name: 'austin-install', src: austin07 },
  { name: 'austin-after', src: austin06 },
  // Process step 4 (install). Watermarked original; acceptable for the mock.
  { name: 'install-austin-panels', src: austin08 },
  // Commercial chapter.
  { name: 'commercial-houston-patio', src: restaurant05 },
  // Texas installs cards, 4:3.
  {
    name: 'case-austin-privacy-wall',
    src: austin06,
    crop: { left: 0, top: 120, width: 960, height: 720 },
  },
  {
    name: 'case-houston-restaurant',
    src: restaurant04,
    crop: { left: 176, top: 0, width: 1024, height: 768 },
  },
  {
    name: 'case-houston-storefront',
    src: storefront05,
    crop: { left: 40, top: 0, width: 1024, height: 768 },
  },
  // System cards, 4:3, uncaptioned (never imply a place).
  {
    name: 'system-hedge',
    src: austin06,
    crop: { left: 560, top: 150, width: 640, height: 480 },
  },
  {
    name: 'system-living-wall',
    src: 'images/living_walls/living-wall-3.jpg',
    crop: { left: 169, top: 169, width: 1350, height: 1012 },
  },
  {
    name: 'system-fence-extension',
    src: 'images/fence/fence-2.jpg',
    crop: { left: 0, top: 506, width: 1350, height: 1012 },
  },
  {
    name: 'system-commercial',
    src: storefront04,
    crop: { left: 176, top: 0, width: 1024, height: 768 },
  },
  // Privacy wall card: freestanding hedge boxes along a Houston walkway (a
  // real photo not otherwise on the page). Full frame: the card shows it at
  // 4:3, 8:3 and 2:1.
  {
    name: 'system-privacy-wall',
    src: 'public/case-studies/houston-restaurant-hedges/HOUSTON-RESTAURAUNT-HEDGE-06.avif',
  },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const manifest = {};

  for (const image of IMAGES) {
    const source = path.join(repoRoot, image.src);
    const meta = await sharp(source).metadata();
    const crop = image.crop ?? { left: 0, top: 0, width: meta.width, height: meta.height };
    if (crop.left + crop.width > meta.width || crop.top + crop.height > meta.height) {
      throw new Error(`${image.name}: crop exceeds ${meta.width}x${meta.height}`);
    }

    const largest = Math.min(crop.width, WIDTHS[WIDTHS.length - 1]);
    const widths = [...WIDTHS.filter((w) => w < largest), largest];

    for (const w of widths) {
      const h = Math.round((crop.height / crop.width) * w);
      const base = sharp(source).extract(crop).resize({ width: w, height: h });
      await base.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(outDir, `${image.name}-${w}.avif`));
      await base.clone().webp({ quality: 76, effort: 6 }).toFile(path.join(outDir, `${image.name}-${w}.webp`));
    }

    manifest[image.name] = {
      width: crop.width,
      height: crop.height,
      widths,
    };
    console.log(`${image.name}: ${crop.width}x${crop.height} -> ${widths.join(', ')}`);
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`manifest -> ${path.relative(appRoot, manifestPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

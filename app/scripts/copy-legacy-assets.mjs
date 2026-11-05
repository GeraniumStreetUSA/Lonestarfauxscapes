// Copies the old static site's asset folders from the repo root into dist/, so
// every old URL for an image, icon, download or the Decap CMS keeps working
// (and Google image search keeps finding the same files).
//
//   node scripts/copy-legacy-assets.mjs     (npm run build runs it before the prerender)
//
// Sources, matching what the old build shipped:
//   images/, favicon/, admin/            root folders
//   public/*                             the old Vite public dir: LIVING-WALL-MATS,
//                                        VALLUM, mats, downloads and case-studies/<slug>/*.avif
//                                        (not _redirects: a later phase rewrites it)
//   case-studies/<slug>/*                any non-HTML file inside a case-study folder
// Not copied: _redirects, _headers (rewritten later), content/*.json (the
// blog pipeline regenerates them), the root downloads/ PDFs and static/ (the
// old build never shipped them and no page links to them).
// Never overwrites a file that is already in dist/ (the app's own public/
// output): a different file under the same name is reported as a clash.

import { copyFile, mkdir, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(appRoot, '..');
const dist = path.join(appRoot, 'dist');

const exists = (p) => stat(p).then(() => true, () => false);

const copied = new Map();
const clashes = [];

async function copyOne(from, to) {
  if (await exists(to)) {
    const same = (await readFile(from)).equals(await readFile(to));
    if (!same) clashes.push(path.relative(dist, to));
    return;
  }
  await mkdir(path.dirname(to), { recursive: true });
  await copyFile(from, to);
  const group = path.relative(dist, to).split(path.sep)[0];
  copied.set(group, (copied.get(group) ?? 0) + 1);
}

async function copyTree(src, dest, keep = () => true) {
  for (const entry of await readdir(src, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyTree(from, to, keep);
    else if (keep(from)) await copyOne(from, to);
  }
}

if (!(await exists(dist))) throw new Error('dist/ is missing: run the client build first');

for (const folder of ['images', 'favicon', 'admin']) {
  await copyTree(path.join(repoRoot, folder), path.join(dist, folder));
}

// The old public dir, every entry but the redirects file.
const publicDir = path.join(repoRoot, 'public');
for (const entry of await readdir(publicDir, { withFileTypes: true })) {
  if (entry.name === '_redirects' || entry.name === '_headers') continue;
  if (entry.isDirectory()) await copyTree(path.join(publicDir, entry.name), path.join(dist, entry.name));
  else await copyOne(path.join(publicDir, entry.name), path.join(dist, entry.name));
}

// Non-HTML files inside case-study folders (the root has only the .html pages today).
const caseStudies = path.join(repoRoot, 'case-studies');
for (const entry of await readdir(caseStudies, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    await copyTree(path.join(caseStudies, entry.name), path.join(dist, 'case-studies', entry.name), (file) => !file.endsWith('.html'));
  }
}

for (const [group, count] of [...copied].sort()) console.log(`legacy assets: ${count} files into dist/${group}`);
if (clashes.length > 0) {
  console.warn(`legacy assets: ${clashes.length} name clash(es), the app's own file was kept:`);
  for (const file of clashes) console.warn(`  dist/${file}`);
}

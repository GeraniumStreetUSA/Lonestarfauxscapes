import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function files(dir: string, exts: string[]): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return files(full, exts);
    return exts.includes(path.extname(name)) ? [full] : [];
  });
}

const sources = [...files(path.join(appRoot, 'src'), ['.ts', '.tsx', '.css', '.json']), path.join(appRoot, 'index.html')];
const pricesFile = path.join(appRoot, 'src/data/starting-prices.ts');
const copyFiles = [
  'src/data/home-content.ts',
  'src/data/case-studies.ts',
  'src/data/site.ts',
  'src/data/starting-prices.ts',
  'src/data/pages/systems/claims-copy.ts',
  'src/data/pages/systems/fence-extensions.ts',
  'src/data/pages/systems/fire-rated-artificial-hedge.ts',
  'src/data/pages/metros/shared.ts',
].map((f) => path.join(appRoot, f));

test('no em-dash anywhere in the app source', () => {
  for (const file of sources) {
    assert.ok(!readFileSync(file, 'utf8').includes('\u2014'), path.relative(appRoot, file));
  }
});

test('dollar figures only in src/data/starting-prices.ts', () => {
  assert.ok(sources.includes(pricesFile), 'the prices file is in the scan');
  for (const file of sources) {
    if (file === pricesFile) continue;
    // The blog posts are the owner's articles; tests/blog-content.test.ts holds the list of those that still quote prices.
    if (file.startsWith(path.join(appRoot, 'src/generated/posts') + path.sep)) continue;
    assert.doesNotMatch(readFileSync(file, 'utf8'), /\$\s?\d/, path.relative(appRoot, file));
  }
});

test('the only dollar figures in the prices file are the five released ones', () => {
  const figures = [...readFileSync(pricesFile, 'utf8').matchAll(/\$\s?(\d[\d,]*)/g)].map((match) => match[1]);
  // Code comments quote the formatted examples ("$99", "$3,960", "$108,000"); the released set must all be there.
  for (const released of ['99', '200', '65', '18', '699']) assert.ok(figures.includes(released), `$${released}`);
  // No fire-rated price is released: no figure sits next to the fire-rating note or statement.
  const text = readFileSync(pricesFile, 'utf8');
  assert.doesNotMatch(text, /fire-rated[^.\n]{0,60}\$\s?\d/i);
});

test('no leftover "no prices" wording', () => {
  for (const file of sources) {
    assert.doesNotMatch(
      readFileSync(file, 'utf8'),
      /no prices here|not dollars|dimensions only|no dollar figure/i,
      path.relative(appRoot, file),
    );
  }
});

test('no banned words in the copy', () => {
  const banned = [
    "y'all",
    'howdy',
    "everything's bigger",
    'beat the heat',
    'maintenance-free',
    'fireproof',
    'identical to real',
    'revolutionary',
    'game-changing',
    'cutting-edge',
    'transform',
    'elevate',
    'stunning',
    'breathtaking',
  ];
  for (const file of copyFiles) {
    const text = readFileSync(file, 'utf8').toLowerCase();
    for (const word of banned) assert.ok(!text.includes(word), `${word} in ${path.relative(appRoot, file)}`);
  }
});

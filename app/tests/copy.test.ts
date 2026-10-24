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
const copyFiles = ['src/data/home-content.ts', 'src/data/case-studies.ts', 'src/data/site.ts'].map((f) =>
  path.join(appRoot, f),
);

test('no em-dash anywhere in the app source', () => {
  for (const file of sources) {
    assert.ok(!readFileSync(file, 'utf8').includes('—'), path.relative(appRoot, file));
  }
});

test('no dollar figures anywhere in the app source', () => {
  for (const file of sources) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /\$\s?\d/, path.relative(appRoot, file));
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

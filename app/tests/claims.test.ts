import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { SEO, QUESTIONS, FAQ, FIRE_CHAPTER, SYSTEMS_SECTION } from '../src/data/home-content.ts';
import { EXTENSION_ATTACHMENT, HEDGE_PRICE_ANSWER, VINYL_CAVEAT } from '../src/data/pages/systems/claims-copy.ts';
import { VALLUM_FRX } from '../src/data/pages/systems/vallum-frx.ts';
import { FIRE_ANSWER, PRICE_ANSWER } from '../src/data/pages/metros/shared.ts';
import {
  FR_PRICE_NOTE,
  FR_STATEMENT,
  STARTING_PRICES,
  formatHedgePricesProse,
  formatStartingPriceCaption,
} from '../src/data/starting-prices.ts';
import { SYSTEMS, buildEstimate } from '../src/lib/estimator.ts';

/**
 * Old claims must not come back (owner corrections of 2026-11-04, the
 * Califauxscapes handoff confirmed for Texas):
 *   - a hedge was "6 ft × 12 in" / 12 in deep (it is 2 to 3 in on a fence or wall, 6 ft × 7 in freestanding);
 *   - foliage was "UV + FR" and fire-rated was standard (it is an upgrade at extra cost);
 *   - a fence extension sat "on top of" the fence or on a "frame above" it (it attaches to the face).
 */

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.resolve(appRoot, '../content/blog');

function files(dir: string, exts: string[]): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return files(full, exts);
    return exts.includes(path.extname(name)) ? [full] : [];
  });
}

/** Everything the site says: the app source (generated posts included) and the blog's markdown. */
const sources = [...files(path.join(appRoot, 'src'), ['.ts', '.tsx', '.css', '.json']), ...files(blogDir, ['.md'])];
const rel = (file: string) => path.relative(path.resolve(appRoot, '..'), file);

/** Sentences, roughly: split after . ! ? and at line breaks. */
function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+|\n+/).map((line) => line.trim()).filter(Boolean);
}

/**
 * Headings are left as they were (Search Console shows jump links to their
 * anchors), so a scan for old wording skips them: markdown and HTML headings,
 * and the table-of-contents entries built from them.
 */
function withoutHeadings(text: string): string {
  return text
    .replace(/<h[1-6][\s\S]*?<\/h[1-6]>/g, '')
    .replace(/^#{1,6} .*$/gm, '')
    .replace(/^\s*"text": .*$/gm, '')
    .replace(/(id|href)=\\?"[^"]*"/g, '');
}

/** Sentences matching `pattern`, except those matching `exempt` (tested on the whole sentence). */
function scan(pattern: RegExp, exempt?: RegExp): string[] {
  const hits: string[] = [];
  for (const file of sources) {
    const text = withoutHeadings(readFileSync(file, 'utf8'));
    for (const sentence of sentences(text)) {
      if (pattern.test(sentence) && !exempt?.test(sentence)) hits.push(`${rel(file)}: ${sentence.slice(0, 160)}`);
    }
  }
  return hits;
}

test('no hedge is "6 ft × 12 in" or 12 in deep', () => {
  assert.deepEqual(scan(/6\s*ft\s*[×x]\s*12\s*in\b/i), []);
  assert.deepEqual(scan(/\b12[\s-]?in(ch(es)?)?[\s-]+(deep|thick)\b/i), []);
  assert.deepEqual(scan(/\b(hedge|hedges)\b[^.]{0,60}\b12[\s-]?(in|inch|inches)\b[^.]{0,20}\b(deep|depth|thick)/i), []);
  assert.deepEqual(scan(/\b(foot|1 ft|one foot)[\s-]+(deep|thick)\b[^.]{0,40}\bhedge/i), []);
});

test('no "UV + FR" foliage claim', () => {
  assert.deepEqual(scan(/UV\s*\+\s*FR/i), []);
  assert.deepEqual(scan(/UV[\s/&-]*(and|&)?[\s/-]*FR\b/), []);
});

test('no sentence calls fire-rated foliage standard', () => {
  const fire = String.raw`(fire[\s-]?rat(ed|ing)|NFPA\s*701|flame[\s-]retardant)`;
  const patterns = [
    // "fire-rated ... as standard / comes standard / included / at no extra cost", unless negated.
    new RegExp(`${fire}[^.]{0,80}(?<!not )(?<!isn't )\\b(as standard|comes? standard|is standard|are standard|standard on every|included (in|with)|at no (extra|additional) (cost|charge)|no extra cost|free of charge)`, 'i'),
    new RegExp(`standard (with )?${fire}`, 'i'),
    new RegExp(`${fire}\\s+(by default|as a default)`, 'i'),
    // "all/every/each of our hedges, panels, mats ... are fire-rated / built for NFPA 701".
    new RegExp(`\\b(all|every|each)\\b[^.]{0,30}\\b(hedges?|walls?|panels?|mats?|products?|foliage|systems?)\\b[^.]{0,40}\\b(is|are|come|comes|comes in|ships?)\\b[^.]{0,20}${fire}`, 'i'),
    new RegExp(`\\bour\\s+(hedges?|walls?|panels?|mats?|products?|foliage|living walls?)\\s+(is|are)\\s+(all\\s+)?${fire}`, 'i'),
    new RegExp(`\\bour\\s+(hedges?|walls?|panels?|mats?|products?|foliage)\\s+(is|are)\\s+(all\\s+)?built (for|to) NFPA`, 'i'),
  ];
  for (const pattern of patterns) {
    // Vallum FRX is the one product that only comes fire-rated (owner, 2026-11-04): its own sentences may say so.
    const hits = scan(pattern, /\bVallum FRX\b/).filter((hit) => !/\bnot\b[^.]{0,30}standard/i.test(hit));
    assert.deepEqual(hits, [], String(pattern));
  }
});

test('a page that talks about fire-rated foliage says it is an upgrade, at extra cost or a requirement', () => {
  const dataFiles = files(path.join(appRoot, 'src/data'), ['.ts']).filter(
    (file) => !file.endsWith('starting-prices.ts') && !file.endsWith('claims-copy.ts'),
  );
  const missing: string[] = [];
  // Navigation labels and links to the explainer posts say nothing about our products.
  const labelsOnly = ['data/site.ts', 'pages/GuidesPage.tsx', 'pages/routes/'];
  for (const file of [...dataFiles, ...files(path.join(appRoot, 'src/pages'), ['.tsx'])]) {
    if (labelsOnly.some((part) => file.includes(part))) continue;
    const text = readFileSync(file, 'utf8');
    if (!/fire[\s-]?rated|NFPA\s*701/i.test(text)) continue;
    // Pages that import the statement or the answers built from it carry it.
    if (/FR_STATEMENT|FR_PRICE_NOTE|FIRE_ANSWER|FIRE_FAQ_ANSWER|FIRE_CHAPTER/.test(text)) continue;
    if (!/\bupgrade\b|extra cost|costs extra/i.test(text)) missing.push(rel(file));
  }
  assert.deepEqual(missing, []);
});

test('the blog posts that mention fire-rated foliage say it is an upgrade or extra cost', () => {
  const missing: string[] = [];
  for (const file of files(blogDir, ['.md'])) {
    const text = readFileSync(file, 'utf8');
    if (!/fire[\s-]?rated/i.test(text)) continue;
    if (!/\bupgrade\b|extra cost|costs extra/i.test(text)) missing.push(rel(file));
  }
  assert.deepEqual(missing, []);
});

test('fence extensions attach to the face, never "on top of" the fence or on a frame above it', () => {
  const noun = String.raw`(fence|wall|fence line|fencing)`;
  const patterns = [
    new RegExp(`\\bon top of (the|an|your|a|this|that)( existing| current| old| wood| wooden| privacy)? ${noun}\\b`, 'i'),
    new RegExp(`\\bon top of (the )?${noun}\\b`, 'i'),
    /\bframe[\s-]above\b/i,
    new RegExp(`\\ba frame above\\b`, 'i'),
    /\babove (the|an|your|a) (existing |current )?(fence|fencing|fence line)\b/i,
    /\bextends? (the|your) (fence )?posts\b/i,
    /\b(top rail|top of the posts)\b/i,
    /\bfence toppers?\b/i,
    /\bhedge toppers?\b/i,
    /\bmounted on top\b/i,
  ];
  for (const pattern of patterns) assert.deepEqual(scan(pattern), [], String(pattern));
});

test('the owner wording for the attachment and the vinyl caveat is used verbatim', () => {
  assert.equal(
    EXTENSION_ATTACHMENT,
    'It attaches to the face of your fence or wall, generally with steel square tube, and comes down 1 ft for every 2 ft of extension height, so a 3 ft extension overlaps the fence by 1.5 ft; the foliage covers the tube at the bottom.',
  );
  assert.equal(VINYL_CAVEAT, 'Extending a vinyl fence is much harder and generally not recommended.');
  const extensionPage = readFileSync(path.join(appRoot, 'src/data/pages/systems/fence-extensions.ts'), 'utf8');
  assert.match(extensionPage, /EXTENSION_ATTACHMENT/);
  assert.match(extensionPage, /VINYL_CAVEAT/);
  assert.match(extensionPage, /question: 'How does it attach to my fence\?'/);
  assert.match(extensionPage, /question: 'Can I extend a vinyl fence\?'/);
  const fenceTopperAlt = /standing on top of/i;
  assert.doesNotMatch(extensionPage, fenceTopperAlt);
});

/** Every string a data module exports, however deeply nested. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => strings(item, out));
  return out;
}

/** A hedge price with its tier: a string that names $99 says "fence or wall", one that names $200 says "freestanding". */
function untiered(text: string): string | null {
  if (/\$99\b/.test(text) && !/fence or wall/i.test(text)) return text;
  if (/\$200\b/.test(text) && !/freestanding/i.test(text)) return text;
  return null;
}

test('every hedge price the data builds is labelled by its tier', async () => {
  const modules = [
    ...files(path.join(appRoot, 'src/data/pages/systems'), ['.ts']),
    ...files(path.join(appRoot, 'src/data/pages/hubs'), ['.ts']),
    path.join(appRoot, 'src/data/pages/metros/shared.ts'),
    path.join(appRoot, 'src/data/home-content.ts'),
  ];
  const bad: string[] = [];
  let checked = 0;
  for (const file of modules) {
    const exported = (await import(file)) as Record<string, unknown>;
    for (const text of strings(exported)) {
      if (/\$(99|200)\b/.test(text)) checked += 1;
      const hit = untiered(text);
      if (hit) bad.push(`${rel(file)}: ${hit.slice(0, 140)}`);
    }
  }
  assert.deepEqual(bad, []);
  assert.ok(checked >= 4, `only ${checked} hedge prices were found to check`);
  // The helpers themselves.
  for (const text of [SEO.description, QUESTIONS.items[3].answer, PRICE_ANSWER, HEDGE_PRICE_ANSWER, formatHedgePricesProse()]) {
    assert.equal(untiered(text), null, text);
  }
  assert.match(SEO.description, /\$99[^.]*on your fence or wall/);
  assert.match(PRICE_ANSWER, /\$99 per linear ft on your fence or wall at 6 ft tall and from \$200 per linear ft freestanding/);
});

test('every rendered hedge price line and caption carries its tier', () => {
  for (const id of ['hedge', 'hedge-freestanding'] as const) {
    const system = SYSTEMS.find((candidate) => candidate.id === id)!;
    const estimate = buildEstimate({ systemId: id, runFt: 40, heightFt: system.height.default });
    // The estimator's caption, the systems card's caption and the hero's caption are the same helper.
    const expected = formatStartingPriceCaption(STARTING_PRICES[id]);
    assert.equal(estimate.price.caption, expected);
    const tier = id === 'hedge' ? /^On your fence or wall/ : /^Freestanding/;
    assert.match(estimate.price.caption, tier);
    assert.match(estimate.summary, id === 'hedge' ? /^Fence hedge/ : /^Freestanding hedge/);
    assert.equal(estimate.price.frNote, FR_PRICE_NOTE);
  }
  const card = SYSTEMS_SECTION.cards[0];
  assert.equal(card.id, 'hedge');
  assert.match(formatStartingPriceCaption(card.startingPrice!), /^On your fence or wall/);
  assert.match(formatStartingPriceCaption(card.alsoPriced!), /^Freestanding/);
  // The metro and hub rows and the hero price line are built from the tier helpers, not from one bare price.
  for (const file of ['src/pages/MetroPage.tsx', 'src/sections/HomeHero.tsx', 'src/components/page/PageHero.tsx']) {
    const text = readFileSync(path.join(appRoot, file), 'utf8');
    assert.match(text, /formatHedgePricesProse|HEDGE_TIERS|hedge-freestanding/, file);
  }
});

test('fire-rated foliage is an upgrade wherever the site states the subject', () => {
  assert.match(FR_STATEMENT, /upgrade at extra cost/);
  assert.match(FIRE_ANSWER, /upgrade at extra cost/);
  assert.match(FIRE_CHAPTER.body, /upgrade at extra cost/);
  const isItFireRated = FAQ.items.find((item) => item.question === 'Is it fire-rated?')!;
  assert.match(isItFireRated.answer, /^Not as standard\./);
  assert.match(isItFireRated.answer, /upgrade at extra cost/);
  // The caveat that the local fire authority decides stays.
  assert.match(isItFireRated.answer, /fire authority/);
  assert.match(FIRE_ANSWER, /AHJ/);
});

test('CLAIMS.md records the corrections with their source', () => {
  const claims = readFileSync(path.resolve(appRoot, '../CLAIMS.md'), 'utf8').toLowerCase();
  for (const needle of [
    'owner 2026-11-04 (Califauxscapes handoff, confirmed for Texas)',
    '$99',
    '$200',
    'fire-rated foliage is an upgrade at extra cost',
    'steel square tube',
    'vinyl',
    'owner 2026-11-04',
    '$81',
    '$18 per linear ft per ft of foliage',
    'scales with height',
    'vallum frx',
    'nfpa 701',
  ]) {
    assert.ok(claims.includes(needle.toLowerCase()), `CLAIMS.md is missing: ${needle}`);
  }
});

test('Vallum FRX only comes fire-rated: standard, priced above standard foliage, no figure of its own', () => {
  const text = strings(VALLUM_FRX).join('\n');
  assert.match(text, /Vallum FRX comes fire-rated \(NFPA 701\) as standard/);
  assert.match(text, /priced above standard living wall foliage/);
  assert.match(text, /fire-rated foliage costs extra/i);
  assert.match(text, /after a site review/);
  // The page is quoted: no Vallum figure. The only dollar figure is the standard living wall reference.
  assert.equal(VALLUM_FRX.hero.price, 'quoted');
  assert.deepEqual([...new Set(text.match(/\$[\d,]+/g))], ['$18']);
  for (const sentence of sentences(text)) {
    if (/\$\d/.test(sentence)) assert.match(sentence, /standard living walls start/i, sentence);
  }
  // No sentence about Vallum FRX calls the fire rating an upgrade.
  for (const sentence of sentences(text)) {
    if (/Vallum FRX/.test(sentence)) assert.doesNotMatch(sentence, /upgrade/i, sentence);
  }
});

test('no panel size or panel count is stated as a product spec', () => {
  const patterns = [
    /\b(hedge|living wall|wall|fence extension)?\s*panels? (are|is) (about |roughly )?\d+\s*(in|inch|inches|ft)\b/i,
    /\b(20|40)[\s-]?(in|inch|inches)[\s-]+(hedge |wall |living wall )?(panels?|modules?|wide)\b/i,
    /\b(20|40) in wide\b/i,
    /\bwe count (the )?(\d+ in )?panels\b/i,
    /\bhow the panels are counted\b/i,
    /\bpanel module\b/i,
    /\b\d+ panels\b/i,
    /\bin 4 ft (units|sections)\b/i,
    /\b4 [×x] 4 ft units\b/i,
    /\broughly 20 by 20 inches\b/i,
  ];
  for (const pattern of patterns) assert.deepEqual(scan(pattern), [], String(pattern));
});

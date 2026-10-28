import assert from 'node:assert/strict';
import test from 'node:test';

import { ESTIMATOR, FAQ, QUESTIONS, QUOTE, SEO, SYSTEMS_SECTION } from '../src/data/home-content.ts';
import {
  INSTALLATION_CAVEAT,
  STARTING_PRICES,
  formatRate,
  formatStartingPrice,
  formatStartingPriceCaption,
  formatStartingPriceProse,
  formatUsd,
} from '../src/data/starting-prices.ts';
import { SYSTEMS } from '../src/lib/estimator.ts';

/** Captions carry no-break spaces for wrapping; compare them as plain text. */
const plain = (text: string) => text.replace(/\u00A0/g, ' ');

test('the released starting prices, verbatim (owner, 2026-10-25)', () => {
  assert.deepEqual(STARTING_PRICES, {
    hedge: { amount: 99, per: 'linear-foot', configuration: '6 ft × 12 in' },
    'fence-extension': { amount: 65, per: 'linear-foot', configuration: '3 ft extension' },
    'living-wall': { amount: 18, per: 'square-foot', configuration: 'Fully custom' },
    'privacy-wall': {
      amount: 699,
      per: 'unit',
      configuration: '4 ft × 4 ft with standard base',
      qualifiers: ['fully custom sizes'],
    },
  });
  assert.equal(INSTALLATION_CAVEAT, '+ installation, quoted after a site review');
});

test('price lines, captions and prose', () => {
  assert.equal(formatStartingPrice(STARTING_PRICES.hedge), 'from $99 / linear ft');
  assert.equal(formatStartingPrice(STARTING_PRICES['fence-extension']), 'from $65 / linear ft');
  assert.equal(formatStartingPrice(STARTING_PRICES['living-wall']), 'from $18 / sq ft');
  assert.equal(formatStartingPrice(STARTING_PRICES['privacy-wall']), 'from $699');
  assert.equal(formatRate(STARTING_PRICES['privacy-wall']), '$699 / unit');
  assert.equal(
    plain(formatStartingPriceCaption(STARTING_PRICES.hedge)),
    '6 ft × 12 in · + installation, quoted after a site review',
  );
  assert.equal(
    plain(formatStartingPriceCaption(STARTING_PRICES['privacy-wall'])),
    '4 ft × 4 ft with standard base · fully custom sizes · + installation, quoted after a site review',
  );
  for (const price of Object.values(STARTING_PRICES)) {
    const caption = formatStartingPriceCaption(price);
    assert.ok(plain(caption).endsWith(INSTALLATION_CAVEAT));
    // A wrapped caption never starts a line with "·" or ends one with "+".
    assert.ok(!caption.includes(' ·') && !caption.includes('+ '), JSON.stringify(caption));
  }
  assert.equal(formatStartingPriceProse(STARTING_PRICES.hedge), 'from $99 per linear ft');
  assert.equal(formatStartingPriceProse(STARTING_PRICES['privacy-wall']), 'from $699 per unit');
  assert.equal(formatUsd(3960), '$3,960');
  assert.equal(formatUsd(108000), '$108,000');
});

test('Four questions #4 is built from the data file', () => {
  const cost = QUESTIONS.items[3];
  assert.equal(cost.question, 'What will it cost?');
  assert.equal(
    cost.answer,
    'Starting prices are published: hedge from $99 per linear ft, fence extension from $65 per linear ft, living wall from $18 per sq ft, privacy wall from $699 per unit. Installation is quoted after a site review, because access, mounting and run length drive it.',
  );
  assert.deepEqual(cost.link, { label: 'How pricing works', href: '/pricing' });
});

test('the FAQ price answer and the estimator copy', () => {
  assert.equal(
    FAQ.items.find((item) => item.question === 'How is the price set?')?.answer,
    'From published starting prices for each system, plus installation. You get a rough quote by email first; the site review sets the final invoice, because run length, mounting and site access drive installation.',
  );
  assert.equal(
    ESTIMATOR.body,
    'Pick a system and set the run. We draw it, count the panels and do the arithmetic on our published starting prices. Installation is quoted after a site review.',
  );
  assert.equal(
    ESTIMATOR.qualifier,
    'Illustrations, not quotes: arithmetic from our published material starting prices. Installation is quoted separately after a site review.',
  );
});

test('SEO description: the hedge price and all five metros, at most 155 characters', () => {
  assert.equal(
    SEO.description,
    'Artificial hedges from $99 per linear ft plus install. Living walls, fence extensions and privacy walls in DFW, Houston, Austin, San Antonio.',
  );
  assert.ok(SEO.description.length <= 155, `${SEO.description.length} characters`);
});

test('systems cards: four priced from the data file, commercial quoted after a site review', () => {
  assert.equal(SYSTEMS_SECTION.title, 'Five systems. Measured to your site.');
  assert.equal(SYSTEMS_SECTION.quoted, 'Quoted after a site review');
  assert.deepEqual(
    SYSTEMS_SECTION.cards.map((card) => [card.id, card.startingPrice]),
    [
      ['hedge', STARTING_PRICES.hedge],
      ['living-wall', STARTING_PRICES['living-wall']],
      ['fence-extension', STARTING_PRICES['fence-extension']],
      ['commercial', null],
      ['privacy-wall', STARTING_PRICES['privacy-wall']],
    ],
  );
  const { title, module, mount, bestFor, link } = SYSTEMS_SECTION.cards[4];
  assert.deepEqual(
    { title, module, mount, bestFor, link },
    {
      title: 'Privacy wall',
      module: '4 × 4 ft units',
      mount: 'Freestanding, standard base',
      bestFor: 'Patios, pool decks, quick screens',
      link: { label: 'Privacy walls', href: '/privacy-wall' },
    },
  );
});

test('every estimator system sends a System chip the quote form offers', () => {
  assert.deepEqual(QUOTE.systems, [
    'Artificial hedge',
    'Living wall',
    'Fence extension',
    'Commercial wall',
    'Privacy wall',
    'Not sure yet',
  ]);
  for (const system of SYSTEMS) {
    assert.ok((QUOTE.systems as readonly string[]).includes(system.quoteSystem), system.quoteSystem);
  }
});

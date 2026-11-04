import assert from 'node:assert/strict';
import test from 'node:test';

import { ESTIMATOR, FAQ, QUESTIONS, QUOTE, SEO, SYSTEMS_SECTION } from '../src/data/home-content.ts';
import {
  FR_PRICE_NOTE,
  FR_STATEMENT,
  HEDGE_TIERS,
  INSTALLATION_CAVEAT,
  STARTING_PRICES,
  formatHedgePriceProse,
  formatHedgePricesProse,
  formatRate,
  formatStartingPrice,
  formatStartingPriceCaption,
  formatStartingPriceProse,
  formatUsd,
} from '../src/data/starting-prices.ts';
import { SYSTEMS } from '../src/lib/estimator.ts';

/** Captions carry no-break spaces for wrapping; compare them as plain text. */
const plain = (text: string) => text.replace(/\u00A0/g, ' ');

test('the released starting prices, verbatim (owner 2026-10-25, hedge corrected 2026-11-04)', () => {
  assert.equal(Object.keys(STARTING_PRICES).length, 5);
  assert.deepEqual(STARTING_PRICES, {
    hedge: { amount: 99, per: 'linear-foot', configuration: 'On your fence or wall, single-sided, about 2 to 3 in deep' },
    'hedge-freestanding': {
      amount: 200,
      per: 'linear-foot',
      configuration: 'Freestanding, 6 ft × 7 in, a full 3D hedge on posts set in concrete',
    },
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
  assert.equal(FR_PRICE_NOTE, 'Prices are for standard UV-stabilized foliage; fire-rated foliage costs extra.');
  assert.equal(
    FR_STATEMENT,
    'Standard foliage is UV-stabilized for outdoor sun. Fire-rated foliage (NFPA 701) is an upgrade at extra cost, with documentation on request.',
  );
});

test('the two hedge kinds: a single hedge price always says its tier', () => {
  assert.deepEqual(
    Object.values(HEDGE_TIERS).map((tier) => [tier.id, tier.label, tier.heightFt, tier.depthIn]),
    [
      ['hedge', 'On your fence or wall', null, [2, 3]],
      ['hedge-freestanding', 'Freestanding', 6, 7],
    ],
  );
  assert.equal(formatHedgePriceProse('hedge'), 'from $99 per linear ft on your fence or wall');
  assert.equal(formatHedgePriceProse('hedge-freestanding'), 'from $200 per linear ft freestanding at 6 ft × 7 in');
  assert.equal(
    formatHedgePricesProse(),
    'from $99 per linear ft on your fence or wall and from $200 per linear ft freestanding at 6 ft × 7 in',
  );
  // Each caption leads with how the hedge stands.
  assert.match(plain(formatStartingPriceCaption(STARTING_PRICES.hedge)), /^On your fence or wall,/);
  assert.match(plain(formatStartingPriceCaption(STARTING_PRICES['hedge-freestanding'])), /^Freestanding, 6 ft × 7 in/);
});

test('price lines, captions and prose', () => {
  assert.equal(formatStartingPrice(STARTING_PRICES.hedge), 'from $99 / linear ft');
  assert.equal(formatStartingPrice(STARTING_PRICES['fence-extension']), 'from $65 / linear ft');
  assert.equal(formatStartingPrice(STARTING_PRICES['living-wall']), 'from $18 / sq ft');
  assert.equal(formatStartingPrice(STARTING_PRICES['privacy-wall']), 'from $699');
  assert.equal(formatRate(STARTING_PRICES['privacy-wall']), '$699 / unit');
  assert.equal(
    plain(formatStartingPriceCaption(STARTING_PRICES.hedge)),
    'On your fence or wall, single-sided, about 2 to 3 in deep · + installation, quoted after a site review',
  );
  assert.equal(formatStartingPrice(STARTING_PRICES['hedge-freestanding']), 'from $200 / linear ft');
  assert.equal(
    plain(formatStartingPriceCaption(STARTING_PRICES['hedge-freestanding'])),
    'Freestanding, 6 ft × 7 in, a full 3D hedge on posts set in concrete · + installation, quoted after a site review',
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
    'Starting prices are published: hedge from $99 per linear ft on your fence or wall and from $200 per linear ft freestanding at 6 ft × 7 in, fence extension from $65 per linear ft, living wall from $18 per sq ft, privacy wall from $699 per unit. Installation is quoted after a site review, because access, mounting and run length drive it. Prices are for standard UV-stabilized foliage; fire-rated foliage costs extra.',
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

test('SEO description: the hedge price with its tier and all five metros, at most 155 characters', () => {
  assert.equal(
    SEO.description,
    'Artificial hedges from $99 per linear ft on your fence or wall, plus install. Living walls and fence extensions in DFW, Houston, Austin, San Antonio.',
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
  // The hedge card prices both kinds; every other card has one price.
  assert.deepEqual(
    SYSTEMS_SECTION.cards.map((card) => [card.id, 'alsoPriced' in card ? card.alsoPriced : undefined]),
    [
      ['hedge', STARTING_PRICES['hedge-freestanding']],
      ['living-wall', undefined],
      ['fence-extension', undefined],
      ['commercial', undefined],
      ['privacy-wall', undefined],
    ],
  );
  assert.equal(SYSTEMS_SECTION.cards[2].mount, 'Face of your fence or wall, steel square tube');
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
    'Hedge on your fence or wall',
    'Freestanding hedge',
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

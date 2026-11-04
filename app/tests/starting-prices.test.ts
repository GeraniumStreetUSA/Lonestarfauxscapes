import assert from 'node:assert/strict';
import test from 'node:test';

import { ESTIMATOR, FAQ, QUESTIONS, QUOTE, SEO, SYSTEMS_SECTION } from '../src/data/home-content.ts';
import {
  FENCE_EXTENSION_FOLIAGE_PER_FT,
  FENCE_EXTENSION_RATE_PER_FT_OF_FOLIAGE,
  FR_PRICE_NOTE,
  FR_STATEMENT,
  HEDGE_BASE_HEIGHT_FT,
  HEDGE_TIERS,
  INSTALLATION_CAVEAT,
  STARTING_PRICES,
  fenceExtensionFoliageFt,
  fenceExtensionRatePerLinearFt,
  formatFenceExtensionPriceProse,
  formatHedgePriceProse,
  formatHedgePricesProse,
  formatRate,
  formatStartingPrice,
  formatStartingPriceCaption,
  formatStartingPriceProse,
  formatUsd,
  formatUsdExact,
  hedgeRatePerLinearFt,
} from '../src/data/starting-prices.ts';
import { SYSTEMS } from '../src/lib/estimator.ts';

/** Captions carry no-break spaces for wrapping; compare them as plain text. */
const plain = (text: string) => text.replace(/\u00A0/g, ' ');

test('the released starting prices, verbatim (owner 2026-10-25, corrected and extended 2026-11-04)', () => {
  assert.equal(Object.keys(STARTING_PRICES).length, 5);
  assert.deepEqual(STARTING_PRICES, {
    hedge: {
      amount: 99,
      per: 'linear-foot',
      baseHeightFt: 6,
      configuration: 'On your fence or wall, priced at 6 ft tall, about 2 to 3 in deep; scales with height',
    },
    'hedge-freestanding': {
      amount: 200,
      per: 'linear-foot',
      configuration: 'Freestanding, 6 ft × 7 in, a full 3D hedge on posts set in concrete',
    },
    'fence-extension': {
      amount: 81,
      per: 'linear-foot',
      baseHeightFt: 3,
      configuration: '3 ft over the fence (4.5 ft of foliage with the overlap)',
      qualifiers: ['$18 per linear ft per ft of foliage'],
    },
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
      ['hedge', 'On your fence or wall', 6, [2, 3]],
      ['hedge-freestanding', 'Freestanding', 6, 7],
    ],
  );
  assert.equal(formatHedgePriceProse('hedge'), 'from $99 per linear ft on your fence or wall at 6 ft tall');
  assert.equal(formatHedgePriceProse('hedge-freestanding'), 'from $200 per linear ft freestanding at 6 ft × 7 in');
  assert.equal(
    formatHedgePricesProse(),
    'from $99 per linear ft on your fence or wall at 6 ft tall and from $200 per linear ft freestanding at 6 ft × 7 in',
  );
  // Each caption leads with how the hedge stands.
  assert.match(plain(formatStartingPriceCaption(STARTING_PRICES.hedge)), /^On your fence or wall,/);
  assert.match(plain(formatStartingPriceCaption(STARTING_PRICES['hedge-freestanding'])), /^Freestanding, 6 ft × 7 in/);
});

test('price lines, captions and prose', () => {
  assert.equal(formatStartingPrice(STARTING_PRICES.hedge), 'from $99 / linear ft');
  assert.equal(formatStartingPrice(STARTING_PRICES['fence-extension']), 'from $81 / linear ft');
  assert.equal(formatStartingPrice(STARTING_PRICES['living-wall']), 'from $18 / sq ft');
  assert.equal(formatStartingPrice(STARTING_PRICES['privacy-wall']), 'from $699');
  assert.equal(formatRate(STARTING_PRICES['privacy-wall']), '$699 / unit');
  assert.equal(
    plain(formatStartingPriceCaption(STARTING_PRICES.hedge)),
    'On your fence or wall, priced at 6 ft tall, about 2 to 3 in deep; scales with height · + installation, quoted after a site review',
  );
  assert.equal(
    plain(formatStartingPriceCaption(STARTING_PRICES['fence-extension'])),
    '3 ft over the fence (4.5 ft of foliage with the overlap) · $18 per linear ft per ft of foliage · + installation, quoted after a site review',
  );
  assert.equal(formatFenceExtensionPriceProse(), 'from $81 per linear ft at 3 ft over the fence');
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
    'Starting prices are published: hedge from $99 per linear ft on your fence or wall at 6 ft tall and from $200 per linear ft freestanding at 6 ft × 7 in, fence extension from $81 per linear ft at 3 ft over the fence, living wall from $18 per sq ft, privacy wall from $699 per unit. Installation is quoted after a site review, because access, mounting and run length drive it. Prices are for standard UV-stabilized foliage; fire-rated foliage costs extra.',
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
    'Pick a system and set the run. We draw it and do the arithmetic on our published starting prices. Installation is quoted after a site review.',
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
  // No card states a panel size or unit size (owner 2026-11-04).
  for (const card of SYSTEMS_SECTION.cards) assert.ok(!('module' in card), card.id);
  const { title, mount, bestFor, link } = SYSTEMS_SECTION.cards[4];
  assert.deepEqual(
    { title, mount, bestFor, link },
    {
      title: 'Privacy wall',
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

test('the hedge on your fence or wall scales with height: $99 per linear ft at 6 ft tall', () => {
  assert.equal(HEDGE_BASE_HEIGHT_FT, 6);
  assert.equal(STARTING_PRICES.hedge.baseHeightFt, 6);
  assert.equal(hedgeRatePerLinearFt(6), 99);
  assert.equal(hedgeRatePerLinearFt(8), 132);
  assert.equal(hedgeRatePerLinearFt(4), 66);
  assert.equal(hedgeRatePerLinearFt(3), 49.5);
  assert.equal(hedgeRatePerLinearFt(10), 165);
  // $16.50 per sq ft of hedge face.
  for (const h of [3, 4, 5, 6, 7, 8, 9, 10]) assert.equal(hedgeRatePerLinearFt(h), h * 16.5);
  // The freestanding hedge is fixed.
  assert.equal(STARTING_PRICES['hedge-freestanding'].baseHeightFt, undefined);
});

test('the fence extension: $18 per linear ft per foot of foliage, foliage = height over the fence x 1.5', () => {
  assert.equal(FENCE_EXTENSION_RATE_PER_FT_OF_FOLIAGE, 18);
  assert.equal(FENCE_EXTENSION_FOLIAGE_PER_FT, 1.5);
  assert.equal(fenceExtensionFoliageFt(3), 4.5);
  assert.equal(fenceExtensionRatePerLinearFt(3), 81);
  assert.equal(fenceExtensionRatePerLinearFt(2), 54);
  assert.equal(fenceExtensionRatePerLinearFt(2.5), 67.5);
  assert.equal(fenceExtensionRatePerLinearFt(6), 162);
  // The released amount is the 3 ft figure.
  assert.equal(STARTING_PRICES['fence-extension'].amount, fenceExtensionRatePerLinearFt(3));
  assert.equal(STARTING_PRICES['fence-extension'].baseHeightFt, 3);
});

test('exact dollars show cents only when there are some', () => {
  assert.equal(formatUsdExact(132), '$132');
  assert.equal(formatUsdExact(49.5), '$49.50');
  assert.equal(formatUsdExact(2029.5), '$2,029.50');
  assert.equal(formatUsdExact(5280), '$5,280');
});

test('the other prices stay as released: living wall $18 per sq ft, privacy wall $699 per unit', () => {
  assert.deepEqual(STARTING_PRICES['living-wall'], { amount: 18, per: 'square-foot', configuration: 'Fully custom' });
  assert.equal(STARTING_PRICES['privacy-wall'].amount, 699);
  assert.equal(STARTING_PRICES['privacy-wall'].per, 'unit');
  assert.equal(STARTING_PRICES['privacy-wall'].configuration, '4 ft × 4 ft with standard base');
});

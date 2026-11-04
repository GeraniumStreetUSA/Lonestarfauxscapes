import assert from 'node:assert/strict';
import test from 'node:test';

import { FR_PRICE_NOTE, INSTALLATION_CAVEAT, STARTING_PRICES } from '../src/data/starting-prices.ts';
import {
  RUN,
  SUMMARY_MAX_LENGTH,
  SYSTEMS,
  buildEstimate,
  clampHeight,
  clampRun,
  commitDraft,
  formatNumber,
  getSystem,
  isHeightLocked,
  isPerUnit,
  roundToTen,
} from '../src/lib/estimator.ts';

/** Captions carry no-break spaces for wrapping; compare them as plain text. */
const plain = (text: string) => text.replace(/ /g, ' ');

const hedge = getSystem('hedge');
const freestanding = getSystem('hedge-freestanding');
const fence = getSystem('fence-extension');
const wall = getSystem('living-wall');
const privacy = getSystem('privacy-wall');

test('systems carry no panel size, panel count or module', () => {
  assert.deepEqual(
    SYSTEMS.map((s) => [s.id, s.label, s.note]),
    [
      ['hedge', 'Hedge on your fence or wall', 'Scales with height'],
      ['hedge-freestanding', 'Freestanding hedge', '6 ft × 7 in'],
      ['fence-extension', 'Fence extension', 'Priced by height'],
      ['living-wall', 'Living wall', 'Per sq ft'],
      ['privacy-wall', 'Privacy wall', 'Freestanding, on a base'],
    ],
  );
  for (const system of SYSTEMS) {
    assert.ok(!('moduleIn' in system), system.id);
    assert.doesNotMatch(system.note, /panel|\b20 in\b|\b40 in\b|4 × 4/i, system.id);
  }
  // Every figure is built on the data file's released prices, nothing else.
  assert.equal(hedge.price, STARTING_PRICES.hedge);
  assert.equal(freestanding.price, STARTING_PRICES['hedge-freestanding']);
  assert.equal(fence.price, STARTING_PRICES['fence-extension']);
  assert.equal(wall.price, STARTING_PRICES['living-wall']);
  assert.equal(privacy.price, STARTING_PRICES['privacy-wall']);
  assert.deepEqual(SYSTEMS.map(isPerUnit), [false, false, false, false, true]);
});

test('estimates never mention panels or units', () => {
  for (const system of SYSTEMS) {
    const e = buildEstimate({ systemId: system.id, runFt: 40, heightFt: system.height.default });
    const text = [e.summary, e.price.figure, e.price.arithmetic ?? '', e.price.caption, e.price.frNote].join(' ');
    assert.doesNotMatch(text.replace(/\/ unit|per unit/g, ''), /panel|units?\b|across|rows/i, system.id);
    assert.ok(!('panels' in e) && !('lines' in e) && !('across' in e), system.id);
  }
});

test('heights: hedge 3 to 10 ft, extension 2 to 6 ft in half feet, living wall 3 to 20 ft; freestanding and privacy wall locked', () => {
  assert.deepEqual(RUN, { min: 4, max: 300, default: 40 });
  assert.deepEqual(hedge.height, { min: 3, max: 10, default: 6 });
  assert.match(hedge.heightNote ?? '', /per linear foot at 6 ft tall and scales with height/);
  assert.doesNotMatch(hedge.heightNote ?? '', /priced to your site/);
  assert.deepEqual(freestanding.height, { min: 6, max: 6, default: 6 });
  assert.equal(freestanding.heightNote, null);
  assert.deepEqual(fence.height, { min: 2, max: 6, default: 3, step: 0.5 });
  assert.deepEqual(wall.height, { min: 3, max: 20, default: 8 });
  assert.deepEqual(privacy.height, { min: 4, max: 4, default: 4 });
  assert.deepEqual(SYSTEMS.map(isHeightLocked), [false, true, false, false, true]);
  // Whatever height arrives, a locked system uses its priced size.
  for (const heightFt of [0, 1, 4, 6, 12, 99, Number.NaN]) {
    assert.equal(buildEstimate({ systemId: 'hedge-freestanding', runFt: 40, heightFt }).heightFt, 6);
    assert.equal(buildEstimate({ systemId: 'privacy-wall', runFt: 40, heightFt }).heightFt, 4);
  }
  assert.equal(buildEstimate({ systemId: 'living-wall', runFt: 40, heightFt: 12 }).heightFt, 12);
});

test('the default hedge run: 40 ft at 6 ft tall is $99 per linear ft, from $3,960', () => {
  const e = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 6 });
  assert.equal(e.areaSqFt, 240);
  assert.deepEqual({ ...e.price, caption: plain(e.price.caption) }, {
    total: 3960,
    amount: '$3,960',
    per: '',
    figure: 'from $3,960',
    arithmetic: '40 linear ft × $99 (6 ft tall) = $3,960',
    caption:
      'On your fence or wall, priced at 6 ft tall, about 2 to 3 in deep; scales with height · + installation, quoted after a site review',
    frNote: FR_PRICE_NOTE,
  });
});

test('hedge on your fence or wall scales with height: 40 ft at 8 ft = $5,280, at 4 ft = $2,640', () => {
  const tall = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 8 });
  assert.equal(tall.price.total, 5280);
  assert.equal(tall.price.figure, 'from $5,280');
  assert.equal(tall.price.arithmetic, '40 linear ft × $132 (8 ft tall) = $5,280');
  assert.equal(tall.areaSqFt, 320);

  const low = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 4 });
  assert.equal(low.price.total, 2640);
  assert.equal(low.price.arithmetic, '40 linear ft × $66 (4 ft tall) = $2,640');

  // A rate that is not whole shows its cents: 3 ft is $49.50 per linear ft.
  const shortest = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 3 });
  assert.equal(shortest.price.total, 1980);
  assert.equal(shortest.price.arithmetic, '40 linear ft × $49.50 (3 ft tall) = $1,980');

  // $16.50 per sq ft of hedge face, at every height.
  for (const heightFt of [3, 4, 5, 6, 7, 8, 9, 10]) {
    const e = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt });
    assert.equal(e.price.total, Math.round((40 * heightFt * 16.5) / 10) * 10, `${heightFt} ft`);
  }
  assert.equal(buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 99 }).heightFt, 10);
  assert.equal(buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 1 }).heightFt, 3);
});

test('freestanding hedge: $200 per linear ft at a fixed 6 ft × 7 in, no height slider', () => {
  const e = buildEstimate({ systemId: 'hedge-freestanding', runFt: 40, heightFt: 6 });
  assert.equal(e.price.total, 8000);
  assert.equal(e.price.figure, 'from $8,000');
  assert.equal(e.price.arithmetic, '40 linear ft × $200 = $8,000');
  assert.equal(
    plain(e.price.caption),
    'Freestanding, 6 ft × 7 in, a full 3D hedge on posts set in concrete · + installation, quoted after a site review',
  );
  assert.equal(e.price.frNote, FR_PRICE_NOTE);
  assert.equal(e.areaSqFt, null);
  // The two hedge kinds never share a rate: the same run costs more freestanding.
  const onFence = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 6 });
  assert.ok((e.price.total ?? 0) > (onFence.price.total ?? 0));
  assert.match(e.summary, /^Freestanding hedge, 40 ft run/);
  assert.match(onFence.summary, /^Fence hedge, 40 ft run/);
});

test('every priced estimate says fire-rated foliage costs extra', () => {
  for (const system of SYSTEMS) {
    const e = buildEstimate({ systemId: system.id, runFt: 40, heightFt: system.height.default });
    assert.equal(e.price.frNote, FR_PRICE_NOTE, system.id);
  }
  assert.match(FR_PRICE_NOTE, /fire-rated foliage costs extra/);
});

test('fence extension: $18 per linear ft per foot of foliage, foliage = height over the fence x 1.5', () => {
  const e = buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: 3 });
  assert.equal(e.heightFt, 3);
  assert.equal(e.price.total, 3240);
  assert.equal(e.price.figure, 'from $3,240');
  assert.equal(e.price.arithmetic, '40 linear ft × $81 (3 ft over the fence, 4.5 ft of foliage) = $3,240');
  assert.equal(
    plain(e.price.caption),
    '3 ft over the fence (4.5 ft of foliage with the overlap) · $18 per linear ft per ft of foliage · + installation, quoted after a site review',
  );
  assert.equal(e.areaSqFt, null);

  // 2 ft over the fence is 3 ft of foliage: 40 × 18 × 3 = $2,160.
  const two = buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: 2 });
  assert.equal(two.price.total, 2160);
  assert.equal(two.price.arithmetic, '40 linear ft × $54 (2 ft over the fence, 3 ft of foliage) = $2,160');
  assert.equal(
    plain(two.price.caption),
    '2 ft over the fence (3 ft of foliage with the overlap) · $18 per linear ft per ft of foliage · + installation, quoted after a site review',
  );

  // Half feet: 2.5 ft over is 3.75 ft of foliage, $67.50 per linear ft.
  const half = buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: 2.5 });
  assert.equal(half.price.total, 2700);
  assert.equal(half.price.arithmetic, '40 linear ft × $67.50 (2.5 ft over the fence, 3.75 ft of foliage) = $2,700');

  for (const heightFt of [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]) {
    const x = buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt });
    assert.equal(x.price.total, Math.round((40 * 18 * heightFt * 1.5) / 10) * 10, `${heightFt} ft`);
  }
});

test('fence extension height: 2 to 6 ft in half feet', () => {
  assert.equal(buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: 9 }).heightFt, 6);
  assert.equal(buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: 0 }).heightFt, 2);
  assert.equal(buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: 3.2 }).heightFt, 3);
  assert.equal(buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: 3.3 }).heightFt, 3.5);
  assert.equal(buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: Number.NaN }).heightFt, 3);
  assert.equal(clampHeight(fence, 4.74), 4.5);
});

test('living wall: run x height = sq ft, priced per sq ft', () => {
  const e = buildEstimate({ systemId: 'living-wall', runFt: 40, heightFt: 8 });
  assert.equal(e.areaSqFt, 320);
  assert.equal(e.price.total, 5760);
  assert.equal(e.price.figure, 'from $5,760');
  assert.equal(e.price.arithmetic, '40 ft × 8 ft = 320 sq ft × $18 = $5,760');
  assert.equal(plain(e.price.caption), 'Fully custom · + installation, quoted after a site review');
});

test('totals round to the nearest ten dollars, and the working shows the exact product', () => {
  assert.equal(roundToTen(4059), 4060);
  assert.equal(roundToTen(4554), 4550);
  assert.equal(roundToTen(2665), 2670);
  assert.equal(roundToTen(3960), 3960);

  // 41 ft × 99 = 4,059: up to 4,060.
  const up = buildEstimate({ systemId: 'hedge', runFt: 41, heightFt: 6 });
  assert.equal(up.price.total, 4060);
  assert.equal(up.price.figure, 'from $4,060');
  assert.equal(up.price.arithmetic, '41 linear ft × $99 (6 ft tall) = $4,059, rounded to $4,060');
  // 46 ft × 99 = 4,554: down to 4,550.
  const down = buildEstimate({ systemId: 'hedge', runFt: 46, heightFt: 6 });
  assert.equal(down.price.arithmetic, '46 linear ft × $99 (6 ft tall) = $4,554, rounded to $4,550');
  // 41 ft × $49.50 = $2,029.50: the exact product keeps its cents, then rounds.
  const cents = buildEstimate({ systemId: 'hedge', runFt: 41, heightFt: 3 });
  assert.equal(cents.price.total, 2030);
  assert.equal(cents.price.arithmetic, '41 linear ft × $49.50 (3 ft tall) = $2,029.50, rounded to $2,030');
  // 41 ft × 81 = 3,321: down to 3,320.
  assert.equal(
    buildEstimate({ systemId: 'fence-extension', runFt: 41, heightFt: 3 }).price.arithmetic,
    '41 linear ft × $81 (3 ft over the fence, 4.5 ft of foliage) = $3,321, rounded to $3,320',
  );
  // 41 ft × 8 ft = 328 sq ft × 18 = 5,904: down to 5,900.
  assert.equal(
    buildEstimate({ systemId: 'living-wall', runFt: 41, heightFt: 8 }).price.arithmetic,
    '41 ft × 8 ft = 328 sq ft × $18 = $5,904, rounded to $5,900',
  );

  // Every rate system's figure is its rate x size, rounded, and nothing else.
  const rate = (id: string, heightFt: number) =>
    id === 'hedge' ? 16.5 * heightFt : id === 'fence-extension' ? 27 * heightFt : STARTING_PRICES['hedge-freestanding'].amount;
  for (const system of SYSTEMS.filter((s) => !isPerUnit(s))) {
    for (const runFt of [4, 17, 40, 123, 300]) {
      for (const heightFt of [system.height.min, 5, system.height.max]) {
        const e = buildEstimate({ systemId: system.id, runFt, heightFt });
        const exact =
          system.price.per === 'square-foot' ? e.runFt * e.heightFt * system.price.amount : e.runFt * rate(system.id, e.heightFt);
        assert.equal(e.price.total, Math.round(exact / 10) * 10, `${system.id} ${runFt} x ${heightFt}`);
        assert.equal((e.price.total ?? 1) % 10, 0);
      }
    }
  }
});

test('the privacy wall price is one standard unit, never multiplied, with no unit count or size shown', () => {
  for (const runFt of [4, 40, 41, 180, 300]) {
    const e = buildEstimate({ systemId: 'privacy-wall', runFt, heightFt: 4 });
    assert.equal(e.price.total, null);
    assert.equal(e.price.arithmetic, null);
    assert.equal(e.price.amount, '$699');
    assert.equal(e.price.per, '/ unit');
    assert.equal(e.price.figure, 'from $699 / unit');
    assert.equal(e.areaSqFt, null);
    // The priced product, said once, in the caption.
    assert.equal(
      plain(e.price.caption),
      '4 ft × 4 ft with standard base · fully custom sizes · + installation, quoted after a site review',
    );
    // However long the run, the only dollar figure is the unit price, and no unit count appears.
    const text = [e.summary, e.price.figure].join(' ');
    assert.deepEqual([...new Set(text.match(/\$[\d,]+/g))], ['$699']);
    assert.doesNotMatch(e.summary, /units?\b.*units?\b|\d+ units/);
  }
  assert.equal(
    buildEstimate({ systemId: 'privacy-wall', runFt: 40, heightFt: 4 }).summary,
    'Privacy wall, 40 ft run · from $699 / unit + installation, quoted after a site review',
  );
});

test('inputs are rounded and clamped', () => {
  assert.equal(clampRun(0), 4);
  assert.equal(clampRun(3.4), 4);
  assert.equal(clampRun(40.4), 40);
  assert.equal(clampRun(40.5), 41);
  assert.equal(clampRun(1000), 300);
  assert.equal(clampRun(Number.NaN), 40);
  assert.equal(clampHeight(hedge, 1), 3);
  assert.equal(clampHeight(hedge, 30), 10);
  assert.equal(clampHeight(hedge, 7.6), 8);
  assert.equal(clampHeight(freestanding, 1), 6);
  assert.equal(clampHeight(fence, 9), 6);
  assert.equal(clampHeight(fence, 1), 2);
  assert.equal(clampHeight(wall, 1), 3);
  assert.equal(clampHeight(wall, 7.6), 8);
  assert.equal(clampHeight(wall, 25), 20);
  // buildEstimate clamps too, so a stray value can never reach the arithmetic.
  const e = buildEstimate({ systemId: 'living-wall', runFt: 999, heightFt: 0 });
  assert.equal(e.runFt, 300);
  assert.equal(e.heightFt, 3);
});

test('typed drafts commit only to a clamped number, or keep the last value', () => {
  assert.equal(commitDraft(RUN, '180', 40), 180);
  assert.equal(commitDraft(RUN, ' 75.6 ', 40), 76);
  assert.equal(commitDraft(RUN, '2', 40), 4);
  assert.equal(commitDraft(RUN, '5000', 40), 300);
  assert.equal(commitDraft(RUN, '', 55), 55);
  assert.equal(commitDraft(RUN, 'abc', 55), 55);
  assert.equal(commitDraft(RUN, '-3', 55), 55);
  assert.equal(commitDraft(RUN, '0', 55), 55);
  // The extension's height keeps half feet.
  assert.equal(commitDraft(fence.height, '3.5', 3), 3.5);
  assert.equal(commitDraft(fence.height, '9', 3), 6);
  assert.equal(commitDraft(fence.height, 'x', 3.5), 3.5);
});

test('every estimate carries the installation caveat, and the summary stays within 160 characters', () => {
  for (const system of SYSTEMS) {
    for (const runFt of [RUN.min, RUN.default, RUN.max]) {
      for (const heightFt of [system.height.min, system.height.max]) {
        const e = buildEstimate({ systemId: system.id, runFt, heightFt });
        assert.ok(plain(e.price.caption).endsWith(INSTALLATION_CAVEAT), e.price.caption);
        assert.ok(e.summary.length <= SUMMARY_MAX_LENGTH, `${e.summary.length}: ${e.summary}`);
        assert.ok(e.summary.startsWith(system.summaryLabel), e.summary);
        // Never truncated into the caveat: the figure and caveat always end it.
        assert.ok(e.summary.endsWith(`· ${e.price.figure} ${INSTALLATION_CAVEAT}`), e.summary);
      }
    }
  }
  assert.equal(
    buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 6 }).summary,
    'Fence hedge, 40 ft run × 6 ft high, 240 sq ft · from $3,960 + installation, quoted after a site review',
  );
  assert.equal(
    buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 8 }).summary,
    'Fence hedge, 40 ft run × 8 ft high, 320 sq ft · from $5,280 + installation, quoted after a site review',
  );
  assert.equal(
    buildEstimate({ systemId: 'hedge-freestanding', runFt: 40, heightFt: 6 }).summary,
    'Freestanding hedge, 40 ft run · from $8,000 + installation, quoted after a site review',
  );
  assert.equal(
    buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: 3 }).summary,
    'Fence extension, 40 ft run × 3 ft over the fence · from $3,240 + installation, quoted after a site review',
  );
  assert.equal(
    buildEstimate({ systemId: 'living-wall', runFt: 40, heightFt: 8 }).summary,
    'Living wall, 40 ft run × 8 ft high, 320 sq ft · from $5,760 + installation, quoted after a site review',
  );
});

test('large runs group thousands', () => {
  const e = buildEstimate({ systemId: 'living-wall', runFt: 300, heightFt: 20 });
  assert.equal(e.areaSqFt, 6000);
  assert.equal(e.price.arithmetic, '300 ft × 20 ft = 6,000 sq ft × $18 = $108,000');
  assert.equal(e.price.figure, 'from $108,000');
  const long = buildEstimate({ systemId: 'hedge', runFt: 300, heightFt: 6 });
  assert.equal(long.price.arithmetic, '300 linear ft × $99 (6 ft tall) = $29,700');
});

test('formatNumber groups thousands and keeps its decimals', () => {
  assert.equal(formatNumber(96), '96');
  assert.equal(formatNumber(1440), '1,440');
  assert.equal(formatNumber(3600), '3,600');
  assert.equal(formatNumber(24.6), '24.6');
});

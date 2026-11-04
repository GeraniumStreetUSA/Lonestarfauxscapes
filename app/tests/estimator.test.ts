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
const plain = (text: string) => text.replace(/\u00A0/g, ' ');

const hedge = getSystem('hedge');
const freestanding = getSystem('hedge-freestanding');
const fence = getSystem('fence-extension');
const wall = getSystem('living-wall');
const privacy = getSystem('privacy-wall');

test('systems and modules: 20 in hedge and extension panels, 40 in wall panels, 4 ft privacy wall units', () => {
  assert.deepEqual(
    SYSTEMS.map((s) => [s.id, s.label, s.moduleIn, s.note]),
    [
      ['hedge', 'Hedge on your fence or wall', 20, '20 in panels'],
      ['hedge-freestanding', 'Freestanding hedge', 20, '7 in deep'],
      ['fence-extension', 'Fence extension', 20, '20 in panels'],
      ['living-wall', 'Living wall', 40, '40 in panels'],
      ['privacy-wall', 'Privacy wall', 48, '4 × 4 ft units'],
    ],
  );
  // Every figure is built on the data file's released prices, nothing else.
  assert.equal(hedge.price, STARTING_PRICES.hedge);
  assert.equal(freestanding.price, STARTING_PRICES['hedge-freestanding']);
  assert.equal(fence.price, STARTING_PRICES['fence-extension']);
  assert.equal(wall.price, STARTING_PRICES['living-wall']);
  assert.equal(privacy.price, STARTING_PRICES['privacy-wall']);
  assert.deepEqual(SYSTEMS.map(isPerUnit), [false, false, false, false, true]);
});

test('heights are locked to the priced size, except the living wall and the hedge on a fence', () => {
  assert.deepEqual(RUN, { min: 4, max: 300, default: 40 });
  // No height is released for a hedge on a fence or wall: the field draws and counts panels, and says so.
  assert.deepEqual(hedge.height, { min: 3, max: 10, default: 6 });
  assert.match(hedge.heightNote ?? '', /per linear foot/);
  assert.match(hedge.heightNote ?? '', /priced to your site/);
  assert.deepEqual(freestanding.height, { min: 6, max: 6, default: 6 });
  assert.equal(freestanding.heightNote, null);
  assert.deepEqual(fence.height, { min: 3, max: 3, default: 3 });
  assert.deepEqual(wall.height, { min: 3, max: 20, default: 8 });
  assert.deepEqual(privacy.height, { min: 4, max: 4, default: 4 });
  assert.deepEqual(SYSTEMS.map(isHeightLocked), [false, true, true, false, true]);
  // Whatever height arrives, a locked system uses its priced size.
  for (const heightFt of [0, 1, 4, 6, 12, 99, Number.NaN]) {
    assert.equal(buildEstimate({ systemId: 'hedge-freestanding', runFt: 40, heightFt }).heightFt, 6);
    assert.equal(buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt }).heightFt, 3);
    assert.equal(buildEstimate({ systemId: 'privacy-wall', runFt: 40, heightFt }).heightFt, 4);
  }
  assert.equal(buildEstimate({ systemId: 'living-wall', runFt: 40, heightFt: 12 }).heightFt, 12);
});

test('the default hedge run: 24 across x 4 rows = 96 panels, from $3,960', () => {
  const e = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 6 });
  assert.equal(e.across, 24);
  assert.equal(e.rows, 4);
  assert.equal(e.panels, 96);
  assert.equal(e.panelsWord, 'panels');
  assert.equal(e.areaSqFt, 240);
  assert.deepEqual(e.lines, {
    across: '40 ft × 12 = 480 in ÷ 20 in = 24 across',
    rows: '6 ft × 12 = 72 in ÷ 20 in = 3.6, so 4 rows',
    panels: '24 × 4 = 96 panels',
    area: '40 ft × 6 ft = 240 sq ft',
  });
  assert.deepEqual({ ...e.price, caption: plain(e.price.caption) }, {
    total: 3960,
    amount: '$3,960',
    per: '',
    figure: 'from $3,960',
    arithmetic: '40 linear ft × $99 = $3,960',
    caption: 'On your fence or wall, single-sided, about 2 to 3 in deep · + installation, quoted after a site review',
    frNote: FR_PRICE_NOTE,
  });
});

test('freestanding hedge: the same panels, priced at the freestanding rate', () => {
  const e = buildEstimate({ systemId: 'hedge-freestanding', runFt: 40, heightFt: 6 });
  assert.equal(e.panels, 96);
  assert.equal(e.price.total, 8000);
  assert.equal(e.price.figure, 'from $8,000');
  assert.equal(e.price.arithmetic, '40 linear ft × $200 = $8,000');
  assert.equal(
    plain(e.price.caption),
    'Freestanding, 6 ft × 7 in, a full 3D hedge on posts set in concrete · + installation, quoted after a site review',
  );
  assert.equal(e.price.frNote, FR_PRICE_NOTE);
  // The two hedge kinds never share a rate: the same run costs more freestanding.
  const onFence = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 6 });
  assert.ok((e.price.total ?? 0) > (onFence.price.total ?? 0));
  assert.match(e.summary, /^Freestanding hedge, 40 ft run/);
  assert.match(onFence.summary, /^Fence hedge, 40 ft run/);
});

test('the hedge on a fence takes a height for the drawing, and its price stays per linear foot', () => {
  const low = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 4 });
  const tall = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 9 });
  assert.equal(low.heightFt, 4);
  assert.equal(tall.heightFt, 9);
  assert.ok(tall.panels > low.panels);
  assert.equal(low.price.total, 3960);
  assert.equal(tall.price.total, 3960);
  assert.equal(buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 99 }).heightFt, 10);
});

test('every priced estimate says fire-rated foliage costs extra', () => {
  for (const system of SYSTEMS) {
    const e = buildEstimate({ systemId: system.id, runFt: 40, heightFt: system.height.default });
    assert.equal(e.price.frNote, FR_PRICE_NOTE, system.id);
  }
  assert.match(FR_PRICE_NOTE, /fire-rated foliage costs extra/);
});

test('fence extension: 3 ft is 36 in ÷ 20 in = 1.8, so 2 rows; priced per linear ft', () => {
  const e = buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: 3 });
  assert.equal(e.lines.rows, '3 ft × 12 = 36 in ÷ 20 in = 1.8, so 2 rows');
  assert.equal(e.panels, 48);
  assert.equal(e.price.total, 2600);
  assert.equal(e.price.figure, 'from $2,600');
  assert.equal(e.price.arithmetic, '40 linear ft × $65 = $2,600');
  assert.equal(plain(e.price.caption), '3 ft extension · + installation, quoted after a site review');
});

test('living wall: run x height = sq ft, priced per sq ft', () => {
  const e = buildEstimate({ systemId: 'living-wall', runFt: 40, heightFt: 8 });
  assert.equal(e.across, 12);
  assert.equal(e.rows, 3);
  assert.equal(e.panels, 36);
  assert.equal(e.lines.across, '40 ft × 12 = 480 in ÷ 40 in = 12 across');
  assert.equal(e.lines.rows, '8 ft × 12 = 96 in ÷ 40 in = 2.4, so 3 rows');
  assert.equal(e.lines.area, '40 ft × 8 ft = 320 sq ft');
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
  assert.equal(up.price.arithmetic, '41 linear ft × $99 = $4,059, rounded to $4,060');
  // 46 ft × 99 = 4,554: down to 4,550.
  const down = buildEstimate({ systemId: 'hedge', runFt: 46, heightFt: 6 });
  assert.equal(down.price.arithmetic, '46 linear ft × $99 = $4,554, rounded to $4,550');
  // 41 ft × 65 = 2,665: half rounds up, to 2,670.
  assert.equal(buildEstimate({ systemId: 'fence-extension', runFt: 41, heightFt: 3 }).price.figure, 'from $2,670');
  // 41 ft × 8 ft = 328 sq ft × 18 = 5,904: down to 5,900.
  assert.equal(
    buildEstimate({ systemId: 'living-wall', runFt: 41, heightFt: 8 }).price.arithmetic,
    '41 ft × 8 ft = 328 sq ft × $18 = $5,904, rounded to $5,900',
  );

  // A rate system's figure is rate x size, rounded, and nothing else.
  for (const system of SYSTEMS.filter((s) => !isPerUnit(s))) {
    for (const runFt of [4, 17, 40, 123, 300]) {
      for (const heightFt of [system.height.min, 11, system.height.max]) {
        const e = buildEstimate({ systemId: system.id, runFt, heightFt });
        const size = system.price.per === 'square-foot' ? e.runFt * e.heightFt : e.runFt;
        assert.equal(e.price.total, Math.round((size * system.price.amount) / 10) * 10);
        assert.equal((e.price.total ?? 1) % 10, 0);
      }
    }
  }
});

test('the privacy wall price is one standard unit, never multiplied', () => {
  for (const runFt of [4, 40, 41, 180, 300]) {
    const e = buildEstimate({ systemId: 'privacy-wall', runFt, heightFt: 4 });
    assert.equal(e.price.total, null);
    assert.equal(e.price.arithmetic, null);
    assert.equal(e.price.amount, '$699');
    assert.equal(e.price.per, '/ unit');
    assert.equal(e.price.figure, 'from $699 / unit');
    assert.equal(
      plain(e.price.caption),
      '4 ft × 4 ft with standard base · fully custom sizes · + installation, quoted after a site review',
    );
    // However many units the run needs, the only dollar figure is the unit price.
    const text = [e.summary, e.price.figure, e.price.caption, ...Object.values(e.lines)].join(' ');
    assert.deepEqual([...new Set(text.match(/\$[\d,]+/g))], ['$699']);
  }
});

test('privacy wall units: ceil(run ÷ 4 ft)', () => {
  const e = buildEstimate({ systemId: 'privacy-wall', runFt: 40, heightFt: 4 });
  assert.equal(e.across, 10);
  assert.equal(e.panels, 10);
  assert.equal(e.panelsWord, 'units');
  assert.deepEqual(e.lines, {
    across: '40 ft ÷ 4 ft = 10 units',
    rows: null,
    panels: null,
    area: '40 ft × 4 ft = 160 sq ft',
  });
  const odd = buildEstimate({ systemId: 'privacy-wall', runFt: 41, heightFt: 4 });
  assert.equal(odd.panels, 11);
  assert.equal(odd.lines.across, '41 ft ÷ 4 ft = 10.25, so 11 units');
  const one = buildEstimate({ systemId: 'privacy-wall', runFt: 4, heightFt: 4 });
  assert.equal(one.panels, 1);
  assert.equal(one.panelsWord, 'unit');
  assert.equal(one.lines.across, '4 ft ÷ 4 ft = 1 unit');
  assert.equal(buildEstimate({ systemId: 'privacy-wall', runFt: 300, heightFt: 4 }).panels, 75);
});

test('counts always round up to a whole panel', () => {
  // 41 ft = 492 in / 20 in = 24.6, so 25 across.
  const e = buildEstimate({ systemId: 'hedge', runFt: 41, heightFt: 6 });
  assert.equal(e.across, 25);
  assert.equal(e.lines.across, '41 ft × 12 = 492 in ÷ 20 in = 24.6, so 25 across');
  assert.equal(e.panels, 100);
  // 10 ft = 120 in / 40 in = exactly 3 rows: no "so".
  const exact = buildEstimate({ systemId: 'living-wall', runFt: 40, heightFt: 10 });
  assert.equal(exact.rows, 3);
  assert.equal(exact.lines.rows, '10 ft × 12 = 120 in ÷ 40 in = 3 rows');
});

test('a single row reads "1 row"', () => {
  const e = buildEstimate({ systemId: 'living-wall', runFt: 40, heightFt: 3 });
  assert.equal(e.rows, 1);
  assert.equal(e.lines.rows, '3 ft × 12 = 36 in ÷ 40 in = 0.9, so 1 row');
  assert.equal(e.lines.panels, '12 × 1 = 12 panels');
});

test('large runs group thousands', () => {
  const e = buildEstimate({ systemId: 'living-wall', runFt: 300, heightFt: 20 });
  assert.equal(e.across, 90);
  assert.equal(e.rows, 6);
  assert.equal(e.panels, 540);
  assert.equal(e.lines.across, '300 ft × 12 = 3,600 in ÷ 40 in = 90 across');
  assert.equal(e.lines.rows, '20 ft × 12 = 240 in ÷ 40 in = 6 rows');
  assert.equal(e.lines.panels, '90 × 6 = 540 panels');
  assert.equal(e.lines.area, '300 ft × 20 ft = 6,000 sq ft');
  assert.equal(e.price.arithmetic, '300 ft × 20 ft = 6,000 sq ft × $18 = $108,000');
  assert.equal(e.price.figure, 'from $108,000');
  const long = buildEstimate({ systemId: 'hedge', runFt: 300, heightFt: 6 });
  assert.equal(long.lines.panels, '180 × 4 = 720 panels');
  assert.equal(long.lines.area, '300 ft × 6 ft = 1,800 sq ft');
  assert.equal(long.price.arithmetic, '300 linear ft × $99 = $29,700');
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
  assert.equal(clampHeight(freestanding, 1), 6);
  assert.equal(clampHeight(fence, 9), 3);
  assert.equal(clampHeight(wall, 1), 3);
  assert.equal(clampHeight(wall, 7.6), 8);
  assert.equal(clampHeight(wall, 25), 20);
  // buildEstimate clamps too, so a stray value can never reach the arithmetic.
  const e = buildEstimate({ systemId: 'living-wall', runFt: 999, heightFt: 0 });
  assert.equal(e.runFt, 300);
  assert.equal(e.heightFt, 3);
});

test('typed drafts commit only to a clamped whole number, or keep the last value', () => {
  assert.equal(commitDraft(RUN, '180', 40), 180);
  assert.equal(commitDraft(RUN, ' 75.6 ', 40), 76);
  assert.equal(commitDraft(RUN, '2', 40), 4);
  assert.equal(commitDraft(RUN, '5000', 40), 300);
  assert.equal(commitDraft(RUN, '', 55), 55);
  assert.equal(commitDraft(RUN, 'abc', 55), 55);
  assert.equal(commitDraft(RUN, '-3', 55), 55);
  assert.equal(commitDraft(RUN, '0', 55), 55);
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
    'Fence hedge, 40 ft run × 6 ft high: 24 across × 4 rows = 96 panels, 240 sq ft (20 in panels) · from $3,960 + installation, quoted after a site review',
  );
  assert.equal(
    buildEstimate({ systemId: 'privacy-wall', runFt: 40, heightFt: 4 }).summary,
    'Privacy wall, 40 ft run × 4 ft high: 10 units, 160 sq ft (4 × 4 ft units) · from $699 / unit + installation, quoted after a site review',
  );
});

test('formatNumber groups thousands and keeps its decimals', () => {
  assert.equal(formatNumber(96), '96');
  assert.equal(formatNumber(1440), '1,440');
  assert.equal(formatNumber(3600), '3,600');
  assert.equal(formatNumber(24.6), '24.6');
});

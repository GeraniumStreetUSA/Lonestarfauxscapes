import assert from 'node:assert/strict';
import test from 'node:test';

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
} from '../src/lib/estimator.ts';

const hedge = getSystem('hedge');
const fence = getSystem('fence-extension');
const wall = getSystem('living-wall');

test('module sizes: 20 in hedge and fence extension panels, 40 in living wall panels', () => {
  assert.deepEqual(
    SYSTEMS.map((s) => [s.id, s.moduleIn, s.note]),
    [
      ['hedge', 20, '20 in panels'],
      ['fence-extension', 20, '20 in panels'],
      ['living-wall', 40, '40 in panels'],
    ],
  );
});

test('ranges: run 4 to 300 ft (default 40) and per-system heights', () => {
  assert.deepEqual(RUN, { min: 4, max: 300, default: 40 });
  assert.deepEqual(hedge.height, { min: 3, max: 12, default: 6 });
  assert.deepEqual(fence.height, { min: 1, max: 4, default: 2 });
  assert.deepEqual(wall.height, { min: 3, max: 20, default: 8 });
});

test('the default hedge run: 24 across x 4 rows = 96 panels, 240 sq ft', () => {
  const e = buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 6 });
  assert.equal(e.across, 24);
  assert.equal(e.rows, 4);
  assert.equal(e.panels, 96);
  assert.equal(e.areaSqFt, 240);
  assert.deepEqual(e.lines, {
    across: '40 ft × 12 = 480 in ÷ 20 in = 24 across',
    rows: '6 ft × 12 = 72 in ÷ 20 in = 3.6, so 4 rows',
    panels: '24 × 4 = 96 panels',
    area: '40 ft × 6 ft = 240 sq ft',
  });
});

test('counts always round up to a whole panel', () => {
  // 41 ft = 492 in / 20 in = 24.6, so 25 across.
  const e = buildEstimate({ systemId: 'hedge', runFt: 41, heightFt: 5 });
  assert.equal(e.across, 25);
  assert.equal(e.lines.across, '41 ft × 12 = 492 in ÷ 20 in = 24.6, so 25 across');
  // 5 ft = 60 in / 20 in = exactly 3 rows: no "so".
  assert.equal(e.rows, 3);
  assert.equal(e.lines.rows, '5 ft × 12 = 60 in ÷ 20 in = 3 rows');
  assert.equal(e.panels, 75);
});

test('living wall counts on 40 in panels', () => {
  const e = buildEstimate({ systemId: 'living-wall', runFt: 40, heightFt: 8 });
  assert.equal(e.across, 12);
  assert.equal(e.rows, 3);
  assert.equal(e.panels, 36);
  assert.equal(e.lines.across, '40 ft × 12 = 480 in ÷ 40 in = 12 across');
  assert.equal(e.lines.rows, '8 ft × 12 = 96 in ÷ 40 in = 2.4, so 3 rows');
  assert.equal(e.lines.area, '40 ft × 8 ft = 320 sq ft');
});

test('a single row reads "1 row"', () => {
  const e = buildEstimate({ systemId: 'fence-extension', runFt: 40, heightFt: 1 });
  assert.equal(e.rows, 1);
  assert.equal(e.lines.rows, '1 ft × 12 = 12 in ÷ 20 in = 0.6, so 1 row');
  assert.equal(e.lines.panels, '24 × 1 = 24 panels');
});

test('large runs group thousands', () => {
  const e = buildEstimate({ systemId: 'hedge', runFt: 300, heightFt: 12 });
  assert.equal(e.across, 180);
  assert.equal(e.rows, 8);
  assert.equal(e.panels, 1440);
  assert.equal(e.lines.across, '300 ft × 12 = 3,600 in ÷ 20 in = 180 across');
  assert.equal(e.lines.rows, '12 ft × 12 = 144 in ÷ 20 in = 7.2, so 8 rows');
  assert.equal(e.lines.panels, '180 × 8 = 1,440 panels');
  assert.equal(e.lines.area, '300 ft × 12 ft = 3,600 sq ft');
});

test('inputs are rounded and clamped', () => {
  assert.equal(clampRun(0), 4);
  assert.equal(clampRun(3.4), 4);
  assert.equal(clampRun(40.4), 40);
  assert.equal(clampRun(40.5), 41);
  assert.equal(clampRun(1000), 300);
  assert.equal(clampRun(Number.NaN), 40);
  assert.equal(clampHeight(hedge, 1), 3);
  assert.equal(clampHeight(hedge, 30), 12);
  assert.equal(clampHeight(fence, 9), 4);
  assert.equal(clampHeight(wall, 25), 20);
  // buildEstimate clamps too, so a stray value can never reach the arithmetic.
  const e = buildEstimate({ systemId: 'fence-extension', runFt: 999, heightFt: 0 });
  assert.equal(e.runFt, 300);
  assert.equal(e.heightFt, 1);
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

test('the summary stays within 160 characters for every system and extreme', () => {
  for (const system of SYSTEMS) {
    for (const runFt of [RUN.min, RUN.default, RUN.max]) {
      for (const heightFt of [system.height.min, system.height.max]) {
        const e = buildEstimate({ systemId: system.id, runFt, heightFt });
        assert.ok(e.summary.length <= SUMMARY_MAX_LENGTH, e.summary);
        assert.ok(e.summary.startsWith(system.label), e.summary);
      }
    }
  }
  assert.equal(
    buildEstimate({ systemId: 'hedge', runFt: 40, heightFt: 6 }).summary,
    'Hedge, 40 ft run × 6 ft high: 24 across × 4 rows = 96 panels, 240 sq ft (20 in panels)',
  );
});

test('no figure in the estimator is money', () => {
  for (const system of SYSTEMS) {
    const e = buildEstimate({ systemId: system.id, runFt: 120, heightFt: system.height.max });
    const text = [e.summary, ...Object.values(e.lines)].join(' ');
    assert.doesNotMatch(text, /\$|usd|price|cost/i);
  }
});

test('formatNumber groups thousands and keeps one decimal', () => {
  assert.equal(formatNumber(96), '96');
  assert.equal(formatNumber(1440), '1,440');
  assert.equal(formatNumber(3600), '3,600');
  assert.equal(formatNumber(24.6), '24.6');
});

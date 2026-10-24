import assert from 'node:assert/strict';
import test from 'node:test';

import { buildEstimate } from '../src/lib/estimator.ts';
import {
  BACK_LENGTH,
  HOUSE_HATCH,
  LOT,
  MIN_TICK_GAP,
  TRACK_LENGTH,
  VIEW_H,
  VIEW_W,
  buildRun,
  runToPx,
} from '../src/lib/yard-plan-geometry.ts';

function run(runFt: number, systemId: 'hedge' | 'fence-extension' | 'living-wall' = 'hedge') {
  const e = buildEstimate({ systemId, runFt, heightFt: 6 });
  return buildRun(e.runFt, e.across);
}

test('the plan is a 640 x 420 drawing', () => {
  assert.equal(VIEW_W, 640);
  assert.equal(VIEW_H, 420);
});

test('feet map to drawn length on a log scale: 30 ft and 300 ft differ, 4 ft still shows', () => {
  const p4 = runToPx(4);
  const p30 = runToPx(30);
  const p300 = runToPx(300);
  assert.ok(p4 > 30, `4 ft draws ${p4}`);
  assert.ok(p300 > p30 * 3, `30 ft ${p30} vs 300 ft ${p300}`);
  // Log, not linear: the first 30 ft are worth far more than the last 30 ft.
  assert.ok(runToPx(30) - runToPx(0) > (runToPx(300) - runToPx(270)) * 4);
  assert.equal(runToPx(300), TRACK_LENGTH);
});

test('the back line holds 120 ft; longer runs turn the corner down the side line', () => {
  assert.equal(runToPx(120), BACK_LENGTH);
  const short = run(40);
  assert.equal(short.turnsCorner, false);
  assert.equal(short.points.length, 2);
  assert.equal(short.end.y, LOT.y0);

  const corner = run(180);
  assert.equal(corner.turnsCorner, true);
  assert.deepEqual(corner.points[1], { x: LOT.x1, y: LOT.y0 });
  assert.equal(corner.end.x, LOT.x1);
  assert.ok(corner.end.y > LOT.y0 + 50, `180 ft ends ${corner.end.y}`);
  // The side run stays above the house.
  assert.ok(run(300).end.y < 330);
});

test('the run starts at the back line left corner, where the page spine lands', () => {
  const r = run(40);
  assert.deepEqual(r.start, { x: LOT.x0, y: LOT.y0 });
  assert.equal(r.length, runToPx(40));
});

test('one tick per panel across when they fit', () => {
  const r = run(40);
  assert.equal(r.panelsAcross, 24);
  assert.equal(r.tickStep, 1);
  assert.equal(r.ticks.length, 24);
  // Ticks run left to right along the back line, perpendicular to it.
  for (let i = 1; i < r.ticks.length; i += 1) {
    assert.ok(r.ticks[i].x1 > r.ticks[i - 1].x1);
    assert.equal(r.ticks[i].x1, r.ticks[i].x2);
  }
});

test('ticks closer than the minimum gap are thinned to every Nth, and say so', () => {
  const r = run(300);
  assert.equal(r.panelsAcross, 180);
  assert.ok(r.tickStep >= 2, `step ${r.tickStep}`);
  assert.equal(r.ticks.length, Math.ceil(180 / r.tickStep));
  const gap = (r.length / r.panelsAcross) * r.tickStep;
  assert.ok(gap >= MIN_TICK_GAP, `drawn gap ${gap}`);
  // On the side line the ticks point west into the yard.
  const last = r.ticks[r.ticks.length - 1];
  assert.equal(last.y1, last.y2);
  assert.ok(last.x2 < last.x1);
});

test('living wall panels are wider, so fewer ticks', () => {
  assert.equal(run(40, 'living-wall').ticks.length, 12);
  assert.equal(run(300, 'living-wall').tickStep, 1);
});

test('the run label sits above the back line, then right of the side line', () => {
  assert.equal(run(40).labels.run.side, 'above');
  assert.equal(run(180).labels.run.side, 'right');
});

test('geometry is deterministic', () => {
  assert.deepEqual(run(137), run(137));
  assert.ok(HOUSE_HATCH.length > 20);
});

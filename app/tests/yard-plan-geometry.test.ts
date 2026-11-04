import assert from 'node:assert/strict';
import test from 'node:test';

import { buildEstimate } from '../src/lib/estimator.ts';
import {
  BACK_LENGTH,
  HOUSE_HATCH,
  LOT,
  MIN_TICK_GAP,
  TICK_LENGTH,
  TRACK_LENGTH,
  UNIT_GAP,
  VIEW_H,
  VIEW_W,
  buildRun,
  buildUnitBlocks,
  depthToPlan,
  runToPx,
  type Point,
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

function units(runFt: number) {
  const e = buildEstimate({ systemId: 'privacy-wall', runFt, heightFt: 4 });
  const r = buildRun(e.runFt, e.across);
  return { r, units: e.across, blocks: buildUnitBlocks(r, e.across) };
}

function drawnLength(points: Point[]): number {
  return points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - points[i].x, p.y - points[i].y), 0);
}

test('privacy wall units are separate blocks along the run, one per unit', () => {
  const { r, units: count, blocks } = units(40);
  assert.equal(count, 10);
  assert.equal(blocks.length, 10);
  // On the back line, centred in the band, left to right with a gap between neighbours.
  for (const b of blocks) {
    assert.equal(b.length, 2);
    assert.equal(b[0].y, LOT.y0 + TICK_LENGTH / 2);
    assert.equal(b[1].y, b[0].y);
    assert.ok(b[1].x > b[0].x);
  }
  for (let i = 1; i < blocks.length; i += 1) {
    const gap = blocks[i][0].x - blocks[i - 1][1].x;
    assert.ok(Math.abs(gap - UNIT_GAP) < 0.05, `gap ${gap}`);
  }
  assert.ok(blocks[0][0].x > r.start.x);
  assert.ok(blocks[blocks.length - 1][1].x < r.end.x);
});

test('units follow the run round the corner, and stay readable at 300 ft', () => {
  const corner = units(180);
  assert.equal(corner.blocks.length, 45);
  // One unit straddles the corner and bends round it; the last runs down the side line.
  assert.ok(corner.blocks.some((b) => b.length === 3));
  const last = corner.blocks[corner.blocks.length - 1];
  assert.equal(last[0].x, last[1].x);
  assert.ok(last[1].y > last[0].y);

  const far = units(300);
  assert.equal(far.blocks.length, 75);
  for (const b of far.blocks) assert.ok(drawnLength(b) >= MIN_TICK_GAP, `block ${drawnLength(b)}`);
});

test('geometry is deterministic', () => {
  assert.deepEqual(run(137), run(137));
  assert.deepEqual(units(137), units(137));
  assert.ok(HOUSE_HATCH.length > 20);
});

test('a hedge on a fence line draws thin, a freestanding hedge at its full 7 in depth', () => {
  assert.equal(depthToPlan(7), TICK_LENGTH);
  assert.ok(depthToPlan(3) < TICK_LENGTH / 2, `3 in draws ${depthToPlan(3)}`);
  assert.ok(depthToPlan(2) < depthToPlan(3));
  const onFence = buildRun(40, 24, depthToPlan(3));
  const free = buildRun(40, 24, depthToPlan(7));
  // Ticks run from the line into the yard by the drawn depth; the band's centre line sits half a depth in.
  const near = (a: number, b: number) => Math.abs(a - b) < 0.01;
  assert.ok(near(onFence.ticks[0].y2 - onFence.ticks[0].y1, depthToPlan(3)));
  assert.ok(near(free.ticks[0].y2 - free.ticks[0].y1, TICK_LENGTH));
  assert.ok(near(onFence.band[0].y, LOT.y0 + depthToPlan(3) / 2));
  assert.ok(near(free.band[0].y, LOT.y0 + TICK_LENGTH / 2));
  // No depth given: the plan's default, as before.
  assert.deepEqual(buildRun(40, 24), free);
});

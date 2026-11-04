import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BACK_LENGTH,
  HOUSE_HATCH,
  LOT,
  TICK_LENGTH,
  TRACK_LENGTH,
  VIEW_H,
  VIEW_W,
  buildRun,
  depthToPlan,
  runToPx,
} from '../src/lib/yard-plan-geometry.ts';

function run(runFt: number) {
  return buildRun(runFt);
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

test('the run label sits above the back line, then right of the side line', () => {
  assert.equal(run(40).labels.run.side, 'above');
  assert.equal(run(180).labels.run.side, 'right');
});

test('geometry is deterministic', () => {
  assert.deepEqual(run(137), run(137));
  assert.ok(HOUSE_HATCH.length > 20);
});

test('a hedge on a fence line draws thin, a freestanding hedge at its full 7 in depth', () => {
  assert.equal(depthToPlan(7), TICK_LENGTH);
  assert.ok(depthToPlan(3) < TICK_LENGTH / 2, `3 in draws ${depthToPlan(3)}`);
  assert.ok(depthToPlan(2) < depthToPlan(3));
  const onFence = buildRun(40, depthToPlan(3));
  const free = buildRun(40, depthToPlan(7));
  // The band's centre line sits half a depth into the yard.
  const near = (a: number, b: number) => Math.abs(a - b) < 0.01;
  assert.ok(near(onFence.band[0].y, LOT.y0 + depthToPlan(3) / 2));
  assert.ok(near(free.band[0].y, LOT.y0 + TICK_LENGTH / 2));
  // No depth given: the plan's default, as before.
  assert.deepEqual(buildRun(40), free);
});

test('the plan draws the run and its length only: no panel ticks, module label or unit blocks', () => {
  const r = run(40);
  assert.deepEqual(Object.keys(r).sort(), ['band', 'end', 'labels', 'length', 'points', 'start', 'turnsCorner']);
  assert.deepEqual(Object.keys(r.labels), ['run']);
  // The band follows the run round the corner.
  const corner = run(180);
  assert.equal(corner.band.length, 3);
  assert.equal(run(40).band.length, 2);
});

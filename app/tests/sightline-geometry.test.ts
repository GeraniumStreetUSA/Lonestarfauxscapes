import assert from 'node:assert/strict';
import test from 'node:test';

import {
  clampHedge,
  EYE,
  FENCE,
  HEDGE,
  hull,
  isOutOfSight,
  outOfSightThreshold,
  POOL,
  rayHeightAt,
  sightlineFrame,
  visibleFrom,
} from '../src/lib/sightline-geometry.ts';

test('the 6 ft fence alone leaves the pool in view', () => {
  assert.equal(isOutOfSight(0), false);
  assert.equal(isOutOfSight(FENCE.height), false);
  assert.ok(visibleFrom(0) > POOL.y0 && visibleFrom(0) < POOL.y1);
});

test('the threshold sits between 7 and 8 ft, so the default 8 ft hedge hides the pool', () => {
  const t = outOfSightThreshold();
  assert.ok(t > 7 && t < 8, `threshold ${t}`);
  assert.equal(isOutOfSight(t - 0.05), false);
  assert.equal(isOutOfSight(t + 0.05), true);
  assert.equal(isOutOfSight(HEDGE.default), true);
});

test('raising the hedge only ever hides more of the pool', () => {
  let last = -Infinity;
  for (let h = HEDGE.min; h <= HEDGE.max; h += 0.25) {
    const cut = visibleFrom(h);
    assert.ok(cut >= last);
    last = cut;
  }
});

test('a ray is blocked exactly when it passes below the hedge top at the hedge face', () => {
  const h = 7;
  const cut = visibleFrom(h);
  const justHidden = { x: 10, y: cut - 0.01, z: 0 };
  const justSeen = { x: 10, y: cut + 0.01, z: 0 };
  assert.ok(rayHeightAt(justHidden, HEDGE.depth) < h);
  assert.ok(rayHeightAt(justSeen, HEDGE.depth) > h);
});

test('frames: in view draws a front cone and a lit strip; out of sight draws neither', () => {
  const seen = sightlineFrame(6);
  assert.equal(seen.outOfSight, false);
  assert.notEqual(seen.frontCone, '');
  assert.notEqual(seen.patch, '');

  const hidden = sightlineFrame(9);
  assert.equal(hidden.outOfSight, true);
  assert.equal(hidden.frontCone, '');
  assert.equal(hidden.patch, '');
  assert.notEqual(hidden.backCone, '');
});

test('a zero-height hedge draws no hedge faces', () => {
  const f = sightlineFrame(0);
  assert.equal(f.hedgeFront, '');
  assert.equal(f.hedgeSide, '');
  assert.equal(f.hedgeTop, '');
});

test('frames are deterministic', () => {
  assert.deepEqual(sightlineFrame(8.3), sightlineFrame(8.3));
});

test('clampHedge keeps the slider in range and falls back on bad input', () => {
  assert.equal(clampHedge(2), HEDGE.min);
  assert.equal(clampHedge(99), HEDGE.max);
  assert.equal(clampHedge(Number.NaN), HEDGE.default);
});

test('hull returns a convex polygon around its points', () => {
  const h = hull([
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 0, y: 2 },
  ]);
  assert.equal(h.length, 4);
});

test('the eye sits on the neighbor house wall, above both blockers', () => {
  assert.ok(EYE.z > HEDGE.max);
});

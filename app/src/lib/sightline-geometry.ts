/**
 * "Out of sight": the hero's backyard, modelled in feet and drawn in a
 * 2:1 axonometric view so a homeowner reads it at a glance (not top down).
 *
 * World axes, in feet:
 *   x  along the back fence, left to right
 *   y  from the fence toward the viewer (into the visitor's yard; the
 *      neighbor's lot is y < 0)
 *   z  up
 *
 * The sightline is real geometry: rays from the neighbor's second-story
 * window to every point of the pool. A ray is blocked when it passes below
 * the top of the fence (at y = 0) or of the hedge (front face at y = 1).
 * Because the pool is flat and level, whether a ray is blocked depends only
 * on how far into the yard it lands, so the visible part of the pool is a
 * strip y ∈ [cut, far edge]. "Out of sight" is when that strip is empty.
 *
 * React-free and deterministic: the same input always gives the same
 * strings, so prerendered and hydrated SVG match.
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Pt {
  x: number;
  y: number;
}

/** Drawing units per foot. */
export const SCALE = 10;
/** Vertical feet read slightly taller than plan feet, as on a drawn axonometric. */
export const Z_SCALE = 1.2;

export const FENCE = { x0: 0, x1: 46, height: 6 } as const;
/** The hedge stands on the yard side of the fence, 12 in deep. */
export const HEDGE = { x0: 0.5, x1: 45.5, depth: 1, min: 6, max: 12, default: 8 } as const;
export const NEIGHBOR_HOUSE = { x0: 15, x1: 41, y0: -28, y1: -10, height: 21 } as const;
export const WINDOW = { x0: 24, x1: 31, z0: 11.5, z1: 16.5 } as const;
/** The neighbor's eye: centre of the second-story window, on its wall. */
export const EYE: Vec3 = { x: 27.5, y: NEIGHBOR_HOUSE.y1, z: 14 };
export const POOL = { x0: 6, x1: 22, y0: 6, y1: 14 } as const;
export const DECK = { x0: 2, x1: 30, y0: 3, y1: 19 } as const;
export const CHAIR = { x0: 23.5, x1: 25.5, y0: 8, y1: 13.5 } as const;
export const OAK = { x: 39.5, y: 15, trunkHeight: 8.5, canopyRadius: 6 } as const;
export const YARD = { x0: -4, x1: 50, y0: 0, y1: 26 } as const;
export const NEIGHBOR_LOT = { x0: -4, x1: 50, y0: -32, y1: 0 } as const;

/** Raw 2:1 axonometric projection, before the viewBox offset. */
export function projectRaw(p: Vec3): Pt {
  return { x: (p.x - p.y) * SCALE, y: ((p.x + p.y) * 0.5 - p.z * Z_SCALE) * SCALE };
}

/**
 * The points that frame the drawing: the house, the fence at full hedge
 * height, the deck and the oak. Ground planes run past this frame and fade
 * out, so empty ground never shrinks the drawing.
 */
function sceneExtents(): Vec3[] {
  const h = NEIGHBOR_HOUSE;
  return [
    { x: h.x0, y: h.y0, z: h.height + 1.5 },
    { x: h.x1, y: h.y0, z: h.height + 1.5 },
    { x: h.x1, y: h.y1, z: 0 },
    { x: h.x0, y: h.y1, z: h.height + 1.5 },
    { x: FENCE.x0 - 2, y: 0, z: HEDGE.max },
    { x: FENCE.x0 - 2, y: 0, z: 0 },
    { x: FENCE.x1 + 2, y: 0, z: 0 },
    { x: DECK.x0 - 1, y: DECK.y1 + 1, z: 0 },
    { x: DECK.x1, y: DECK.y1 + 2, z: 0 },
    { x: OAK.x + OAK.canopyRadius, y: OAK.y, z: 0 },
    { x: OAK.x, y: OAK.y + 3, z: 0 },
    { x: OAK.x, y: OAK.y, z: OAK.trunkHeight + OAK.canopyRadius * 1.4 },
  ];
}

const PAD = 14;

const RAW_BOUNDS = (() => {
  const pts = sceneExtents().map(projectRaw);
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return {
    minX: Math.min(...xs) - PAD,
    minY: Math.min(...ys) - PAD,
    maxX: Math.max(...xs) + PAD,
    maxY: Math.max(...ys) + PAD,
  };
})();

export const VIEWBOX = {
  width: Math.round(RAW_BOUNDS.maxX - RAW_BOUNDS.minX),
  height: Math.round(RAW_BOUNDS.maxY - RAW_BOUNDS.minY),
};

/** Project into viewBox coordinates. */
export function project(p: Vec3): Pt {
  const r = projectRaw(p);
  return { x: r.x - RAW_BOUNDS.minX, y: r.y - RAW_BOUNDS.minY };
}

/** A point as a percentage of the viewBox, for DOM labels laid over the SVG. */
export function toPercent(p: Pt): { left: number; top: number } {
  return { left: (p.x / VIEWBOX.width) * 100, top: (p.y / VIEWBOX.height) * 100 };
}

function fmt(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

/** SVG `points` attribute for world points. */
export function points(ps: Vec3[]): string {
  return ps
    .map(project)
    .map((p) => `${fmt(p.x)},${fmt(p.y)}`)
    .join(' ');
}

/** SVG `points` for already projected points. */
export function points2d(ps: Pt[]): string {
  return ps.map((p) => `${fmt(p.x)},${fmt(p.y)}`).join(' ');
}

/** Height of the ray from the eye to a ground point (z = 0), where it crosses the plane y = planeY. */
export function rayHeightAt(target: Vec3, planeY: number, eye: Vec3 = EYE): number {
  const t = (planeY - eye.y) / (target.y - eye.y);
  return eye.z + (target.z - eye.z) * t;
}

/** Where the ray from the eye to a ground point crosses the plane y = planeY. */
export function rayPointAt(target: Vec3, planeY: number, eye: Vec3 = EYE): Vec3 {
  const t = (planeY - eye.y) / (target.y - eye.y);
  return {
    x: eye.x + (target.x - eye.x) * t,
    y: planeY,
    z: eye.z + (target.z - eye.z) * t,
  };
}

/**
 * The first yard depth whose ray clears a blocker of height `blockerHeight`
 * standing at `planeY`. Ground points nearer than this are hidden.
 */
function clearDepth(planeY: number, blockerHeight: number, eye: Vec3 = EYE): number {
  if (blockerHeight >= eye.z) return Number.POSITIVE_INFINITY;
  return eye.y + (planeY - eye.y) / (1 - blockerHeight / eye.z);
}

export function clampHedge(feet: number): number {
  if (!Number.isFinite(feet)) return HEDGE.default;
  return Math.min(HEDGE.max, Math.max(HEDGE.min, feet));
}

/**
 * Yard depth before which the pool is hidden, for a hedge of `hedgeFt`.
 * The fence alone always applies; the hedge applies once it is drawn at all.
 */
export function visibleFrom(hedgeFt: number): number {
  const fence = clearDepth(0, FENCE.height);
  const hedge = hedgeFt > 0 ? clearDepth(HEDGE.depth, hedgeFt) : Number.NEGATIVE_INFINITY;
  return Math.max(fence, hedge);
}

/** The lowest hedge height that hides the whole pool, in feet. */
export function outOfSightThreshold(): number {
  // Solve clearDepth(HEDGE.depth, h) = POOL.y1 for h.
  return EYE.z * (1 - (HEDGE.depth - EYE.y) / (POOL.y1 - EYE.y));
}

export function isOutOfSight(hedgeFt: number): boolean {
  return visibleFrom(hedgeFt) >= POOL.y1;
}

/** Convex hull (monotone chain), so cones are always clean polygons. */
export function hull(ps: Pt[]): Pt[] {
  const sorted = [...ps].sort((a, b) => a.x - b.x || a.y - b.y);
  if (sorted.length < 3) return sorted;
  const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Pt[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

function corners(x0: number, x1: number, y0: number, y1: number, z = 0): Vec3[] {
  return [
    { x: x0, y: y0, z },
    { x: x1, y: y0, z },
    { x: x1, y: y1, z },
    { x: x0, y: y1, z },
  ];
}

export interface SightlineFrame {
  hedgeFt: number;
  outOfSight: boolean;
  /** Window to fence line, over the whole pool. Drawn behind fence and hedge. */
  backCone: string;
  /** Fence line to the visible strip of pool. Empty when out of sight. */
  frontCone: string;
  /** The strip of pool still in view, on the water. Empty when out of sight. */
  patch: string;
  /** Hedge faces (empty strings when the hedge has no height). */
  hedgeFront: string;
  hedgeSide: string;
  hedgeTop: string;
  /** Handle and label anchor: middle of the hedge's top front edge, as viewBox %. */
  handle: { left: number; top: number };
  /** Label anchor on the visible strip (or the pool centre when hidden), as viewBox %. */
  poolLabel: { left: number; top: number };
}

/** Everything that changes with the hedge height, for one frame. */
export function sightlineFrame(rawHedgeFt: number): SightlineFrame {
  const hedgeFt = Math.max(0, Math.min(HEDGE.max, rawHedgeFt));
  const cut = visibleFrom(hedgeFt);
  const outOfSight = cut >= POOL.y1;

  const pool = corners(POOL.x0, POOL.x1, POOL.y0, POOL.y1);
  const back = hull([project(EYE), ...pool.map((p) => project(rayPointAt(p, 0)))]);

  let frontCone = '';
  let patch = '';
  const stripY0 = Math.max(POOL.y0, cut);
  if (!outOfSight) {
    const strip = corners(POOL.x0, POOL.x1, stripY0, POOL.y1);
    frontCone = points2d(hull([...strip.map((p) => project(rayPointAt(p, 0))), ...strip.map(project)]));
    patch = points(strip);
  }

  const { x0, x1, depth } = HEDGE;
  const h = hedgeFt;
  const hedgeFront =
    h > 0
      ? points([
          { x: x0, y: depth, z: 0 },
          { x: x1, y: depth, z: 0 },
          { x: x1, y: depth, z: h },
          { x: x0, y: depth, z: h },
        ])
      : '';
  const hedgeSide =
    h > 0
      ? points([
          { x: x1, y: depth, z: 0 },
          { x: x1, y: 0, z: 0 },
          { x: x1, y: 0, z: h },
          { x: x1, y: depth, z: h },
        ])
      : '';
  const hedgeTop =
    h > 0
      ? points([
          { x: x0, y: 0, z: h },
          { x: x1, y: 0, z: h },
          { x: x1, y: depth, z: h },
          { x: x0, y: depth, z: h },
        ])
      : '';

  const handlePt = project({ x: x0 + 9, y: depth, z: Math.max(h, FENCE.height) });
  const poolPt = outOfSight
    ? project({ x: (POOL.x0 + POOL.x1) / 2, y: (POOL.y0 + POOL.y1) / 2, z: 0 })
    : project({ x: (POOL.x0 + POOL.x1) / 2, y: (stripY0 + POOL.y1) / 2, z: 0 });

  return {
    hedgeFt,
    outOfSight,
    backCone: points2d(back),
    frontCone,
    patch,
    hedgeFront,
    hedgeSide,
    hedgeTop,
    handle: toPercent(handlePt),
    poolLabel: toPercent(poolPt),
  };
}

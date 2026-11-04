/**
 * The estimator's yard plan: one fixed, top-down Texas backyard in a
 * 640 x 420 viewBox, with the visitor's run drawn along its back property
 * line.
 *
 * Pure and deterministic (no Math.random, no DOM), so the plan in the
 * prerendered HTML is the plan React hydrates. Labels are returned as anchor
 * points for DOM text over the SVG; the SVG itself never carries text.
 *
 * Plan conventions used:
 *   - property line: long-short dashed, the lot is a closed rectangle;
 *   - the run starts at the back line's left corner and runs east; past the
 *     back line's capacity (120 ft) it turns the corner and runs south down
 *     the side line, so a corner lot reads differently from a short run;
 *   - feet map to drawn length on a log scale, so 30 ft and 300 ft differ
 *     visibly while 4 ft still shows;
 *   - one tick per panel across, perpendicular to the run, on the yard side;
 *     ticks closer than MIN_TICK_GAP are thinned to every Nth and labelled;
 *   - freestanding units (the privacy wall) are separate blocks instead.
 */

export const VIEW_W = 640;
export const VIEW_H = 420;

export interface Point {
  x: number;
  y: number;
}

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * The lot. Its left edge sits on the viewBox's left edge so the page's spine
 * (the hero's property line, carried down the page) lands exactly on the
 * corner where the run starts.
 */
export const LOT = { x0: 0.5, y0: 40, x1: 548, y1: 404 } as const;

/** Run length (ft) the back line holds before the run turns the corner. */
export const BACK_CAPACITY_FT = 120;
/** Longest run the estimator allows, in feet. */
export const MAX_RUN_FT = 300;
/** Log-scale knee: smaller is more logarithmic. */
const LOG_KNEE_FT = 30;

export const BACK_LENGTH = LOT.x1 - LOT.x0;
const LOG_SCALE = BACK_LENGTH / Math.log(1 + BACK_CAPACITY_FT / LOG_KNEE_FT);

/**
 * Smallest drawn gap between ticks, in viewBox units. The plan renders at
 * roughly 0.55x on a 390 px phone and about 1x on desktop, so 6 units keeps
 * ticks at least 3 px apart on screen at every width.
 */
export const MIN_TICK_GAP = 6;
/** Tick length, from the run line into the yard. Also the depth drawn for a freestanding hedge (7 in). */
export const TICK_LENGTH = 9;

/**
 * Drawn depth for a hedge of a true depth in inches: the freestanding hedge
 * (7 in) fills TICK_LENGTH, so the 2 to 3 in hedge on a fence line draws at
 * under half of it. A drawing scale, not a measurement.
 */
export function depthToPlan(depthIn: number): number {
  return Math.round(((depthIn * TICK_LENGTH) / 7) * 100) / 100;
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Drawn length along the track for a run in feet. */
export function runToPx(runFt: number): number {
  const ft = Math.min(MAX_RUN_FT, Math.max(0, runFt));
  return round(LOG_SCALE * Math.log(1 + ft / LOG_KNEE_FT));
}

/** The full track: back line east, then down the side line to the 300 ft end. */
export const TRACK_LENGTH = runToPx(MAX_RUN_FT);
export const SIDE_LENGTH = round(TRACK_LENGTH - BACK_LENGTH);
export const TRACK_POINTS: readonly Point[] = [
  { x: LOT.x0, y: LOT.y0 },
  { x: LOT.x1, y: LOT.y0 },
  { x: LOT.x1, y: round(LOT.y0 + SIDE_LENGTH) },
];
export const TRACK_PATH = TRACK_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

/** The point at a drawn distance along the track, and which way the yard lies. */
export function pointAt(distance: number): { point: Point; onSide: boolean } {
  const d = Math.min(TRACK_LENGTH, Math.max(0, distance));
  if (d <= BACK_LENGTH) {
    return { point: { x: round(LOT.x0 + d), y: LOT.y0 }, onSide: false };
  }
  return { point: { x: LOT.x1, y: round(LOT.y0 + (d - BACK_LENGTH)) }, onSide: true };
}

export type LabelSide = 'above' | 'right' | 'below' | 'left';

export interface LabelAnchor {
  /** Percent of the drawing's width and height, for absolute DOM placement. */
  leftPct: number;
  topPct: number;
  side: LabelSide;
}

export function toAnchor(point: Point, side: LabelSide): LabelAnchor {
  return {
    leftPct: round((point.x / VIEW_W) * 100),
    topPct: round((point.y / VIEW_H) * 100),
    side,
  };
}

/** Where the run-length callout sits for an end point: above the back line, or right of the side line. */
export function runLabelAnchor(distance: number): LabelAnchor {
  const { point, onSide } = pointAt(distance);
  return onSide
    ? toAnchor({ x: point.x + 12, y: point.y }, 'right')
    : toAnchor({ x: point.x, y: point.y - 12 }, 'above');
}

export interface RunGeometry {
  /** Polyline points of the drawn run, start corner first. */
  points: Point[];
  /** Drawn length of the run, in viewBox units. */
  length: number;
  start: Point;
  end: Point;
  /** True once the run has turned the corner onto the side line. */
  turnsCorner: boolean;
  /** One segment per tick drawn, in order from the start. */
  ticks: Segment[];
  /**
   * The centre line of the green band the ticks sit in (the hedge's depth),
   * offset half a tick length into the yard. Drawn with stroke-width
   * `depth` (TICK_LENGTH unless a hedge's true depth is drawn).
   */
  band: Point[];
  /** Panels across, the true count. */
  panelsAcross: number;
  /** 1 when every panel has a tick; N when only every Nth panel is drawn. */
  tickStep: number;
  labels: {
    run: LabelAnchor;
    /** The module note, just inside the start corner, under the tick band. */
    module: LabelAnchor;
  };
}

export function buildRun(runFt: number, panelsAcross: number, depth: number = TICK_LENGTH): RunGeometry {
  const length = runToPx(runFt);
  const end = pointAt(length);
  const turnsCorner = end.onSide && length > BACK_LENGTH;

  const points: Point[] = [{ x: LOT.x0, y: LOT.y0 }];
  if (turnsCorner) points.push({ x: LOT.x1, y: LOT.y0 });
  points.push(end.point);

  const count = Math.max(1, Math.floor(panelsAcross));
  const gap = length / count;
  const tickStep = gap >= MIN_TICK_GAP ? 1 : Math.ceil(MIN_TICK_GAP / gap);

  const ticks: Segment[] = [];
  for (let i = 0; i < count; i += tickStep) {
    const { point, onSide } = pointAt((i + 0.5) * gap);
    ticks.push(
      onSide
        ? { x1: point.x, y1: point.y, x2: round(point.x - depth), y2: point.y }
        : { x1: point.x, y1: point.y, x2: point.x, y2: round(point.y + depth) },
    );
  }

  const half = depth / 2;
  const band: Point[] = [{ x: LOT.x0, y: LOT.y0 + half }];
  if (turnsCorner) {
    band.push({ x: round(LOT.x1 - half), y: LOT.y0 + half });
    band.push({ x: round(LOT.x1 - half), y: end.point.y });
  } else {
    band.push({ x: end.point.x, y: LOT.y0 + half });
  }

  return {
    points,
    length,
    start: points[0],
    end: end.point,
    turnsCorner,
    ticks,
    band,
    panelsAcross: count,
    tickStep,
    labels: {
      run: runLabelAnchor(length),
      module: toAnchor({ x: LOT.x0 + 14, y: LOT.y0 + depth + 12 }, 'below'),
    },
  };
}

/** Gap between neighbouring freestanding units on the plan, in viewBox units. */
export const UNIT_GAP = 3;

/**
 * Freestanding units (the privacy wall) as separate blocks along the run: the
 * run's band cut into `units` equal lengths, with a small gap between
 * neighbours. Each block is a polyline on the band's centre line, drawn with
 * stroke-width TICK_LENGTH (the run's `depth`); one that straddles the corner bends round it.
 */
export function buildUnitBlocks(run: RunGeometry, units: number): Point[][] {
  const segments = run.band.slice(1).map((b, i) => {
    const a = run.band[i];
    return { a, b, length: Math.hypot(b.x - a.x, b.y - a.y) };
  });
  const total = segments.reduce((sum, s) => sum + s.length, 0);
  const count = Math.max(1, Math.floor(units));
  const pitch = total / count;
  const inset = Math.min(UNIT_GAP / 2, pitch / 4);

  const slice = (from: number, to: number): Point[] => {
    const out: Point[] = [];
    let start = 0;
    for (const { a, b, length } of segments) {
      const end = start + length;
      if (length > 0 && end > from && start < to) {
        const at = (d: number): Point => {
          const t = (d - start) / length;
          return { x: round(a.x + (b.x - a.x) * t), y: round(a.y + (b.y - a.y) * t) };
        };
        if (out.length === 0) out.push(at(Math.max(from, start)));
        out.push(at(Math.min(to, end)));
      }
      start = end;
    }
    return out;
  };

  return Array.from({ length: count }, (_, i) => slice(i * pitch + inset, (i + 1) * pitch - inset));
}

/* ---------------------------------------------------------------------------
 * The fixed yard: house footprint (hatched), pool, one live oak, north arrow.
 * ------------------------------------------------------------------------- */

/** The house footprint as two rectangles forming an L (main block plus a wing). */
export const HOUSE_RECTS: readonly Rect[] = [
  { x: 132, y: 300, w: 236, h: 86 },
  { x: 368, y: 322, w: 82, h: 64 },
];

/** Outline of the L-shaped footprint, clockwise from the top-left corner. */
export const HOUSE_OUTLINE: readonly Point[] = [
  { x: 132, y: 300 },
  { x: 368, y: 300 },
  { x: 368, y: 322 },
  { x: 450, y: 322 },
  { x: 450, y: 386 },
  { x: 132, y: 386 },
];

/** Property corners other than the run's start, marked as open monuments. */
export const LOT_CORNERS: readonly Point[] = [
  { x: LOT.x1, y: LOT.y0 },
  { x: LOT.x1, y: LOT.y1 },
  { x: LOT.x0, y: LOT.y1 },
];

export const POOL = { x: 276, y: 150, w: 132, h: 60, r: 10 } as const;

export const OAK = { cx: 132, cy: 158, r: 58 } as const;

/** North arrow: a shaft and a half-filled head, in the bottom-right corner, outside the lot. */
export const NORTH = {
  shaft: { x1: 598, y1: 404, x2: 598, y2: 364 } as Segment,
  /** Filled half of the head (east half), as a polygon. */
  headFilled: [
    { x: 598, y: 360 },
    { x: 606, y: 380 },
    { x: 598, y: 375 },
  ] as Point[],
  /** Open half of the head (west half), as a polyline. */
  headOpen: [
    { x: 598, y: 360 },
    { x: 590, y: 380 },
    { x: 598, y: 375 },
  ] as Point[],
  label: toAnchor({ x: 598, y: 352 }, 'above'),
} as const;

/**
 * 45-degree hatch for a set of rectangles, from one global line family so the
 * hatch runs continuously across the L-shaped footprint.
 */
export function hatchRects(rects: readonly Rect[], spacing: number): Segment[] {
  const out: Segment[] = [];
  for (const r of rects) {
    // Lines x + y = c. Visit every c on the global grid that crosses this rect.
    const cMin = r.x + r.y;
    const cMax = r.x + r.w + r.y + r.h;
    const first = Math.ceil(cMin / spacing) * spacing;
    for (let c = first; c <= cMax; c += spacing) {
      // Intersect the line with the rect's edges.
      const xA = Math.max(r.x, c - (r.y + r.h));
      const xB = Math.min(r.x + r.w, c - r.y);
      if (xB - xA <= 0.5) continue;
      out.push({ x1: round(xA), y1: round(c - xA), x2: round(xB), y2: round(c - xB) });
    }
  }
  return out;
}

export const HOUSE_HATCH: readonly Segment[] = hatchRects(HOUSE_RECTS, 9);

export function pointsToPath(points: readonly Point[], close = false): string {
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  return close ? `${d} Z` : d;
}

export function segmentsToPath(segments: readonly Segment[]): string {
  return segments.map((s) => `M ${s.x1} ${s.y1} L ${s.x2} ${s.y2}`).join(' ');
}

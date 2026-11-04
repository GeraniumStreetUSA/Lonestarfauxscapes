/**
 * "How long is the line you want green?": the homepage estimator's maths.
 *
 * It counts panels the way a crew would:
 *
 *   across = ceil(run in / module in)
 *   rows   = ceil(height in / module in)
 *   panels = across x rows
 *   area   = run ft x height ft
 *
 * (a freestanding privacy wall counts 4 ft units instead: ceil(run ft / 4 ft)),
 * then does the arithmetic on the released starting prices in
 * `data/starting-prices.ts`, the only source of a figure:
 *
 *   hedge (on your fence or wall),
 *   freestanding hedge,
 *   fence extension          run ft x the rate per linear ft
 *   living wall              run ft x height ft = sq ft, x the rate per sq ft
 *   privacy wall             the price of one standard unit, never multiplied
 *
 * Totals round to the nearest ten dollars, and the working shows the exact
 * product first. There is no labour factor, no range and no installation
 * figure: installation is quoted after a site review, and every price carries
 * that caveat and the fire-rating note (FR_PRICE_NOTE). Heights are locked to
 * the priced configuration (freestanding hedge 6 ft, fence extension 3 ft,
 * privacy wall 4 ft). The living wall, priced per square foot, takes a height;
 * so does the hedge on your fence or wall, whose price is per linear foot
 * with no released height: the height only draws the panel count, and a
 * taller run may be priced to the site.
 *
 * Every figure comes back with its working as strings, so the page shows the
 * arithmetic beside it. Kept free of React and the DOM so it runs under
 * `node --test` and renders identically in prerendered HTML.
 */

import {
  FR_PRICE_NOTE,
  HEDGE_TIERS,
  INSTALLATION_CAVEAT,
  STARTING_PRICES,
  UNIT_LABELS,
  formatRate,
  formatStartingPriceCaption,
  formatUsd,
  type StartingPrice,
} from '../data/starting-prices.ts';

export type SystemId = 'hedge' | 'hedge-freestanding' | 'fence-extension' | 'living-wall' | 'privacy-wall';

export interface Range {
  min: number;
  max: number;
  default: number;
}

export interface EstimatorSystem {
  id: SystemId;
  /** Chip label in the estimator. */
  label: string;
  /** How the estimate reads in the quote summary (short, so it fits 160 characters). */
  summaryLabel: string;
  /** Chip note, also drawn on the plan in mono. */
  note: string;
  /**
   * Module across the run in inches: 20 in hedge and extension panels, 40 in
   * wall panels, 48 in (4 ft) freestanding privacy wall units.
   */
  moduleIn: number;
  /** Height range in feet. min === max locks it to the priced configuration. */
  height: Range;
  /** Said under an open height field: what the price does and does not cover. */
  heightNote: string | null;
  /** Released depth in inches, drawn on the plan; null draws the plan's default depth. */
  depthIn: number | null;
  /** The released starting price the figure is built on. */
  price: StartingPrice;
  /** The matching System chip in the quote form. */
  quoteSystem: string;
}

/** Run length range in feet, shared by every system. */
export const RUN: Range = { min: 4, max: 300, default: 40 };

export const SYSTEMS: readonly EstimatorSystem[] = [
  {
    id: 'hedge',
    label: `Hedge ${HEDGE_TIERS.hedge.said}`,
    summaryLabel: 'Fence hedge',
    note: '20 in panels',
    moduleIn: 20,
    // No height is released for a hedge on a fence or wall: the field draws and counts
    // panels, the price stays per linear foot.
    height: { min: 3, max: 10, default: 6 },
    heightNote: 'The price is per linear foot. Taller runs may be priced to your site.',
    depthIn: 3,
    price: STARTING_PRICES.hedge,
    quoteSystem: 'Hedge on your fence or wall',
  },
  {
    id: 'hedge-freestanding',
    label: 'Freestanding hedge',
    summaryLabel: 'Freestanding hedge',
    note: '7 in deep',
    moduleIn: 20,
    height: { min: 6, max: 6, default: 6 },
    heightNote: null,
    depthIn: 7,
    price: STARTING_PRICES['hedge-freestanding'],
    quoteSystem: 'Freestanding hedge',
  },
  {
    id: 'fence-extension',
    label: 'Fence extension',
    summaryLabel: 'Fence extension',
    note: '20 in panels',
    moduleIn: 20,
    height: { min: 3, max: 3, default: 3 },
    heightNote: null,
    depthIn: null,
    price: STARTING_PRICES['fence-extension'],
    quoteSystem: 'Fence extension',
  },
  {
    id: 'living-wall',
    label: 'Living wall',
    summaryLabel: 'Living wall',
    note: '40 in panels',
    moduleIn: 40,
    height: { min: 3, max: 20, default: 8 },
    heightNote: null,
    depthIn: null,
    price: STARTING_PRICES['living-wall'],
    quoteSystem: 'Living wall',
  },
  {
    id: 'privacy-wall',
    label: 'Privacy wall',
    summaryLabel: 'Privacy wall',
    note: '4 × 4 ft units',
    moduleIn: 48,
    height: { min: 4, max: 4, default: 4 },
    heightNote: null,
    depthIn: null,
    price: STARTING_PRICES['privacy-wall'],
    quoteSystem: 'Privacy wall',
  },
];

export const DEFAULT_SYSTEM_ID: SystemId = 'hedge';

export function getSystem(id: SystemId): EstimatorSystem {
  const found = SYSTEMS.find((system) => system.id === id);
  if (!found) throw new Error(`Unknown estimator system: ${id}`);
  return found;
}

/** True when the height is fixed by the priced configuration (no slider). */
export function isHeightLocked(system: EstimatorSystem): boolean {
  return system.height.min === system.height.max;
}

/** True for a system priced per standard unit, whose price is never multiplied. */
export function isPerUnit(system: EstimatorSystem): boolean {
  return system.price.per === 'unit';
}

/** Round to whole feet and clamp into the range. A non-number falls back to the default. */
export function clampToRange(range: Range, value: number): number {
  if (!Number.isFinite(value)) return range.default;
  return Math.min(range.max, Math.max(range.min, Math.round(value)));
}

export function clampRun(value: number): number {
  return clampToRange(RUN, value);
}

export function clampHeight(system: EstimatorSystem, value: number): number {
  return clampToRange(system.height, value);
}

/**
 * Commit what a visitor typed into a number field.
 *
 * The field holds the raw string while they type, so "1" on the way to "180"
 * is never clamped under their fingers. Only blur or Enter commits, through
 * this function: blank, non-numeric or non-positive input keeps the last
 * committed value; anything else is rounded and clamped.
 */
export function commitDraft(range: Range, draft: string, lastCommitted: number): number {
  const trimmed = draft.trim();
  const parsed = Number(trimmed);
  if (trimmed === '' || !Number.isFinite(parsed) || parsed <= 0) {
    return clampToRange(range, lastCommitted);
  }
  return clampToRange(range, parsed);
}

/** Whole numbers with thousands separators, deterministic on server and client. */
export function formatNumber(value: number): string {
  const [whole, fraction] = String(value).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return fraction ? `${grouped}.${fraction}` : grouped;
}

/** A quotient to at most two decimal places (3.6, 10.25), without trailing zeros. */
function formatQuotient(value: number): string {
  return formatNumber(Math.round(value * 100) / 100);
}

function plural(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}

/** `40 ft ÷ 4 ft = 10 units`, or `... = 10.25, so 11 units` when it does not divide. */
function quotientLine(head: string, exact: number, count: number, unit: string): string {
  return Number.isInteger(exact)
    ? `${head}${formatNumber(count)} ${unit}`
    : `${head}${formatQuotient(exact)}, so ${formatNumber(count)} ${unit}`;
}

/** `40 ft × 12 = 480 in ÷ 20 in = 24 across` or `... = 3.6, so 4 rows`. */
function divisionLine(feet: number, moduleIn: number, count: number, unit: string): string {
  const inches = feet * 12;
  const head = `${formatNumber(feet)} ft × 12 = ${formatNumber(inches)} in ÷ ${moduleIn} in = `;
  return quotientLine(head, inches / moduleIn, count, unit);
}

/** Nearest ten dollars, the way the starting figures are shown. */
export function roundToTen(value: number): number {
  return Math.round(value / 10) * 10;
}

export interface EstimateInput {
  systemId: SystemId;
  runFt: number;
  heightFt: number;
}

export interface EstimatePrice {
  /** Material starting figure, rounded to the nearest ten dollars; null for a per-unit price. */
  total: number | null;
  /** The large figure: the rounded total, or a per-unit system's released unit price. */
  amount: string;
  /** Shown after the amount: "/ unit" for a per-unit price, otherwise empty. */
  per: string;
  /** "from" and the amount, plus "/ unit" for one standard unit (never multiplied). */
  figure: string;
  /** "40 linear ft × rate = total", with any rounding; null when nothing is multiplied. */
  arithmetic: string | null;
  /** Configuration, qualifiers and the installation caveat, from the data file. */
  caption: string;
  /** Said under the price: the figures are for standard foliage, fire-rated costs extra. */
  frNote: string;
}

export interface Estimate {
  system: EstimatorSystem;
  runFt: number;
  heightFt: number;
  /** Panels across the run, or freestanding units. */
  across: number;
  /** Panel rows; 1 for freestanding units. */
  rows: number;
  /** Panels, or units for a privacy wall. */
  panels: number;
  /** What `panels` counts: "panels", "unit" or "units". */
  panelsWord: string;
  areaSqFt: number;
  /** The working, shown in mono beside the figures. Null lines are not shown. */
  lines: {
    across: string;
    rows: string | null;
    panels: string | null;
    area: string;
  };
  price: EstimatePrice;
  /** ≤160 characters; carried into the quote form and the lead email. */
  summary: string;
}

export const SUMMARY_MAX_LENGTH = 160;

function buildPrice(system: EstimatorSystem, runFt: number, heightFt: number, areaSqFt: number): EstimatePrice {
  const { price } = system;
  const caption = formatStartingPriceCaption(price);

  // One standard unit, shown as released. It is never multiplied by the units
  // counted for the run: every other size is custom.
  if (price.per === 'unit') {
    return {
      total: null,
      amount: formatUsd(price.amount),
      per: `/ ${UNIT_LABELS.unit}`,
      figure: `from ${formatRate(price)}`,
      arithmetic: null,
      caption,
      frNote: FR_PRICE_NOTE,
    };
  }

  const perSquareFoot = price.per === 'square-foot';
  const exact = (perSquareFoot ? areaSqFt : runFt) * price.amount;
  const total = roundToTen(exact);
  const size = perSquareFoot
    ? `${formatNumber(runFt)} ft × ${formatNumber(heightFt)} ft = ${formatNumber(areaSqFt)} sq ft`
    : `${formatNumber(runFt)} ${UNIT_LABELS['linear-foot']}`;
  const product = `${size} × ${formatUsd(price.amount)} = ${formatUsd(exact)}`;

  return {
    total,
    amount: formatUsd(total),
    per: '',
    figure: `from ${formatUsd(total)}`,
    arithmetic: exact === total ? product : `${product}, rounded to ${formatUsd(total)}`,
    caption,
    frNote: FR_PRICE_NOTE,
  };
}

export function buildEstimate(input: EstimateInput): Estimate {
  const system = getSystem(input.systemId);
  const runFt = clampRun(input.runFt);
  const heightFt = clampHeight(system, input.heightFt);
  const areaSqFt = runFt * heightFt;
  const area = `${formatNumber(runFt)} ft × ${formatNumber(heightFt)} ft = ${formatNumber(areaSqFt)} sq ft`;
  const price = buildPrice(system, runFt, heightFt, areaSqFt);
  const head = `${system.summaryLabel}, ${formatNumber(runFt)} ft run × ${formatNumber(heightFt)} ft high: `;
  const tail = ` · ${price.figure} ${INSTALLATION_CAVEAT}`;

  if (isPerUnit(system)) {
    const unitFt = system.moduleIn / 12;
    const units = Math.ceil(runFt / unitFt);
    const word = plural(units, 'unit', 'units');
    return {
      system,
      runFt,
      heightFt,
      across: units,
      rows: 1,
      panels: units,
      panelsWord: word,
      areaSqFt,
      lines: {
        across: quotientLine(`${formatNumber(runFt)} ft ÷ ${unitFt} ft = `, runFt / unitFt, units, word),
        rows: null,
        panels: null,
        area,
      },
      price,
      summary: truncate(
        `${head}${formatNumber(units)} ${word}, ${formatNumber(areaSqFt)} sq ft (${system.note})${tail}`,
      ),
    };
  }

  const across = Math.ceil((runFt * 12) / system.moduleIn);
  const rows = Math.ceil((heightFt * 12) / system.moduleIn);
  const panels = across * rows;
  const rowWord = plural(rows, 'row', 'rows');

  return {
    system,
    runFt,
    heightFt,
    across,
    rows,
    panels,
    panelsWord: 'panels',
    areaSqFt,
    lines: {
      across: divisionLine(runFt, system.moduleIn, across, 'across'),
      rows: divisionLine(heightFt, system.moduleIn, rows, rowWord),
      panels: `${formatNumber(across)} × ${formatNumber(rows)} = ${formatNumber(panels)} panels`,
      area,
    },
    price,
    summary: truncate(
      `${head}${formatNumber(across)} across × ${formatNumber(rows)} ${rowWord} = ${formatNumber(panels)} panels, ` +
        `${formatNumber(areaSqFt)} sq ft (${system.note})${tail}`,
    ),
  };
}

function truncate(value: string): string {
  return value.length <= SUMMARY_MAX_LENGTH ? value : value.slice(0, SUMMARY_MAX_LENGTH);
}

/**
 * "How long is the line you want green?": the homepage estimator's maths.
 *
 * It does the arithmetic on the released starting prices in
 * `data/starting-prices.ts`, the only source of a figure:
 *
 *   hedge on your fence or wall   run ft x the rate at the height (the
 *                                 released rate is for 6 ft tall; it scales
 *                                 with height)
 *   freestanding hedge            run ft x the released rate (fixed at 6 ft x 7 in)
 *   fence extension               run ft x the rate per ft of foliage x feet of
 *                                 foliage, where the foliage is the height
 *                                 over the fence x 1.5
 *   living wall                   run ft x height ft = sq ft, x the rate per sq ft
 *   privacy wall                  the price of one standard unit, never multiplied
 *
 * No panel size or panel count is shown for any privacy product (owner,
 * 2026-11-04). Totals round to the nearest ten dollars, and the working shows
 * the exact product first. There is no labour factor, no range and no
 * installation figure: installation is quoted after a site review, and every
 * price carries that caveat and the fire-rating note (FR_PRICE_NOTE). Heights
 * are locked to the priced configuration for the freestanding hedge (6 ft) and
 * the privacy wall; the hedge on your fence or wall (3 to 10 ft), the fence
 * extension (2 to 6 ft over the fence, in half feet) and the living wall take
 * a height.
 *
 * Every figure comes back as strings, so the page shows the arithmetic beside
 * it. Kept free of React and the DOM so it runs under `node --test` and
 * renders identically in prerendered HTML.
 */

import {
  FR_PRICE_NOTE,
  INSTALLATION_CAVEAT,
  STARTING_PRICES,
  UNIT_LABELS,
  fenceExtensionFoliageFt,
  fenceExtensionRatePerLinearFt,
  formatFenceExtensionConfiguration,
  formatRate,
  formatStartingPriceCaption,
  formatUsd,
  formatUsdExact,
  hedgeRatePerLinearFt,
  type StartingPrice,
} from '../data/starting-prices.ts';

export type SystemId = 'hedge' | 'hedge-freestanding' | 'fence-extension' | 'living-wall' | 'privacy-wall';

export interface Range {
  min: number;
  max: number;
  default: number;
  /** Step in feet; whole feet unless set. */
  step?: number;
}

export interface EstimatorSystem {
  id: SystemId;
  /** Chip label in the estimator. */
  label: string;
  /** How the estimate reads in the quote summary (short, so it fits 160 characters). */
  summaryLabel: string;
  /** Chip note: what the price is based on. */
  note: string;
  /** Height range in feet. min === max locks it to the priced configuration. */
  height: Range;
  /** The height field's label where a height is taken. */
  heightLabel: string;
  /** Said under an open height field: what the price does with it. */
  heightNote: string | null;
  /** After the height in the quote summary: "high", "over the fence". */
  heightWord: string;
  /** True where the readout also shows the area in sq ft (the hedge face, the living wall). */
  showArea: boolean;
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
    label: 'Hedge on your fence or wall',
    summaryLabel: 'Fence hedge',
    note: 'Scales with height',
    height: { min: 3, max: 10, default: 6 },
    heightLabel: 'Height (ft)',
    heightNote: 'The price is per linear foot at 6 ft tall and scales with height.',
    heightWord: 'high',
    showArea: true,
    depthIn: 3,
    price: STARTING_PRICES.hedge,
    quoteSystem: 'Hedge on your fence or wall',
  },
  {
    id: 'hedge-freestanding',
    label: 'Freestanding hedge',
    summaryLabel: 'Freestanding hedge',
    note: '6 ft × 7 in',
    height: { min: 6, max: 6, default: 6 },
    heightLabel: 'Height (ft)',
    heightNote: null,
    heightWord: 'high',
    showArea: false,
    depthIn: 7,
    price: STARTING_PRICES['hedge-freestanding'],
    quoteSystem: 'Freestanding hedge',
  },
  {
    id: 'fence-extension',
    label: 'Fence extension',
    summaryLabel: 'Fence extension',
    note: 'Priced by height',
    height: { min: 2, max: 6, default: 3, step: 0.5 },
    heightLabel: 'Height over the fence (ft)',
    heightNote: 'It comes down 1 ft over the fence for every 2 ft of extension, so the foliage is 1.5 times the height.',
    heightWord: 'over the fence',
    showArea: false,
    depthIn: null,
    price: STARTING_PRICES['fence-extension'],
    quoteSystem: 'Fence extension',
  },
  {
    id: 'living-wall',
    label: 'Living wall',
    summaryLabel: 'Living wall',
    note: 'Per sq ft',
    height: { min: 3, max: 20, default: 8 },
    heightLabel: 'Height (ft)',
    heightNote: null,
    heightWord: 'high',
    showArea: true,
    depthIn: null,
    price: STARTING_PRICES['living-wall'],
    quoteSystem: 'Living wall',
  },
  {
    id: 'privacy-wall',
    label: 'Privacy wall',
    summaryLabel: 'Privacy wall',
    note: 'Freestanding, on a base',
    height: { min: 4, max: 4, default: 4 },
    heightLabel: 'Height (ft)',
    heightNote: null,
    heightWord: 'high',
    showArea: false,
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

/** Round to the range's step (whole feet unless it has one) and clamp into the range. A non-number falls back to the default. */
export function clampToRange(range: Range, value: number): number {
  if (!Number.isFinite(value)) return range.default;
  const step = range.step ?? 1;
  return Math.min(range.max, Math.max(range.min, Math.round(value / step) * step));
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
  /** "40 linear ft × rate (8 ft tall) = total", with any rounding; null when nothing is multiplied. */
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
  /** Run x height in sq ft, where the readout shows it (the hedge on a fence or wall, the living wall); otherwise null. */
  areaSqFt: number | null;
  price: EstimatePrice;
  /** ≤160 characters; carried into the quote form and the lead email. */
  summary: string;
}

export const SUMMARY_MAX_LENGTH = 160;

function buildPrice(system: EstimatorSystem, runFt: number, heightFt: number): EstimatePrice {
  const { id, price } = system;
  const base = formatStartingPriceCaption(price);

  // One standard unit, shown as released. It is never multiplied by the run:
  // every other size is custom.
  if (price.per === 'unit') {
    return {
      total: null,
      amount: formatUsd(price.amount),
      per: `/ ${UNIT_LABELS.unit}`,
      figure: `from ${formatRate(price)}`,
      arithmetic: null,
      caption: base,
      frNote: FR_PRICE_NOTE,
    };
  }

  let exact: number;
  let product: string;
  let caption = base;
  if (price.per === 'square-foot') {
    const areaSqFt = runFt * heightFt;
    exact = areaSqFt * price.amount;
    product = `${formatNumber(runFt)} ft × ${formatNumber(heightFt)} ft = ${formatNumber(areaSqFt)} sq ft × ${formatUsd(price.amount)} = ${formatUsdExact(exact)}`;
  } else {
    // Per linear foot: the hedge on a fence or wall and the extension take their rate from the height.
    const linear = `${formatNumber(runFt)} ${UNIT_LABELS['linear-foot']}`;
    if (id === 'hedge') {
      const rate = hedgeRatePerLinearFt(heightFt);
      exact = runFt * rate;
      product = `${linear} × ${formatUsdExact(rate)} (${formatNumber(heightFt)} ft tall) = ${formatUsdExact(exact)}`;
    } else if (id === 'fence-extension') {
      const rate = fenceExtensionRatePerLinearFt(heightFt);
      exact = runFt * rate;
      product = `${linear} × ${formatUsdExact(rate)} (${formatNumber(heightFt)} ft over the fence, ${formatNumber(fenceExtensionFoliageFt(heightFt))} ft of foliage) = ${formatUsdExact(exact)}`;
      caption = [formatFenceExtensionConfiguration(heightFt), ...(price.qualifiers ?? []), INSTALLATION_CAVEAT].join(' · ');
    } else {
      exact = runFt * price.amount;
      product = `${linear} × ${formatUsd(price.amount)} = ${formatUsdExact(exact)}`;
    }
  }

  const total = roundToTen(exact);
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
  const areaSqFt = system.showArea ? runFt * heightFt : null;
  const price = buildPrice(system, runFt, heightFt);

  // A locked height is the priced size, not something the visitor set, so the summary leaves it out.
  const size = isHeightLocked(system)
    ? ''
    : ` × ${formatNumber(heightFt)} ft ${system.heightWord}`;
  const area = areaSqFt === null ? '' : `, ${formatNumber(areaSqFt)} sq ft`;
  const summary = `${system.summaryLabel}, ${formatNumber(runFt)} ft run${size}${area} · ${price.figure} ${INSTALLATION_CAVEAT}`;

  return { system, runFt, heightFt, areaSqFt, price, summary: truncate(summary) };
}

function truncate(value: string): string {
  return value.length <= SUMMARY_MAX_LENGTH ? value : value.slice(0, SUMMARY_MAX_LENGTH);
}

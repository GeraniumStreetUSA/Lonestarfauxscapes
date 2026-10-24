/**
 * "How long is the line you want green?": the homepage estimator's maths.
 *
 * Dimensions only. There is no price anywhere in this module and there must
 * never be one: every quote follows a site review (owner decision 2026-10-24).
 * What it does is count panels the way a crew would:
 *
 *   across = ceil(run in / module in)
 *   rows   = ceil(height in / module in)
 *   panels = across x rows
 *   area   = run ft x height ft
 *
 * and it returns the arithmetic as strings so the page shows its working
 * beside every figure. Kept free of React and the DOM so it runs under
 * `node --test` and renders identically in prerendered HTML.
 */

export type SystemId = 'hedge' | 'fence-extension' | 'living-wall';

export interface Range {
  min: number;
  max: number;
  default: number;
}

export interface EstimatorSystem {
  id: SystemId;
  /** Chip label in the estimator. */
  label: string;
  /** Chip note, also drawn on the plan in mono. */
  note: string;
  /** Panel module in inches (20 in hedge and extension mats, 40 in wall mats). */
  moduleIn: number;
  /** Height range in feet. */
  height: Range;
  /** The matching System chip in the quote form. */
  quoteSystem: string;
}

/** Run length range in feet, shared by every system. */
export const RUN: Range = { min: 4, max: 300, default: 40 };

export const SYSTEMS: readonly EstimatorSystem[] = [
  {
    id: 'hedge',
    label: 'Hedge',
    note: '20 in panels',
    moduleIn: 20,
    height: { min: 3, max: 12, default: 6 },
    quoteSystem: 'Artificial hedge',
  },
  {
    id: 'fence-extension',
    label: 'Fence extension',
    note: '20 in panels',
    moduleIn: 20,
    height: { min: 1, max: 4, default: 2 },
    quoteSystem: 'Fence extension',
  },
  {
    id: 'living-wall',
    label: 'Living wall',
    note: '40 in panels',
    moduleIn: 40,
    height: { min: 3, max: 20, default: 8 },
    quoteSystem: 'Living wall',
  },
];

export const DEFAULT_SYSTEM_ID: SystemId = 'hedge';

export function getSystem(id: SystemId): EstimatorSystem {
  const found = SYSTEMS.find((system) => system.id === id);
  if (!found) throw new Error(`Unknown estimator system: ${id}`);
  return found;
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

/** A quotient to one decimal place, without a trailing ".0". */
function formatQuotient(value: number): string {
  return formatNumber(Math.round(value * 10) / 10);
}

function plural(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}

/** `40 ft × 12 = 480 in ÷ 20 in = 24 across` or `... = 3.6, so 4 rows`. */
function divisionLine(feet: number, moduleIn: number, count: number, unit: string): string {
  const inches = feet * 12;
  const exact = inches / moduleIn;
  const head = `${formatNumber(feet)} ft × 12 = ${formatNumber(inches)} in ÷ ${moduleIn} in = `;
  return Number.isInteger(exact)
    ? `${head}${formatNumber(count)} ${unit}`
    : `${head}${formatQuotient(exact)}, so ${formatNumber(count)} ${unit}`;
}

export interface EstimateInput {
  systemId: SystemId;
  runFt: number;
  heightFt: number;
}

export interface Estimate {
  system: EstimatorSystem;
  runFt: number;
  heightFt: number;
  across: number;
  rows: number;
  panels: number;
  areaSqFt: number;
  /** The working, shown in mono beside the figures. */
  lines: {
    across: string;
    rows: string;
    panels: string;
    area: string;
  };
  /** ≤160 characters; carried into the quote form and the lead email. */
  summary: string;
}

export const SUMMARY_MAX_LENGTH = 160;

export function buildEstimate(input: EstimateInput): Estimate {
  const system = getSystem(input.systemId);
  const runFt = clampRun(input.runFt);
  const heightFt = clampHeight(system, input.heightFt);

  const across = Math.ceil((runFt * 12) / system.moduleIn);
  const rows = Math.ceil((heightFt * 12) / system.moduleIn);
  const panels = across * rows;
  const areaSqFt = runFt * heightFt;

  const rowWord = plural(rows, 'row', 'rows');

  const lines = {
    across: divisionLine(runFt, system.moduleIn, across, 'across'),
    rows: divisionLine(heightFt, system.moduleIn, rows, rowWord),
    panels: `${formatNumber(across)} × ${formatNumber(rows)} = ${formatNumber(panels)} panels`,
    area: `${formatNumber(runFt)} ft × ${formatNumber(heightFt)} ft = ${formatNumber(areaSqFt)} sq ft`,
  };

  const summary = truncate(
    `${system.label}, ${formatNumber(runFt)} ft run × ${formatNumber(heightFt)} ft high: ` +
      `${formatNumber(across)} across × ${formatNumber(rows)} ${rowWord} = ${formatNumber(panels)} panels, ` +
      `${formatNumber(areaSqFt)} sq ft (${system.note})`,
  );

  return { system, runFt, heightFt, across, rows, panels, areaSqFt, lines, summary };
}

function truncate(value: string): string {
  return value.length <= SUMMARY_MAX_LENGTH ? value : value.slice(0, SUMMARY_MAX_LENGTH);
}

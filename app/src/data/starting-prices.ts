/**
 * Texas starting prices, released by the owner on 2026-10-25 and corrected
 * on 2026-11-04 (the Califauxscapes handoff, confirmed for Texas): the same
 * structure as Califauxscapes, with installation extra.
 *
 *   Hedge on your fence or wall  from $99 / linear ft   (single-sided, about 2 to 3 in deep)
 *   Freestanding hedge           from $200 / linear ft  (6 ft × 7 in, full 3D, on posts set in concrete)
 *   Fence extension              from $65 / linear ft   (3 ft extension)
 *   Living wall                  from $18 / sq ft       (fully custom)
 *   Privacy wall                 from $699 per unit     (4 ft × 4 ft with standard base; fully custom sizes)
 *
 * This is the only file in the app where a dollar figure may be written
 * (`tests/copy.test.ts` enforces it); everything else formats these numbers.
 * Each one is a material/system starting point for its configuration, never
 * an installed price, a range or a typical project total, and it always
 * travels with INSTALLATION_CAVEAT. Every one is for standard UV-stabilized
 * foliage; fire-rated foliage is an upgrade at extra cost (FR_PRICE_NOTE),
 * and no figure is released for it. The commercial wall has no released
 * price: it stays "Quoted after a site review".
 */

/**
 * `hedge` is the hedge on your fence or wall; `hedge-freestanding` is the
 * freestanding hedge. Wherever a hedge is priced, the two are said apart by
 * HEDGE_TIERS' labels. The privacy wall (a unit on its own base) is another
 * product.
 */
export type StartingPriceId = 'hedge' | 'hedge-freestanding' | 'fence-extension' | 'living-wall' | 'privacy-wall';

/** What an amount is per. `unit` is one standard unit: nothing ever multiplies it. */
export type StartingPriceUnit = 'linear-foot' | 'square-foot' | 'unit';

export interface StartingPrice {
  /** Whole US dollars. */
  amount: number;
  per: StartingPriceUnit;
  /** The configuration the figure is released for, verbatim. */
  configuration: string;
  /** Further released qualifiers, shown after the configuration. */
  qualifiers?: readonly string[];
}

export const STARTING_PRICES: Readonly<Record<StartingPriceId, StartingPrice>> = {
  hedge: {
    amount: 99,
    per: 'linear-foot',
    configuration: 'On your fence or wall, single-sided, about 2 to 3 in deep',
  },
  'hedge-freestanding': {
    amount: 200,
    per: 'linear-foot',
    configuration: 'Freestanding, 6 ft × 7 in, a full 3D hedge on posts set in concrete',
  },
  'fence-extension': { amount: 65, per: 'linear-foot', configuration: '3 ft extension' },
  'living-wall': { amount: 18, per: 'square-foot', configuration: 'Fully custom' },
  'privacy-wall': {
    amount: 699,
    per: 'unit',
    configuration: '4 ft × 4 ft with standard base',
    qualifiers: ['fully custom sizes'],
  },
};

/** How a hedge stands, and so what it costs (owner, 2026-11-04). */
export type HedgeTierId = 'hedge' | 'hedge-freestanding';

export interface HedgeTier {
  id: HedgeTierId;
  /** As a chooser, a row or a heading says it. */
  label: string;
  /** After a figure in a sentence: "from $99 per linear ft on your fence or wall". */
  said: string;
  /** What it is, past how it stands. */
  build: string;
  /** Released height in feet; null where none is stated (on a fence or wall). */
  heightFt: number | null;
  /** Released depth in inches: one figure, or the range "about" spans. */
  depthIn: number | readonly [number, number];
}

export const HEDGE_TIERS: Readonly<Record<HedgeTierId, HedgeTier>> = {
  hedge: {
    id: 'hedge',
    label: 'On your fence or wall',
    said: 'on your fence or wall',
    build: 'single-sided, about 2 to 3 in deep',
    heightFt: null,
    depthIn: [2, 3],
  },
  'hedge-freestanding': {
    id: 'hedge-freestanding',
    label: 'Freestanding',
    said: 'freestanding at 6 ft × 7 in',
    build: '6 ft × 7 in, a full 3D hedge on posts set in concrete',
    heightFt: 6,
    depthIn: 7,
  },
};

/** Beside every price: what the figures are for, and that fire rating is extra. */
export const FR_PRICE_NOTE = 'Prices are for standard UV-stabilized foliage; fire-rated foliage costs extra.';

/** Wherever fire rating comes up (owner, 2026-11-04). */
export const FR_STATEMENT =
  'Standard foliage is UV-stabilized for outdoor sun. Fire-rated foliage (NFPA 701) is an upgrade at extra cost, with documentation on request.';

/** The qualifier every starting price carries, verbatim. */
export const INSTALLATION_CAVEAT = '+ installation, quoted after a site review';

/** Short unit labels: "linear ft", "sq ft", "unit". */
export const UNIT_LABELS: Readonly<Record<StartingPriceUnit, string>> = {
  'linear-foot': 'linear ft',
  'square-foot': 'sq ft',
  unit: 'unit',
};

/** "$99", "$3,960", "$108,000": whole dollars, grouped the same on server and client. */
export function formatUsd(value: number): string {
  return `$${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/** The rate as released: "$99 / linear ft", "$18 / sq ft", "$699 / unit". */
export function formatRate(price: StartingPrice): string {
  return `${formatUsd(price.amount)} / ${UNIT_LABELS[price.per]}`;
}

/**
 * A card's price line: "from $99 / linear ft", "from $18 / sq ft". A per-unit
 * price reads "from $699"; the caption names the unit it buys.
 */
export function formatStartingPrice(price: StartingPrice): string {
  return price.per === 'unit' ? `from ${formatUsd(price.amount)}` : `from ${formatRate(price)}`;
}

/** For running prose: "from $99 per linear ft", "from $699 per unit". */
export function formatStartingPriceProse(price: StartingPrice): string {
  return `from ${formatUsd(price.amount)} per ${UNIT_LABELS[price.per]}`;
}

/**
 * The caption under a price: configuration, qualifiers, then the
 * installation caveat. "Freestanding, 6 ft × 7 in, a full 3D hedge on posts set in concrete · + installation, quoted after a site review".
 * No-break spaces keep each "·" on the line before it and "+" with
 * "installation", so a wrapped caption never starts a line with "·" or ends
 * one with "+".
 */
export function formatStartingPriceCaption(price: StartingPrice): string {
  const caveat = INSTALLATION_CAVEAT.replace('+ ', '+ ');
  return [price.configuration, ...(price.qualifiers ?? []), caveat].join(' · ');
}

/**
 * A hedge price in running prose, always said with its tier:
 * "from $99 per linear ft on your fence or wall",
 * "from $200 per linear ft freestanding at 6 ft × 7 in".
 */
export function formatHedgePriceProse(id: HedgeTierId): string {
  return `${formatStartingPriceProse(STARTING_PRICES[id])} ${HEDGE_TIERS[id].said}`;
}

/** Both hedge prices in one clause, on your fence or wall first. */
export function formatHedgePricesProse(): string {
  return `${formatHedgePriceProse('hedge')} and ${formatHedgePriceProse('hedge-freestanding')}`;
}

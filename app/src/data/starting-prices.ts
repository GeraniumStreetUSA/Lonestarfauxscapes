/**
 * Texas starting prices, released by the owner on 2026-10-25 and corrected
 * on 2026-11-04 (the Califauxscapes handoff, confirmed for Texas): the same
 * structure as Califauxscapes, with installation extra.
 *
 *   Hedge on your fence or wall  from $99 / linear ft   (priced at 6 ft tall, about 2 to 3 in deep; scales with height)
 *   Freestanding hedge           from $200 / linear ft  (6 ft × 7 in, full 3D, on posts set in concrete)
 *   Fence extension              from $81 / linear ft   (3 ft over the fence = 4.5 ft of foliage at $18 per ft of foliage)
 *   Living wall                  from $18 / sq ft       (fully custom)
 *   Privacy wall                 from $699 per unit     (4 ft × 4 ft with standard base; fully custom sizes)
 *
 * Two prices scale (owner, 2026-11-04). The hedge on your fence or wall is
 * $99 per linear ft at 6 ft tall and scales with height ($16.50 per sq ft of
 * hedge face: 8 ft is $132, 4 ft is $66). The fence extension is $18 per
 * linear ft per foot of foliage, and its foliage is the extension height over
 * the fence x 1.5, because it comes down 1 ft over the fence face for every
 * 2 ft of extension (3 ft over = 4.5 ft of foliage = $81). No panel size or
 * panel count is a product spec for any privacy product.
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
  /**
   * Set where the price scales with height: the height in feet the amount is
   * released for (the hedge on a fence or wall 6 ft tall; the fence extension
   * 3 ft over the fence).
   */
  baseHeightFt?: number;
  /** The configuration the figure is released for, verbatim. */
  configuration: string;
  /** Further released qualifiers, shown after the configuration. */
  qualifiers?: readonly string[];
}

/** The hedge on your fence or wall is released at this height and scales with it. */
export const HEDGE_BASE_HEIGHT_FT = 6;

/** The fence extension: dollars per linear ft per foot of foliage. */
export const FENCE_EXTENSION_RATE_PER_FT_OF_FOLIAGE = 18;
/** Feet of foliage per foot of extension: it comes down 1 ft over the fence face for every 2 ft of extension. */
export const FENCE_EXTENSION_FOLIAGE_PER_FT = 1.5;
/** The extension height over the fence the released price is for. */
export const FENCE_EXTENSION_BASE_HEIGHT_FT = 3;

export const STARTING_PRICES: Readonly<Record<StartingPriceId, StartingPrice>> = {
  hedge: {
    amount: 99,
    per: 'linear-foot',
    baseHeightFt: HEDGE_BASE_HEIGHT_FT,
    configuration: 'On your fence or wall, priced at 6 ft tall, about 2 to 3 in deep; scales with height',
  },
  'hedge-freestanding': {
    amount: 200,
    per: 'linear-foot',
    configuration: 'Freestanding, 6 ft × 7 in, a full 3D hedge on posts set in concrete',
  },
  'fence-extension': {
    amount: 81,
    per: 'linear-foot',
    baseHeightFt: FENCE_EXTENSION_BASE_HEIGHT_FT,
    configuration: '3 ft over the fence (4.5 ft of foliage with the overlap)',
    qualifiers: [`$${FENCE_EXTENSION_RATE_PER_FT_OF_FOLIAGE} per linear ft per ft of foliage`],
  },
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
  /** Height in feet the figure is released for: the hedge on a fence or wall is priced at 6 ft and scales; the freestanding hedge is 6 ft. */
  heightFt: number | null;
  /** Released depth in inches: one figure, or the range "about" spans. */
  depthIn: number | readonly [number, number];
}

export const HEDGE_TIERS: Readonly<Record<HedgeTierId, HedgeTier>> = {
  hedge: {
    id: 'hedge',
    label: 'On your fence or wall',
    said: 'on your fence or wall at 6 ft tall',
    build: 'single-sided, about 2 to 3 in deep',
    heightFt: HEDGE_BASE_HEIGHT_FT,
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

/** Dollars and cents only when the figure has cents: "$132", "$49.50", "$2,029.50". */
export function formatUsdExact(value: number): string {
  const cents = Math.round(value * 100);
  if (cents % 100 === 0) return formatUsd(cents / 100);
  return `${formatUsd(Math.floor(cents / 100))}.${String(cents % 100).padStart(2, '0')}`;
}

/** The hedge on your fence or wall, per linear ft, at a height: $99 at 6 ft, $132 at 8 ft, $49.50 at 3 ft. */
export function hedgeRatePerLinearFt(heightFt: number): number {
  return Math.round(((STARTING_PRICES.hedge.amount * heightFt) / HEDGE_BASE_HEIGHT_FT) * 100) / 100;
}

/** Feet of foliage for an extension height over the fence: 3 ft over is 4.5 ft of foliage. */
export function fenceExtensionFoliageFt(extensionFt: number): number {
  return extensionFt * FENCE_EXTENSION_FOLIAGE_PER_FT;
}

/** The fence extension, per linear ft, at a height over the fence: $81 at 3 ft, $54 at 2 ft. */
export function fenceExtensionRatePerLinearFt(extensionFt: number): number {
  return Math.round(FENCE_EXTENSION_RATE_PER_FT_OF_FOLIAGE * fenceExtensionFoliageFt(extensionFt) * 100) / 100;
}

/** "3 ft over the fence (4.5 ft of foliage with the overlap)", for any extension height. */
export function formatFenceExtensionConfiguration(extensionFt: number): string {
  return `${extensionFt} ft over the fence (${fenceExtensionFoliageFt(extensionFt)} ft of foliage with the overlap)`;
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

/** The extension price in running prose: "from $81 per linear ft at 3 ft over the fence". */
export function formatFenceExtensionPriceProse(): string {
  return `${formatStartingPriceProse(STARTING_PRICES['fence-extension'])} at ${FENCE_EXTENSION_BASE_HEIGHT_FT} ft over the fence`;
}

/** Both hedge prices in one clause, on your fence or wall first. */
export function formatHedgePricesProse(): string {
  return `${formatHedgePriceProse('hedge')} and ${formatHedgePriceProse('hedge-freestanding')}`;
}

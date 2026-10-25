/**
 * Texas starting prices, released by the owner on 2026-10-25: the same
 * structure as Califauxscapes, with installation extra.
 *
 *   Artificial hedge   from $99 / linear ft   (6 ft × 12 in)
 *   Fence extension    from $65 / linear ft   (3 ft extension)
 *   Living wall        from $18 / sq ft       (fully custom)
 *   Privacy wall       from $699 per unit     (4 ft × 4 ft with standard base; fully custom sizes)
 *
 * This is the only file in the app where a dollar figure may be written
 * (`tests/copy.test.ts` enforces it); everything else formats these numbers.
 * Each one is a material/system starting point for its configuration, never
 * an installed price, a range or a typical project total, and it always
 * travels with INSTALLATION_CAVEAT. The commercial wall has no released
 * price: it stays "Quoted after a site review".
 */

export type StartingPriceId = 'hedge' | 'fence-extension' | 'living-wall' | 'privacy-wall';

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
  hedge: { amount: 99, per: 'linear-foot', configuration: '6 ft × 12 in' },
  'fence-extension': { amount: 65, per: 'linear-foot', configuration: '3 ft extension' },
  'living-wall': { amount: 18, per: 'square-foot', configuration: 'Fully custom' },
  'privacy-wall': {
    amount: 699,
    per: 'unit',
    configuration: '4 ft × 4 ft with standard base',
    qualifiers: ['fully custom sizes'],
  },
};

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
 * installation caveat. "6 ft × 12 in · + installation, quoted after a site review".
 * No-break spaces keep each "·" on the line before it and "+" with
 * "installation", so a wrapped caption never starts a line with "·" or ends
 * one with "+".
 */
export function formatStartingPriceCaption(price: StartingPrice): string {
  const caveat = INSTALLATION_CAVEAT.replace('+ ', '+ ');
  return [price.configuration, ...(price.qualifiers ?? []), caveat].join(' · ');
}

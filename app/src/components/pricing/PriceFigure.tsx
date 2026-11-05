import { formatUsd, STARTING_PRICES, UNIT_LABELS, type StartingPriceId } from '../../data/starting-prices';

/** The unit under a figure: "/ linear ft", "/ sq ft", "per unit". */
function unitLabel(per: (typeof STARTING_PRICES)[StartingPriceId]['per']): string {
  return per === 'unit' ? 'per unit' : `/ ${UNIT_LABELS[per]}`;
}

/**
 * A released starting price set large: "from", the figure in the display
 * face, then its unit. Read from starting-prices.ts, never typed.
 */
export default function PriceFigure({ id }: { id: StartingPriceId }) {
  const price = STARTING_PRICES[id];
  return (
    <p className="pr-price">
      <span className="pr-from">from</span> <span className="pr-num">{formatUsd(price.amount)}</span>{' '}
      <span className="pr-unit">{unitLabel(price.per)}</span>
    </p>
  );
}

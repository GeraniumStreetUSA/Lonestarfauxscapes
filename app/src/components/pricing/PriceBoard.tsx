import { Flame } from 'lucide-react';

import { PRICING_PAGE, type BoardCard } from '../../data/pages/utility/pricing';
import { FR_PRICE_NOTE, HEDGE_TIERS, STARTING_PRICES, type HedgeTier, type StartingPriceId } from '../../data/starting-prices';
import '../../styles/pricing.css';
import PriceFigure from './PriceFigure';
import { SectionDrawing, type SectionDrawingId } from './SectionDrawings';

const { cards, chips, quoted } = PRICING_PAGE.board;

/** The hedge's two tiers, each with its own drawing. */
const TIERS: readonly { tier: HedgeTier; drawing: SectionDrawingId }[] = [
  { tier: HEDGE_TIERS.hedge, drawing: 'hedge' },
  { tier: HEDGE_TIERS['hedge-freestanding'], drawing: 'hedge-freestanding' },
];

/** A tier's size in a few words, from the released numbers: "priced at 6 ft tall, about 2 to 3 in deep", "6 ft × 7 in". */
function tierSize(tier: HedgeTier): string {
  const { heightFt, depthIn } = tier;
  if (typeof depthIn === 'number') return `${heightFt} ft × ${depthIn} in`;
  return `Priced at ${heightFt} ft tall, about ${depthIn[0]} to ${depthIn[1]} in deep; scales with height`;
}

/** A card's second line of small print: the configuration its figure is released for. */
function configuration(id: StartingPriceId): string {
  const price = STARTING_PRICES[id];
  return [price.configuration, ...(price.qualifiers ?? [])].join(', ');
}

function Title({ card }: { card: BoardCard }) {
  return (
    <h3 className="pr-name">
      <a href={card.href}>{card.title}</a>
    </h3>
  );
}

function Chips({ installation }: { installation: boolean }) {
  return (
    <ul className="pr-chips">
      {installation ? <li className="pr-chip">{chips.installation}</li> : null}
      <li className="pr-chip">
        <Flame size={14} strokeWidth={2} aria-hidden="true" />
        {chips.fire}
      </li>
    </ul>
  );
}

function HedgeCard({ card }: { card: BoardCard }) {
  return (
    <li className="pr-card pr-card-hedge">
      <div className="pr-head">
        <Title card={card} />
        <p className="pr-line">{card.line}</p>
      </div>
      <div className="pr-tiers">
        {TIERS.map(({ tier, drawing }) => (
          <div key={tier.id} className="pr-tier">
            <div className="pr-frame">
              <SectionDrawing id={drawing} />
            </div>
            <h4 className="pr-tier-name">{tier.label}</h4>
            <PriceFigure id={tier.id} />
            <p className="pr-spec">{tierSize(tier)}</p>
          </div>
        ))}
      </div>
    </li>
  );
}

function SystemCard({ card }: { card: BoardCard }) {
  const priced = card.id === 'commercial' ? null : card.id;
  return (
    <li className="pr-card">
      <div className="pr-frame">
        <SectionDrawing id={card.id} />
      </div>
      <div className="pr-body">
        <Title card={card} />
        {priced ? (
          <>
            <PriceFigure id={priced} />
            <p className="pr-spec">{configuration(priced)}</p>
          </>
        ) : (
          <p className="pr-quoted">{quoted}</p>
        )}
        <p className="pr-line">{card.line}</p>
      </div>
    </li>
  );
}

/**
 * The price board: one card per system, each with its section drawing, the
 * figure large, the unit and one short line. The hedge shows both tiers side
 * by side. Phones: a card per row with the drawing beside the figure. What
 * every price carries (installation, the fire-rated upgrade) is said once,
 * above the cards, instead of on each one.
 */
export default function PriceBoard() {
  return (
    <>
      <div className="pr-legend">
        <p className="pr-legend-label">Every price</p>
        <Chips installation />
      </div>
      <ul className="pr-board" data-reveal>
        {cards.map((card) => (card.id === 'hedge' ? <HedgeCard key={card.id} card={card} /> : <SystemCard key={card.id} card={card} />))}
      </ul>
      <p className="pr-note">{FR_PRICE_NOTE}</p>
    </>
  );
}

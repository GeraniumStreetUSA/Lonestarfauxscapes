import { HEDGE_TIERS, INSTALLATION_CAVEAT, FR_PRICE_NOTE, type HedgeTierId } from '../../data/starting-prices';
import '../../styles/pricing.css';
import Callout from '../Callout';
import PriceFigure from './PriceFigure';
import { SectionDrawing } from './SectionDrawings';

const ORDER: readonly HedgeTierId[] = ['hedge', 'hedge-freestanding'];

/**
 * The hedge's two starting prices side by side: on your fence or wall, and
 * freestanding. Each tier has its section drawing, its figure and its build
 * line, so the difference reads at a glance. Everything comes from
 * starting-prices.ts. Side by side from 340 px; stacked below that.
 */
export default function HedgeTierCompare() {
  return (
    <section id="hedge-prices" aria-labelledby="hedge-prices-title" className="section pr-compare-section">
      <div className="wrap">
        <header className="pk-section-head" data-reveal>
          <Callout text="◦ TWO WAYS TO STAND A HEDGE" />
          <h2 id="hedge-prices-title" className="t-h2 pk-section-title mt-5">
            Two kinds of hedge, two starting prices.
          </h2>
        </header>
        <div className="pr-compare" data-reveal>
          {ORDER.map((id) => {
            const tier = HEDGE_TIERS[id];
            return (
              <article key={id} className="pr-card pr-compare-tier">
                <div className="pr-frame">
                  <SectionDrawing id={id} />
                </div>
                <h3 className="pr-tier-name">{tier.label}</h3>
                <PriceFigure id={id} />
                <p className="pr-build">{tier.build}</p>
              </article>
            );
          })}
        </div>
        <ul className="pr-chips pr-compare-chips">
          <li className="pr-chip">{INSTALLATION_CAVEAT}</li>
        </ul>
        <p className="pr-note">{FR_PRICE_NOTE}</p>
      </div>
    </section>
  );
}

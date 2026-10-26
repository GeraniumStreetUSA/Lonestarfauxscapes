import { ArrowDown, ArrowRight } from 'lucide-react';

import Magnetic from '../components/Magnetic';
import { ForkGlyph } from '../components/PlanDrawings';
import SightlineScene from '../components/SightlineScene';
import { HERO } from '../data/home-content';
import { BUSINESS } from '../data/site';
import { formatStartingPrice, INSTALLATION_CAVEAT, STARTING_PRICES } from '../data/starting-prices';

/**
 * "Out of sight. Still green." The buyer's real problem is someone looking
 * in, so the hero draws that look and lets the visitor block it: a
 * neighbor's second-story window, a sightline over a 6 ft fence onto the
 * pool, and a hedge they can raise until the pool is out of sight.
 *
 * The H1 is one element: the search phrase, then the display line.
 */
export default function HomeHero() {
  const hedgePrice = `Hedges ${formatStartingPrice(STARTING_PRICES.hedge)} ${INSTALLATION_CAVEAT}`;

  return (
    <section aria-labelledby="hero-title" className="hero">
      <div className="wrap hero-layout">
        <h1 id="hero-title" className="hero-title">
          <span className="hero-kicker">{HERO.kicker}</span>
          <span className="hero-display">
            {HERO.display.map((line) => (
              <span key={line} className="hero-display-line">
                <span>{line}</span>
              </span>
            ))}
          </span>
        </h1>

        <div className="hero-copy">
          <p className="t-lede hero-sub">{HERO.sub}</p>
          <div className="hero-actions">
            <Magnetic>
              <a href="#quote" className="btn btn-primary btn-lg" data-primary-cta data-cta="hero">
                {HERO.cta}
                <ArrowDown size={18} strokeWidth={2.2} className="nudge-down" aria-hidden="true" />
              </a>
            </Magnetic>
            <p className="t-small text-cedar">
              {HERO.phoneLead}{' '}
              <a href={BUSINESS.phoneHref} className="hero-phone">
                {BUSINESS.phoneDisplay}
              </a>
            </p>
          </div>
          <p className="hero-price">{hedgePrice}</p>
        </div>

        <div className="hero-scene">
          <SightlineScene />
        </div>

        <div className="hero-foot">
          <p className="t-small max-w-[44ch] text-cedar [text-wrap:balance]">{HERO.trust}</p>
          <ul className="hero-fork">
            {HERO.fork.map((item, index) => (
              <li key={item.href}>
                <a href={item.href} className="fork-link group">
                  <ForkGlyph kind={index === 0 ? 'homes' : 'businesses'} />
                  <span className="flex items-center gap-2">
                    {item.label}
                    <ArrowRight
                      size={16}
                      strokeWidth={2.2}
                      className="flex-none transition-transform duration-200 group-hover:translate-x-[3px]"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

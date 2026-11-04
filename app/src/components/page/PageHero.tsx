import { ArrowDown, ArrowRight } from 'lucide-react';
import { useId, type ReactNode } from 'react';

import { BUSINESS } from '../../data/site';
import {
  FR_PRICE_NOTE,
  formatStartingPriceCaption,
  formatUsd,
  STARTING_PRICES,
  UNIT_LABELS,
  type StartingPriceId,
} from '../../data/starting-prices';
import { useQuoteHref } from '../../lib/quote-href';
import type { Route } from '../../routes';
import Callout from '../Callout';
import Magnetic from '../Magnetic';
import Breadcrumbs from './Breadcrumbs';
import FactRows, { type Fact } from './FactRows';

interface PageHeroProps {
  /** The trail comes from `route.breadcrumbs`. */
  route: Pick<Route, 'breadcrumbs'>;
  /** The sheet label: the eyebrow on phones, the title block's right-hand note on desktop. */
  callout?: string;
  /** The H1. */
  title: string;
  lede?: string;
  /** A released starting price, or `'quoted'` for work with no released price. */
  price?: StartingPriceId | 'quoted';
  /** The "Get a free quote" button and the phone line. */
  actions?: boolean;
  /** A `<Picture>` or a drawing; shown in a 4:3 frame on phones, an offset lot frame on desktop. */
  media?: ReactNode;
  /** A fact strip under the hero. */
  facts?: readonly Fact[];
}

/** One released price as three parts (the word "from", the figure, the unit), so the figure can be set large. */
function PriceBlock({ id, first }: { id: StartingPriceId; first: boolean }) {
  const released = STARTING_PRICES[id];
  return (
    <>
      <p className={first ? 'pk-price' : 'pk-price mt-4'}>
        <span className="pk-price-word">from</span> <span className="pk-price-fig">{formatUsd(released.amount)}</span>
        {released.per === 'unit' ? null : <span className="pk-price-word"> / {UNIT_LABELS[released.per]}</span>}
      </p>
      <p className="pk-price-caption">{formatStartingPriceCaption(released)}</p>
    </>
  );
}

/**
 * The released price, with the fire-rating note under it. A hedge is priced
 * two ways, so a hedge page shows both, each with its tier in its caption.
 */
function PriceLine({ price }: { price: StartingPriceId | 'quoted' }) {
  if (price === 'quoted') {
    return (
      <p className="pk-price pk-price-text">Quoted after a site review</p>
    );
  }
  const ids: StartingPriceId[] = price === 'hedge' ? ['hedge', 'hedge-freestanding'] : [price];
  return (
    <>
      {ids.map((id, index) => (
        <PriceBlock key={id} id={id} first={index === 0} />
      ))}
      <p className="pk-price-caption">{FR_PRICE_NOTE}</p>
    </>
  );
}

/**
 * The top of every inner page, built like a drawing's title block: a rule
 * with the trail on the left and the sheet label on the right, then the H1,
 * the lede, the released price and the quote button, with the photo or
 * drawing in an offset lot frame. Phones stack the same pieces in one
 * column, about a screen tall, and put the media last.
 */
export default function PageHero({ route, callout, title, lede, price, actions, media, facts }: PageHeroProps) {
  const quoteHref = useQuoteHref();
  const titleId = useId();
  const onPage = quoteHref.startsWith('#');
  const Arrow = onPage ? ArrowDown : ArrowRight;

  return (
    <section aria-labelledby={titleId} className="pk-hero">
      <div className="wrap">
        <div className="pk-hero-grid" data-media={media ? 'yes' : 'no'}>
          <div className="pk-hero-bar">
            <Breadcrumbs crumbs={route.breadcrumbs} />
          </div>
          {callout ? <Callout text={callout} className="pk-hero-callout" /> : null}
          <h1 id={titleId} className="pk-hero-title">
            {title}
          </h1>
          {lede ? <p className="t-lede pk-hero-lede">{lede}</p> : null}
          {price ? (
            <div className="pk-hero-price">
              <PriceLine price={price} />
            </div>
          ) : null}
          {actions ? (
            <div className="pk-hero-actions">
              <Magnetic>
                <a href={quoteHref} className="btn btn-primary btn-lg" data-primary-cta data-cta="page_hero">
                  Get a free quote
                  <Arrow size={18} strokeWidth={2.2} className={onPage ? 'nudge-down' : 'nudge-right'} aria-hidden="true" />
                </a>
              </Magnetic>
              <p className="t-small text-cedar">
                or call{' '}
                <a href={BUSINESS.phoneHref} className="hero-phone">
                  {BUSINESS.phoneDisplay}
                </a>
              </p>
            </div>
          ) : null}
          {media ? (
            <div className="pk-hero-media lot-frame">
              <div className="photo pk-hero-frame">{media}</div>
              <span className="pin" style={{ left: 0, top: '100%' }} aria-hidden="true" />
            </div>
          ) : null}
        </div>
        {facts && facts.length > 0 ? <FactRows items={facts} className="pk-hero-facts" /> : null}
      </div>
    </section>
  );
}

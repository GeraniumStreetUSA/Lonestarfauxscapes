import { ArrowRight } from 'lucide-react';
import { useId, type ReactNode } from 'react';

import Callout from '../Callout';

export interface Card {
  title: string;
  href: string;
  /** A place, a topic or a system: the mono note above the title. */
  callout?: string;
  /** One line. */
  text?: string;
  /** A `<Picture>` or a plan drawing. */
  media?: ReactNode;
  mediaKind?: 'photo' | 'drawing';
  /** The link text; defaults to "Read more". */
  linkLabel?: string;
}

/**
 * Cards for the hubs: picture, callout, title, one line and a link, the way
 * the homepage's install cards read. Three across on desktop, two on tablets.
 * Phones: compact rows (square picture, callout, title, two lines) like the
 * homepage's recent jobs. `compact` drops each card's line on phones (title,
 * place and link only), for a list that repeats what a page already says.
 */
export default function CardGrid({ items, compact = false }: { items: readonly Card[]; compact?: boolean }) {
  const uid = useId();
  return (
    <ul className="pk-cards" data-compact={compact ? 'yes' : undefined} data-reveal>
      {items.map((card, index) => {
        const titleId = `${uid}-${index}`;
        return (
          <li key={card.href}>
            <article className="card-hover" data-media={card.media ? 'yes' : 'no'}>
              {card.media ? (
                <div className={card.mediaKind === 'drawing' ? 'pk-media-drawing' : 'photo photo-settle pk-media-photo'}>
                  {card.media}
                </div>
              ) : null}
              {card.callout ? <Callout text={card.callout} className="pk-card-callout" /> : null}
              <h3 id={titleId} className="t-h3 pk-card-title">
                {card.title}
              </h3>
              {card.text ? <p className="t-small pk-card-text">{card.text}</p> : null}
              <a href={card.href} className="link-go pk-card-link" aria-describedby={titleId}>
                {card.linkLabel ?? 'Read more'}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

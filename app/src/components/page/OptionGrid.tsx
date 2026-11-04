import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

export interface Option {
  title: string;
  /** One or two lines. */
  text?: ReactNode;
  /** A `<Picture>` or a plan drawing. */
  media?: ReactNode;
  /** `photo` fills a 4:3 frame (a square on phones); `drawing` sits in a padded plan frame. */
  mediaKind?: 'photo' | 'drawing';
  /** Makes the whole cell a link (the title is the link text). */
  href?: string;
}

interface OptionGridProps {
  items: readonly Option[];
  /** Columns from 1024 px; tablets get two. */
  columns?: 3 | 4;
}

/**
 * Options, materials or systems as cells in a hairline grid. A cell with an
 * `href` is one big link through its title. Phones: compact rows with a
 * square 96 px picture on the left, never a carousel.
 */
export default function OptionGrid({ items, columns = 3 }: OptionGridProps) {
  return (
    <ul className="pk-options" data-cols={columns} data-reveal>
      {items.map((item) => (
        <li key={item.title} className="pk-option">
          <article
            className={item.href ? 'card-hover' : undefined}
            data-media={item.media ? 'yes' : 'no'}
            data-link={item.href ? 'yes' : 'no'}
          >
            {item.media ? (
              <div className={item.mediaKind === 'drawing' ? 'pk-media-drawing' : 'photo photo-settle pk-media-photo'}>
                {item.media}
              </div>
            ) : null}
            <div className="pk-option-body">
              <h3 className="pk-option-title">
                {item.href ? (
                  <a href={item.href} className="pk-stretch">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h3>
              {item.text ? <p className="pk-option-text">{item.text}</p> : null}
            </div>
            {item.href ? <ArrowUpRight size={18} strokeWidth={2.2} className="pk-option-arrow" aria-hidden="true" /> : null}
          </article>
        </li>
      ))}
    </ul>
  );
}

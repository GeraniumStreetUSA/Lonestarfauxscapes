import type { ReactNode } from 'react';

export interface Point {
  title: string;
  text: ReactNode;
}

interface PointListProps {
  items: readonly Point[];
  /** The element each title is: an h3 under a section's H2, or a plain bold line. */
  titleAs?: 'h3' | 'h4' | 'p';
  /** Phones show the titles (and any links) only; the sentences stay in the markup. For rows another block repeats. */
  terse?: boolean;
}

/**
 * Numbered rows (01, 02, ...) with a title and a sentence or two, hairline
 * separated: the fire chapter's rows as a reusable list. On the ink tone the
 * rule, title and text switch to the dark palette (CSS reads `.on-ink`).
 * Phones: one column, the title beside its number.
 */
export default function PointList({ items, titleAs: Title = 'h3', terse = false }: PointListProps) {
  return (
    <ol className="pk-points" data-terse={terse ? 'yes' : undefined}>
      {items.map((item, index) => (
        <li key={item.title} className="pk-point">
          <div className="pk-point-head">
            <span className="pk-point-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Title className="pk-point-title">{item.title}</Title>
          </div>
          <div className="pk-point-text">{item.text}</div>
        </li>
      ))}
    </ol>
  );
}

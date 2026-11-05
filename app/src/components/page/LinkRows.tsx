import { ArrowRight } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';

export interface LinkRow {
  title: string;
  href: string;
  /** One line. */
  text?: ReactNode;
  /** Chips mode on phones: a small mono label shown above the first link of each group. */
  group?: string;
}

interface LinkRowsProps {
  items: readonly LinkRow[];
  /** Two columns from 768 px; phones always get one. */
  columns?: 1 | 2;
  /**
   * Phones (up to 639 px) show the links as wrapped 44 px chips: the title
   * alone, no index, description or arrow, with a mono label where `group`
   * changes. Every link and description stays in the markup; tablets and
   * desktop keep the rows.
   */
  chips?: boolean;
  /** Phones show the title only, in a compact row (no description line). Every description stays in the markup. */
  terse?: boolean;
}

/**
 * A list of links as rows: a mono index, the title, an optional one-line
 * description and an arrow, hairline separated. For related pages, guides and
 * nearby areas. Works on the ink tone (CSS reads `.on-ink`).
 */
export default function LinkRows({ items, columns = 1, chips = false, terse = false }: LinkRowsProps) {
  return (
    <ul
      className="pk-link-rows"
      data-cols={columns}
      data-chips={chips ? 'yes' : undefined}
      data-terse={terse ? 'yes' : undefined}
      data-reveal
    >
      {items.map((item, index) => (
        <Fragment key={item.href}>
          {chips && item.group && item.group !== items[index - 1]?.group ? (
            <li className="pk-link-group" role="presentation">
              {item.group}
            </li>
          ) : null}
          <li>
            <a href={item.href} className="pk-link-row group">
              <span className="pk-link-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="pk-link-main">
                <span className="pk-link-title">{item.title}</span>
                {item.text ? <span className="pk-link-text">{item.text}</span> : null}
              </span>
              <ArrowRight size={18} strokeWidth={2.2} className="pk-link-arrow" aria-hidden="true" />
            </a>
          </li>
        </Fragment>
      ))}
    </ul>
  );
}

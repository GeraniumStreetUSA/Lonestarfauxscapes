/**
 * The shape of a hub page's copy (`/products`, `/residential`, `/commercial`,
 * `/commercial-resources`, `/case-studies`). `HubPage` renders `sections` in
 * order between the hero and the close. Prices are never typed here: a
 * `systems` section formats them from starting-prices.ts.
 */

import type { FaqItem } from '../../../lib/faq-schema.ts';
import type { SystemCard } from '../../home-content.ts';

export interface HubLink {
  label: string;
  href: string;
}

export interface HubLinkRow {
  title: string;
  href: string;
  text?: string;
}

/** A manifest name and its alt text. */
export interface HubImage {
  name: string;
  alt: string;
}

export interface HubPoint {
  title: string;
  text: string;
  links?: readonly HubLink[];
}

export interface HubOption {
  title: string;
  text?: string;
  href?: string;
  image?: HubImage;
}

export interface HubCard {
  title: string;
  href: string;
  callout?: string;
  text?: string;
  image?: HubImage;
  linkLabel?: string;
}

interface Head {
  id: string;
  callout?: string;
  title: string;
  intro?: string;
  tone?: 'caliche' | 'limestone' | 'ink';
}

export type HubSection =
  /** Cards for the home page's systems, with their released price lines. `terse`: phones drop the "best for" line. */
  | (Head & { kind: 'systems'; ids: readonly SystemCard['id'][]; terse?: boolean })
  | (Head & { kind: 'options'; items: readonly HubOption[]; columns?: 3 | 4 })
  /** Numbered rows; `links` adds a column of link rows beside them on desktop (chips on phones). */
  | (Head & {
      kind: 'points';
      items: readonly HubPoint[];
      links?: readonly HubLinkRow[];
      /** Phones fold the rows behind this summary (the 5-step process). */
      fold?: string;
      /** Phones show each row's title and links only (the sentences repeat the cards below). */
      terse?: boolean;
    })
  /** `compact`: phones show each card without its line. */
  | (Head & { kind: 'cards'; items: readonly HubCard[]; more?: HubLink; compact?: boolean })
  | (Head & { kind: 'links'; items: readonly HubLinkRow[]; columns?: 1 | 2 })
  | (Head & { kind: 'prose'; paragraphs: readonly string[]; links?: readonly HubLink[] })
  /** Two photos side by side, each with a label, and one link. */
  | (Head & { kind: 'pair'; items: readonly { image: HubImage; label: string }[]; link?: HubLink })
  /** The five metros as links. */
  | (Head & { kind: 'areas' })
  | { kind: 'faq'; id: string; title: string; items: readonly FaqItem[] };

export interface HubData {
  callout?: string;
  /** The H1. */
  title: string;
  lede: string;
  hero?: HubImage;
  sections: readonly HubSection[];
  /** `form` ends in the quote form (the route has `hasQuoteForm`); `band` in the quote band. */
  close: { kind: 'band'; title?: string; text?: string } | { kind: 'form' };
}

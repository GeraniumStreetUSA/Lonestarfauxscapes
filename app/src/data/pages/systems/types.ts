/**
 * The shape of every system and use-case page's copy. `SystemPage.tsx`
 * renders it: the hero first, then `blocks` in order, then the FAQ, the link
 * band and the quote section. Prices are never typed here: a page names a
 * released price id and the hero formats it (see data/starting-prices.ts).
 */

import type { SystemId } from '../../../lib/estimator.ts';
import type { FaqItem } from '../../../lib/faq-schema.ts';
import type manifest from '../../image-manifest.json';
import type { StartingPriceId } from '../../starting-prices.ts';

export type ImageName = keyof typeof manifest;

export interface PageImage {
  name: ImageName;
  alt: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface PageLink {
  title: string;
  href: string;
  /** One line. */
  text?: string;
}

export interface PointItem {
  title: string;
  text: string;
}

export interface OptionItem {
  title: string;
  text: string;
  /** A photo (4:3 frame, square on phones). */
  image?: PageImage;
  /** A product sample on white, shown whole instead of cropped. */
  sample?: PageImage;
  /** Makes the whole cell a link. */
  href?: string;
}

interface BlockBase {
  id: string;
  callout: string;
  title: string;
  intro?: string;
  /** Section ground; blocks alternate caliche and limestone down the page. */
  tone?: 'caliche' | 'limestone';
}

export type Block =
  | (BlockBase & { kind: 'points'; items: readonly PointItem[] })
  | (BlockBase & { kind: 'options'; items: readonly OptionItem[]; columns?: 3 | 4 })
  | (BlockBase & {
      kind: 'text';
      paragraphs: readonly string[];
      list?: readonly string[];
      links?: readonly PageLink[];
    })
  /** The owner's five-step process (data/home-content.ts), plus what drives the quote. */
  | (BlockBase & { kind: 'process'; driversTitle?: string; drivers?: readonly string[] })
  /** Case studies from data/case-studies.ts, by slug. */
  | (BlockBase & { kind: 'projects'; slugs: readonly string[] })
  /** Two portrait photos side by side. */
  | (BlockBase & { kind: 'pair'; first: PageImage; second: PageImage; firstLabel: string; secondLabel: string })
  | { kind: 'estimator'; system: SystemId; callout?: string; title?: string; body?: string };

export interface SystemPageData {
  /** `system` pages carry the estimator and the process; `usecase` pages are lighter. */
  variant: 'system' | 'usecase';
  hero: {
    callout: string;
    title: string;
    lede: string;
    /** The released price of the page's system, or `quoted`. */
    price: StartingPriceId | 'quoted';
    image: PageImage;
    facts: readonly Spec[];
  };
  blocks: readonly Block[];
  faq: {
    title?: string;
    items: readonly FaqItem[];
  };
  links: {
    /** Sibling systems and use cases. */
    related: readonly PageLink[];
    /** Two to four blog posts on the same topic. */
    guides: readonly PageLink[];
  };
}

import type { FaqItem } from '../../../lib/faq-schema';

/** The five system pages a metro links to, in the order they are listed. */
export type SystemKey = 'hedge' | 'living-wall' | 'fence-extension' | 'privacy-wall' | 'commercial-wall';

/** A row of text with a link: a guide, a setup page or a nearby area. */
export interface MetroLink {
  title: string;
  href: string;
  text?: string;
}

/** A blog post, by slug: the page finds its title and path in the generated list. */
export interface MetroGuide {
  slug: string;
  /** Overrides the post's long title on the row. */
  title: string;
  text: string;
}

export interface MetroNeed {
  title: string;
  text: string;
}

/** Everything a metro or suburb page says. Rendered by `MetroPage`. */
export interface MetroData {
  slug: string;
  name: string;
  kind: 'metro' | 'suburb';
  /** Suburbs only: the metro page this one links up to. */
  parent?: { slug: string; name: string };
  /** The TexasMap pin to light: the city's own, or the parent metro's. */
  mapActive: string;
  /** A documented local install photo for the hero, instead of the map. */
  photo?: 'austin' | 'houston';
  callout: string;
  /** The H1. */
  title: string;
  lede: string;
  needsTitle: string;
  needsIntro?: string;
  needs: readonly MetroNeed[];
  /** Suburbs: the places the old page named, shown as a short list under the needs. */
  places?: readonly string[];
  /** One short line per system (about 30 characters: it sits beside a picture on phones). */
  systems: Record<SystemKey, string>;
  /** Metros: the city's posts. */
  guides?: readonly MetroGuide[];
  /** Metros: use-case pages that fit this city. */
  setups?: readonly MetroLink[];
  faq: readonly FaqItem[];
  /** Metros with suburbs: their slugs. */
  suburbs?: readonly string[];
}

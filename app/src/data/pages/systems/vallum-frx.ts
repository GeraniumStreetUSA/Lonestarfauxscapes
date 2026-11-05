/**
 * /vallum-frx. The fire-rated living wall system. NFPA 701 only. Owner,
 * 2026-11-04: Vallum FRX only comes fire-rated, so it is priced above standard
 * living wall foliage; no figure is released and it is quoted after a site
 * review. Vallum FRX is the one product that comes fire-rated as standard. Dropped:
 * "industry-leading warranties", the 1-year structural and 3-year foliage
 * warranties, the 5 to 7 year lifespan, the 1 to 2 day install time, the
 * aluminum hat channel, steel grid and "UV-PE HD" material list (unverified),
 * "pinnacle of architectural engineering", "Method 2 certified", the
 * placeholder phone link.
 */

import { INSTALLATION_CAVEAT, STARTING_PRICES, formatStartingPriceProse } from '../../starting-prices.ts';
import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const VALLUM_FRX: SystemPageData = {
  variant: 'usecase',
  hero: {
    callout: '◦ LIVING WALL / FIRE-RATED',
    title: 'Vallum FRX Fire-Rated Living Wall',
    lede: 'Vallum FRX comes fire-rated (NFPA 701) as standard, with UV-stabilized foliage and documentation on request. Fire-rated foliage costs extra, so it is priced above standard living wall foliage.',
    price: 'quoted',
    image: {
      name: 'sys-vallum-wall',
      alt: 'Vallum FRX artificial living wall on an exterior wall',
    },
    facts: [
      { label: 'Fire-rated', value: 'Always, NFPA 701' },
      { label: 'Foliage', value: 'UV-stabilized' },
      { label: 'Build', value: 'Three layers' },
      { label: 'Use', value: 'Indoor or outdoor' },
    ],
  },
  blocks: [
    {
      kind: 'text',
      id: 'problem',
      callout: '◦ THE PROBLEM',
      title: 'Some walls have to pass a fire marshal.',
      paragraphs: [
        'Restaurants, hotels, multifamily and retail projects often need greenery with a documented fire rating. Vallum FRX is our fire-rated living wall system, and it comes fire-rated (NFPA 701) as standard, with documentation on request.',
        'Fire-rated foliage costs extra, so Vallum FRX is priced above standard living wall foliage. We quote it after a site review. Ask for the NFPA 701 documentation for the exact system, then confirm the requirement with your fire marshal.',
      ],
      links: [GUIDES.nfpa],
    },
    {
      kind: 'points',
      id: 'system',
      callout: '◦ THE SYSTEM',
      title: 'What Vallum FRX is.',
      tone: 'limestone',
      items: [
        {
          title: 'Three layers',
          text: 'A frame, a grid and the foliage on top, built as one system for the wall.',
        },
        {
          title: 'Fire-rated, always',
          text: 'Vallum FRX only comes fire-rated, built for NFPA 701, with UV-stabilized foliage for walls that see sun. That makes it cost more than standard living wall foliage.',
        },
        {
          title: 'Inside or out',
          text: 'It fits interior walls and outdoor ones. Tell us which, so the rating matches the exposure.',
        },
        {
          title: 'No irrigation, no upkeep',
          text: 'No water supply, fertilizer or pest control. Rinse off dust now and then.',
        },
      ],
    },
    {
      kind: 'pair',
      id: 'before-after',
      callout: '◦ BEFORE AND AFTER',
      title: 'A Vallum FRX wall, before and after.',
      first: { name: 'sys-vallum-before', alt: 'Bare exterior wall with a balcony rail, before the install' },
      second: { name: 'sys-vallum-after', alt: 'The same exterior wall with Vallum FRX living wall panels installed' },
      firstLabel: '◦ BEFORE',
      secondLabel: '◦ AFTER',
    },
  ],
  faq: {
    items: [
      {
        question: 'What is Vallum FRX?',
        answer:
          'It is our fire-rated living wall system: a frame, a grid and UV-stabilized foliage built as one system for NFPA 701. Vallum FRX only comes fire-rated, and fire-rated foliage costs extra.',
      },
      {
        question: 'Is it fire-rated?',
        answer: `Yes. Vallum FRX comes fire-rated (NFPA 701) as standard, and fire-rated foliage costs extra. Ask for the documentation for the exact system you choose, before you order, and your local fire authority (the AHJ) makes the final call. On our other systems fire-rated foliage is an upgrade at extra cost.`,
      },
      {
        question: 'Can it go outside?',
        answer:
          'Yes. The foliage is UV-stabilized for outdoor sun, and the system fits interior walls too. Tell us where the wall goes and how much sun it sees.',
      },
      {
        question: 'What does it mount to?',
        answer: 'A wall or a frame. The site review confirms what your wall can carry and how the panels fasten.',
      },
      {
        question: 'What does it cost?',
        answer: `Vallum FRX is priced above standard living wall foliage, because fire-rated foliage costs extra, and we quote it after a site review. For reference, standard living walls start ${formatStartingPriceProse(STARTING_PRICES['living-wall'])} (${STARTING_PRICES['living-wall'].configuration.toLowerCase()}) ${INSTALLATION_CAVEAT}.`,
      },
    ],
  },
  links: {
    related: [PAGES.livingWall, PAGES.fireRated, PAGES.commercialWall, PAGES.poolLivingWall, PAGES.hedge],
    guides: [GUIDES.nfpa, GUIDES.wallGuide, GUIDES.fireGuide],
  },
};

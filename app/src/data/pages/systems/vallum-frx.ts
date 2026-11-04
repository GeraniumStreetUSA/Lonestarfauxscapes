/**
 * /vallum-frx. The fire-rated living wall system. NFPA 701 only. Dropped:
 * "industry-leading warranties", the 1-year structural and 3-year foliage
 * warranties, the 5 to 7 year lifespan, the 1 to 2 day install time, the
 * aluminum hat channel, steel grid and "UV-PE HD" material list (unverified),
 * "pinnacle of architectural engineering", "Method 2 certified", the
 * placeholder phone link.
 */

import { FR_STATEMENT, INSTALLATION_CAVEAT, STARTING_PRICES, formatStartingPriceProse } from '../../starting-prices.ts';
import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const VALLUM_FRX: SystemPageData = {
  variant: 'usecase',
  hero: {
    callout: '◦ LIVING WALL / FIRE-RATED',
    title: 'Vallum FRX Fire-Rated Living Wall',
    lede: 'The fire-rated option for living walls, built for NFPA 701, with UV-stabilized foliage. Fire rating is an upgrade at extra cost, with documentation on request.',
    price: 'living-wall',
    image: {
      name: 'sys-vallum-wall',
      alt: 'Vallum FRX artificial living wall on an exterior wall',
    },
    facts: [
      { label: 'Fire-rated', value: 'Upgrade (NFPA 701)' },
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
        'Restaurants, hotels, multifamily and retail projects often need greenery with a documented fire rating. Vallum FRX is our fire-rated living wall system, built for NFPA 701. Fire rating is an upgrade at extra cost, with documentation on request.',
        'Ask for the NFPA 701 documentation for the exact system, then confirm the requirement with your fire marshal.',
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
          title: 'Fire-rated, as an upgrade',
          text: 'Built for NFPA 701, with UV-stabilized foliage for walls that see sun. The fire rating is an upgrade at extra cost.',
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
          'It is our fire-rated living wall system: a frame, a grid and UV-stabilized foliage built as one system for NFPA 701. Fire rating is an upgrade at extra cost on every product.',
      },
      {
        question: 'Is it fire-rated?',
        answer: `It is the fire-rated option, built for NFPA 701, and fire rating costs extra. ${FR_STATEMENT} Ask for the documentation for the exact system you choose, before you order, and your local fire authority (the AHJ) makes the final call.`,
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
        answer: `Living walls start ${formatStartingPriceProse(STARTING_PRICES['living-wall'])} (${STARTING_PRICES['living-wall'].configuration.toLowerCase()}) ${INSTALLATION_CAVEAT}. Vallum FRX is a specific system, so we price it in your rough quote.`,
      },
    ],
  },
  links: {
    related: [PAGES.livingWall, PAGES.fireRated, PAGES.commercialWall, PAGES.poolLivingWall, PAGES.hedge],
    guides: [GUIDES.nfpa, GUIDES.wallGuide, GUIDES.fireGuide],
  },
};

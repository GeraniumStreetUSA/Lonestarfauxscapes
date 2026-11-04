/**
 * /vallum-frx. The fire-rated living wall system. NFPA 701 only. Dropped:
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
    lede: 'A fire-rated living wall system, built for NFPA 701, with UV-stable foliage. Ask for the NFPA 701 documentation for the exact system.',
    price: 'living-wall',
    image: {
      name: 'sys-vallum-wall',
      alt: 'Vallum FRX artificial living wall on an exterior wall',
    },
    facts: [
      { label: 'Fire', value: 'Built for NFPA 701' },
      { label: 'Foliage', value: 'UV-stable' },
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
        'Restaurants, hotels, multifamily and retail projects often need greenery with a documented fire rating. Vallum FRX is our fire-rated living wall system, built for NFPA 701.',
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
          title: 'Fire-rated and UV-stable',
          text: 'Built for NFPA 701, with UV-stable foliage for walls that see sun.',
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
          'It is our fire-rated living wall system: a frame, a grid and UV-stable foliage built as one system, with fire-rated options built for NFPA 701.',
      },
      {
        question: 'Is it fire-rated?',
        answer:
          'It is built for NFPA 701, the flame test fire marshals ask for on decorative greenery. Ask for the NFPA 701 documentation for the exact system you choose, before you order.',
      },
      {
        question: 'Can it go outside?',
        answer:
          'Yes. The foliage is UV-stable for outdoor sun, and the system fits interior walls too. Tell us where the wall goes and how much sun it sees.',
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

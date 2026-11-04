/**
 * /living-wall. Carried over from the old page: the uses (lobbies, amenity
 * spaces, restaurants, retail), the four mat styles, and the real-versus-
 * artificial comparison, as plain points. Dropped: the 1-year and 3-year
 * warranties, the 10+ year lifespan, powder-coated frames, CAD drawings and
 * "our Texas shop", logo and lighting claims, acoustic backing, the
 * yearly per-square-foot upkeep figure, "seamless" and "turnkey".
 */

import { INSTALLATION_CAVEAT, STARTING_PRICES, formatStartingPriceProse } from '../../starting-prices.ts';
import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const LIVING_WALL: SystemPageData = {
  variant: 'system',
  hero: {
    callout: '◦ SYSTEM / LIVING WALL',
    title: 'Artificial Living Wall Installation in Texas',
    lede: 'Mixed-foliage panels for a blank wall, in 40 in modules, cut to your wall. No irrigation system, no plant care.',
    price: 'living-wall',
    image: {
      name: 'sys-living-wall-hero',
      alt: 'Artificial mixed-foliage living wall with a fire hose cabinet set into it',
    },
    facts: [
      { label: 'Panels', value: '40 in wide' },
      { label: 'Height', value: 'You set it' },
      { label: 'Mount', value: 'Wall or frame' },
      { label: 'Fire', value: 'NFPA 701 options' },
    ],
  },
  blocks: [
    {
      kind: 'points',
      id: 'solves',
      callout: '◦ WHAT IT SOLVES',
      title: 'What a living wall solves.',
      tone: 'limestone',
      items: [
        {
          title: 'A blank wall with nothing to water',
          text: 'No pumps, no plumbing, no drainage and no plants to replace. Rinse off dust now and then.',
        },
        {
          title: 'Green where plants cannot live',
          text: 'Lobbies, amenity spaces, restaurants, courtyards and covered patios, with or without good light.',
        },
        {
          title: 'Fire-rated and UV-rated options',
          text: 'Fire-rated living wall options are built for NFPA 701. UV-rated options are made for outdoor sun.',
        },
        {
          title: 'Built to your wall',
          text: 'Panels are 40 in wide. The wall is planned to your height and width, with the foliage pattern laid out across it.',
        },
      ],
    },
    {
      kind: 'estimator',
      system: 'living-wall',
      title: 'How big is the wall?',
      body: 'Set the run and the height. We count 40 in panels and do the arithmetic on our published living wall starting price. Installation is quoted after a site review.',
    },
    {
      kind: 'options',
      id: 'styles',
      callout: '◦ MAT STYLES',
      title: 'Living wall mat options.',
      intro: 'Four starting points. We can mix styles on one wall.',
      items: [
        {
          title: 'Single mat',
          text: 'One mat style across the wall. A good fit for accent walls, columns and smaller spaces.',
        },
        {
          title: 'Vallum FRX',
          text: 'A fire-rated living wall system, built for NFPA 701.',
          href: '/vallum-frx',
        },
        {
          title: 'Fluid design',
          text: 'A custom mix of single mat styles, laid out in flowing patterns.',
        },
        {
          title: 'Oasis',
          text: 'A bright, layered mix with fuller color and texture.',
        },
      ],
    },
    {
      kind: 'points',
      id: 'real-or-artificial',
      callout: '◦ REAL OR ARTIFICIAL',
      title: 'Real vs artificial living walls.',
      intro: 'A planted wall is a building system. An artificial one is panels on a wall.',
      items: [
        {
          title: 'Water',
          text: 'A planted wall needs irrigation, drainage and plumbing. An artificial wall needs none of them.',
        },
        {
          title: 'Upkeep',
          text: 'A planted wall needs pruning, feeding and replacing plants. An artificial wall needs a rinse now and then.',
        },
        {
          title: 'Light',
          text: 'Plants need the right light to stay alive. Artificial foliage stays green in any light, but outdoors it should be UV-rated.',
        },
      ],
    },
    {
      kind: 'process',
      id: 'pricing',
      callout: '◦ HOW PRICING WORKS',
      title: 'Cost factors and how a wall job runs.',
      intro: 'The starting price is per square foot of wall, for the material. Installation is quoted after a site review, because wall size, mounting and access drive it.',
      tone: 'limestone',
      driversTitle: 'What to send',
      drivers: [
        'Wall size: width and height in feet.',
        'Inside or outside, and how much sun the wall gets.',
        'What the wall is made of: block, stucco, drywall or a frame.',
        'Photos of the wall and the space around it.',
      ],
    },
  ],
  faq: {
    items: [
      {
        question: 'Does an artificial living wall need irrigation?',
        answer: 'No. There is no irrigation, drainage or water supply to plan, and no plants to replace. Rinse off dust now and then.',
      },
      {
        question: 'Can it go outside?',
        answer:
          "UV-rated living wall options are made for outdoor sun. Indoor-grade foliage is not, and it can fade faster outside. Tell us where the wall goes and how much sun it sees.",
      },
      {
        question: 'Is there a fire-rated living wall?',
        answer:
          'Fire-rated living wall options are built for NFPA 701, the flame test fire marshals ask for on decorative greenery. Ask for the NFPA 701 documentation for the exact system you choose.',
      },
      {
        question: 'What does it mount to?',
        answer: 'A wall or a frame. The site review confirms what your wall can carry and how the panels fasten.',
      },
      {
        question: 'How is the price set?',
        answer: `Living walls start ${formatStartingPriceProse(STARTING_PRICES['living-wall'])} (${STARTING_PRICES['living-wall'].configuration.toLowerCase()}) ${INSTALLATION_CAVEAT}. You get a rough quote by email first; the site review sets the final invoice.`,
      },
    ],
  },
  links: {
    related: [PAGES.vallum, PAGES.poolLivingWall, PAGES.commercialWall, PAGES.hedge, PAGES.fireRated],
    guides: [GUIDES.wallGuide, GUIDES.wallIndoorOutdoor, GUIDES.wallRealVsArtificial],
  },
};

/**
 * /artificial-boxwood-hedge. Carried over from the old page: boxwood as the
 * clipped look, fixed versus mobile builds, fire-rated boxwood for venues.
 * Mobile hedges on casters stay as an option with no numbers. Dropped: the 2 to
 * 12+ ft size range, "one person can roll it", weighted bases, sandbags and
 * stake-downs, wedding-popularity claims, density tiers, signage and lighting
 * add-ons, the setup-time and cost rows.
 */

import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const ARTIFICIAL_BOXWOOD_HEDGE: SystemPageData = {
  variant: 'usecase',
  hero: {
    callout: '◦ HEDGE / BOXWOOD',
    title: 'Artificial Boxwood Hedges in Texas',
    lede: 'The classic clipped boxwood look, built to your size. Fixed on a fence, a wall or a frame, or on casters where it has to move.',
    price: 'hedge',
    image: {
      name: 'austin-install',
      alt: 'Installer on a ladder fixing boxwood panels to a wire mesh screen',
    },
    facts: [
      { label: 'Look', value: 'Clipped boxwood' },
      { label: 'Size', value: 'Built to yours' },
      { label: 'Mount', value: 'Fixed or on casters' },
      { label: 'Fire', value: 'NFPA 701 options' },
    ],
  },
  blocks: [
    {
      kind: 'text',
      id: 'why',
      callout: '◦ WHY BOXWOOD',
      title: 'Boxwood, without the upkeep.',
      paragraphs: [
        'Boxwood is the look people ask for first: small, dense leaves and a clean clipped line. Real boxwood needs water, clipping and replacing when it browns.',
        'Artificial boxwood panels hold the same formal line with no watering and no trimming. Rinse off dust and pollen now and then.',
      ],
    },
    {
      kind: 'points',
      id: 'built',
      callout: '◦ HOW IT IS BUILT',
      title: 'What to look for in a boxwood panel.',
      tone: 'limestone',
      items: [
        {
          title: 'Dense, clipped leaves',
          text: 'Leaf density and seams are what give artificial boxwood away. Look at both up close, on real Texas jobs, before you decide.',
        },
        {
          title: 'Built to your size',
          text: 'Panels are made to your height and width: straight runs, corners and freestanding sections.',
        },
        {
          title: 'UV-rated and fire-rated options',
          text: 'UV-rated boxwood is made for outdoor sun. Fire-rated boxwood is built for NFPA 701, for indoor venues such as hotels and event spaces. Ask for the NFPA 701 documentation for the exact system.',
        },
      ],
    },
    {
      kind: 'options',
      id: 'builds',
      callout: '◦ BUILDS',
      title: 'Fixed or mobile.',
      columns: 4,
      items: [
        {
          title: 'On a fence or wall',
          text: 'Panels mounted for good. The usual choice for backyard privacy, patio edges and storefronts.',
        },
        {
          title: 'Freestanding frame',
          text: 'A frame that stands on its own, for dividers and screens where there is no fence.',
        },
        {
          title: 'Mobile, on casters',
          text: 'Hedge sections that roll into place, for events, restaurants and flexible spaces.',
        },
        {
          title: 'Fire-rated boxwood',
          text: 'For venues that ask for NFPA 701 documentation before they allow greenery.',
        },
      ],
    },
    {
      kind: 'projects',
      id: 'projects',
      callout: '◦ TEXAS JOBS',
      title: 'Boxwood on Texas jobs.',
      tone: 'limestone',
      slugs: ['austin-high-end-residential-privacy', 'houston-restaurant-hedges'],
    },
  ],
  faq: {
    items: [
      {
        question: 'Can I get a boxwood hedge on wheels?',
        answer:
          'Yes. Mobile boxwood hedges on casters are an option for events, restaurants and flexible spaces. Tell us the space, how often it moves and whether it sits indoors or out, and we quote the right build.',
      },
      {
        question: 'What sizes can you make?',
        answer:
          'Panels are built to your height and width. Our priced size is 6 ft tall, and other sizes go in your rough quote.',
      },
      {
        question: 'Will Texas sun wear it out?',
        answer:
          'UV-rated boxwood is made for outdoor sun. Indoor-grade foliage is not, and it can fade faster outside. Match the rating to the exposure.',
      },
      {
        question: 'Is there fire-rated boxwood for indoor venues?',
        answer:
          'Fire-rated boxwood options are built for NFPA 701, the flame test fire marshals ask for on decorative greenery. Ask for the NFPA 701 documentation for the exact system you choose.',
      },
      {
        question: 'Can I use it for an event?',
        answer:
          'Boxwood panels work as backdrops, dividers and entrance features. Send the venue, the size and the date, and we will say what is possible.',
      },
    ],
  },
  links: {
    related: [PAGES.hedge, PAGES.fireRated, PAGES.poolPrivacy, PAGES.hoa, PAGES.fenceExtension],
    guides: [GUIDES.boxwoodVsReal, GUIDES.hedgeGuide, GUIDES.hedgeCare],
  },
};

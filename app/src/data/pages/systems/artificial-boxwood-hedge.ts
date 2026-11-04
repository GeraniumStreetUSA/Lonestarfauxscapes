/**
 * /artificial-boxwood-hedge. Carried over from the old page: boxwood as the
 * clipped look, fixed versus mobile builds, fire-rated boxwood for venues.
 * Mobile hedges on casters stay as an option with no numbers. Dropped: the 2 to
 * 12+ ft size range, "one person can roll it", weighted bases, sandbags and
 * stake-downs, wedding-popularity claims, density tiers, signage and lighting
 * add-ons, the setup-time and cost rows.
 */

import { FR_STATEMENT } from '../../starting-prices.ts';
import { HEDGE_SIZE_NOTE } from './claims-copy.ts';
import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const ARTIFICIAL_BOXWOOD_HEDGE: SystemPageData = {
  variant: 'usecase',
  hero: {
    callout: '◦ HEDGE / BOXWOOD',
    title: 'Artificial Boxwood Hedges in Texas',
    lede: 'The classic clipped boxwood look, built to your size. Fixed on your fence or wall, freestanding on posts, or on casters where it has to move.',
    price: 'hedge',
    image: {
      name: 'austin-install',
      alt: 'Installer on a ladder fixing boxwood panels to a wire mesh screen',
    },
    facts: [
      { label: 'Look', value: 'Clipped boxwood' },
      { label: 'Size', value: 'Built to yours' },
      { label: 'Mount', value: 'Fixed or on casters' },
      { label: 'Fire-rated', value: 'Upgrade (NFPA 701)' },
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
          title: 'UV-stabilized, with fire-rated as an upgrade',
          text: 'Standard boxwood is UV-stabilized for outdoor sun. Fire-rated boxwood (NFPA 701) is an upgrade at extra cost, for indoor venues such as hotels and event spaces, with documentation on request.',
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
          title: 'Freestanding',
          text: 'A hedge on posts set in concrete, for dividers and screens where there is no fence.',
        },
        {
          title: 'Mobile, on casters',
          text: 'Hedge sections that roll into place, for events, restaurants and flexible spaces.',
        },
        {
          title: 'Fire-rated boxwood (upgrade)',
          text: 'An upgrade at extra cost, for venues that ask for NFPA 701 documentation before they allow greenery.',
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
          `Panels are built to your height and width. ${HEDGE_SIZE_NOTE}`,
      },
      {
        question: 'Will Texas sun wear it out?',
        answer:
          'Standard boxwood is UV-stabilized for outdoor sun. Indoor-grade foliage is not, and it can fade faster outside. Match the rating to the exposure.',
      },
      {
        question: 'Is there fire-rated boxwood for indoor venues?',
        answer: `Yes, as an upgrade at extra cost; standard boxwood is not fire-rated. ${FR_STATEMENT} Ask for the NFPA 701 documentation for the exact system you choose.`,
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

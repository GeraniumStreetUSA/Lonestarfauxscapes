/**
 * /artificial-hedge. Carried over from the old page: the H1's keyword, the
 * material families (boxwood, ficus, oasis, other), the four measurements a
 * quote needs, the maintenance note and the cost drivers. Dropped: acoustic
 * and noise claims, "engineered for code", the percentage upcharges, height
 * ranges, lifespan and "turnkey".
 */

import { INSTALLATION_CAVEAT, STARTING_PRICES, formatStartingPriceProse } from '../../starting-prices.ts';
import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const ARTIFICIAL_HEDGE: SystemPageData = {
  variant: 'system',
  hero: {
    callout: '◦ SYSTEM / HEDGE',
    title: 'Artificial Hedge Installation in Texas',
    lede: 'Hedge panels for a fence line, a wall or a patio edge, built to your measurements. No watering, no trimming.',
    price: 'hedge',
    image: {
      name: 'austin-after',
      alt: 'Tall artificial boxwood privacy wall behind live oaks in an Austin backyard',
    },
    facts: [
      { label: 'Height', value: '6 ft priced size' },
      { label: 'Panels', value: '20 in wide' },
      { label: 'Mount', value: 'Fence, frame or wall' },
      { label: 'Fire', value: 'NFPA 701 options' },
    ],
  },
  blocks: [
    {
      kind: 'points',
      id: 'solves',
      callout: '◦ WHAT IT SOLVES',
      title: 'What an artificial hedge solves.',
      tone: 'limestone',
      items: [
        {
          title: 'Privacy on day one',
          text: 'Panels go up full. There is no growing season to wait through before the view next door is gone.',
        },
        {
          title: 'No watering, no trimming',
          text: 'No irrigation, no clipping, no dead sections to replace. Rinse off dust and pollen now and then.',
        },
        {
          title: 'Built to your run',
          text: 'Panels are cut to your lengths and heights, with corners and returns planned in, so the line reads as one hedge.',
        },
        {
          title: 'Fire-rated and UV-rated options',
          text: 'Fire-rated options are built for NFPA 701. UV-rated options are made for outdoor sun. Match each to the site.',
        },
      ],
    },
    {
      kind: 'estimator',
      system: 'hedge',
      title: 'How long is the hedge run?',
      body: 'Set the run. We count 20 in panels and do the arithmetic on our published hedge starting price. Installation is quoted after a site review.',
    },
    {
      kind: 'options',
      id: 'materials',
      callout: '◦ MATERIALS',
      title: 'Material options for artificial hedges.',
      intro: 'Four families. UV-rated and fire-rated options exist; ask which apply to the one you like.',
      items: [
        {
          title: 'Boxwood',
          text: 'The classic clipped look. Small, dense leaves for fences and storefronts.',
          sample: { name: 'sys-mat-boxwood', alt: 'Boxwood artificial hedge panel sample' },
        },
        {
          title: 'Ficus',
          text: 'A broader leaf and a softer, more natural texture.',
          sample: { name: 'sys-mat-ficus', alt: 'Ficus artificial hedge panel sample' },
        },
        {
          title: 'Oasis',
          text: 'A layered mix with depth and tonal variation, for feature walls.',
          sample: { name: 'sys-mat-oasis', alt: 'Oasis mixed-foliage artificial hedge panel sample' },
        },
        {
          title: 'Something else',
          text: 'Want a different style? Tell us the look and we will say what is available.',
          sample: { name: 'sys-mat-other', alt: 'Mixed-leaf artificial hedge panel sample' },
        },
      ],
    },
    {
      kind: 'process',
      id: 'pricing',
      callout: '◦ HOW PRICING WORKS',
      title: 'Cost factors and how a hedge job runs.',
      intro: 'The starting price is for the material. Installation is quoted after a site review, because run length, mounting, height and site access drive it.',
      tone: 'limestone',
      driversTitle: 'What to send',
      drivers: [
        'Run length: the line you want green, corners and returns included.',
        'Height: from the ground or the fence top to the height you want.',
        'Mounting surface: fence, block wall, metal posts or building facade.',
        'Photos: wide shots of the run and close ones of the mounting surface.',
      ],
    },
    {
      kind: 'projects',
      id: 'projects',
      callout: '◦ TEXAS JOBS',
      title: 'Hedges on Texas jobs.',
      slugs: ['austin-high-end-residential-privacy', 'houston-restaurant-hedges', 'houston-storefront-hedges'],
    },
  ],
  faq: {
    items: [
      {
        question: 'Do artificial hedges need watering or trimming?',
        answer: 'No watering and no trimming. Rinse off dust and pollen now and then.',
      },
      {
        question: 'Can it mount on my existing fence?',
        answer:
          'Often, yes. Panels can mount to many fences or to a freestanding frame. The site review confirms what your fence can carry.',
      },
      {
        question: 'Will Texas sun wear it out?',
        answer:
          "UV-rated hedge options are made for outdoor sun. Indoor-grade foliage is not, and it can fade faster outside. Match the rating to the exposure of your run.",
      },
      {
        question: 'Is it fire-rated?',
        answer:
          'Fire-rated hedge options are built for NFPA 701, the flame test fire marshals ask for on decorative greenery. Ask for the NFPA 701 documentation for the exact system you choose.',
      },
      {
        question: 'Will my HOA approve it?',
        answer:
          "We cannot promise approval. Check your HOA's rules and submit product specs and photos with your request.",
      },
      {
        question: 'How is the price set?',
        answer: `Hedge panels start ${formatStartingPriceProse(STARTING_PRICES.hedge)} (${STARTING_PRICES.hedge.configuration}) ${INSTALLATION_CAVEAT}. You get a rough quote by email first; the site review sets the final invoice.`,
      },
    ],
  },
  links: {
    related: [PAGES.fenceExtension, PAGES.boxwood, PAGES.fireRated, PAGES.hoa, PAGES.poolPrivacy],
    guides: [GUIDES.hedgeGuide, GUIDES.hedgeCare, GUIDES.diyOrPro],
  },
};

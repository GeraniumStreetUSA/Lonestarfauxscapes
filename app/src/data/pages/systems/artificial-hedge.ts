/**
 * /artificial-hedge. Carried over from the old page: the H1's keyword, the
 * material families (boxwood, ficus, oasis, other), the four measurements a
 * quote needs, the maintenance note and the cost drivers. Dropped: acoustic
 * and noise claims, "engineered for code", the percentage upcharges, height
 * ranges, lifespan and "turnkey".
 */

import { FR_STATEMENT, HEDGE_TIERS } from '../../starting-prices.ts';
import { FIRE_FAQ_ANSWER, HEDGE_MOUNT_ANSWER, HEDGE_PRICE_ANSWER, UV_FAQ_ANSWER } from './claims-copy.ts';
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
      // Short forms: the tier comparison right below gives each build in full.
      { label: HEDGE_TIERS.hedge.label, value: '2 to 3 in deep, priced at 6 ft tall' },
      { label: HEDGE_TIERS['hedge-freestanding'].label, value: '6 ft × 7 in, on posts' },
      { label: 'Fire-rated', value: 'Upgrade (NFPA 701)' },
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
          title: 'UV-stabilized, with fire-rated as an upgrade',
          text: FR_STATEMENT,
        },
      ],
    },
    {
      kind: 'estimator',
      system: 'hedge',
      title: 'How long is the hedge run?',
      body: 'Pick a hedge on your fence or wall, or a freestanding hedge, and set the run. On a fence or wall, set the height too. We do the arithmetic on our published hedge starting prices. Installation is quoted after a site review.',
    },
    {
      kind: 'options',
      id: 'materials',
      callout: '◦ MATERIALS',
      title: 'Material options for artificial hedges.',
      intro: 'Four families. Standard foliage is UV-stabilized. Fire-rated foliage is an upgrade at extra cost: tell us the one you like and we will say plainly whether it comes fire-rated.',
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
        'Height: from the ground to the height you want. A hedge on your fence or wall is priced per linear foot at 6 ft tall and scales with height.',
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
        answer: HEDGE_MOUNT_ANSWER,
      },
      {
        question: 'Will Texas sun wear it out?',
        answer: UV_FAQ_ANSWER,
      },
      {
        question: 'Is it fire-rated?',
        answer: FIRE_FAQ_ANSWER,
      },
      {
        question: 'Will my HOA approve it?',
        answer:
          "We cannot promise approval. Check your HOA's rules and submit product specs and photos with your request.",
      },
      {
        question: 'How is the price set?',
        answer: HEDGE_PRICE_ANSWER,
      },
    ],
  },
  links: {
    related: [PAGES.fenceExtension, PAGES.boxwood, PAGES.fireRated, PAGES.hoa, PAGES.poolPrivacy],
    guides: [GUIDES.hedgeGuide, GUIDES.hedgeCare, GUIDES.diyOrPro],
  },
};

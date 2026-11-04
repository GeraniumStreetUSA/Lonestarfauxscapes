/**
 * /pool-living-wall. Carried over from the old page: where a wall goes around
 * a pool, the real-versus-artificial contrast, the style choices, and the
 * honest note on chlorine and sun. Dropped: "fully resistant to pool
 * chemicals", resort comparisons (Cabo, Bali), "no maintenance ever", wind
 * loads, shop fabrication, install timing, "zero" upkeep, lifespans and the
 * "complete oasis" packages with sizes.
 */

import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const POOL_LIVING_WALL: SystemPageData = {
  variant: 'usecase',
  hero: {
    callout: '◦ POOL / LIVING WALL',
    title: 'Pool Living Walls in Texas',
    lede: 'A green wall behind the pool, with no irrigation, no debris in the water and no plants to replace.',
    price: 'living-wall',
    image: {
      name: 'sys-living-wall-close',
      alt: 'Close view of artificial mixed foliage on a living wall',
    },
    facts: [
      { label: 'Panels', value: '40 in wide' },
      { label: 'Height', value: 'You set it' },
      { label: 'Mount', value: 'Wall, fence or frame' },
      { label: 'Foliage', value: 'UV-rated options' },
    ],
  },
  blocks: [
    {
      kind: 'text',
      id: 'problem',
      callout: '◦ THE PROBLEM',
      title: 'Live plants struggle at a pool.',
      paragraphs: [
        'Splash, chemical mist, reflected heat and full sun are hard on live plants, and a planted wall needs pumps, irrigation and drainage on top of that.',
        'An artificial living wall needs no water supply and sheds nothing into the pool. Outdoor-rated systems can work well here, but product choice and a regular rinse matter.',
      ],
    },
    {
      kind: 'options',
      id: 'where',
      callout: '◦ WHERE IT GOES',
      title: 'Where a pool living wall goes.',
      tone: 'limestone',
      columns: 4,
      items: [
        { title: 'Behind the pool', text: 'A green backdrop for the whole deck.' },
        { title: 'Over a fence', text: 'Cover a plain wood or metal fence with foliage.' },
        { title: 'Cabana or pergola', text: 'Foliage on one side or more of the structure.' },
        { title: 'Spa surround', text: 'An enclosed, private feel around the hot tub.' },
      ],
    },
    {
      kind: 'points',
      id: 'plan',
      callout: '◦ WHAT TO PLAN FOR',
      title: 'What to plan for.',
      items: [
        {
          title: 'Match the rating to the sun',
          text: 'UV-rated living wall options are made for outdoor sun. Indoor-grade foliage is not, and it can fade faster outside.',
        },
        {
          title: 'Rinse it now and then',
          text: 'Rinse with a hose when dust or pollen builds up. Keep concentrated pool chemicals off the foliage.',
        },
        {
          title: 'Pick a style',
          text: 'Tropical mixed foliage, a manicured boxwood look or a custom mix. Tell us the look and what is already in your yard.',
        },
        {
          title: 'Fire-rated if you need it',
          text: 'Fire-rated living wall options are built for NFPA 701. Ask for the NFPA 701 documentation for the exact system.',
        },
      ],
    },
  ],
  faq: {
    items: [
      {
        question: 'Can a living wall go near a pool or water feature?',
        answer:
          'Pool areas bring humidity, splash and residue from chlorine and sunscreen. Outdoor-rated living wall systems can work well there, but product choice and a regular rinse matter. Tell us how close the wall stands to the water.',
      },
      {
        question: 'Does it need irrigation or drainage?',
        answer: 'No. There is no water supply, irrigation or drainage to plan, and no plants to replace.',
      },
      {
        question: 'How do I clean it?',
        answer: 'Rinse with a garden hose when dust or pollen builds up. No pruning, no feeding, no replacing plants.',
      },
      {
        question: 'Will the color fade in Texas sun?',
        answer:
          'UV-rated options are made for outdoor sun, but appearance over time depends on exposure, placement and the product. Match the system to the sun and weather your wall will see.',
      },
      {
        question: 'Can you match my landscaping?',
        answer:
          'We can mix foliage styles to suit your yard and hardscape. Send photos and the look you want, and we suggest a mix in the assessment.',
      },
    ],
  },
  links: {
    related: [PAGES.livingWall, PAGES.poolPrivacy, PAGES.vallum, PAGES.hedge, PAGES.fenceExtension],
    guides: [GUIDES.wallIndoorOutdoor, GUIDES.wallGuide, GUIDES.wallSummer],
  },
};

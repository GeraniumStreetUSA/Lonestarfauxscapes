/**
 * /pool-privacy-hedge. Carried over from the old page: the sightline problem
 * (second floor, deck, gap, street), fence-top or freestanding, gap-filling,
 * and the honest note on pool chemistry. Dropped: "Zero debris, ever", "no
 * impact on filtration", "doesn't attract insects", the 5 to 10 year lifespan,
 * the "3-5 years to mature" figure, "free, no obligation" site visit, "most
 * HOAs approve" and the shop pre-fabrication line.
 */

import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const POOL_PRIVACY_HEDGE: SystemPageData = {
  variant: 'usecase',
  hero: {
    callout: '◦ POOL / PRIVACY',
    title: 'Pool Privacy Hedges in Texas',
    lede: 'A hedge along the pool takes the view away. It sheds no leaves into the water, and there is nothing to water or trim.',
    price: 'hedge',
    image: {
      name: 'sys-pool-hedge',
      alt: 'Long artificial hedge wall behind a backyard swimming pool',
    },
    facts: [
      { label: 'Height', value: '6 ft priced size' },
      { label: 'Panels', value: '20 in wide' },
      { label: 'Mount', value: 'Fence or freestanding' },
      { label: 'Foliage', value: 'UV-rated options' },
    ],
  },
  blocks: [
    {
      kind: 'text',
      id: 'problem',
      callout: '◦ THE PROBLEM',
      title: 'The pool is the part of the yard everyone can see.',
      paragraphs: [
        'A two-story neighbor, a raised deck or an open side can look straight at the pool. A live hedge takes years to reach height, drops leaves and flowers into the water and needs trimming.',
        'An artificial hedge goes up at full height and sheds nothing into the pool.',
      ],
    },
    {
      kind: 'points',
      id: 'plan',
      callout: '◦ HOW IT IS PLANNED',
      title: 'How a pool screen is planned.',
      tone: 'limestone',
      items: [
        {
          title: 'Start with the sightline',
          text: 'Stand where you swim and note what can see you: a window, a deck, the street. The height follows the angle of that view.',
        },
        {
          title: 'Fence-top or freestanding',
          text: 'Add hedge panels above your fence, or stand freestanding sections where there is no fence to build on.',
        },
        {
          title: 'Fill the gaps',
          text: 'Corners, and the gap between your fence and the house next door, get panels cut to fit.',
        },
        {
          title: 'Outdoor-rated foliage',
          text: 'UV-rated options are made for outdoor sun. Pool areas add splash, residue and reflected heat, so match the product to the spot and rinse it now and then.',
        },
      ],
    },
  ],
  faq: {
    items: [
      {
        question: 'Will it hold up near a chlorinated pool?',
        answer:
          'Pool areas add chlorine mist, sunscreen and dust to nearby surfaces. Outdoor-rated hedge panels can work well there, but product choice and a regular rinse matter. Keep concentrated pool chemicals off the foliage.',
      },
      {
        question: 'How tall can a pool privacy hedge be?',
        answer:
          'Our priced size is 6 ft tall. Taller screens go in your rough quote, and the height depends on the angle of the view you want to block.',
      },
      {
        question: 'Will it drop leaves into the pool?',
        answer:
          'The hedge itself sheds nothing: no leaves, flowers or berries. Trees overhead still drop what they drop.',
      },
      {
        question: 'Can it block a two-story neighbor?',
        answer:
          'A taller screen can block that view. Send a photo from where you swim, and we size the height to the angle. Fence extensions add height on top of a fence you already have.',
      },
      {
        question: 'Will my HOA allow it?',
        answer:
          "We cannot promise approval. Check your HOA's rules and submit product specs and photos with your request.",
      },
    ],
  },
  links: {
    related: [PAGES.fenceExtension, PAGES.privacyWall, PAGES.hedge, PAGES.poolLivingWall, PAGES.hoa],
    guides: [GUIDES.poolPrivacy, GUIDES.privacyCompared, GUIDES.hedgeCare],
  },
};

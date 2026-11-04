/**
 * /fence-extensions. Carried over from the old page: height added to the
 * fence you have, the 9 ft arithmetic, HOA height limits as the thing to check
 * first, and the three-step flow. Dropped: acoustic cores and "-5 to -10 dB",
 * the "___+ fences extended" counter, one-to-two-day timelines, "most HOAs
 * approve faster", steel or aluminum frame specifics, wind and the DIY
 * comparison table.
 */

import { INSTALLATION_CAVEAT, STARTING_PRICES, formatStartingPriceProse } from '../../starting-prices.ts';
import { EXTENSION_ATTACHMENT, VINYL_CAVEAT } from './claims-copy.ts';
import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const FENCE_EXTENSIONS: SystemPageData = {
  variant: 'system',
  hero: {
    callout: '◦ SYSTEM / FENCE EXTENSION',
    title: 'Artificial Fence Extensions for Patio Privacy in Texas',
    lede: 'Add hedge panels to the face of the fence or wall you already have, and rise above it. More height, more screening, no new fence.',
    price: 'fence-extension',
    image: {
      name: 'sys-fence-topper',
      alt: 'Tall artificial hedge rising above a low stucco wall along the side of a house, under a clear blue sky',
    },
    facts: [
      { label: 'Extension', value: '3 ft priced size' },
      { label: 'Panels', value: '20 in wide' },
      { label: 'Mount', value: 'Face of the fence or wall, steel square tube' },
      { label: 'Foliage', value: 'UV-stabilized' },
    ],
  },
  blocks: [
    {
      kind: 'points',
      id: 'solves',
      callout: '◦ WHAT IT SOLVES',
      title: 'What a fence extension solves.',
      tone: 'limestone',
      items: [
        {
          title: 'A fence that is not tall enough',
          text: 'A neighbor with a second-story window looks over a 6 ft fence. A 3 ft extension on a 6 ft fence reaches 9 ft.',
        },
        {
          title: 'No new fence to build',
          text: 'The extension is fixed to the face of your fence or wall, generally with steel square tube. The fence stays; only the height changes.',
        },
        {
          title: 'No watering, no trimming',
          text: 'The extension stays green without irrigation or clipping. Rinse off dust now and then.',
        },
        {
          title: 'Built to your fence line',
          text: 'Panels are sized to your spans, with corners and returns planned in so the top reads as one hedge.',
        },
      ],
    },
    {
      kind: 'text',
      id: 'attach',
      callout: '◦ HOW IT ATTACHES',
      title: 'How it attaches to your fence.',
      paragraphs: [EXTENSION_ATTACHMENT, `${VINYL_CAVEAT} The site review confirms what your fence or wall can carry.`],
    },
    {
      kind: 'estimator',
      system: 'fence-extension',
      title: 'How long is the fence?',
      body: 'Set the run. We count 20 in panels for a 3 ft extension and do the arithmetic on our published fence extension starting price. Installation is quoted after a site review.',
    },
    {
      kind: 'text',
      id: 'height',
      callout: '◦ HEIGHT',
      title: 'How tall can the extension go?',
      paragraphs: [
        'We price a 3 ft extension. Other heights go in your rough quote.',
        "Check your HOA's fence height limit, and your city's, before you pick one. Tell us the limit and we plan to it.",
      ],
      links: [PAGES.hoa],
    },
    {
      kind: 'process',
      id: 'pricing',
      callout: '◦ HOW PRICING WORKS',
      title: 'Cost factors and how a job runs.',
      intro: 'The starting price is for the material. Installation is quoted after a site review, which also checks what your fence or wall can carry.',
      tone: 'limestone',
      driversTitle: 'What to send',
      drivers: [
        'Fence length, with corners and gates marked.',
        'Fence height now, and the height you want to reach.',
        'Fence type: wood, metal, masonry or vinyl (extending vinyl is much harder).',
        'Photos from the yard side, and the view you want to block.',
      ],
    },
  ],
  faq: {
    items: [
      {
        question: 'How does it attach to my fence?',
        answer: `${EXTENSION_ATTACHMENT} The site review confirms what your fence or wall can carry.`,
      },
      {
        question: 'Can I extend a vinyl fence?',
        answer: VINYL_CAVEAT,
      },
      {
        question: 'How much height can I add?',
        answer:
          'We price a 3 ft extension, which takes a 6 ft fence to 9 ft. Other heights are quoted. Check your HOA and city height limits first.',
      },
      {
        question: 'Will my HOA allow it?',
        answer:
          "We cannot promise approval. Check your HOA's rules and submit product specs and photos with your request.",
      },
      {
        question: 'Does it need watering or trimming?',
        answer: 'No watering and no trimming. Rinse off dust and pollen now and then.',
      },
      {
        question: 'How is the price set?',
        answer: `Fence extensions start ${formatStartingPriceProse(STARTING_PRICES['fence-extension'])} (${STARTING_PRICES['fence-extension'].configuration}) ${INSTALLATION_CAVEAT}. You get a rough quote by email first; the site review sets the final invoice.`,
      },
    ],
  },
  links: {
    related: [PAGES.hedge, PAGES.privacyWall, PAGES.poolPrivacy, PAGES.hoa, PAGES.boxwood],
    guides: [GUIDES.privacyCompared, GUIDES.hoaApproval, GUIDES.diyOrPro],
  },
};

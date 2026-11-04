/**
 * Copy for /pricing. Dollar figures are never typed here: the page and the
 * answers below render the released starting prices through the helpers in
 * src/data/starting-prices.ts.
 */

import {
  FR_STATEMENT,
  HEDGE_TIERS,
  INSTALLATION_CAVEAT,
  STARTING_PRICES,
  formatStartingPriceProse,
} from '../../starting-prices.ts';

/** The card order on the price board: the hedge (both tiers) first, the commercial wall (no price) last. */
export type BoardSystemId = 'hedge' | 'fence-extension' | 'living-wall' | 'privacy-wall' | 'commercial';

export interface BoardCard {
  id: BoardSystemId;
  title: string;
  href: string;
  /** One short line: what it is. */
  line: string;
}

export const PRICING_PAGE = {
  callout: '◦ PRICING',
  title: 'Starting prices for artificial hedges and living walls',
  lede: 'Material starting prices, by the foot or the unit. Installation is quoted after a site review.',
  board: {
    id: 'starting-prices',
    callout: '◦ STARTING PRICES',
    title: 'What each system starts at.',
    cards: [
      { id: 'hedge', title: 'Artificial hedge', href: '/artificial-hedge', line: 'On your fence, or on its own posts.' },
      { id: 'fence-extension', title: 'Fence extension', href: '/fence-extensions', line: 'Raises your fence. Fixed to its face.' },
      { id: 'living-wall', title: 'Living wall', href: '/living-wall', line: 'Foliage on a wall, cut to your size.' },
      { id: 'privacy-wall', title: 'Privacy wall', href: '/privacy-wall', line: 'A freestanding screen on a base.' },
      { id: 'commercial', title: 'Commercial wall', href: '/commercial-wall', line: 'Foliage panels for business facades.' },
    ] satisfies BoardCard[],
    /** The chip under every card (the caveat is the shared constant, verbatim). */
    chips: { installation: INSTALLATION_CAVEAT, fire: 'Fire-rated: upgrade, extra cost' },
    /** The commercial wall has no released price. */
    quoted: 'Quoted after a site review',
  },
  covers: {
    id: 'whats-in-the-price',
    callout: '◦ WHAT IT COVERS',
    title: 'What the starting price covers.',
    inTitle: 'In the starting price',
    in: ['Standard UV-stabilized foliage', 'Panels for your run or area'],
    extraTitle: 'Extra',
    extra: [
      'Installation, after the site review',
      'Fire-rated foliage (NFPA 701)',
      'Anything the site review adds',
    ],
  },
  drivers: {
    id: 'cost-drivers',
    callout: '◦ COST DRIVERS',
    title: 'What changes the number.',
    items: [
      { icon: 'length', title: 'Run length', text: 'Longer runs use more material.' },
      { icon: 'height', title: 'Height', text: 'Taller runs may be priced to your site.' },
      { icon: 'surface', title: 'Mounting surface', text: 'A fence, a wall or posts install differently.' },
      { icon: 'fence', title: 'Fence condition', text: 'Extending vinyl is generally not recommended.' },
      { icon: 'custom', title: 'Custom shapes', text: 'Corners, steps and logos add shop time.' },
      { icon: 'access', title: 'Site access', text: 'Confirmed at the site review.' },
      { icon: 'fire', title: 'Fire-rated foliage', text: 'An upgrade, at extra cost.' },
      { icon: 'commercial', title: 'Commercial needs', text: 'Code and paperwork can change the scope.' },
    ],
  },
  process: {
    id: 'how-a-job-runs',
    callout: '◦ FIVE STEPS',
    title: 'How a job runs.',
    fold: 'The five steps',
  },
  faq: {
    title: 'Pricing questions',
    items: [
      {
        question: 'What does the starting price include?',
        answer:
          'The material: standard UV-stabilized foliage and panels for your run or area. Installation is extra and is quoted after a site review.',
      },
      {
        question: 'Why is installation quoted after a site review?',
        answer:
          'Mounting, access and height change the work. We confirm them on site, and the review sets the final invoice.',
      },
      {
        question: 'What is the difference between a hedge on my fence and a freestanding hedge?',
        answer: `A hedge ${HEDGE_TIERS.hedge.said} is ${HEDGE_TIERS.hedge.build}, ${formatStartingPriceProse(STARTING_PRICES.hedge)}. A freestanding hedge is ${HEDGE_TIERS['hedge-freestanding'].build}, ${formatStartingPriceProse(STARTING_PRICES['hedge-freestanding'])}. Both are material starting prices; installation is quoted after a site review.`,
      },
      {
        question: 'How much does fire-rated foliage cost?',
        answer: FR_STATEMENT,
      },
      {
        question: 'What should I send for a quote?',
        answer:
          'Your run length and height, your city, the surface (fence, wall or mesh), and a wide photo and a close-up. Missing a number? Send what you have.',
      },
    ],
  },
} as const;

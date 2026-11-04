/**
 * /privacy-wall: a new page (there is no old one). Built only from the
 * released price (4 ft x 4 ft with standard base, fully custom sizes), the
 * estimator's privacy wall system (4 ft units, counted run in feet / 4) and the
 * homepage card (freestanding, standard base, patios, pool decks). No wind,
 * noise, fire, timeline or lifespan claims: none is sourced for this system.
 */

import { INSTALLATION_CAVEAT, STARTING_PRICES, formatStartingPriceProse } from '../../starting-prices.ts';
import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const PRIVACY_WALL: SystemPageData = {
  variant: 'system',
  hero: {
    callout: '◦ SYSTEM / PRIVACY WALL',
    title: 'Freestanding Artificial Privacy Walls in Texas',
    lede: 'Hedge units on a base, in 4 ft sections. Screen a patio, a pool deck or an open edge without building a fence first.',
    price: 'privacy-wall',
    image: {
      name: 'system-privacy-wall',
      alt: 'Freestanding boxwood hedge sections along a covered walkway',
    },
    facts: [
      { label: 'Unit', value: '4 ft × 4 ft' },
      { label: 'Base', value: 'Standard base' },
      { label: 'Stands', value: 'Freestanding' },
      { label: 'Sizes', value: 'Custom available' },
    ],
  },
  blocks: [
    {
      kind: 'points',
      id: 'solves',
      callout: '◦ WHAT IT SOLVES',
      title: 'What a privacy wall solves.',
      tone: 'limestone',
      items: [
        {
          title: 'A screen where no fence runs',
          text: 'Units stand on their own base. A patio edge, a pool deck or an open side yard can be screened without building a fence first.',
        },
        {
          title: 'Sized in 4 ft sections',
          text: 'A run is counted in 4 ft units, so you see the layout and the count before you commit. Custom sizes are available.',
        },
        {
          title: 'No watering, no trimming',
          text: 'Nothing to irrigate or clip. Rinse off dust and pollen now and then.',
        },
      ],
    },
    {
      kind: 'estimator',
      system: 'privacy-wall',
      title: 'How long is the screen?',
      body: 'Set the run. We count 4 ft × 4 ft units and draw the layout. The starting price is per standard unit, and installation is quoted after a site review.',
    },
    {
      kind: 'options',
      id: 'where',
      callout: '◦ WHERE IT STANDS',
      title: 'Where a freestanding wall fits.',
      items: [
        { title: 'Patio edge', text: 'Screen a seating area from the yard, the street or the house next door.' },
        { title: 'Pool deck', text: 'Separate the pool from dining, or close off a view from the side.' },
        { title: 'Open side yard', text: 'Close a gap where no fence runs.' },
      ],
    },
    {
      kind: 'options',
      id: 'other-systems',
      callout: '◦ OTHER SYSTEMS',
      title: 'Is a freestanding wall the right one?',
      intro: 'It is for open edges. If something is already standing, another system may fit better.',
      tone: 'limestone',
      items: [
        {
          title: 'Fence extensions',
          text: 'Your fence is there but too short. Add height fixed to the face of it.',
          href: '/fence-extensions',
        },
        {
          title: 'Artificial hedge',
          text: 'You want green along a fence, a wall or a patio edge.',
          href: '/artificial-hedge',
        },
        {
          title: 'Living wall',
          text: 'You have a blank wall to cover.',
          href: '/living-wall',
        },
      ],
    },
    {
      kind: 'process',
      id: 'pricing',
      callout: '◦ HOW PRICING WORKS',
      title: 'Cost factors and how a job runs.',
      intro: 'The starting price is for one standard unit with its base. Custom sizes and installation are quoted after a site review, because placement, ground and access drive them.',
      driversTitle: 'What to send',
      drivers: [
        'Run length, and where the units would stand.',
        'The surface under them: deck, concrete, pavers or turf.',
        'A height above 4 ft, if you want one.',
        'Photos of the space from where you would sit.',
      ],
    },
  ],
  faq: {
    items: [
      {
        question: 'How big is a unit?',
        answer: '4 ft × 4 ft with a standard base. Fully custom sizes are available and quoted.',
      },
      {
        question: 'Does it need a fence or wall behind it?',
        answer:
          'No. Units are freestanding on a base. The site review confirms where they stand and how they sit on your surface.',
      },
      {
        question: 'How is a run counted?',
        answer: 'In 4 ft units: the run in feet divided by 4, rounded up. The estimator shows the arithmetic.',
      },
      {
        question: 'Can it go beside the pool?',
        answer:
          'Yes, as a screen along a pool deck or a patio. Pool areas bring splash and residue, so tell us how close it stands to the water.',
      },
      {
        question: 'Will my HOA allow it?',
        answer:
          "We cannot promise approval. Check your HOA's rules and submit product specs and photos with your request.",
      },
      {
        question: 'How is the price set?',
        answer: `Privacy walls start ${formatStartingPriceProse(STARTING_PRICES['privacy-wall'])} (${STARTING_PRICES['privacy-wall'].configuration}) ${INSTALLATION_CAVEAT}. You get a rough quote by email first; the site review sets the final invoice.`,
      },
    ],
  },
  links: {
    related: [PAGES.fenceExtension, PAGES.hedge, PAGES.poolPrivacy, PAGES.livingWall, PAGES.hoa],
    guides: [GUIDES.privacyCompared, GUIDES.poolPrivacy, GUIDES.hoaApproval],
  },
};

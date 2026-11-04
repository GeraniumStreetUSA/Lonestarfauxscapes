/**
 * /fire-rated-artificial-hedge. NFPA 701 only: what it is and where it comes
 * up are the homepage's fire chapter wording (data/home-content.ts), reused so
 * the two never disagree. Dropped: "self-extinguishes within 2 seconds", the
 * pass criteria list, "Method 2 certified", certificates with every
 * installation, MSDS and inspector support, "required in most Texas
 * occupancies", "worked with fire marshals across Texas", "cost difference is
 * minimal". No other test standard is claimed for our products. Fire-rated
 * foliage is an upgrade at extra cost on every product (owner, 2026-11-04):
 * this page describes the upgrade and when a project needs it, and names no
 * figure for it.
 */

import { FIRE_CHAPTER } from '../../home-content.ts';
import { FR_STATEMENT } from '../../starting-prices.ts';
import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const FIRE_RATED_ARTIFICIAL_HEDGE: SystemPageData = {
  variant: 'usecase',
  hero: {
    callout: '◦ FIRE / NFPA 701',
    title: 'Fire-Rated Artificial Hedges Built for NFPA 701',
    lede: 'Hotels, restaurants and multifamily projects often need greenery with a documented fire rating. The fire-rated hedge option is built for NFPA 701. It is an upgrade at extra cost.',
    price: 'hedge',
    image: {
      name: 'commercial-houston-patio',
      alt: FIRE_CHAPTER.photoAlt,
    },
    facts: [
      { label: 'Fire-rated', value: 'Upgrade, extra cost' },
      { label: 'Applies to', value: 'Hedges, walls' },
      { label: 'Ask for', value: 'Documentation' },
      { label: 'Decides', value: 'Your fire marshal' },
    ],
  },
  blocks: [
    {
      kind: 'points',
      id: 'nfpa-701',
      callout: '◦ NFPA 701',
      title: 'What NFPA 701 is, and what to ask for.',
      items: FIRE_CHAPTER.points.map((point) => ({ title: point.label, text: point.text })),
    },
    {
      kind: 'options',
      id: 'where',
      callout: '◦ WHERE IT COMES UP',
      title: 'Where projects ask for it.',
      intro: 'Not every building needs it. Requirements vary by use, city and code edition, so confirm with your fire marshal.',
      tone: 'limestone',
      columns: 4,
      items: [
        { title: 'Hotels', text: 'Lobbies, corridors, restaurants and pool areas.' },
        { title: 'Multifamily', text: 'Common areas, amenity decks and clubhouses.' },
        { title: 'Retail', text: 'Storefronts, displays and shopping center common areas.' },
        { title: 'Offices and venues', text: 'Lobbies, atriums, conference rooms and event spaces.' },
      ],
    },
  ],
  faq: {
    items: [
      {
        question: 'Is fire-rated foliage standard?',
        answer: `No. ${FR_STATEMENT} No price is published for it, so it is quoted in your rough quote.`,
      },
      {
        question: 'What is NFPA 701?',
        answer: FIRE_CHAPTER.points[0].text,
      },
      {
        question: 'What documentation can I get?',
        answer:
          'Ask for the NFPA 701 documentation for the exact system you choose, before you order. Then take it to your fire marshal early.',
      },
      {
        question: 'Is a fire rating required in Texas?',
        answer:
          'It depends. Many Texas cities adopt the International Fire Code, which points artificial decorative vegetation in many commercial buildings to NFPA 701, documented by the manufacturer. Requirements vary by use, city and code edition, and your fire marshal decides.',
      },
      {
        question: 'Can a home use fire-rated hedges?',
        answer:
          'You can ask for the fire-rated upgrade on any project. It is mostly a commercial requirement, so tell us what your project needs when you ask for the quote, and the rough quote will be for the right material.',
      },
      {
        question: 'Do fire-rated living walls exist?',
        answer:
          'Yes. Fire-rated living wall options are built for NFPA 701 too, as an upgrade at extra cost. Vallum FRX is our fire-rated living wall system.',
      },
    ],
  },
  links: {
    related: [PAGES.hedge, PAGES.vallum, PAGES.commercialWall, PAGES.boxwood, PAGES.livingWall],
    guides: [GUIDES.nfpa, GUIDES.fireCode, GUIDES.fireGuide, GUIDES.firewise],
  },
};

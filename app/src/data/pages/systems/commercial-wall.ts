/**
 * /commercial-wall. Carried over from the old page: the four building types,
 * the two documented Houston jobs, and the fire documentation advice. There is
 * no released price: the wall is quoted after a site review. Dropped: wind
 * ratings and load calculations, stamped drawings, weight per square foot,
 * frame materials, "5-8 year" color retention, warranties, LEED and SDS
 * packages, "meets code", graffiti and foot-traffic claims, logo and
 * signage fabrication, acoustic infill, "Instagram-worthy".
 */

import { FR_STATEMENT } from '../../starting-prices.ts';
import { FIRE_FAQ_ANSWER } from './claims-copy.ts';
import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const COMMERCIAL_WALL: SystemPageData = {
  variant: 'system',
  hero: {
    callout: '◦ SYSTEM / COMMERCIAL WALL',
    title: 'Commercial Artificial Hedge Wall Covering in Texas',
    lede: 'Hedge panels over a facade, a barrier or a patio edge, for restaurants, retail, hotels and multifamily. Standard foliage is UV-stabilized; fire-rated foliage is an upgrade at extra cost.',
    price: 'quoted',
    image: {
      name: 'system-commercial',
      alt: 'Artificial hedge panels on a commercial storefront',
    },
    facts: [
      { label: 'Module', value: 'Per system spec' },
      { label: 'Mount', value: 'Wall or frame' },
      { label: 'Foliage', value: 'UV-stabilized' },
      { label: 'Fire-rated', value: 'Upgrade (NFPA 701)' },
    ],
  },
  blocks: [
    {
      kind: 'points',
      id: 'solves',
      callout: '◦ WHAT IT SOLVES',
      title: 'What a commercial wall solves.',
      tone: 'limestone',
      items: [
        {
          title: 'A bare wall or barrier, covered',
          text: 'Panels mount over what is already there. A Houston storefront kept its concrete barriers and covered them.',
        },
        {
          title: 'An edge that guides people',
          text: 'A hedge line defines a patio and keeps foot traffic out of seating. A Houston restaurant used one for exactly that.',
        },
        {
          title: 'No landscape upkeep',
          text: 'No irrigation, no trimming and no plants to replace along a wall or entry. Rinse off dust now and then.',
        },
        {
          title: 'Fire documentation to ask for',
          text: `${FR_STATEMENT} Then confirm the requirement with your fire marshal.`,
        },
      ],
    },
    {
      kind: 'options',
      id: 'where',
      callout: '◦ WHERE IT GOES',
      title: 'Where commercial walls go.',
      columns: 4,
      items: [
        { title: 'Restaurants and hotels', text: 'Patio edges, poolside walls and exterior dining areas.' },
        { title: 'Multifamily', text: 'Amenity areas, common-area walls and garage facades.' },
        { title: 'Retail', text: 'Storefronts, shopping center common areas and parking structures.' },
        { title: 'Offices', text: 'Building exteriors, courtyards and outdoor areas for staff.' },
      ],
    },
    {
      kind: 'process',
      id: 'pricing',
      callout: '◦ HOW QUOTING WORKS',
      title: 'How a commercial wall is quoted.',
      intro: 'There is no starting price for a commercial wall. Size, mounting, access and any fire documentation vary too much, so it is quoted after a site review.',
      tone: 'limestone',
      driversTitle: 'What to send',
      drivers: [
        'Wall or run size, with a few photos.',
        'City, and what the building is: restaurant, hotel, multifamily, retail or office.',
        'Whether the wall needs fire-rated foliage (an upgrade at extra cost).',
        'Who signs off: owner, property manager or fire marshal.',
      ],
    },
    {
      kind: 'projects',
      id: 'projects',
      callout: '◦ TEXAS JOBS',
      title: 'Commercial hedge work in Houston.',
      slugs: ['houston-restaurant-hedges', 'houston-storefront-hedges'],
    },
  ],
  faq: {
    items: [
      {
        question: 'Is it fire-rated?',
        answer: FIRE_FAQ_ANSWER,
      },
      {
        question: 'Does it handle Texas sun?',
        answer:
          'Standard foliage is UV-stabilized for outdoor sun. Indoor-grade foliage is not, and it can fade faster outside. Match the rating to the wall exposure.',
      },
      {
        question: 'How is it mounted?',
        answer:
          'Panels fasten to your wall or to a freestanding frame. On the Houston storefront job, custom mounting plates were drilled into the existing concrete barriers.',
      },
      {
        question: 'What does it cost?',
        answer:
          'A commercial wall is quoted after a site review. Send the size, the city and photos, and we email an assessment and a rough quote first.',
      },
      {
        question: 'What will my fire marshal want?',
        answer:
          'Requirements vary by building use, city and code edition, and your fire marshal decides. Ask us for the NFPA 701 documentation for your system and take it to them early.',
      },
    ],
  },
  links: {
    related: [
      { title: 'Commercial projects', href: '/commercial', text: 'Restaurants, retail, hotels and multifamily.' },
      PAGES.fireRated,
      PAGES.vallum,
      PAGES.hedge,
      PAGES.livingWall,
    ],
    guides: [GUIDES.fireGuide, GUIDES.hospitality, GUIDES.multifamilyRoi],
  },
};

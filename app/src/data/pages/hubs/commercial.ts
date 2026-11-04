import { CASE_CARDS } from '../../case-studies.ts';
import { FIRE_CHAPTER, PROCESS } from '../../home-content.ts';
import { FR_STATEMENT } from '../../starting-prices.ts';
import type { HubData } from './types.ts';

/** /commercial: businesses. Ends in the quote form. */
export const COMMERCIAL_HUB: HubData = {
  callout: '◦ FOR BUSINESSES',
  title: 'Commercial artificial green walls for Texas properties',
  lede: 'Hedges and living walls for restaurants, retail, hotels and multifamily. Fire-rated foliage (NFPA 701) is an upgrade at extra cost. Commercial walls are quoted after a site review.',
  hero: {
    name: 'commercial-houston-patio',
    alt: FIRE_CHAPTER.photoAlt,
  },
  sections: [
    {
      kind: 'options',
      id: 'systems',
      callout: '◦ COMMERCIAL SYSTEMS',
      title: 'Commercial greenery systems.',
      intro: 'Pick the system, then send the site. Each one is built to your dimensions.',
      columns: 4,
      items: [
        {
          title: 'Commercial wall covering',
          text: 'Hedge cladding for storefronts, facades and walls. Quoted after a site review.',
          href: '/commercial-wall',
          image: { name: 'system-commercial', alt: 'Artificial hedge panels on a commercial storefront' },
        },
        {
          title: 'Hedge screens and extensions',
          text: 'Screens along a perimeter or a patio edge, or height added to the face of an existing fence.',
          href: '/artificial-hedge',
          image: { name: 'system-hedge', alt: 'Artificial boxwood hedge panels on a fence line' },
        },
        {
          title: 'Living walls',
          text: 'Greenery for lobbies, amenity spaces and feature walls.',
          href: '/living-wall',
          image: { name: 'system-living-wall', alt: 'Artificial living wall on a wall' },
        },
        {
          title: 'Vallum FRX',
          text: 'The fire-rated living wall system built for NFPA 701, an upgrade at extra cost.',
          href: '/vallum-frx',
        },
      ],
    },
    {
      kind: 'points',
      id: 'fire',
      callout: '◦ FIRE CODE',
      title: 'Fire and code documentation.',
      intro: 'Restaurants, retail and multifamily projects often need greenery with a documented fire rating.',
      tone: 'ink',
      items: FIRE_CHAPTER.points.map((point) => ({ title: point.label, text: point.text })),
      links: [
        { title: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge', text: 'The fire-rated upgrade, built for NFPA 701.' },
        { title: 'NFPA 701, explained', href: '/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery', text: 'The test, and what it covers.' },
        {
          title: 'Texas fire code for commercial buildings',
          href: '/blog/texas-fire-code-requirements-for-artificial-plants-in-commercial-buildings',
          text: 'Where decorative greenery comes up.',
        },
      ],
    },
    {
      kind: 'cards',
      id: 'work',
      callout: '◦ COMMERCIAL WORK IN HOUSTON',
      title: 'Two Houston jobs.',
      intro: 'A restaurant patio and a storefront, both mounted to concrete.',
      items: CASE_CARDS.filter((card) => card.city === 'Houston').map((card) => ({
        title: card.title,
        href: card.path,
        callout: `${card.city} / Commercial`,
        text: card.problemSolved,
        image: { name: card.image, alt: card.alt },
        linkLabel: 'See the job',
      })),
      more: { label: 'All case studies', href: '/case-studies' },
      compact: true,
    },
    {
      kind: 'points',
      id: 'process',
      fold: 'How a job runs, in 5 steps',
      callout: '◦ HOW A JOB RUNS',
      title: 'How a commercial job runs.',
      tone: 'limestone',
      items: PROCESS.steps.map((step) => ({ title: step.title, text: step.body })),
    },
    {
      kind: 'links',
      id: 'resources',
      callout: '◦ FOR SPEC TEAMS',
      title: 'Commercial resources.',
      columns: 2,
      items: [
        { title: 'Commercial resource hub', href: '/commercial-resources', text: 'What to send, what each buyer asks, how fire documentation works.' },
        { title: 'Commercial walls', href: '/commercial-wall', text: 'Facades and storefronts, quoted after a site review.' },
        { title: 'Pricing', href: '/pricing', text: 'How commercial pricing is built.' },
        { title: 'Installation', href: '/installation', text: 'What an install involves.' },
      ],
    },
    {
      kind: 'faq',
      id: 'faq',
      title: 'Commercial questions.',
      items: [
        {
          question: 'What fire documentation can I get?',
          answer: `${FR_STATEMENT} Ask for the NFPA 701 documentation for the exact system you choose, while you are getting your quote.`,
        },
        {
          question: 'Interior or exterior?',
          answer:
            'Both are possible. Outdoor walls need UV-stabilized foliage (our standard), because indoor-grade foliage can fade faster in sun. Tell us where the wall goes and we match the rating to the exposure.',
        },
        {
          question: 'How is a commercial job priced?',
          answer:
            'Commercial walls are quoted after a site review. Send your dimensions, city and photos, and we email an assessment and a rough quote. The site review sets the final invoice.',
        },
        {
          question: 'What upkeep does it need?',
          answer: 'No watering and no trimming. Rinse off dust and pollen now and then.',
        },
        {
          question: 'Can it mount to concrete?',
          answer:
            'Yes. Both Houston jobs above use custom mounting plates drilled into concrete. The site review confirms the mounting for your wall.',
        },
      ],
    },
    {
      kind: 'areas',
      id: 'areas',
      callout: '◦ WHERE WE INSTALL',
      title: 'Serving five Texas metros.',
    },
  ],
  close: { kind: 'form' },
};

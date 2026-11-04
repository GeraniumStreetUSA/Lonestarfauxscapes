import { CASE_CARDS } from '../../case-studies.ts';
import type { HubData } from './types.ts';

/** /case-studies: the three Texas jobs, then links to systems and cities. */
export const CASE_STUDIES_HUB: HubData = {
  callout: '◦ CASE STUDIES',
  title: 'Case studies from real Texas installs',
  lede: 'Three Texas jobs: the problem, the scope and the finished result, before you ask for a quote.',
  sections: [
    {
      kind: 'cards',
      id: 'jobs',
      callout: '◦ HOUSTON AND AUSTIN',
      title: 'Three Texas jobs.',
      items: CASE_CARDS.map((card) => ({
        title: card.title,
        href: card.path,
        callout: `${card.city} / ${card.slug.startsWith('austin') ? 'Residential' : 'Commercial'}`,
        text: card.problemSolved,
        image: { name: card.image, alt: card.alt },
        linkLabel: 'Read the case study',
      })),
    },
    {
      kind: 'links',
      id: 'systems',
      callout: '◦ SERVICE PAGES',
      title: 'Explore service pages.',
      tone: 'limestone',
      columns: 2,
      items: [
        { title: 'Artificial hedges', href: '/artificial-hedge', text: 'Boxwood hedge panels for fences, screens and facades.' },
        { title: 'Living walls', href: '/living-wall', text: 'Greenery for a wall, with no irrigation.' },
        { title: 'Residential', href: '/residential', text: 'Hedges, fence extensions and living walls for homes.' },
        { title: 'Commercial', href: '/commercial', text: 'Hedges and living walls for businesses.' },
        { title: 'Pricing', href: '/pricing', text: 'Starting prices, and what changes the cost.' },
        { title: 'Gallery', href: '/gallery', text: 'Every photo from these three jobs.' },
      ],
    },
    {
      kind: 'links',
      id: 'cities',
      callout: '◦ CITY PAGES',
      title: 'Browse city pages.',
      columns: 2,
      items: [
        { title: 'Houston', href: '/houston', text: 'A restaurant patio and a storefront.' },
        { title: 'Austin', href: '/austin', text: 'A privacy wall on a 16 ft screen.' },
        { title: 'All locations', href: '/locations', text: 'Dallas, Fort Worth, San Antonio and more.' },
      ],
    },
  ],
  close: { kind: 'band' },
};

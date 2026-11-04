import { FR_STATEMENT } from '../../starting-prices.ts';
import type { HubData } from './types.ts';

/** /products: the five systems with their released prices, then the job-specific pages. */
export const PRODUCTS_HUB: HubData = {
  callout: '◦ SYSTEMS',
  title: 'Artificial hedge and living wall products for Texas',
  lede: 'Five systems, each built to your measurements. Pick one below, or send your numbers and we suggest the right one in your assessment.',
  sections: [
    {
      kind: 'systems',
      id: 'lineup',
      callout: '◦ PRODUCT LINEUP',
      title: 'Product lineup.',
      intro: 'Starting prices are for the material. Installation is quoted after a site review.',
      ids: ['hedge', 'living-wall', 'fence-extension', 'commercial', 'privacy-wall'],
    },
    {
      kind: 'links',
      id: 'uses',
      callout: '◦ BUILT FOR A JOB',
      title: 'The same systems, set up for one job.',
      tone: 'limestone',
      columns: 2,
      items: [
        { title: 'Artificial boxwood hedge', href: '/artificial-boxwood-hedge', text: 'Boxwood panels for patios, events and permanent installs.' },
        { title: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge', text: 'The fire-rated upgrade, built for NFPA 701. Extra cost.' },
        { title: 'HOA-friendly hedges', href: '/hoa-approved-artificial-hedge', text: 'The specs and photos your HOA request needs.' },
        { title: 'Pool privacy hedge', href: '/pool-privacy-hedge', text: 'Screening beside the pool, with no watering.' },
        { title: 'Pool living wall', href: '/pool-living-wall', text: 'Greenery for a pool-area wall.' },
        { title: 'Vallum FRX', href: '/vallum-frx', text: 'The fire-rated living wall system, an upgrade at extra cost.' },
      ],
    },
    {
      kind: 'prose',
      id: 'fire',
      callout: '◦ PERMITTING AND FIRE',
      title: 'Fire-rated options and documentation.',
      paragraphs: [
        `${FR_STATEMENT} NFPA 701 is the flame test fire marshals ask for on decorative greenery. Ask for the documentation for the exact system you choose, before you order.`,
        'Match the foliage to how much sun the wall gets: indoor-grade foliage can fade faster outside.',
      ],
      links: [
        { label: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge' },
        { label: 'NFPA 701, explained', href: '/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery' },
      ],
    },
    {
      kind: 'areas',
      id: 'areas',
      callout: '◦ WHERE WE INSTALL',
      title: 'Serving five Texas metros.',
    },
  ],
  close: { kind: 'band' },
};

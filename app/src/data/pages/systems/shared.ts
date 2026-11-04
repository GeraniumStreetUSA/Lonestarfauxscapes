/**
 * Links and wording the system and use-case pages share, so a sibling is
 * described the same way wherever it is listed. Every path is a slashless
 * route of the site; every blog slug exists in src/generated/posts/index.ts.
 */

import type { PageLink } from './types.ts';

/** The five metros, in the order the footer lists them. */
export const METROS: readonly PageLink[] = [
  { title: 'Dallas', href: '/dallas' },
  { title: 'Fort Worth', href: '/fort-worth' },
  { title: 'Houston', href: '/houston' },
  { title: 'Austin', href: '/austin' },
  { title: 'San Antonio', href: '/san-antonio' },
];

/** Systems and use cases, keyed by path, each with the line a link row shows. */
export const PAGES = {
  hedge: { title: 'Artificial hedge', href: '/artificial-hedge', text: 'Panels for a fence line, a wall or a patio edge.' },
  livingWall: { title: 'Living wall', href: '/living-wall', text: 'Mixed foliage for a blank wall, in 40 in panels.' },
  fenceExtension: { title: 'Fence extensions', href: '/fence-extensions', text: 'Add height to the fence you already have.' },
  commercialWall: { title: 'Commercial wall', href: '/commercial-wall', text: 'Facades and storefronts, quoted after a site review.' },
  privacyWall: { title: 'Privacy wall', href: '/privacy-wall', text: 'Freestanding 4 ft units on a base.' },
  boxwood: { title: 'Boxwood hedge', href: '/artificial-boxwood-hedge', text: 'The classic clipped look, fixed or on casters.' },
  fireRated: { title: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge', text: 'The fire-rated upgrade, built for NFPA 701.' },
  hoa: { title: 'Hedges for HOA requests', href: '/hoa-approved-artificial-hedge', text: 'Specs and photos for your HOA submission.' },
  poolPrivacy: { title: 'Pool privacy hedge', href: '/pool-privacy-hedge', text: 'Screen the pool from the second floor next door.' },
  poolLivingWall: { title: 'Pool living wall', href: '/pool-living-wall', text: 'Greenery behind the pool, nothing to water.' },
  vallum: { title: 'Vallum FRX', href: '/vallum-frx', text: 'The fire-rated living wall system, an upgrade.' },
} as const satisfies Record<string, PageLink>;

/** Blog posts, keyed by topic, with a short line on what each covers. */
export const GUIDES = {
  hedgeGuide: {
    title: 'The complete guide to artificial hedges in Texas',
    href: '/blog/the-complete-guide-to-artificial-hedges-in-texas',
    text: 'Materials, sizes, mounting and what to ask.',
  },
  hedgeCare: {
    title: 'Artificial hedge maintenance and care',
    href: '/blog/artificial-hedge-maintenance-and-care-for-texas-homeowners',
    text: 'What cleaning a hedge actually takes.',
  },
  hedgeHeat: {
    title: 'How artificial hedges hold up in Texas heat',
    href: '/blog/how-long-do-artificial-hedges-last-in-texas-heat',
    text: 'Sun, UV ratings and placement.',
  },
  diyOrPro: {
    title: 'DIY vs professional hedge installation',
    href: '/blog/diy-vs-professional-artificial-hedge-installation',
    text: 'What the job involves before you decide.',
  },
  boxwoodVsReal: {
    title: 'Artificial vs real boxwood in Texas',
    href: '/blog/artificial-vs-real-boxwood-texas',
    text: 'Water, upkeep and long-term value.',
  },
  privacyCompared: {
    title: 'Backyard privacy compared: fences, hedges, walls',
    href: '/blog/texas-backyard-privacy-solutions-compared-fences-hedges-walls',
    text: 'Which option fits which yard.',
  },
  poolPrivacy: {
    title: 'Pool privacy solutions for Texas backyards',
    href: '/blog/pool-privacy-solutions-artificial-hedges-for-texas-backyards',
    text: 'Sightlines, heights and what to measure.',
  },
  hoaApproval: {
    title: 'How to get HOA approval for artificial hedges',
    href: '/blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas',
    text: 'The steps, in order.',
  },
  hoaLaw: {
    title: 'Texas Property Code 202.007 and artificial hedges',
    href: '/blog/texas-property-code-202-007-artificial-hedges-and-hoa-rules',
    text: 'What the statute covers and what it does not.',
  },
  wallGuide: {
    title: 'The complete guide to artificial living walls in Texas',
    href: '/blog/the-complete-guide-to-artificial-living-walls-in-texas',
    text: 'Mats, mounting, sun and care.',
  },
  wallIndoorOutdoor: {
    title: 'Indoor vs outdoor artificial living walls',
    href: '/blog/indoor-vs-outdoor-artificial-living-walls-materials-and-design',
    text: 'Why the rating has to match the exposure.',
  },
  wallRealVsArtificial: {
    title: 'Real vs artificial living walls in Texas',
    href: '/blog/real-vs-artificial-living-walls-in-texas-an-honest-comparison',
    text: 'An honest comparison.',
  },
  wallSummer: {
    title: 'Artificial living walls in Texas summers',
    href: '/blog/artificial-living-walls-for-the-texas-summers',
    text: 'What holds up in full sun.',
  },
  nfpa: {
    title: 'NFPA 701, explained',
    href: '/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery',
    text: 'The fire standards behind decorative greenery.',
  },
  fireCode: {
    title: 'Texas fire code for artificial plants in commercial buildings',
    href: '/blog/texas-fire-code-requirements-for-artificial-plants-in-commercial-buildings',
    text: 'Where the requirement comes from.',
  },
  fireGuide: {
    title: 'Fire-rated artificial greenery for Texas commercial properties',
    href: '/blog/fire-rated-artificial-greenery-for-texas-commercial-properties',
    text: 'The complete guide.',
  },
  firewise: {
    title: 'Firewise artificial hedges for multifamily properties',
    href: '/blog/firewise-artificial-hedges-for-multi-family-units',
    text: 'What property managers should look for.',
  },
  hospitality: {
    title: 'Hotel and hospitality artificial greenery',
    href: '/blog/hotel-and-hospitality-artificial-greenery-design-meets-compliance',
    text: 'Design and compliance together.',
  },
  restaurants: {
    title: 'Artificial green walls for Texas restaurants and bars',
    href: '/blog/artificial-green-walls-for-texas-restaurants-and-bars',
    text: 'Patios, dining rooms and storefronts.',
  },
  multifamilyRoi: {
    title: 'Artificial greenery ROI for multifamily managers',
    href: '/blog/artificial-greenery-roi-for-multifamily-property-managers',
    text: 'Upkeep, water and replacement compared.',
  },
  balcony: {
    title: 'Apartment balcony privacy and fire-safe hedges',
    href: '/blog/apartment-balcony-privacy-fire-safe-artificial-hedge-solutions',
    text: 'What balconies ask of a hedge.',
  },
} as const satisfies Record<string, PageLink>;

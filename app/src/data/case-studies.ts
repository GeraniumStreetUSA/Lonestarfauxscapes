/**
 * The three Texas installs on the homepage. Title, city, problemSolved and
 * path are copied verbatim from ../content/case-studies.json (the site's
 * case-study source); tests/case-studies.test.ts fails if they drift.
 */

export interface CaseCard {
  slug: string;
  title: string;
  city: string;
  problemSolved: string;
  path: string;
  image: string;
  alt: string;
}

export const CASE_CARDS: readonly CaseCard[] = [
  {
    slug: 'austin-high-end-residential-privacy',
    title: 'Austin Residential Privacy Wall on an Existing 16-Foot Screen',
    city: 'Austin',
    problemSolved:
      'Replaced a high-maintenance live screen with immediate privacy on a 16-foot-tall structure facing a neighboring remodel.',
    path: '/case-studies/austin-high-end-residential-privacy',
    image: 'case-austin-privacy-wall',
    alt: 'Tall artificial boxwood privacy wall behind live oaks in an Austin backyard',
  },
  {
    slug: 'houston-restaurant-hedges',
    title: 'Houston Restaurant Patio Hedge Barriers for Seating and Traffic Flow',
    city: 'Houston',
    problemSolved: 'Defined the patio edge and reduced people cutting through guest seating.',
    path: '/case-studies/houston-restaurant-hedges',
    image: 'case-houston-restaurant',
    alt: 'Artificial boxwood hedge barriers along a Houston restaurant patio',
  },
  {
    slug: 'houston-storefront-hedges',
    title: 'Houston Storefront Hedge Screening Over Existing Concrete Barriers',
    city: 'Houston',
    problemSolved:
      'Improved the storefront presentation while keeping the original concrete barriers in place.',
    path: '/case-studies/houston-storefront-hedges',
    image: 'case-houston-storefront',
    alt: 'Artificial hedge panels covering a concrete barrier outside a Houston storefront',
  },
];

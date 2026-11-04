import type { Crumb, Route } from '../routes.ts';

const HOME: Crumb = { label: 'Home', href: '/' };
const CASE_STUDIES: Crumb = { label: 'Case Studies', href: '/case-studies' };

/**
 * One route per case study (`/case-studies/<slug>`). Written by hand: the
 * title and description are the live pages' own (case-studies/<slug>.html),
 * the path and breadcrumb label match src/data/projects.ts. Each page is its
 * own chunk (`src/pages/routes/case-study-<slug>.tsx`).
 */
export const CASE_STUDY_ROUTES: readonly Route[] = [
  {
    path: '/case-studies/austin-high-end-residential-privacy',
    type: 'project',
    title: 'Austin Residential Privacy Wall Case Study | Lone Star Faux Scapes',
    description:
      'See how a large Austin privacy screen was converted from failing live plants to a maintenance-light artificial greenery wall.',
    robots: 'index',
    sitemap: true,
    breadcrumbs: [HOME, CASE_STUDIES, { label: 'Austin privacy wall', href: '/case-studies/austin-high-end-residential-privacy' }],
    hasQuoteForm: true,
    load: () => import('../pages/routes/case-study-austin-high-end-residential-privacy'),
  },
  {
    path: '/case-studies/houston-restaurant-hedges',
    type: 'project',
    title: 'Houston Restaurant Patio Hedge Barrier Case Study | Lone Star Faux Scapes',
    description:
      'See how a Houston restaurant used mounted artificial hedge barriers to define patio seating and improve foot-traffic control.',
    robots: 'index',
    sitemap: true,
    breadcrumbs: [HOME, CASE_STUDIES, { label: 'Houston restaurant patio', href: '/case-studies/houston-restaurant-hedges' }],
    hasQuoteForm: true,
    load: () => import('../pages/routes/case-study-houston-restaurant-hedges'),
  },
  {
    path: '/case-studies/houston-storefront-hedges',
    type: 'project',
    title: 'Houston Storefront Hedge Screening Case Study | Lone Star Faux Scapes',
    description:
      'See how existing concrete barriers at a Houston storefront were upgraded with UV-stabilized artificial hedge panels.',
    robots: 'index',
    sitemap: true,
    breadcrumbs: [HOME, CASE_STUDIES, { label: 'Houston storefront', href: '/case-studies/houston-storefront-hedges' }],
    hasQuoteForm: true,
    load: () => import('../pages/routes/case-study-houston-storefront-hedges'),
  },
];

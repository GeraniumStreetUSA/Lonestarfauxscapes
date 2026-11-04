import type { ComponentType } from 'react';

import { SEO } from './data/home-content.ts';
import { buildFaqNode } from './data/home-schema.ts';
import { BLOG_ROUTES } from './generated/blog-routes.ts';
import { CASE_STUDY_ROUTES } from './generated/case-study-routes.ts';

/**
 * Every page on the site, in one list. It drives the page that renders for a
 * URL, the prerender (one HTML file per route), sitemap.xml, robots.txt,
 * llms.txt and the route tests. Paths are the live site's, slashless.
 */

export type RouteType = 'home' | 'system' | 'usecase' | 'hub' | 'metro' | 'post' | 'project' | 'utility';

export interface Crumb {
  label: string;
  href: string;
}

/** What every page component receives. */
export interface PageProps {
  route: Route;
}

export interface Route {
  /** Slashless, e.g. `/dallas` or `/blog/<slug>`; `/` is the homepage. */
  path: string;
  type: RouteType;
  /** The full <title>, brand suffix included. */
  title: string;
  description: string;
  robots: 'index' | 'noindex';
  /** In sitemap.xml: true only for indexable pages. */
  sitemap: boolean;
  /** The trail to this page, Home first and this page last. Empty for none. */
  breadcrumbs: readonly Crumb[];
  /** The page carries the `#quote` form, so the chrome's quote buttons scroll to it. */
  hasQuoteForm: boolean;
  /** The page component, loaded on demand (one chunk per template). */
  load: () => Promise<{ default: ComponentType<PageProps> }>;
  /** Extra JSON-LD nodes for this page, added to the shared @graph. */
  schema?: () => object[];
}

const HOME: Crumb = { label: 'Home', href: '/' };
const PRODUCTS: Crumb = { label: 'Products', href: '/products' };
const COMMERCIAL: Crumb = { label: 'Commercial', href: '/commercial' };
const LOCATIONS: Crumb = { label: 'Locations', href: '/locations' };

const placeholder = () => import('./pages/PlaceholderPage');

/**
 * One module per page (`src/pages/routes/<slug>.tsx`), so each page is its own
 * chunk. A page still being built exports the placeholder.
 */
const PAGE_MODULES: Record<string, Route['load']> = {
  '/artificial-hedge': () => import('./pages/routes/artificial-hedge'),
  '/living-wall': () => import('./pages/routes/living-wall'),
  '/fence-extensions': () => import('./pages/routes/fence-extensions'),
  '/commercial-wall': () => import('./pages/routes/commercial-wall'),
  '/privacy-wall': () => import('./pages/routes/privacy-wall'),
  '/artificial-boxwood-hedge': () => import('./pages/routes/artificial-boxwood-hedge'),
  '/fire-rated-artificial-hedge': () => import('./pages/routes/fire-rated-artificial-hedge'),
  '/hoa-approved-artificial-hedge': () => import('./pages/routes/hoa-approved-artificial-hedge'),
  '/pool-privacy-hedge': () => import('./pages/routes/pool-privacy-hedge'),
  '/pool-living-wall': () => import('./pages/routes/pool-living-wall'),
  '/vallum-frx': () => import('./pages/routes/vallum-frx'),
  '/products': () => import('./pages/routes/products'),
  '/residential': () => import('./pages/routes/residential'),
  '/commercial': () => import('./pages/routes/commercial'),
  '/commercial-resources': () => import('./pages/routes/commercial-resources'),
  '/locations': () => import('./pages/routes/locations'),
  '/guides': () => import('./pages/routes/guides'),
  '/blog': () => import('./pages/routes/blog'),
  '/case-studies': () => import('./pages/routes/case-studies'),
  '/gallery': () => import('./pages/routes/gallery'),
  '/dallas': () => import('./pages/routes/dallas'),
  '/fort-worth': () => import('./pages/routes/fort-worth'),
  '/houston': () => import('./pages/routes/houston'),
  '/austin': () => import('./pages/routes/austin'),
  '/san-antonio': () => import('./pages/routes/san-antonio'),
  '/plano': () => import('./pages/routes/plano'),
  '/frisco': () => import('./pages/routes/frisco'),
  '/irving': () => import('./pages/routes/irving'),
  '/arlington': () => import('./pages/routes/arlington'),
  '/sugar-land': () => import('./pages/routes/sugar-land'),
  '/the-woodlands': () => import('./pages/routes/the-woodlands'),
  '/contact': () => import('./pages/routes/contact'),
  '/pricing': () => import('./pages/routes/pricing'),
  '/installation': () => import('./pages/routes/installation'),
  '/privacy': () => import('./pages/routes/privacy'),
  '/terms': () => import('./pages/routes/terms'),
  '/sitemap': () => import('./pages/routes/sitemap'),
  '/hedge-builder-residential': () => import('./pages/routes/hedge-builder-residential'),
  '/hedge-builder-commercial': () => import('./pages/routes/hedge-builder-commercial'),
  '/404': () => import('./pages/routes/404'),
};



/**
 * A page that still renders the placeholder. Replace `load` as each real
 * template lands. `label` (this page's name in the trail) and `parent` build
 * the breadcrumbs; leave both out for none.
 */
function page(
  path: string,
  type: RouteType,
  title: string,
  description: string,
  opts: { label?: string; parent?: Crumb; robots?: Route['robots']; quote?: boolean } = {},
): Route {
  const robots = opts.robots ?? 'index';
  return {
    path,
    type,
    title,
    description,
    robots,
    sitemap: robots === 'index',
    breadcrumbs: opts.label ? [HOME, ...(opts.parent ? [opts.parent] : []), { label: opts.label, href: path }] : [],
    // System, use-case and metro pages end in the quote form; other pages opt in.
    hasQuoteForm: opts.quote ?? ['system', 'usecase', 'metro'].includes(type),
    load: PAGE_MODULES[path] ?? placeholder,
  };
}

/*
 * Titles and descriptions are the live pages' own (tuned against Search
 * Console), copied from the root HTML files; only em-dashes were replaced.
 * The suburb pages are `noindex`, as live. The Frisco description spells
 * its dollar sign as an escape: dollar figures live in starting-prices.ts.
 * 2026-11-04: descriptions that made claims the site cannot back up (tested,
 * turnkey, acoustic, timelines, old example prices) were trimmed to match
 * the rebuilt pages; keywords kept.
 */
export const STATIC_ROUTES: readonly Route[] = [
  {
    path: '/',
    type: 'home',
    title: SEO.title,
    description: SEO.description,
    robots: 'index',
    sitemap: true,
    breadcrumbs: [],
    hasQuoteForm: true,
    load: () => import('./pages/HomePage'),
    schema: () => [buildFaqNode()],
  },
  // SYSTEMS
  page('/artificial-hedge', 'system',
    'Artificial Hedge Installation in Texas | Lone Star Faux Scapes',
    'Custom artificial hedge installation in Texas for fences, facades, and privacy screens. Compare boxwood, mixed foliage, and fire-rated options.',
    { label: 'Artificial Hedge Installation', parent: PRODUCTS }),
  page('/living-wall', 'system',
    'Artificial Living Wall Installation in Texas | Lone Star Faux Scapes',
    'Custom artificial living walls for Texas homes and commercial spaces. UV-rated and fire-rated options available; no irrigation system required.',
    { label: 'Artificial Living Wall', parent: PRODUCTS }),
  page('/fence-extensions', 'system',
    'Patio Privacy Ideas: Artificial Fence Extensions | Lone Star',
    'Need patio privacy ideas that work immediately? Add no-maintenance artificial hedge panels to your existing fence for instant screening. Get a free quote.',
    { label: 'Fence Extensions', parent: PRODUCTS }),
  page('/commercial-wall', 'system',
    'Commercial Wall Covering: Artificial Hedge Facades in Texas',
    'Artificial hedge panels for Texas commercial walls. Fire-rated, UV-stabilized options for hotels, retail & multifamily facades. Get a quote.',
    { label: 'Commercial Wall Covering', parent: PRODUCTS }),
  page('/privacy-wall', 'system',
    'Freestanding Artificial Privacy Walls in Texas | Lone Star',
    'Freestanding artificial privacy walls for Texas patios, pools and yards. Sized to your space and set on a base. Send your dimensions for a free quote.',
    { label: 'Freestanding Privacy Wall', parent: PRODUCTS }),
  // USE-CASE PAGES
  page('/artificial-boxwood-hedge', 'usecase',
    'Artificial Boxwood Hedges in Texas | Lone Star Faux Scapes',
    'Custom artificial boxwood hedge panels for Texas events, patios & permanent installs. UV-stable, mobile or fixed builds. Free quotes.',
    { label: 'Artificial Boxwood Hedge', parent: PRODUCTS }),
  page('/fire-rated-artificial-hedge', 'usecase',
    'Fire-Rated Artificial Hedges Built for NFPA 701 in Texas',
    'Fire-rated artificial hedges built for NFPA 701, for Texas hotels, multifamily and mixed-use projects. Ask for the documentation for your exact system.',
    { label: 'Fire-Rated Artificial Hedge', parent: PRODUCTS }),
  page('/hoa-approved-artificial-hedge', 'usecase',
    'HOA-Approved Artificial Hedges Texas | Lone Star',
    'HOA-friendly artificial hedge installation in Texas, with the specs and photos your HOA request needs, for fence toppers and privacy screens.',
    { label: 'HOA-Approved Artificial Hedge', parent: PRODUCTS }),
  page('/pool-privacy-hedge', 'usecase',
    'Pool Privacy Hedges in Texas | Lone Star Faux Scapes',
    'Instant pool privacy with UV-stabilized artificial hedges. No leaves in the pool, no watering, custom sizing for any Texas backyard. Get a free quote.',
    { label: 'Pool Privacy Hedge', parent: PRODUCTS }),
  page('/pool-living-wall', 'usecase',
    'Pool Living Walls: Backyard Oasis Without the Maintenance',
    'Resort-style artificial living walls for Texas pool areas. No irrigation, debris, or upkeep, lush greenery year-round. Free quotes.',
    { label: 'Pool Living Wall', parent: PRODUCTS }),
  page('/vallum-frx', 'usecase',
    'Vallum FRX Fire-Rated Living Wall | NFPA 701',
    'Vallum FRX: a fire-rated living wall system built for NFPA 701, with UV-stable foliage. Commercial and residential installs across Texas.',
    { label: 'Vallum FRX', parent: PRODUCTS }),
  // HUBS
  page('/products', 'hub',
    'Artificial Hedge & Living Wall Products',
    'Browse artificial hedge, living wall, and privacy solutions for Texas projects. Fire-rated and UV-stabilized product options.',
    { label: 'Products' }),
  page('/residential', 'hub',
    'Residential Artificial Hedges: Backyard Privacy in Texas',
    'Artificial privacy hedges, fence extensions, and living walls for Texas homes. HOA-friendly, no watering, no trimming. Custom fit to your yard. Free quotes.',
    { label: 'Residential', quote: true }),
  page('/commercial', 'hub',
    'Commercial Artificial Green Walls: Hotels, Retail & Multifamily',
    'Fire-rated artificial hedges & living walls for Texas hotels, restaurants, retail & multifamily. Installed for you, no watering. Commercial quote.',
    { label: 'Commercial', quote: true }),
  page('/commercial-resources', 'hub',
    'Commercial Resource Hub for Architects, Designers, GCs, and Property Teams',
    'Commercial resource hub for Texas architects, GCs & property teams: artificial hedges, living walls, branded feature walls & privacy screens.',
    { label: 'Commercial Resources', parent: COMMERCIAL }),
  page('/locations', 'hub',
    'Texas Locations | Lone Star Faux Scapes',
    'Lone Star Faux Scapes serves all major Texas cities with artificial hedge installation, faux living walls, and privacy systems. Find your city.',
    { label: 'Locations' }),
  page('/guides', 'hub',
    'Texas Guides | Lone Star Faux Scapes',
    'High-intent guides for artificial hedges, living walls, installation planning, fire documentation, HOA approval, and pricing across Texas.',
    { label: 'Guides' }),
  page('/blog', 'hub',
    'Texas Blog | Lone Star Faux Scapes',
    'Knowledge blog with general articles, planning notes, local updates, comparisons, and inspiration for artificial hedges and living walls across Texas.',
    { label: 'Blog' }),
  page('/case-studies', 'hub',
    'Case Studies | Lone Star Faux Scapes',
    'Real Lone Star Faux Scapes installs across Texas. See the problem solved, the scope, and the finished result before you request pricing.',
    { label: 'Case Studies' }),
  page('/gallery', 'hub',
    'Artificial Hedge & Living Wall Project Gallery | Lone Star',
    'Browse Texas artificial hedge, living wall, fence extension, and commercial greenery project photos from Lone Star Faux Scapes.',
    { label: 'Gallery' }),
  // METRO PAGES
  page('/dallas', 'metro',
    'Dallas Artificial Hedge Installation & Faux Living Walls',
    'Artificial hedge, privacy screen, and faux living wall installation in Dallas for patios, retail, hospitality, and estate projects. Send dimensions for pricing.',
    { label: 'Dallas', parent: LOCATIONS }),
  page('/fort-worth', 'metro',
    'Fort Worth Artificial Hedge Installation & Faux Living Walls',
    'Artificial hedge, privacy screen, and faux living wall installation in Fort Worth for patios, commercial spaces, and homes. Send dimensions for pricing.',
    { label: 'Fort Worth', parent: LOCATIONS }),
  page('/houston', 'metro',
    'Houston Artificial Hedges & Living Walls | Lone Star',
    'Houston artificial hedges & living walls built for humidity. Fire-rated options, HOA-friendly, no watering. Free quotes for patios and commercial.',
    { label: 'Houston', parent: LOCATIONS }),
  page('/austin', 'metro',
    'Austin Artificial Hedges & Living Walls: No Water Needed',
    'Artificial hedge & living wall installation in Austin, TX. UV-stable, fire-rated, HOA-friendly. Beat the heat without watering. Free quote.',
    { label: 'Austin', parent: LOCATIONS }),
  page('/san-antonio', 'metro',
    'San Antonio Artificial Hedges & Living Walls',
    'San Antonio artificial hedge & living wall installation. Fire-rated, UV-stable, zero upkeep. Free quotes for pools, patios & hospitality.',
    { label: 'San Antonio', parent: LOCATIONS }),
  // SUBURB PAGES
  page('/plano', 'metro',
    'Plano Artificial Hedges: Custom Privacy & Green Walls',
    'Custom artificial hedge installation in Plano, TX: privacy screens for homes, corporate campuses, and retail facades. Free estimates.',
    { label: 'Plano', parent: LOCATIONS, robots: 'noindex' }),
  page('/frisco', 'metro',
    'Frisco Artificial Hedges: Premium Privacy Installations',
    'Custom artificial hedge installation in Frisco, TX, for homes and businesses. Fire-rated options and HOA-friendly designs. Free quotes.',
    { label: 'Frisco', parent: LOCATIONS, robots: 'noindex' }),
  page('/irving', 'metro',
    'Irving Artificial Hedges: Business & Residential Privacy',
    'Custom artificial hedge installation in Irving, TX: privacy screens and feature walls for businesses, mixed-use properties, and homes. Free estimates.',
    { label: 'Irving', parent: LOCATIONS, robots: 'noindex' }),
  page('/arlington', 'metro',
    'Arlington Artificial Hedges & Living Walls: Custom Installs',
    'Artificial hedge and living wall installation in Arlington, TX, for homes, commercial properties, and venues. Custom built. Free quotes.',
    { label: 'Arlington', parent: LOCATIONS, robots: 'noindex' }),
  page('/sugar-land', 'metro',
    'Sugar Land Artificial Hedges: Privacy for Luxury Communities',
    'Custom artificial hedge installation in Sugar Land, TX, for master-planned communities, businesses, and homes. HOA-friendly, no watering. Free quotes.',
    { label: 'Sugar Land', parent: LOCATIONS, robots: 'noindex' }),
  page('/the-woodlands', 'metro',
    'The Woodlands Artificial Hedges: Built for Your Community',
    'Custom artificial hedge installation in The Woodlands, TX, for master-planned communities, businesses, and homes. No watering. Free quotes.',
    { label: 'The Woodlands', parent: LOCATIONS, robots: 'noindex' }),
  // UTILITY
  page('/contact', 'utility',
    'Contact Us | Lone Star Faux Scapes',
    'Contact Lone Star Faux Scapes for artificial hedges & living walls across Texas. Free quotes in Dallas, Fort Worth, Houston, Austin and San Antonio.',
    { label: 'Contact', quote: true }),
  page('/pricing', 'utility',
    'Artificial Hedge & Living Wall Pricing Texas | Lone Star',
    'Starting prices for artificial hedges, living walls, fence extensions and privacy walls in Texas, plus what changes the cost on custom projects.',
    { label: 'Pricing', quote: true }),
  page('/installation', 'utility',
    'Artificial Hedge Installation Across Texas: Turnkey & Custom',
    'Artificial hedge & living wall installation across Texas: custom fabrication, fire-rated options, and a clear five-step process. Free quote.',
    { label: 'Installation' }),
  page('/privacy', 'utility',
    'Privacy Policy | Lone Star Faux Scapes',
    'Privacy Policy for Lone Star Faux Scapes. Learn how we collect, use, and protect your personal information.',
    { label: 'Privacy Policy', robots: 'noindex' }),
  page('/terms', 'utility',
    'Terms of Service | Lone Star Faux Scapes',
    'Terms of Service for Lone Star Faux Scapes. Read our terms and conditions for using our website and services.',
    { label: 'Terms of Service', robots: 'noindex' }),
  page('/sitemap', 'utility',
    'Lone Star Faux Scapes HTML Sitemap',
    'Find Lone Star Faux Scapes service pages, Texas location pages, project galleries, case studies, blog guides, pricing, and contact pages.',
    { label: 'Sitemap', robots: 'noindex' }),
  page('/hedge-builder-residential', 'utility',
    'Residential Hedge Builder | Lone Star Faux Scapes',
    'Build a custom residential artificial hedge: choose dimensions, materials, base options & casters. Installed across Texas. Free quote.',
    { label: 'Residential Hedge Builder', robots: 'noindex' }),
  page('/hedge-builder-commercial', 'utility',
    'Commercial Hedge Builder | Lone Star Faux Scapes',
    'Build a custom commercial artificial hedge: dimensions, materials, base specs & casters. Installed across Texas by Lone Star Faux Scapes.',
    { label: 'Commercial Hedge Builder', robots: 'noindex' }),
  page('/404', 'utility',
    'Page Not Found | Lone Star Faux Scapes',
    'That page does not exist. Browse our artificial hedges and living walls, or contact us for a free quote.',
    { robots: 'noindex' }),
];

/**
 * The component kit's review page (`/__kit`). Added only in dev: the build
 * replaces `import.meta.env.DEV` with false and drops this, so the prerender,
 * the sitemap and the route tests never see it. Optional chaining because
 * `node --test` has no `import.meta.env`.
 */
const KIT_ROUTES: readonly Route[] = import.meta.env?.DEV
  ? [
      {
        path: '/__kit',
        type: 'utility',
        title: 'Page kit | Lone Star Faux Scapes',
        description: 'Every shared page component with sample content (development only).',
        robots: 'noindex',
        sitemap: false,
        breadcrumbs: [HOME, PRODUCTS, { label: 'Page kit', href: '/__kit' }],
        // KitPage renders the QuoteSection, so the chrome's quote buttons scroll to #quote.
        hasQuoteForm: true,
        load: () => import('./pages/KitPage'),
      },
    ]
  : [];

/**
 * The static routes plus the generated ones (blog posts, case studies). A
 * path listed twice would prerender over itself, so that fails loudly.
 */
export function allRoutes(): Route[] {
  const routes = [...STATIC_ROUTES, ...KIT_ROUTES, ...BLOG_ROUTES, ...CASE_STUDY_ROUTES];
  const seen = new Set<string>();
  for (const route of routes) {
    if (seen.has(route.path)) throw new Error(`Duplicate route path: ${route.path}`);
    seen.add(route.path);
  }
  return routes;
}

const ROUTES = allRoutes();

/** The route for a URL path, or undefined. A trailing slash is ignored. */
export function findRoute(pathname: string): Route | undefined {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return ROUTES.find((route) => route.path === path);
}

/** Like `findRoute`, but an unknown path gets the 404 page. */
export function resolveRoute(pathname: string): Route {
  const route = findRoute(pathname) ?? findRoute('/404');
  if (!route) throw new Error('Missing /404 route');
  return route;
}

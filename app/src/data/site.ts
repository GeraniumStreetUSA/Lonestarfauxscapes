/**
 * Who the business is, and where its links go. Only confirmed facts: no
 * street address, licence, hours, ratings or project counts
 * (OWNER-NEEDS.md defaults).
 */

export const SITE_URL = 'https://lonestarfauxscapes.com';

export const BUSINESS = {
  name: 'Lone Star Faux Scapes',
  phoneDisplay: '(760) 978-7335',
  phoneHref: 'tel:+17609787335',
  phoneSchema: '+1-760-978-7335',
  email: 'info@lonestarfauxscapes.com',
  emailHref: 'mailto:info@lonestarfauxscapes.com',
  parent: {
    name: 'Geranium Street USA',
    url: 'https://geraniumstreet.com',
  },
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const HEADER_NAV: readonly NavLink[] = [
  { label: 'Systems', href: '/products' },
  { label: 'Projects', href: '/case-studies' },
  { label: 'Areas', href: '/locations' },
  { label: 'Guides', href: '/guides' },
];

/** The phone menu sheet: the header's links plus the two most asked-for pages. */
export const MENU_LINKS: readonly NavLink[] = [
  ...HEADER_NAV,
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export const SYSTEM_LINKS: readonly NavLink[] = [
  { label: 'Artificial hedges', href: '/artificial-hedge' },
  { label: 'Living walls', href: '/living-wall' },
  { label: 'Fence extensions', href: '/fence-extensions' },
  { label: 'Commercial walls', href: '/commercial-wall' },
  { label: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge' },
  { label: 'Pool privacy', href: '/pool-privacy-hedge' },
];

export const AREA_LINKS: readonly NavLink[] = [
  { label: 'Dallas', href: '/dallas' },
  { label: 'Fort Worth', href: '/fort-worth' },
  { label: 'Houston', href: '/houston' },
  { label: 'Austin', href: '/austin' },
  { label: 'San Antonio', href: '/san-antonio' },
];

export const COMPANY_LINKS: readonly NavLink[] = [
  { label: 'Projects', href: '/case-studies' },
  { label: 'Guides', href: '/guides' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

import { FAQ, SEO } from './home-content.ts';
import { AREA_LINKS, BUSINESS, SITE_URL } from './site.ts';

export const BUSINESS_ID = `${SITE_URL}/#business`;

/**
 * The one HomeAndConstructionBusiness node every page's JSON-LD points at.
 * Only confirmed facts: no street address, licence, opening hours or
 * ratings.
 */
export function buildBusinessNode() {
  return {
    '@type': 'HomeAndConstructionBusiness',
    '@id': BUSINESS_ID,
    name: BUSINESS.name,
    url: SEO.canonical,
    telephone: BUSINESS.phoneSchema,
    email: BUSINESS.email,
    parentOrganization: {
      '@type': 'Organization',
      name: BUSINESS.parent.name,
      url: BUSINESS.parent.url,
    },
    areaServed: [
      ...AREA_LINKS.map((area) => ({
        '@type': 'City',
        name: area.label,
        containedInPlace: { '@type': 'State', name: 'Texas' },
      })),
      { '@type': 'State', name: 'Texas' },
    ],
  };
}

/** The homepage FAQPage, built from the same array the page shows. */
export function buildFaqNode() {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQ.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

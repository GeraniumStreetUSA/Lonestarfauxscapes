import { Helmet } from 'react-helmet-async';

import { FAQ, SEO } from '../data/home-content';
import { AREA_LINKS, BUSINESS, SITE_URL } from '../data/site';

const BUSINESS_ID = `${SITE_URL}/#business`;

/**
 * JSON-LD for the homepage. One HomeAndConstructionBusiness node with only
 * confirmed facts: no street address, licence, opening hours or ratings. The
 * FAQPage is built from the same array the page shows.
 */
export function buildHomeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SEO.canonical,
        name: BUSINESS.name,
        inLanguage: 'en-US',
        publisher: { '@id': BUSINESS_ID },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SEO.canonical,
        name: SEO.title,
        description: SEO.description,
        inLanguage: 'en-US',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': BUSINESS_ID },
      },
      {
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
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: FAQ.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };
}

/**
 * Head tags through react-helmet-async (on React 19 it hands title, meta and
 * link to React, which hoists them into <head>), plus the JSON-LD as a plain
 * script in the page: structured data is valid anywhere in the document, and
 * rendering it directly keeps it in the prerendered HTML exactly once.
 * `noindex` until the rebuild goes live.
 */
export default function HomeSeo() {
  const graph = JSON.stringify(buildHomeGraph()).replace(/</g, '\\u003c');
  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={SEO.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={BUSINESS.name} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content={SEO.title} />
        <meta property="og:description" content={SEO.description} />
        <meta property="og:url" content={SEO.canonical} />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph }} />
    </>
  );
}

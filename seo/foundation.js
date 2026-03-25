import path from 'path';

export const SITE_URL = (process.env.SITE_URL || 'https://lonestarfauxscapes.com').replace(/\/+$/, '');
export const BRAND_NAME = 'Lone Star Faux Scapes';
export const DEFAULT_SOCIAL_IMAGE = '/images/hero/hero-main-1200w.jpg';
export const DEFAULT_LOGO_IMAGE = '/favicon/apple-touch-icon.png';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BUSINESS_ID = `${SITE_URL}/#business`;

const BUSINESS_DETAILS = Object.freeze({
  telephone: '(760) 978-7335',
  openingHours: 'Mo-Fr 08:00-16:00',
  priceRange: '$$',
  address: Object.freeze({
    '@type': 'PostalAddress',
    streetAddress: '21933 Briarcliff Dr',
    addressLocality: 'Spicewood',
    addressRegion: 'TX',
    postalCode: '78669',
    addressCountry: 'US',
  }),
});

const CORE_CITY_ROUTE_LABELS = Object.freeze({
  '/austin': 'Austin',
  '/dallas': 'Dallas',
  '/fort-worth': 'Fort Worth',
  '/houston': 'Houston',
  '/san-antonio': 'San Antonio',
});

const SUPPORT_CITY_ROUTE_LABELS = Object.freeze({
  '/arlington': 'Arlington',
  '/frisco': 'Frisco',
  '/irving': 'Irving',
  '/plano': 'Plano',
  '/sugar-land': 'Sugar Land',
  '/the-woodlands': 'The Woodlands',
});

const SERVICE_ROUTE_DEFINITIONS = Object.freeze({
  '/artificial-boxwood-hedge': {
    label: 'Artificial Boxwood Hedge',
    serviceName: 'Artificial Boxwood Hedge Installation',
    parent: { name: 'Products', item: '/products' },
  },
  '/artificial-hedge': {
    label: 'Artificial Hedge',
    serviceName: 'Artificial Hedge Installation',
    parent: { name: 'Products', item: '/products' },
  },
  '/commercial-wall': {
    label: 'Commercial Wall',
    serviceName: 'Commercial Artificial Wall Installation',
    parent: { name: 'Products', item: '/products' },
  },
  '/commercial': {
    label: 'Commercial',
    serviceName: 'Commercial Artificial Greenery Installation',
  },
  '/fence-extensions': {
    label: 'Fence Extensions',
    serviceName: 'Artificial Fence Extension Installation',
    parent: { name: 'Products', item: '/products' },
  },
  '/fire-rated-artificial-hedge': {
    label: 'Fire-Rated Artificial Hedge',
    serviceName: 'Fire-Rated Artificial Hedge Installation',
    parent: { name: 'Products', item: '/products' },
  },
  '/hoa-approved-artificial-hedge': {
    label: 'HOA-Approved Artificial Hedge',
    serviceName: 'HOA-Friendly Artificial Hedge Installation',
    parent: { name: 'Products', item: '/products' },
  },
  '/installation': {
    label: 'Installation',
    serviceName: 'Artificial Greenery Installation',
  },
  '/living-wall': {
    label: 'Artificial Living Wall',
    serviceName: 'Artificial Living Wall Installation',
    parent: { name: 'Products', item: '/products' },
  },
  '/pool-living-wall': {
    label: 'Pool Living Wall',
    serviceName: 'Poolside Artificial Living Wall Installation',
    parent: { name: 'Products', item: '/products' },
  },
  '/pool-privacy-hedge': {
    label: 'Pool Privacy Hedge',
    serviceName: 'Pool Privacy Hedge Installation',
    parent: { name: 'Products', item: '/products' },
  },
  '/residential': {
    label: 'Residential',
    serviceName: 'Residential Artificial Greenery Installation',
  },
  '/vallum-frx': {
    label: 'Vallum FRX',
    serviceName: 'Vallum FRX Installation',
    parent: { name: 'Products', item: '/products' },
  },
});

const COLLECTION_ROUTE_DEFINITIONS = Object.freeze({
  '/gallery': { label: 'Gallery', schemaType: 'CollectionPage' },
  '/locations': { label: 'Locations', schemaType: 'CollectionPage' },
  '/products': { label: 'Products', schemaType: 'CollectionPage' },
});

const DIRECT_PAGE_DEFINITIONS = Object.freeze({
  '/contact': { kind: 'contact', label: 'Contact', includeInSitemap: true },
  '/pricing': { kind: 'page', label: 'Pricing', includeInSitemap: true },
});

const UTILITY_ROUTE_DEFINITIONS = Object.freeze({
  '/404': { label: '404', robots: 'noindex, nofollow', includeInSitemap: false },
  '/admin': { label: 'Admin', robots: 'noindex, nofollow', includeInSitemap: false },
  '/admin/': { label: 'Admin', robots: 'noindex, nofollow', includeInSitemap: false },
  '/hedge-builder-commercial': {
    label: 'Commercial Hedge Builder',
    robots: 'noindex, follow',
    includeInSitemap: false,
  },
  '/hedge-builder-residential': {
    label: 'Residential Hedge Builder',
    robots: 'noindex, follow',
    includeInSitemap: false,
  },
  '/privacy': { label: 'Privacy Policy', robots: 'noindex, follow', includeInSitemap: false },
  '/sitemap': { label: 'HTML Sitemap', robots: 'noindex, follow', includeInSitemap: false },
  '/terms': { label: 'Terms of Service', robots: 'noindex, follow', includeInSitemap: false },
});

export function normalizeRoutePath(routePath) {
  const raw = String(routePath || '').trim() || '/';
  const [pathname] = raw.split(/[?#]/, 1);
  const normalized = pathname.replace(/\\/g, '/');

  if (!normalized || normalized === '/index') return '/';
  if (normalized === '/admin') return '/admin/';
  if (normalized === 'admin' || normalized === 'admin/') return '/admin/';

  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')) {
    return withLeadingSlash.replace(/\/+$/, '');
  }

  return withLeadingSlash;
}

export function buildCanonicalUrl(routePath) {
  const normalized = normalizeRoutePath(routePath);
  return normalized === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalized}`;
}

function normalizeRobotsTokens(value) {
  const tokens = String(value || '')
    .split(',')
    .map(part => part.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(tokens)];
}

export function resolveRobotsDirective(value, options = {}) {
  const { noindex = false, fallback = 'index, follow' } = options;
  const tokens = normalizeRobotsTokens(value);

  if (tokens.length === 0) {
    return noindex ? 'noindex, follow' : fallback;
  }

  if (noindex && !tokens.includes('noindex')) {
    tokens.unshift('noindex');
  }

  if (!tokens.includes('index') && !tokens.includes('noindex')) {
    tokens.unshift(noindex ? 'noindex' : 'index');
  }

  if (!tokens.includes('follow') && !tokens.includes('nofollow')) {
    tokens.push(noindex ? 'follow' : 'follow');
  }

  return tokens.join(', ');
}

export function resolveCanonicalValue(value, fallbackPath = '/') {
  const raw = String(value || '').trim();
  if (!raw) return buildCanonicalUrl(fallbackPath);

  try {
    const resolved = new URL(raw, `${SITE_URL}/`);
    resolved.hash = '';

    if (resolved.origin === new URL(SITE_URL).origin) {
      return buildCanonicalUrl(resolved.pathname);
    }

    return resolved.toString();
  } catch {
    return buildCanonicalUrl(fallbackPath);
  }
}

export function toAbsoluteUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return `${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('//')) return `https:${raw}`;
  const normalized = raw.startsWith('/') ? raw : `/${raw}`;
  return `${SITE_URL}${normalized}`;
}

export function isNoindexDirective(value) {
  return normalizeRobotsTokens(value).includes('noindex');
}

export function routeFromFilename(filename, cwd = process.cwd()) {
  const relative = path.relative(cwd, filename).replace(/\\/g, '/');
  if (relative === 'index.html') return '/';
  if (relative === 'admin/index.html') return '/admin/';
  if (!relative.endsWith('.html')) return '/';
  return normalizeRoutePath(relative.replace(/\.html$/, ''));
}

export function getRouteSeoConfig(routePath) {
  const route = normalizeRoutePath(routePath);

  if (UTILITY_ROUTE_DEFINITIONS[route]) {
    return {
      kind: 'utility',
      label: UTILITY_ROUTE_DEFINITIONS[route].label,
      robots: UTILITY_ROUTE_DEFINITIONS[route].robots,
      includeInSitemap: UTILITY_ROUTE_DEFINITIONS[route].includeInSitemap,
    };
  }

  if (route === '/') {
    return {
      kind: 'home',
      label: 'Home',
      includeInSitemap: true,
    };
  }

  if (route.startsWith('/blog/')) {
    return {
      kind: 'blogPost',
      label: null,
      includeInSitemap: true,
    };
  }

  if (route.startsWith('/case-studies/')) {
    return {
      kind: 'caseStudyDetail',
      label: null,
      includeInSitemap: true,
    };
  }

  if (route === '/blog') {
    return {
      kind: 'blogIndex',
      label: 'Blog',
      includeInSitemap: true,
    };
  }

  if (route === '/case-studies') {
    return {
      kind: 'caseStudyIndex',
      label: 'Case Studies',
      includeInSitemap: true,
    };
  }

  if (CORE_CITY_ROUTE_LABELS[route]) {
    return {
      kind: 'city',
      label: CORE_CITY_ROUTE_LABELS[route],
      serviceName: `Artificial Hedges and Living Walls in ${CORE_CITY_ROUTE_LABELS[route]}`,
      includeInSitemap: true,
    };
  }

  if (SUPPORT_CITY_ROUTE_LABELS[route]) {
    return {
      kind: 'city',
      label: SUPPORT_CITY_ROUTE_LABELS[route],
      serviceName: `Artificial Hedges and Living Walls in ${SUPPORT_CITY_ROUTE_LABELS[route]}`,
      includeInSitemap: false,
      robots: 'noindex, follow',
      isSupportArea: true,
    };
  }

  if (SERVICE_ROUTE_DEFINITIONS[route]) {
    return {
      kind: 'service',
      includeInSitemap: true,
      ...SERVICE_ROUTE_DEFINITIONS[route],
    };
  }

  if (DIRECT_PAGE_DEFINITIONS[route]) {
    return {
      ...DIRECT_PAGE_DEFINITIONS[route],
    };
  }

  if (COLLECTION_ROUTE_DEFINITIONS[route]) {
    return {
      kind: 'collection',
      includeInSitemap: true,
      ...COLLECTION_ROUTE_DEFINITIONS[route],
    };
  }

  return {
    kind: 'page',
    label: null,
    includeInSitemap: true,
  };
}

export function shouldIncludeStaticRouteInSitemap(routePath) {
  const config = getRouteSeoConfig(routePath);
  return config.includeInSitemap !== false && !isNoindexDirective(config.robots);
}

export function shouldIncludeGeneratedRouteInSitemap(routePath, options = {}) {
  const route = normalizeRoutePath(routePath);
  const canonical = resolveCanonicalValue(options.canonical, route);
  const robots = resolveRobotsDirective(options.robots, { noindex: options.noindex === true });

  if (isNoindexDirective(robots)) return false;
  return canonical === buildCanonicalUrl(route);
}

export function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));
}

export function stripHtml(value) {
  return decodeHtmlEntities(String(value || '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function extractTagContent(html, regex) {
  const match = html.match(regex);
  return match ? stripHtml(match[1]) : '';
}

function parseTagAttributes(tag) {
  const attributes = {};
  const attributeRegex = /([^\s"'=<>\/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let match;

  while ((match = attributeRegex.exec(tag)) !== null) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    attributes[name.toLowerCase()] = doubleQuoted ?? singleQuoted ?? unquoted ?? '';
  }

  return attributes;
}

export function extractTitle(html) {
  return extractTagContent(html, /<title>([\s\S]*?)<\/title>/i);
}

export function extractMetaContent(html, attribute, value) {
  const regex = /<meta\b[^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const attributes = parseTagAttributes(match[0]);
    if (String(attributes[attribute.toLowerCase()] || '').toLowerCase() !== value.toLowerCase()) {
      continue;
    }

    return stripHtml(attributes.content || '');
  }

  return '';
}

export function extractCanonicalHref(html) {
  const regex = /<link\b[^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const attributes = parseTagAttributes(match[0]);
    if (String(attributes.rel || '').toLowerCase() !== 'canonical') continue;
    return stripHtml(attributes.href || '');
  }

  return '';
}

export function extractFirstHeading(html) {
  return extractTagContent(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
}

export function extractFirstImage(html) {
  const regex = /<img\b[^>]*>/gi;
  const match = regex.exec(html);
  if (!match) return '';

  const attributes = parseTagAttributes(match[0]);
  return String(attributes.src || '').trim();
}

export function extractFirstParagraph(html) {
  return extractTagContent(html, /<p\b[^>]*>([\s\S]*?)<\/p>/i);
}

export function extractJsonLdObjects(html) {
  const blocks = [];
  const regex = /<script\b[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const raw = match[1].trim();
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      flattenJsonLd(parsed).forEach(item => blocks.push(item));
    } catch {
      continue;
    }
  }

  return blocks;
}

function flattenJsonLd(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (Array.isArray(value['@graph'])) return value['@graph'].flatMap(flattenJsonLd);
  if (typeof value === 'object') return [value];
  return [];
}

export function extractFaqItems(html, existingSchemas = []) {
  const fromSchema = existingSchemas.find(schema => schema['@type'] === 'FAQPage');
  if (fromSchema && Array.isArray(fromSchema.mainEntity) && fromSchema.mainEntity.length > 0) {
    return fromSchema.mainEntity
      .map(item => ({
        question: stripHtml(item?.name),
        answer: stripHtml(item?.acceptedAnswer?.text),
      }))
      .filter(item => item.question && item.answer);
  }

  const items = [];
  const regex = /<details\b[^>]*>([\s\S]*?)<\/details>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const detailsHtml = match[1];
    const summaryMatch = detailsHtml.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i);
    if (!summaryMatch) continue;

    const question = stripHtml(summaryMatch[1]);
    const answer = stripHtml(detailsHtml.replace(summaryMatch[0], ''));
    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items;
}

function findSchemaByType(existingSchemas, types) {
  return existingSchemas.find(schema => {
    const type = schema?.['@type'];
    if (Array.isArray(type)) return type.some(item => types.includes(item));
    return types.includes(type);
  });
}

function buildAreaServed(cityName) {
  if (!cityName) {
    return [{ '@type': 'State', name: 'Texas' }];
  }

  return [
    { '@type': 'State', name: 'Texas' },
    { '@type': 'City', name: cityName },
  ];
}

function buildBreadcrumbs(routePath, routeConfig, fallbackTitle) {
  const route = normalizeRoutePath(routePath);
  const label = routeConfig.label || fallbackTitle || stripBrandSuffix(fallbackTitle);
  const home = [{ name: 'Home', item: buildCanonicalUrl('/') }];

  if (route === '/') return [];
  if (routeConfig.kind === 'blogPost') {
    return [
      ...home,
      { name: 'Blog', item: buildCanonicalUrl('/blog') },
      { name: label || fallbackTitle, item: buildCanonicalUrl(route) },
    ];
  }

  if (routeConfig.kind === 'caseStudyDetail') {
    return [
      ...home,
      { name: 'Case Studies', item: buildCanonicalUrl('/case-studies') },
      { name: label || fallbackTitle, item: buildCanonicalUrl(route) },
    ];
  }

  if (routeConfig.kind === 'city') {
    return [
      ...home,
      { name: 'Locations', item: buildCanonicalUrl('/locations') },
      { name: label, item: buildCanonicalUrl(route) },
    ];
  }

  if (routeConfig.parent) {
    return [
      ...home,
      {
        name: routeConfig.parent.name,
        item: buildCanonicalUrl(routeConfig.parent.item),
      },
      { name: label || fallbackTitle, item: buildCanonicalUrl(route) },
    ];
  }

  return [...home, { name: label || fallbackTitle, item: buildCanonicalUrl(route) }];
}

function stripBrandSuffix(title) {
  return String(title || '').replace(/\s+\|\s+Lone Star Faux Scapes$/i, '').trim();
}

function pickExistingDate(existingSchema, key) {
  const value = existingSchema?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function compactObject(value) {
  if (Array.isArray(value)) {
    return value.map(compactObject).filter(item => item !== undefined && item !== null && item !== '');
  }

  if (!value || typeof value !== 'object') return value;

  const entries = Object.entries(value)
    .map(([key, entryValue]) => [key, compactObject(entryValue)])
    .filter(([, entryValue]) => {
      if (Array.isArray(entryValue)) return entryValue.length > 0;
      return entryValue !== undefined && entryValue !== null && entryValue !== '';
    });

  return Object.fromEntries(entries);
}

function buildOrganizationSchema() {
  return compactObject({
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: BRAND_NAME,
    url: SITE_URL,
    telephone: BUSINESS_DETAILS.telephone,
    logo: {
      '@type': 'ImageObject',
      url: toAbsoluteUrl(DEFAULT_LOGO_IMAGE),
    },
    image: toAbsoluteUrl(DEFAULT_SOCIAL_IMAGE),
    address: BUSINESS_DETAILS.address,
    areaServed: buildAreaServed(),
  });
}

function buildBusinessSchema(routePath, image, cityName) {
  return compactObject({
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${buildCanonicalUrl(routePath)}#business`,
    name: BRAND_NAME,
    url: buildCanonicalUrl(routePath),
    image,
    telephone: BUSINESS_DETAILS.telephone,
    openingHours: BUSINESS_DETAILS.openingHours,
    priceRange: BUSINESS_DETAILS.priceRange,
    address: BUSINESS_DETAILS.address,
    areaServed: buildAreaServed(cityName),
    parentOrganization: { '@id': ORGANIZATION_ID },
  });
}

function buildWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: BRAND_NAME,
    url: `${SITE_URL}/`,
    inLanguage: 'en-US',
    publisher: { '@id': ORGANIZATION_ID },
  };
}

function buildServiceSchema(routePath, title, description, serviceName, cityName, providerId) {
  return compactObject({
    '@type': 'Service',
    '@id': `${buildCanonicalUrl(routePath)}#service`,
    name: serviceName || stripBrandSuffix(title),
    serviceType: serviceName || stripBrandSuffix(title),
    description,
    url: buildCanonicalUrl(routePath),
    provider: { '@id': providerId || `${buildCanonicalUrl(routePath)}#business` },
    areaServed: buildAreaServed(cityName),
  });
}

function buildWebPageSchema(routePath, title, description, schemaType = 'WebPage') {
  return compactObject({
    '@type': schemaType,
    '@id': `${buildCanonicalUrl(routePath)}#webpage`,
    url: buildCanonicalUrl(routePath),
    name: title,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  });
}

function buildBreadcrumbListSchema(routePath, breadcrumbs) {
  if (!Array.isArray(breadcrumbs) || breadcrumbs.length < 2) return null;

  return {
    '@type': 'BreadcrumbList',
    '@id': `${buildCanonicalUrl(routePath)}#breadcrumb`,
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function buildFaqSchema(routePath, faqItems) {
  if (!Array.isArray(faqItems) || faqItems.length === 0) return null;

  return {
    '@type': 'FAQPage',
    '@id': `${buildCanonicalUrl(routePath)}#faq`,
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function buildBlogPostingSchema(routePath, title, description, image, existingSchema) {
  return compactObject({
    '@type': 'BlogPosting',
    '@id': `${buildCanonicalUrl(routePath)}#article`,
    headline: stripBrandSuffix(title),
    description,
    image: [image],
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@id': `${buildCanonicalUrl(routePath)}#webpage` },
    datePublished: pickExistingDate(existingSchema, 'datePublished'),
    dateModified:
      pickExistingDate(existingSchema, 'dateModified') || pickExistingDate(existingSchema, 'datePublished'),
    articleSection: stripHtml(existingSchema?.articleSection),
    keywords: existingSchema?.keywords,
  });
}

function buildArticleSchema(routePath, title, description, image, existingSchema) {
  return compactObject({
    '@type': 'Article',
    '@id': `${buildCanonicalUrl(routePath)}#article`,
    headline: stripBrandSuffix(title),
    description,
    image: [image],
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@id': `${buildCanonicalUrl(routePath)}#webpage` },
    datePublished: pickExistingDate(existingSchema, 'datePublished'),
    dateModified:
      pickExistingDate(existingSchema, 'dateModified') || pickExistingDate(existingSchema, 'datePublished'),
  });
}

function buildPageGraph(routePath, title, description, image, routeConfig, existingSchemas, faqItems) {
  const graph = [];
  const breadcrumbs = buildBreadcrumbs(routePath, routeConfig, stripBrandSuffix(title));
  const breadcrumbSchema = buildBreadcrumbListSchema(routePath, breadcrumbs);
  const faqSchema = buildFaqSchema(routePath, faqItems);
  const articleSchema = findSchemaByType(existingSchemas, ['BlogPosting', 'Article']);
  const cityName = routeConfig.kind === 'city' ? routeConfig.label : undefined;

  if (routeConfig.kind === 'utility') {
    return {
      breadcrumbs,
      graph: compactObject([
        buildWebPageSchema(routePath, title, description),
      ]),
    };
  }

  graph.push(buildOrganizationSchema());

  if (routeConfig.kind === 'home') {
    graph.push(buildWebsiteSchema());
    graph.push(buildWebPageSchema(routePath, title, description));
    graph.push(buildBusinessSchema(routePath, image));
    graph.push(
      buildServiceSchema(
        '/artificial-hedge',
        'Artificial Hedge Installation',
        description,
        'Artificial Hedge Installation',
        undefined,
        BUSINESS_ID,
      ),
    );
    graph.push(
      buildServiceSchema(
        '/living-wall',
        'Artificial Living Wall Installation',
        description,
        'Artificial Living Wall Installation',
        undefined,
        BUSINESS_ID,
      ),
    );
  } else if (routeConfig.kind === 'contact') {
    graph.push(buildBusinessSchema(routePath, image));
    graph.push(buildWebPageSchema(routePath, title, description, 'ContactPage'));
  } else if (routeConfig.kind === 'service') {
    graph.push(buildBusinessSchema(routePath, image));
    graph.push(buildServiceSchema(routePath, title, description, routeConfig.serviceName));
    graph.push(buildWebPageSchema(routePath, title, description));
  } else if (routeConfig.kind === 'city') {
    graph.push(buildBusinessSchema(routePath, image, cityName));
    graph.push(buildServiceSchema(routePath, title, description, routeConfig.serviceName, cityName));
    graph.push(buildWebPageSchema(routePath, title, description));
  } else if (routeConfig.kind === 'blogIndex') {
    graph.push(buildWebPageSchema(routePath, title, description, 'Blog'));
  } else if (routeConfig.kind === 'blogPost') {
    graph.push(buildWebPageSchema(routePath, title, description));
    graph.push(buildBlogPostingSchema(routePath, title, description, image, articleSchema));
  } else if (routeConfig.kind === 'caseStudyIndex') {
    graph.push(buildWebPageSchema(routePath, title, description, 'CollectionPage'));
  } else if (routeConfig.kind === 'caseStudyDetail') {
    graph.push(buildWebPageSchema(routePath, title, description));
    graph.push(buildArticleSchema(routePath, title, description, image, articleSchema));
  } else if (routeConfig.kind === 'collection') {
    graph.push(buildWebPageSchema(routePath, title, description, routeConfig.schemaType || 'CollectionPage'));
  } else {
    graph.push(buildWebPageSchema(routePath, title, description));
  }

  if (breadcrumbSchema) graph.push(breadcrumbSchema);
  if (faqSchema) graph.push(faqSchema);

  return {
    breadcrumbs,
    graph: compactObject(graph),
  };
}

function buildRobotsDirective(routePath, routeConfig, extractedRobots) {
  if (routeConfig.robots) return routeConfig.robots;
  return resolveRobotsDirective(extractedRobots, {
    fallback: normalizeRoutePath(routePath) === '/' ? 'index, follow' : 'index, follow',
  });
}

export function collectSeoPageData(routePath, html) {
  const route = normalizeRoutePath(routePath);
  const routeConfig = getRouteSeoConfig(route);
  const existingSchemas = extractJsonLdObjects(html);
  const title = extractTitle(html) || routeConfig.label || BRAND_NAME;
  const description =
    extractMetaContent(html, 'name', 'description') ||
    extractMetaContent(html, 'property', 'og:description') ||
    extractFirstParagraph(html) ||
    stripBrandSuffix(title);
  const extractedCanonical = extractCanonicalHref(html);
  const extractedRobots = extractMetaContent(html, 'name', 'robots');
  const socialImage =
    extractMetaContent(html, 'property', 'og:image') ||
    extractMetaContent(html, 'name', 'twitter:image') ||
    extractFirstImage(html) ||
    DEFAULT_SOCIAL_IMAGE;
  const faqItems = extractFaqItems(html, existingSchemas);
  const articleSchema = findSchemaByType(existingSchemas, ['BlogPosting', 'Article']);
  const canonical = resolveCanonicalValue(extractedCanonical, route);
  const robots = buildRobotsDirective(route, routeConfig, extractedRobots);
  const image = toAbsoluteUrl(socialImage);
  const ogType = routeConfig.kind === 'blogPost' || routeConfig.kind === 'caseStudyDetail' ? 'article' : 'website';
  const { breadcrumbs, graph } = buildPageGraph(
    route,
    title,
    description,
    image,
    routeConfig,
    existingSchemas,
    faqItems,
  );
  const datePublished = pickExistingDate(articleSchema, 'datePublished');
  const dateModified =
    pickExistingDate(articleSchema, 'dateModified') || pickExistingDate(articleSchema, 'datePublished');

  return {
    route,
    title,
    description,
    canonical,
    robots,
    image,
    ogType,
    routeConfig,
    breadcrumbs,
    graph,
    datePublished,
    dateModified,
  };
}

function renderJsonLdGraph(graph) {
  if (!Array.isArray(graph) || graph.length === 0) return '';
  return `  <script type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}\n  </script>`;
}

export function renderSeoHead(pageData) {
  const title = escapeHtml(pageData.title);
  const description = escapeHtml(pageData.description);
  const canonical = escapeHtml(pageData.canonical);
  const robots = escapeHtml(pageData.robots);
  const image = escapeHtml(pageData.image);
  const ogType = escapeHtml(pageData.ogType);
  const imageAlt = escapeHtml(stripBrandSuffix(pageData.title) || pageData.title);
  const jsonLd = renderJsonLdGraph(pageData.graph);
  const publishedTime = pageData.ogType === 'article' && pageData.datePublished
    ? `  <meta property="article:published_time" content="${escapeHtml(pageData.datePublished)}">`
    : '';
  const modifiedTime = pageData.ogType === 'article' && pageData.dateModified
    ? `  <meta property="article:modified_time" content="${escapeHtml(pageData.dateModified)}">`
    : '';

  return [
    `  <title>${title}</title>`,
    `  <meta name="description" content="${description}">`,
    `  <meta name="robots" content="${robots}">`,
    `  <link rel="canonical" href="${canonical}">`,
    `  <meta property="og:site_name" content="${escapeHtml(BRAND_NAME)}">`,
    '  <meta property="og:locale" content="en_US">',
    `  <meta property="og:title" content="${title}">`,
    `  <meta property="og:description" content="${description}">`,
    `  <meta property="og:type" content="${ogType}">`,
    `  <meta property="og:url" content="${canonical}">`,
    `  <meta property="og:image" content="${image}">`,
    `  <meta property="og:image:secure_url" content="${image}">`,
    `  <meta property="og:image:alt" content="${imageAlt}">`,
    publishedTime,
    modifiedTime,
    '  <meta name="twitter:card" content="summary_large_image">',
    `  <meta name="twitter:title" content="${title}">`,
    `  <meta name="twitter:description" content="${description}">`,
    `  <meta name="twitter:image" content="${image}">`,
    `  <meta name="twitter:image:alt" content="${imageAlt}">`,
    jsonLd,
  ]
    .filter(Boolean)
    .join('\n');
}

export function stripExistingSeoMarkup(headContent) {
  return headContent
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, '')
    .replace(
      /<meta\b[^>]+(?:name|property)=["'](?:description|keywords|author|robots|twitter:[^"']+|og:[^"']+)["'][^>]*>\s*/gi,
      '',
    )
    .replace(/<link\b[^>]+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<script\b[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();
}

export function stripExistingJsonLdMarkup(html) {
  return html.replace(
    /<script\b[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
    '',
  );
}

export function applySeoFoundation(html, routePath) {
  const headMatch = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return { html, data: null };

  const pageData = collectSeoPageData(routePath, html);
  const htmlWithoutJsonLd = stripExistingJsonLdMarkup(html);
  const sanitizedHead = stripExistingSeoMarkup(headMatch[1]);
  const seoHead = renderSeoHead(pageData);
  const replacement = `<head>\n${sanitizedHead}\n${seoHead}\n</head>`;

  return {
    html: htmlWithoutJsonLd.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, replacement),
    data: pageData,
  };
}

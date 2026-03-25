import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { resolveCanonicalValue, resolveRobotsDirective } from '../seo/foundation.js';
import { UNIVERSAL_NAV_MARKUP, UNIVERSAL_NAV_SCRIPT, UNIVERSAL_NAV_STYLESHEET } from './shared-nav.js';

const SITE_URL = (process.env.SITE_URL || 'https://lonestarfauxscapes.com').replace(/\/+$/, '');
const CONTENT_DIR = './content/case-studies';
const OUTPUT_DIR = './case-studies';
const HUB_FILE = './case-studies.html';
const JSON_FILE = './content/case-studies.json';
const TEMPLATE_PREFIX = '_';
const SERVICE_LABELS = {
  '/artificial-hedge': 'Artificial hedges',
  '/living-wall': 'Living walls',
  '/commercial-wall': 'Commercial feature walls',
  '/fence-extensions': 'Fence extensions',
  '/pool-privacy-hedge': 'Pool privacy screens',
  '/fire-rated-artificial-hedge': 'Fire-rated greenery',
  '/residential': 'Residential installs',
  '/commercial': 'Commercial installs',
  '/pricing': 'Pricing and ballpark ranges',
};

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);
const isProtocolRelativeUrl = (value) => String(value || '').startsWith('//');

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const sanitizeSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const toIsoDate = (value, fallback = new Date()) => {
  if (typeof value === 'string') {
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  }
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback.toISOString().slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
};

const formatDate = (isoDate) => {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const toImageSrc = (value) => {
  const image = String(value || '').trim();
  if (!image) return '/images/commercial/commercial-1.webp';
  if (isAbsoluteUrl(image) || isProtocolRelativeUrl(image)) return image;
  return image.startsWith('/') ? image : `/${image}`;
};

const toAbsoluteUrl = (value) => {
  if (isAbsoluteUrl(value)) return value;
  if (isProtocolRelativeUrl(value)) return `https:${value}`;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${SITE_URL}${normalized}`;
};

const cleanText = (value) => String(value || '').trim();

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map(cleanText).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.replace(/^-+\s*/, ''))
      .map(cleanText)
      .filter(Boolean);
  }

  return [];
};

const normalizePathArray = (value) => normalizeStringArray(value).map((item) => {
  if (item.startsWith('/')) return item;
  if (isAbsoluteUrl(item) || isProtocolRelativeUrl(item)) return item;
  return `/${item}`;
});

const cityFromLocation = (value) => cleanText(String(value || '').split(',')[0]);

const toTitleWords = (value) =>
  cleanText(value)
    .split(/[-_/]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const labelForPath = (href) => {
  if (!href) return '';
  if (SERVICE_LABELS[href]) return SERVICE_LABELS[href];
  if (href === '/') return 'Homepage';
  return toTitleWords(String(href).replace(/^\/+|\/+$/g, ''));
};

const pathHref = (href) => {
  if (!href) return '';
  if (isAbsoluteUrl(href) || isProtocolRelativeUrl(href)) return href;
  return href.startsWith('/') ? href : `/${href}`;
};

const uniqueBy = (items, keyFn) => {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
};

const renderList = (items, className = '') => {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];
  if (values.length === 0) return '';
  return `<ul${className ? ` class="${className}"` : ''}>${values.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
};

const mediaListForEntry = (entry) => {
  const beforeItems = (entry.beforeImages || []).map((src, index) => ({
    type: 'Before',
    src,
    alt: `${entry.title} before install ${index + 1}`,
  }));

  const afterSource = entry.afterImages && entry.afterImages.length > 0
    ? entry.afterImages
    : [entry.image];

  const afterItems = afterSource.map((src, index) => ({
    type: 'After',
    src,
    alt: `${entry.title} after install ${index + 1}`,
  }));

  return [...beforeItems, ...afterItems];
};

const renderProjectSnapshot = (entry) => {
  const cards = [];

  if (entry.projectType) cards.push({ label: 'Project type', value: entry.projectType });
  if (entry.audience || entry.category) cards.push({ label: 'Who it served', value: entry.audience || entry.category });
  if (entry.problemSolved || entry.summary) cards.push({ label: 'Problem solved', value: entry.problemSolved || entry.summary });
  if (entry.installTime) cards.push({ label: 'Install timing', value: entry.installTime });
  if (entry.dimensions) cards.push({ label: 'Project scale', value: entry.dimensions });
  if (entry.documentationNotes) cards.push({ label: 'Documentation', value: entry.documentationNotes });
  if (entry.fireRatingNotes) cards.push({ label: 'Fire-rating note', value: entry.fireRatingNotes });

  const scopeList = renderList(entry.scope, 'snapshot-list');
  if (scopeList) cards.push({ label: 'Installed scope', value: scopeList, isHtml: true });

  const materialList = renderList(entry.material, 'snapshot-list');
  if (materialList) cards.push({ label: 'Materials used', value: materialList, isHtml: true });

  if (cards.length === 0) return '';

  return `
    <section class="snapshot" aria-label="Project snapshot">
      ${cards.map((card) => `
        <article class="snapshot-card">
          <span class="snapshot-label">${escapeHtml(card.label)}</span>
          ${card.isHtml ? card.value : `<p>${escapeHtml(card.value)}</p>`}
        </article>
      `).join('')}
    </section>
  `;
};

const renderStorySections = (entry) => {
  const scopeList = renderList(entry.scope, 'story-list');
  const materialList = renderList(entry.material, 'story-list');

  const executionSignals = [];
  if (entry.installTime) executionSignals.push(`Install window: ${entry.installTime}`);
  if (entry.dimensions) executionSignals.push(`Project scale: ${entry.dimensions}`);
  if (entry.fireRatingNotes) executionSignals.push(entry.fireRatingNotes);
  if (entry.documentationNotes) executionSignals.push(entry.documentationNotes);

  const outcomeSignals = [];
  outcomeSignals.push(entry.problemSolved || entry.summary);
  if (entry.location) outcomeSignals.push(`Location context: ${entry.location}`);
  if (entry.tags && entry.tags.length > 0) outcomeSignals.push(`Keywords: ${entry.tags.join(', ')}`);

  return `
    <section class="story-grid" aria-label="Project storyline">
      <article class="story-block">
        <h2>Challenge</h2>
        <p>${escapeHtml(entry.problemSolved || entry.summary || 'The published notes focus on the final challenge and practical goals for this install.')}</p>
      </article>
      <article class="story-block">
        <h2>Solution</h2>
        ${scopeList || materialList ? `
          ${scopeList ? `<h3>Scope</h3>${scopeList}` : ''}
          ${materialList ? `<h3>Material stack</h3>${materialList}` : ''}
        ` : `<p>Published notes emphasize outcome over detailed scope line-items for this install.</p>`}
      </article>
      <article class="story-block">
        <h2>Execution</h2>
        ${executionSignals.length > 0
    ? renderList(executionSignals, 'story-list')
    : '<p>Execution details were not published in full, but final photos and summary describe the completed approach.</p>'}
      </article>
      <article class="story-block">
        <h2>Outcome</h2>
        ${renderList(outcomeSignals, 'story-list')}
      </article>
    </section>
  `;
};

const renderRelatedLinks = (entry, allEntries) => {
  const serviceLinks = normalizePathArray(entry.relatedServices)
    .map((href) => ({ href, label: labelForPath(href) }))
    .filter((item) => item.href && item.label);

  const featuredLinks = normalizePathArray(entry.featuredPages)
    .map((href) => ({ href, label: labelForPath(href) }))
    .filter((item) => item.href && item.label);

  const sameCityEntries = allEntries
    .filter((candidate) => candidate.slug !== entry.slug && candidate.city === entry.city)
    .slice(0, 3)
    .map((candidate) => ({
      href: `/case-studies/${candidate.slug}`,
      label: `${candidate.city}: ${candidate.title}`,
    }));

  const sameAudienceEntries = allEntries
    .filter(
      (candidate) =>
        candidate.slug !== entry.slug &&
        candidate.city !== entry.city &&
        (candidate.audience || candidate.category) === (entry.audience || entry.category),
    )
    .slice(0, 2)
    .map((candidate) => ({
      href: `/case-studies/${candidate.slug}`,
      label: `${candidate.city}: ${candidate.projectType || candidate.title}`,
    }));

  const sameTagEntries = allEntries
    .filter((candidate) => {
      if (candidate.slug === entry.slug) return false;
      if (!candidate.tags || candidate.tags.length === 0) return false;
      return candidate.tags.some((tag) => (entry.tags || []).includes(tag));
    })
    .slice(0, 2)
    .map((candidate) => ({
      href: `/case-studies/${candidate.slug}`,
      label: `${candidate.city}: ${candidate.title}`,
    }));

  const linkGroups = [
    { title: `Related ${entry.city || 'Texas'} installs`, links: sameCityEntries.slice(0, 3) },
    { title: 'Similar project type installs', links: uniqueBy([...sameAudienceEntries, ...sameTagEntries], (item) => item.href).slice(0, 4) },
    { title: 'Service pages', links: serviceLinks.slice(0, 4) },
    { title: 'Helpful pages', links: featuredLinks.filter((item) => item.href !== '/').slice(0, 4) },
  ].filter((group) => group.links.length > 0);

  if (linkGroups.length === 0) return '';

  return `
    <section class="related-suite" aria-label="Related pages and case studies">
      <h2>Continue your research</h2>
      <p class="related-suite__intro">Use these links to compare similar installs, jump to service pages, or review local pages before requesting your own scope review.</p>
      <div class="related-suite__grid">
        ${linkGroups.map((group) => `
          <article class="related-cluster">
            <h3>${escapeHtml(group.title)}</h3>
            <div class="related-links">
              ${group.links.map((item) => `<a href="${pathHref(item.href)}">${escapeHtml(item.label)}</a>`).join('')}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
};

const renderQuoteBlock = (entry) => {
  if (!entry.quote) return '';
  const attribution = [entry.quoteAuthor, entry.quoteRole].filter(Boolean).join(', ');

  return `
    <blockquote class="quote-block">
      <p>${escapeHtml(entry.quote)}</p>
      ${attribution ? `<footer>${escapeHtml(attribution)}</footer>` : ''}
    </blockquote>
  `;
};

const renderCardInternalLinks = (entry) => {
  const cityPath = entry.city ? `/${sanitizeSlug(entry.city)}` : '';
  const links = uniqueBy(
    [
      cityPath ? { href: cityPath, label: `${entry.city} page` } : null,
      ...normalizePathArray(entry.relatedServices).map((href) => ({ href, label: labelForPath(href) })),
      ...normalizePathArray(entry.featuredPages).map((href) => ({ href, label: labelForPath(href) })),
    ].filter(Boolean),
    (item) => item.href,
  )
    .filter((item) => item.href !== '/' && item.href !== `/case-studies/${entry.slug}`)
    .slice(0, 4);

  if (links.length === 0) return '';

  return `
    <div class="card-links">
      ${links.map((item) => `<a href="${pathHref(item.href)}">${escapeHtml(item.label)}</a>`).join('')}
    </div>
  `;
};

const renderFeatureMedia = (entry) => {
  const items = mediaListForEntry(entry);
  if (items.length === 0) {
    return '';
  }

  const primary = items.find((item) => item.type === 'After') || items[0];
  const rail = items.filter((item) => item.src !== primary.src).slice(0, 5);

  return `
    <section class="detail-media" aria-label="Project media">
      <figure class="detail-media__primary">
        <img src="${primary.src}" alt="${escapeHtml(primary.alt)}" loading="eager" decoding="async">
        <figcaption>${escapeHtml(primary.type)} image from this published install profile.</figcaption>
      </figure>
      ${rail.length > 0 ? `
        <div class="detail-media__rail">
          ${rail.map((item) => `
            <figure class="detail-media__thumb">
              <img src="${item.src}" alt="${escapeHtml(item.alt)}" loading="lazy" decoding="async">
              <figcaption>${escapeHtml(item.type)}</figcaption>
            </figure>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `;
};

const renderDetailPage = (entry, allEntries) => {
  const canonical = entry.canonical || `${SITE_URL}/case-studies/${entry.slug}`;
  const seoTitle = entry.seoTitle || `${entry.title} | Case Study`;
  const seoDescription = entry.seoDescription || entry.summary;
  const robots = entry.robots || 'index, follow';
  const imageAbsolute = toAbsoluteUrl(entry.socialImage || entry.image);
  const topPills = [
    entry.displayDate,
    entry.city || entry.location,
    entry.audience || entry.category,
    entry.projectType,
  ].filter(Boolean);

  const quickFacts = [
    entry.problemSolved ? { label: 'Problem solved', value: entry.problemSolved } : null,
    entry.installTime ? { label: 'Install timing', value: entry.installTime } : null,
    entry.dimensions ? { label: 'Scale', value: entry.dimensions } : null,
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(seoTitle)}</title>
  <meta name="description" content="${escapeHtml(seoDescription)}">
  <meta name="robots" content="${escapeHtml(robots)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${escapeHtml(seoTitle)}">
  <meta property="og:description" content="${escapeHtml(seoDescription)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${imageAbsolute}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(seoTitle)}">
  <meta name="twitter:description" content="${escapeHtml(seoDescription)}">
  <meta name="twitter:image" content="${imageAbsolute}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg:#f7f2e9;
      --bg-alt:#efe6d8;
      --surface-soft:#fffdf8;
      --line:#d9cbbb;
      --text:#211a14;
      --muted:#6f6155;
      --accent:#7a5633;
      --accent-strong:#9a7045;
      --hero-shadow:0 24px 60px rgba(64, 42, 14, 0.08);
      --font-display: "Fraunces", "Iowan Old Style", Georgia, serif;
      --font-body: "Manrope", "Avenir Next", "Segoe UI", Arial, sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding-top: 5rem;
      background:
        radial-gradient(circle at 12% 8%, rgba(188,145,88,0.16), transparent 33%),
        radial-gradient(circle at 88% 18%, rgba(155,118,80,0.14), transparent 30%),
        var(--bg);
      color: var(--text);
      font: 16px/1.68 var(--font-body);
    }
    .container { width: min(1120px, 92%); margin: 0 auto; }
    .detail-hero {
      margin: 2.7rem 0 1.4rem;
      padding: clamp(1.25rem, 2.4vw, 1.9rem);
      border-radius: 28px;
      border: 1px solid var(--line);
      background:
        linear-gradient(140deg, rgba(191,148,89,0.17), transparent 45%),
        linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.8));
      box-shadow: var(--hero-shadow);
      display: grid;
      gap: 1.2rem;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    }
    .detail-kicker {
      margin: 0 0 0.5rem;
      color: var(--accent-strong);
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 0.76rem;
      font-weight: 800;
    }
    h1 {
      margin: 0 0 0.8rem;
      line-height: 1.08;
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-family: var(--font-display);
      letter-spacing: -0.01em;
      text-wrap: balance;
    }
    .summary {
      margin: 0;
      color: var(--muted);
      max-width: 64ch;
      font-size: 1.02rem;
      line-height: 1.72;
    }
    .meta {
      display: flex;
      gap: .56rem;
      flex-wrap: wrap;
      margin: 0 0 1rem;
    }
    .pill {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: .36rem .72rem;
      color: #4e4338;
      font-size: .78rem;
      background: var(--bg-alt);
    }
    .hero-facts {
      display: grid;
      gap: 0.65rem;
      align-content: start;
    }
    .hero-fact {
      padding: 0.8rem 0.95rem;
      border-radius: 16px;
      border: 1px solid var(--line);
      background: var(--surface-soft);
    }
    .hero-fact span {
      display: block;
      margin-bottom: 0.34rem;
      color: var(--accent-strong);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }
    .hero-fact p {
      margin: 0;
      color: #3f342b;
      font-size: 0.95rem;
      line-height: 1.56;
    }
    .detail-media {
      display: grid;
      gap: 0.85rem;
      margin: 0 0 1.6rem;
    }
    .detail-media__primary {
      margin: 0;
      border: 1px solid var(--line);
      border-radius: 24px;
      overflow: hidden;
      background: var(--surface-soft);
    }
    .detail-media__primary img {
      width: 100%;
      display: block;
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }
    .detail-media__primary figcaption {
      padding: 0.72rem 0.95rem;
      color: var(--muted);
      font-size: 0.86rem;
      border-top: 1px solid var(--line);
      background: var(--bg-alt);
    }
    .detail-media__rail {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 0.72rem;
    }
    .detail-media__thumb {
      margin: 0;
      border-radius: 14px;
      border: 1px solid var(--line);
      overflow: hidden;
      background: var(--surface-soft);
    }
    .detail-media__thumb img {
      width: 100%;
      display: block;
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }
    .detail-media__thumb figcaption {
      padding: 0.46rem 0.62rem;
      font-size: 0.78rem;
      color: var(--muted);
      border-top: 1px solid var(--line);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }
    .story-grid {
      display: grid;
      gap: 0.85rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: 0 0 1.8rem;
    }
    .story-block {
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 1rem 1.05rem;
      background: var(--surface-soft);
    }
    .story-block h2 {
      margin: 0 0 0.62rem;
      font-family: var(--font-display);
      font-size: clamp(1.15rem, 2.1vw, 1.42rem);
      line-height: 1.2;
      letter-spacing: -0.01em;
    }
    .story-block h3 {
      margin: 0.8rem 0 0.4rem;
      font-size: 0.84rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent-strong);
    }
    .story-block p {
      margin: 0;
      color: #453a31;
      line-height: 1.62;
      font-size: 0.95rem;
    }
    .story-list {
      margin: 0;
      padding-left: 1.1rem;
      color: #453a31;
    }
    .story-list li + li { margin-top: 0.34rem; }
    .snapshot {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 0.76rem;
      margin-bottom: 1.8rem;
    }
    .snapshot-card {
      padding: 0.92rem 0.98rem;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: var(--surface-soft);
    }
    .snapshot-label {
      display: block;
      margin-bottom: 0.42rem;
      color: var(--accent-strong);
      font-size: .72rem;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .snapshot-card p,
    .snapshot-card li {
      margin: 0;
      color: #453a31;
      font-size: 0.92rem;
      line-height: 1.55;
    }
    .snapshot-list {
      margin: 0;
      padding-left: 1.08rem;
    }
    .snapshot-list li + li { margin-top: 0.32rem; }
    .quote-block {
      margin: 0 0 1.6rem;
      padding: 1.05rem 1.2rem;
      border-radius: 18px;
      border: 1px solid #d2bea6;
      background: #f5e9d9;
    }
    .quote-block p {
      margin: 0 0 .6rem;
      color: #2c2219;
      font-size: 1rem;
      line-height: 1.65;
    }
    .quote-block footer { color: #6f6155; font-size: .92rem; }
    .detail-narrative {
      margin: 0 0 1.8rem;
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 1.2rem 1.2rem 1.3rem;
      background: var(--surface-soft);
    }
    .detail-narrative h2 {
      margin: 0 0 0.72rem;
      font-size: clamp(1.22rem, 2.1vw, 1.5rem);
      font-family: var(--font-display);
    }
    .detail-narrative article h2 {
      margin-top: 1.5rem;
      margin-bottom: 0.52rem;
      font-size: clamp(1.1rem, 1.9vw, 1.35rem);
      font-family: var(--font-display);
    }
    .detail-narrative article p,
    .detail-narrative article li {
      color: #453a31;
      line-height: 1.66;
    }
    .detail-narrative article ul { padding-left: 1.16rem; }
    .related-suite {
      margin: 0 0 1.8rem;
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 1rem 1.05rem 1.2rem;
      background: var(--surface-soft);
    }
    .related-suite h2 {
      margin: 0 0 0.7rem;
      font-size: clamp(1.1rem, 2vw, 1.34rem);
      font-family: var(--font-display);
    }
    .related-suite__intro {
      margin: 0 0 0.9rem;
      color: var(--muted);
      line-height: 1.62;
    }
    .related-suite__grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    .related-cluster {
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 0.8rem;
      background: var(--bg-alt);
    }
    .related-cluster h3 {
      margin: 0 0 .54rem;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: .76rem;
    }
    .related-links {
      display: flex;
      flex-wrap: wrap;
      gap: .58rem;
    }
    .related-links a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      padding: .58rem .84rem;
      border-radius: 999px;
      border: 1px solid #ccb9a2;
      background: #fff;
      color: #33281f;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.88rem;
      transition: background-color .2s ease, color .2s ease, border-color .2s ease;
    }
    .related-links a:hover { background: #33281f; color: #fff; border-color: #33281f; }
    .back {
      display: inline-flex;
      margin: 0 0 3rem;
      color: var(--accent);
      text-decoration: none;
      font-weight: 700;
      letter-spacing: .02em;
      min-height: 44px;
      align-items: center;
    }
    .footer {
      border-top: 1px solid #ddd0bf;
      padding: 2rem 0 3rem;
      color: var(--muted);
      font-size: .9rem;
    }
    @media (max-width: 920px) {
      .detail-hero { grid-template-columns: minmax(0, 1fr); }
    }
    @media (max-width: 760px) {
      .story-grid { grid-template-columns: minmax(0, 1fr); }
      .related-suite__grid { grid-template-columns: minmax(0, 1fr); }
      .detail-narrative { padding: 1rem 0.95rem 1.05rem; }
      .related-suite { padding: 0.95rem 0.9rem 1rem; }
    }
    @media (min-width: 900px) {
      .related-suite__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${JSON.stringify(entry.title)},
    "description": ${JSON.stringify(entry.summary)},
    "datePublished": "${entry.date}",
    "dateModified": "${entry.updated || entry.date}",
    "image": ${JSON.stringify(imageAbsolute)},
    "author": {
      "@type": "Organization",
      "name": "Lone Star Faux Scapes"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lone Star Faux Scapes",
      "logo": {
        "@type": "ImageObject",
        "url": "${SITE_URL}/favicon/web-app-manifest-512x512.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${canonical}"
    }
  }
  </script>
${UNIVERSAL_NAV_STYLESHEET}
  <link rel="stylesheet" href="/cro.css">
</head>
<body>
${UNIVERSAL_NAV_MARKUP}

  <main class="container">
    <section class="detail-hero">
      <div>
        <p class="detail-kicker">${escapeHtml(entry.city || 'Texas')} published install</p>
        <div class="meta">
          ${topPills.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join('')}
        </div>
        <h1>${escapeHtml(entry.title)}</h1>
        <p class="summary">${escapeHtml(entry.summary)}</p>
      </div>
      <aside class="hero-facts">
        ${quickFacts.length > 0
    ? quickFacts.map((fact) => `
              <article class="hero-fact">
                <span>${escapeHtml(fact.label)}</span>
                <p>${escapeHtml(fact.value)}</p>
              </article>
            `).join('')
    : `
            <article class="hero-fact">
              <span>Published profile</span>
              <p>Use this case study to review scope and outcome details from a real Texas install.</p>
            </article>
          `}
      </aside>
    </section>

    ${renderFeatureMedia(entry)}

    ${renderStorySections(entry)}

    ${renderProjectSnapshot(entry)}

    ${renderQuoteBlock(entry)}

    <section class="detail-narrative">
      <h2>Detailed project walkthrough</h2>
      <article>
        ${entry.html}
      </article>
    </section>

    ${renderRelatedLinks(entry, allEntries)}

    <section class="lsfs-cro-section">
      <div class="lsfs-cro-card" data-lsfs-context="case_study_detail_cta">
        <div>
          <p class="lsfs-cro-eyebrow">${escapeHtml(entry.city || 'Texas')} project help</p>
          <h2 class="lsfs-cro-title">Need a scope review for a similar project?</h2>
          <p class="lsfs-cro-copy">Send the project type, rough dimensions, city, and anything important like fire-doc or access requirements. We can point you to the clearest next step.</p>
          <div class="lsfs-cro-actions">
            <a class="lsfs-cro-btn lsfs-cro-btn--primary" href="/pricing" data-lsfs-cta="case_study_ballpark_pricing">Get ballpark pricing</a>
            <a class="lsfs-cro-btn lsfs-cro-btn--secondary" href="tel:+17609787335" data-lsfs-cta="case_study_call">Call (760) 978-7335</a>
            <a class="lsfs-cro-btn lsfs-cro-btn--tertiary" href="mailto:info@lonestarfauxscapes.com?subject=${encodeURIComponent(`${entry.city || 'Texas'} project review`)}" data-lsfs-cta="case_study_email">Email your project</a>
          </div>
          <div class="lsfs-cro-context">
            <span class="lsfs-cro-pill">Custom fit for the site</span>
            <span class="lsfs-cro-pill">Fast install planning</span>
            <span class="lsfs-cro-pill">Documentation support when needed</span>
          </div>
        </div>
        <div data-lsfs-quote-widget data-lsfs-form-context="case_study_detail_quote" data-lsfs-form-title="Short quote form" data-lsfs-form-copy="Use this if your project is similar and you want the fastest useful next step." data-lsfs-service="${escapeHtml(entry.projectType || 'Case study follow-up')}" data-lsfs-location="${escapeHtml(entry.city || '')}" data-lsfs-button="Request Pricing"></div>
      </div>
    </section>

    <a class="back" href="/case-studies">&larr; Back to all case studies</a>
  </main>

  <footer class="footer">
    <div class="container">
      &copy; <span id="year"></span> Lone Star Faux Scapes
    </div>
  </footer>
  <script>document.getElementById('year').textContent = String(new Date().getFullYear());</script>
${UNIVERSAL_NAV_SCRIPT}
  <script src="/cro.js"></script>
</body>
</html>`;
};

const renderHubSpotlight = (entry) => `
      <article class="hub-spotlight">
        <a class="hub-spotlight__media" href="/case-studies/${entry.slug}" data-lsfs-cta="case_study_spotlight_${escapeHtml(entry.slug)}">
          <img src="${entry.afterImages?.[0] || entry.image}" alt="${escapeHtml(entry.title)}" loading="eager" decoding="async">
          <span class="hub-spotlight__badge">${escapeHtml(entry.city || 'Texas')} / ${escapeHtml(entry.audience || entry.category)}</span>
        </a>
        <div class="hub-spotlight__body">
          <p class="hub-spotlight__kicker">Most recent published profile</p>
          <h2><a href="/case-studies/${entry.slug}" data-lsfs-cta="case_study_spotlight_title_${escapeHtml(entry.slug)}">${escapeHtml(entry.title)}</a></h2>
          <p>${escapeHtml(entry.summary)}</p>
          <div class="hub-spotlight__facts">
            <span><strong>Problem solved:</strong> ${escapeHtml(entry.problemSolved || entry.summary)}</span>
            ${entry.installTime ? `<span><strong>Install timing:</strong> ${escapeHtml(entry.installTime)}</span>` : ''}
            ${entry.dimensions ? `<span><strong>Scale:</strong> ${escapeHtml(entry.dimensions)}</span>` : ''}
          </div>
          <a class="hub-spotlight__cta" href="/case-studies/${entry.slug}" data-lsfs-cta="case_study_spotlight_read_${escapeHtml(entry.slug)}">Read this project profile &rarr;</a>
        </div>
      </article>
`;

const renderHubCard = (entry, compact = false) => `
  <article class="${compact ? 'hub-card hub-card--compact' : 'hub-card'}">
    <a class="hub-card__media" href="/case-studies/${entry.slug}" data-lsfs-cta="case_study_card_${escapeHtml(entry.slug)}">
      <img src="${entry.afterImages?.[0] || entry.image}" alt="${escapeHtml(entry.title)}" loading="lazy" decoding="async">
    </a>
    <div class="hub-card__body">
      <div class="hub-card__meta">
        <span>${escapeHtml(entry.city || entry.location)}</span>
        <span>${escapeHtml(entry.audience || entry.category)}</span>
        <span>${escapeHtml(entry.projectType || entry.category)}</span>
      </div>
      <h3><a href="/case-studies/${entry.slug}" data-lsfs-cta="case_study_title_${escapeHtml(entry.slug)}">${escapeHtml(entry.title)}</a></h3>
      <p>${escapeHtml(entry.summary)}</p>
      <ul class="hub-card__list">
        <li><strong>Challenge:</strong> ${escapeHtml(entry.problemSolved || entry.summary)}</li>
        ${entry.installTime ? `<li><strong>Install timing:</strong> ${escapeHtml(entry.installTime)}</li>` : ''}
        ${entry.dimensions ? `<li><strong>Scale:</strong> ${escapeHtml(entry.dimensions)}</li>` : ''}
      </ul>
      ${renderCardInternalLinks(entry)}
      <a class="hub-card__cta" href="/case-studies/${entry.slug}" data-lsfs-cta="case_study_read_${escapeHtml(entry.slug)}">Read profile &rarr;</a>
    </div>
  </article>
`;

const renderHubResearchRail = (entries) => {
  const serviceLinks = uniqueBy(
    entries.flatMap((entry) =>
      normalizePathArray(entry.relatedServices).map((href) => ({ href, label: labelForPath(href) })),
    ),
    (item) => item.href,
  )
    .filter((item) => item.href && item.label)
    .slice(0, 8);

  const cityLinks = uniqueBy(
    entries
      .map((entry) => {
        const citySlug = sanitizeSlug(entry.city);
        if (!citySlug) return null;
        return { href: `/${citySlug}`, label: `${entry.city} installs` };
      })
      .filter(Boolean),
    (item) => item.href,
  ).slice(0, 8);

  if (serviceLinks.length === 0 && cityLinks.length === 0) return '';

  return `
    <section class="hub-research" aria-label="Explore related pages">
      ${serviceLinks.length > 0 ? `
        <article class="hub-research__cluster">
          <h2>Explore service pages</h2>
          <div class="hub-research__links">
            ${serviceLinks.map((item) => `<a href="${pathHref(item.href)}">${escapeHtml(item.label)}</a>`).join('')}
          </div>
        </article>
      ` : ''}
      ${cityLinks.length > 0 ? `
        <article class="hub-research__cluster">
          <h2>Browse city pages</h2>
          <div class="hub-research__links">
            ${cityLinks.map((item) => `<a href="${pathHref(item.href)}">${escapeHtml(item.label)}</a>`).join('')}
          </div>
        </article>
      ` : ''}
    </section>
  `;
};

const renderHubPage = (entries) => {
  const listItems = entries
    .map((entry, index) => {
      const absolute = `${SITE_URL}/case-studies/${entry.slug}`;
      return `      {
        "@type": "ListItem",
        "position": ${index + 1},
        "url": ${JSON.stringify(absolute)},
        "name": ${JSON.stringify(entry.title)}
      }`;
    })
    .join(',\n');

  const spotlight = entries[0];
  const browseCards = entries.slice(1);
  const cityGroups = uniqueBy(
    entries.map((entry) => entry.city).filter(Boolean).map((city) => ({ city })),
    (item) => item.city,
  ).map((group) => ({
    ...group,
    entries: entries.filter((entry) => entry.city === group.city),
  }));

  const cityCount = uniqueBy(entries, (entry) => entry.city).length;
  const audienceCount = uniqueBy(entries, (entry) => entry.audience || entry.category).length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Case Studies | Lone Star Faux Scapes</title>
  <meta name="description" content="Real Lone Star Faux Scapes installs across Texas. See the problem solved, scope, install timing, and finished outcome before you request pricing.">
  <link rel="canonical" href="${SITE_URL}/case-studies">
  <meta property="og:title" content="Case Studies | Lone Star Faux Scapes">
  <meta property="og:description" content="Real installs across Texas with scope, install timing, and finished outcome details.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE_URL}/case-studies">
  <meta property="og:image" content="${SITE_URL}/images/commercial/commercial-2.webp">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Case Studies | Lone Star Faux Scapes">
  <meta name="twitter:description" content="Real installs across Texas with scope, install timing, and finished outcome details.">
  <meta name="twitter:image" content="${SITE_URL}/images/commercial/commercial-2.webp">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg:#f7f2e9;
      --bg-alt:#efe6d8;
      --surface:#fffdf8;
      --line:#d9cbbb;
      --text:#211a14;
      --muted:#6f6155;
      --accent:#7a5633;
      --accent-strong:#9a7045;
      --font-display: "Fraunces", "Iowan Old Style", Georgia, serif;
      --font-body: "Manrope", "Avenir Next", "Segoe UI", Arial, sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding-top: 5rem;
      background:
        radial-gradient(circle at 8% 12%, rgba(189,145,88,0.16), transparent 33%),
        radial-gradient(circle at 92% 15%, rgba(158,119,81,0.14), transparent 31%),
        var(--bg);
      color: var(--text);
      font: 16px/1.66 var(--font-body);
    }
    .container { width: min(1200px, 92%); margin: 0 auto; }
    .hero-shell {
      margin: 2.8rem 0 1.35rem;
      padding: clamp(1.2rem, 2.2vw, 1.7rem);
      border-radius: 28px;
      border: 1px solid var(--line);
      background:
        linear-gradient(145deg, rgba(192,147,89,0.16), transparent 43%),
        linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.8));
      box-shadow: 0 22px 56px rgba(70, 48, 21, 0.08);
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
      gap: 1.1rem;
      align-items: end;
    }
    .hero-kicker { margin: 0 0 0.5rem; color: var(--accent-strong); text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.75rem; font-weight: 800; }
    .hero-shell h1 { margin: 0 0 0.8rem; line-height: 1.05; font-size: clamp(2rem, 4vw, 3.15rem); font-family: var(--font-display); text-wrap: balance; }
    .hero-shell p { margin: 0; color: var(--muted); max-width: 62ch; font-size: 1rem; line-height: 1.74; }
    .hero-metrics { display: grid; gap: 0.62rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .hero-metric { border: 1px solid var(--line); border-radius: 14px; padding: 0.8rem 0.85rem; background: var(--surface); }
    .hero-metric strong { display: block; margin-bottom: 0.3rem; font-size: 1.06rem; color: #3a2f25; line-height: 1.2; }
    .hero-metric span { color: var(--muted); font-size: 0.83rem; line-height: 1.35; text-transform: uppercase; letter-spacing: 0.08em; }
    .hub-research { display: grid; gap: 0.85rem; margin: 0 0 1.2rem; grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .hub-research__cluster { border: 1px solid var(--line); border-radius: 18px; padding: 0.9rem; background: var(--surface); }
    .hub-research__cluster h2 { margin: 0 0 0.55rem; font-size: clamp(1rem, 1.8vw, 1.2rem); font-family: var(--font-display); }
    .hub-research__links { display: flex; flex-wrap: wrap; gap: .56rem; }
    .hub-research__links a { display: inline-flex; align-items: center; min-height: 44px; border: 1px solid #ccb9a2; border-radius: 999px; padding: .54rem .82rem; background: #fff; color: #33281f; text-decoration: none; font-weight: 600; font-size: .88rem; transition: background-color .2s ease, color .2s ease, border-color .2s ease; }
    .hub-research__links a:hover { background: #33281f; color: #fff; border-color: #33281f; }
    .hub-spotlight { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); margin: 0 0 1.2rem; border: 1px solid var(--line); border-radius: 24px; overflow: hidden; background: var(--surface); box-shadow: 0 20px 46px rgba(65, 43, 15, 0.08); }
    .hub-spotlight__media { position: relative; display: block; background: var(--bg-alt); }
    .hub-spotlight__media img { width: 100%; height: 100%; object-fit: cover; display: block; aspect-ratio: 16 / 11; }
    .hub-spotlight__badge { position: absolute; top: 0.95rem; left: 0.95rem; z-index: 1; border: 1px solid rgba(255,255,255,0.3); border-radius: 999px; padding: 0.4rem 0.75rem; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.05em; background: rgba(31,24,17,0.74); color: #fff; }
    .hub-spotlight__body { padding: clamp(1rem, 2vw, 1.5rem); display: grid; gap: 0.8rem; align-content: center; }
    .hub-spotlight__kicker { margin: 0; color: var(--accent-strong); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.73rem; font-weight: 800; }
    .hub-spotlight h2 { margin: 0; line-height: 1.12; font-size: clamp(1.45rem, 2.8vw, 2.2rem); font-family: var(--font-display); }
    .hub-spotlight h2 a { color: #2d241d; text-decoration: none; }
    .hub-spotlight p { margin: 0; color: #4b3e33; line-height: 1.65; font-size: 0.98rem; }
    .hub-spotlight__facts { display: grid; gap: 0.44rem; margin: 0; }
    .hub-spotlight__facts span { display: block; color: #4b3e33; font-size: 0.9rem; line-height: 1.52; }
    .hub-spotlight__cta { display: inline-flex; align-items: center; color: var(--accent); text-decoration: none; font-weight: 700; letter-spacing: 0.02em; margin-top: 0.2rem; }
    .hub-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem; margin: 0 0 1.4rem; }
    .hub-card { border: 1px solid var(--line); border-radius: 18px; overflow: hidden; background: var(--surface); display: grid; grid-template-columns: minmax(0, 1fr); }
    .hub-card__media { display: block; overflow: hidden; background: var(--bg-alt); aspect-ratio: 16 / 10; }
    .hub-card__media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .24s ease; }
    .hub-card:hover .hub-card__media img { transform: scale(1.04); }
    .hub-card__body { padding: 0.95rem 1rem 1.1rem; }
    .hub-card__meta { display: flex; flex-wrap: wrap; gap: 0.4rem; color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 0.45rem; }
    .hub-card__meta span { border: 1px solid #dfcfbc; border-radius: 999px; padding: 0.2rem 0.5rem; background: #f8f2e8; }
    .hub-card h3 { margin: 0 0 0.48rem; font-size: clamp(1.02rem, 1.8vw, 1.22rem); line-height: 1.3; font-family: var(--font-display); }
    .hub-card h3 a { color: #2d241d; text-decoration: none; }
    .hub-card p { margin: 0; color: #4b3e33; font-size: 0.92rem; line-height: 1.58; }
    .hub-card__list { margin: 0.7rem 0 0; padding-left: 1.02rem; color: #4b3e33; font-size: 0.88rem; line-height: 1.5; }
    .card-links { margin-top: 0.68rem; display: flex; flex-wrap: wrap; gap: .46rem; }
    .card-links a { display: inline-flex; align-items: center; min-height: 44px; padding: .42rem .66rem; border-radius: 999px; border: 1px solid #d6c4af; background: #f9f4ec; color: #4a3a2d; text-decoration: none; font-size: .8rem; font-weight: 600; }
    .hub-card__cta { margin-top: 0.75rem; display: inline-flex; color: var(--accent); text-decoration: none; font-weight: 700; font-size: 0.9rem; letter-spacing: .01em; }
    .city-groups { display: grid; gap: 1rem; margin: 0 0 2rem; }
    .city-group { border: 1px solid var(--line); border-radius: 18px; padding: 0.9rem; background: var(--surface); }
    .city-group__head { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.76rem; }
    .city-group__head h2 { margin: 0; font-size: clamp(1.05rem, 1.8vw, 1.24rem); font-family: var(--font-display); }
    .city-group__count { border: 1px solid #dcc9b2; border-radius: 999px; padding: 0.28rem 0.58rem; color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.07em; }
    .city-group__cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
    .hub-card--compact .hub-card__body { padding: 0.78rem 0.86rem 0.92rem; }
    .hub-card--compact h3 { font-size: 1rem; }
    .hub-card--compact p { font-size: 0.88rem; }
    .footer { border-top: 1px solid #ddd0bf; padding: 2rem 0 3rem; color: var(--muted); font-size: .9rem; }
    @media (max-width: 960px) {
      .hero-shell { grid-template-columns: minmax(0, 1fr); }
      .hub-spotlight { grid-template-columns: minmax(0, 1fr); }
      .hub-research { grid-template-columns: minmax(0, 1fr); }
    }
    @media (max-width: 760px) {
      .hero-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .hub-grid { grid-template-columns: minmax(0, 1fr); }
      .city-group__cards { grid-template-columns: minmax(0, 1fr); }
      .hero-shell { margin-top: 2.3rem; }
    }
    @media (min-width: 880px) {
      .hub-research { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Lone Star Faux Scapes Case Studies",
    "url": "${SITE_URL}/case-studies",
    "description": "Real installs across Texas with scope details and outcomes.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
${listItems}
      ]
    }
  }
  </script>
${UNIVERSAL_NAV_STYLESHEET}
  <link rel="stylesheet" href="/cro.css">
</head>
<body>
${UNIVERSAL_NAV_MARKUP}
  <main class="container">
    <section class="hero-shell">
      <div>
        <p class="hero-kicker">Published install profiles</p>
        <h1>Case studies from real Texas installs</h1>
        <p>Browse first-hand project profiles to understand the problem solved, the installed scope, and planning notes before you request pricing.</p>
      </div>
      <div class="hero-metrics">
        <article class="hero-metric"><strong>${entries.length}</strong><span>Published project profiles</span></article>
        <article class="hero-metric"><strong>${cityCount}</strong><span>Texas cities represented</span></article>
        <article class="hero-metric"><strong>${audienceCount}</strong><span>Audience categories</span></article>
        <article class="hero-metric"><strong>${entries[0]?.displayDate || '-'}</strong><span>Most recent publish date</span></article>
      </div>
    </section>

    ${renderHubResearchRail(entries)}

    ${spotlight ? renderHubSpotlight(spotlight) : ''}

    ${browseCards.length > 0 ? `
      <section class="hub-grid">
        ${browseCards.map((entry) => renderHubCard(entry)).join('\n')}
      </section>
    ` : ''}

    ${cityGroups.length > 0 ? `
      <section class="city-groups">
        ${cityGroups.map((group) => `
          <section class="city-group">
            <div class="city-group__head">
              <h2>${escapeHtml(group.city)}</h2>
              <span class="city-group__count">${group.entries.length} profile${group.entries.length === 1 ? '' : 's'}</span>
            </div>
            <div class="city-group__cards">
              ${group.entries.map((entry) => renderHubCard(entry, true)).join('\n')}
            </div>
          </section>
        `).join('\n')}
      </section>
    ` : ''}

    <section class="lsfs-cro-section" style="padding-bottom: 3rem;">
      <div class="lsfs-cro-card" data-lsfs-context="case_study_hub_cta">
        <div>
          <p class="lsfs-cro-eyebrow">Need pricing or a scope review?</p>
          <h2 class="lsfs-cro-title">Call us or send the project details.</h2>
          <p class="lsfs-cro-copy">Share the city, project type, rough dimensions, and anything important like fire-doc needs or install timing. We can point you in the right direction quickly.</p>
          <div class="lsfs-cro-actions">
            <a class="lsfs-cro-btn lsfs-cro-btn--primary" href="/pricing" data-lsfs-cta="case_study_hub_pricing">Get ballpark pricing</a>
            <a class="lsfs-cro-btn lsfs-cro-btn--secondary" href="tel:+17609787335" data-lsfs-cta="case_study_hub_call">Call (760) 978-7335</a>
            <a class="lsfs-cro-btn lsfs-cro-btn--tertiary" href="mailto:info@lonestarfauxscapes.com?subject=Project%20Inquiry" data-lsfs-cta="case_study_hub_email">Email your project</a>
          </div>
        </div>
        <div data-lsfs-quote-widget data-lsfs-form-context="case_study_hub_quote" data-lsfs-form-title="Short quote form" data-lsfs-form-copy="Use this if you want a fast next step without a long call." data-lsfs-service="Case study follow-up" data-lsfs-button="Request Pricing"></div>
      </div>
    </section>
  </main>
  <footer class="footer">
    <div class="container">
      &copy; <span id="year"></span> Lone Star Faux Scapes
    </div>
  </footer>
  <script>document.getElementById('year').textContent = String(new Date().getFullYear());</script>
${UNIVERSAL_NAV_SCRIPT}
  <script src="/cro.js"></script>
</body>
</html>`;
};

function buildCaseStudies() {
  console.log('Building case studies...');

  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('  No case study content directory found. Skipping.');
    return;
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.md') && !file.startsWith(TEMPLATE_PREFIX));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const entry of fs.readdirSync(OUTPUT_DIR)) {
    if (entry.endsWith('.html')) {
      fs.unlinkSync(path.join(OUTPUT_DIR, entry));
    }
  }

  const entries = [];
  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const isDraft = data.draft === true || data.published === false;
    const title = cleanText(data.title);
    const summary = cleanText(data.summary);
    const category = cleanText(data.category || data.audience || 'Project');
    const location = cleanText(data.location || 'Texas');
    const fileSlug = sanitizeSlug(file.replace(/\.md$/, ''));
    const slug = sanitizeSlug(data.slug || fileSlug);

    if (isDraft) {
      console.log(`  Draft: ${file} (skipped)`);
      continue;
    }

    if (!title || !summary || !slug) {
      console.log(`  Skipped: ${file} (missing title, summary, or slug)`);
      continue;
    }

    const date = toIsoDate(data.date || fs.statSync(filePath).mtime);
    const updated = toIsoDate(data.updated || data.date || fs.statSync(filePath).mtime);
    const displayDate = formatDate(date);
    const image = toImageSrc(data.image || data.afterImage || data.after_image);
    const routePath = `/case-studies/${slug}`;
    const html = marked.parse(content || '');

    const entry = {
      slug,
      title,
      summary,
      category,
      audience: cleanText(data.audience || data.category || 'Project'),
      city: cleanText(data.city || cityFromLocation(location) || 'Texas'),
      location,
      projectType: cleanText(data.projectType || data.project_type || data.category || 'Artificial greenery installation'),
      problemSolved: cleanText(data.problemSolved || data.problem_solved || summary),
      scope: normalizeStringArray(data.scope),
      dimensions: cleanText(data.dimensions),
      material: normalizeStringArray(data.material || data.productsUsed || data.products_used),
      installTime: cleanText(data.installTime || data.install_time),
      fireRatingNotes: cleanText(data.fireRatingNotes || data.fire_rating_notes),
      documentationNotes: cleanText(data.documentationNotes || data.documentation_notes),
      beforeImages: normalizePathArray(data.beforeImages || data.before_images || data.beforeImage || data.before_image),
      afterImages: normalizePathArray(data.afterImages || data.after_images || data.afterImage || data.after_image || data.image),
      quote: cleanText(data.clientQuote || data.quote),
      quoteAuthor: cleanText(data.quoteAuthor || data.quote_author),
      quoteRole: cleanText(data.quoteRole || data.quote_role),
      relatedServices: normalizePathArray(data.relatedServices || data.related_services),
      featuredPages: normalizePathArray(data.featuredPages || data.featured_pages),
      tags: normalizeStringArray(data.tags),
      date,
      updated,
      displayDate,
      image,
      socialImage: toImageSrc(data.socialImage || data.social_image || data.image || data.afterImage || data.after_image),
      canonical: resolveCanonicalValue(data.canonical, routePath),
      robots: resolveRobotsDirective(data.robots, { noindex: data.noindex === true }),
      seoTitle: cleanText(data.seoTitle || data.seo_title),
      seoDescription: cleanText(data.seoDescription || data.seo_description),
      html,
    };
    entries.push(entry);
  }

  entries.sort((a, b) => b.date.localeCompare(a.date));
  for (const entry of entries) {
    const detailHtml = renderDetailPage(entry, entries);
    const outputPath = path.join(OUTPUT_DIR, `${entry.slug}.html`);
    fs.writeFileSync(outputPath, detailHtml);
    console.log(`  Generated: ${outputPath}`);
  }

  fs.writeFileSync(HUB_FILE, renderHubPage(entries));
  fs.writeFileSync(
    JSON_FILE,
    JSON.stringify(
      entries.map((entry) => ({
        slug: entry.slug,
        title: entry.title,
        summary: entry.summary,
        category: entry.category,
        audience: entry.audience,
        city: entry.city,
        location: entry.location,
        projectType: entry.projectType,
        problemSolved: entry.problemSolved,
        scope: entry.scope,
        dimensions: entry.dimensions,
        material: entry.material,
        installTime: entry.installTime,
        fireRatingNotes: entry.fireRatingNotes,
        documentationNotes: entry.documentationNotes,
        beforeImages: entry.beforeImages,
        afterImages: entry.afterImages,
        quote: entry.quote,
        quoteAuthor: entry.quoteAuthor,
        quoteRole: entry.quoteRole,
        relatedServices: entry.relatedServices,
        featuredPages: entry.featuredPages,
        tags: entry.tags,
        date: entry.date,
        updated: entry.updated,
        displayDate: entry.displayDate,
        image: entry.image,
        socialImage: entry.socialImage,
        path: `/case-studies/${entry.slug}`,
      })),
      null,
      2,
    ),
  );
  console.log(`  Generated: ${HUB_FILE}`);
  console.log(`  Generated: ${JSON_FILE}`);
  console.log(`Case studies build complete! ${entries.length} case studies published.`);
}

buildCaseStudies();

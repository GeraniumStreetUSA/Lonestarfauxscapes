import fs from 'fs';
import path from 'path';
import pricingPageConfig from '../content/pricing-page.js';
import { resolveCanonicalValue, resolveRobotsDirective, toAbsoluteUrl } from '../seo/foundation.js';
import { UNIVERSAL_NAV_MARKUP, UNIVERSAL_NAV_SCRIPT, UNIVERSAL_NAV_STYLESHEET } from './shared-nav.js';

const OUTPUT_FILE = path.resolve('pricing.html');

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const renderSimpleList = (items, className = '') => `          <ul${className ? ` class="${className}"` : ''}>
${items.map(item => `            <li>${escapeHtml(item)}</li>`).join('\n')}
          </ul>`;

const renderTrustPoints = (items) => `          <ul class="trust-list" role="list">
${items
  .map(
    item => `            <li>
              <span class="trust-dot" aria-hidden="true"></span>
              <span>${escapeHtml(item)}</span>
            </li>`,
  )
  .join('\n')}
          </ul>`;

const renderStepList = (items) => `          <ol class="step-list">
${items
  .map(
    item => `            <li>
              <span class="step-list__text">${escapeHtml(item)}</span>
            </li>`,
  )
  .join('\n')}
          </ol>`;

const renderSnapshotCards = (items) =>
  items
    .map(
      (item, index) => `        <article class="snapshot-card${index % 2 === 1 ? ' snapshot-card--alt' : ''}">
          <p class="snapshot-card__eyebrow">${escapeHtml(item.eyebrow)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="snapshot-card__dimensions">${escapeHtml(item.dimensions)}</p>
          <div class="snapshot-card__price">${escapeHtml(item.price)}</div>
          <p class="snapshot-card__summary">${escapeHtml(item.summary)}</p>
${renderSimpleList(item.bullets, 'snapshot-card__list')}
          <a class="inline-link" href="${escapeHtml(item.href)}">${escapeHtml(item.hrefLabel)}</a>
        </article>`,
    )
    .join('\n');

const renderCustomProjects = (items) =>
  items
    .map(
      item => `        <article class="mini-card">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
          <a class="inline-link" href="${escapeHtml(item.href)}">Learn more</a>
        </article>`,
    )
    .join('\n');

const renderDrivers = (items) =>
  items
    .map(
      item => `          <article class="driver-item">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
          </article>`,
    )
    .join('\n');

const renderLinkChips = (items) =>
  items
    .map(item => `<a class="chip" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join('\n');

const buildPage = (config) => {
  const canonical = resolveCanonicalValue(config.meta.canonical, '/pricing');
  const robots = resolveRobotsDirective(config.meta.robots, { fallback: 'index, follow' });
  const socialImage = toAbsoluteUrl(config.meta.socialImage);
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(config.meta.title)}</title>
  <meta name="description" content="${escapeHtml(config.meta.description)}">
  <meta name="robots" content="${escapeHtml(robots)}">
  <meta name="keywords" content="artificial hedge pricing Texas, living wall pricing Texas, artificial hedge cost, living wall cost, Texas hedge installation pricing">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:title" content="${escapeHtml(config.meta.title)}">
  <meta property="og:description" content="${escapeHtml(config.meta.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(socialImage)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(config.meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(config.meta.description)}">
  <meta name="twitter:image" content="${escapeHtml(socialImage)}">
  <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg">
  <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
  <meta name="theme-color" content="#050a07">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap"></noscript>
  <style>
    :root {
      --color-bg: #050a07;
      --color-bg-soft: #0a140f;
      --color-panel: rgba(10, 18, 14, 0.88);
      --color-panel-alt: rgba(15, 27, 21, 0.9);
      --color-line: rgba(255, 255, 255, 0.12);
      --color-text: #f5f2eb;
      --color-text-muted: rgba(245, 242, 235, 0.72);
      --color-accent: #84c090;
      --color-accent-strong: #d5f6b5;
      --font-heading: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
      --font-body: 'Source Sans 3', 'Segoe UI', Arial, sans-serif;
      --container: min(1140px, 92vw);
      --shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
    }

    * { box-sizing: border-box; }

    html {
      overflow-y: scroll;
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      color: var(--color-text);
      font-family: var(--font-body);
      line-height: 1.6;
      background:
        radial-gradient(circle at top left, rgba(132, 192, 144, 0.14), transparent 30%),
        radial-gradient(circle at 80% 10%, rgba(132, 192, 144, 0.08), transparent 24%),
        linear-gradient(180deg, #050a07 0%, #06100c 24%, #050a07 100%);
      -webkit-font-smoothing: antialiased;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    img {
      max-width: 100%;
      display: block;
    }

    .container {
      width: var(--container);
      margin: 0 auto;
    }

    .site-header {
      position: fixed;
      top: 1.25rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      width: min(1200px, 96vw);
      padding: 0.8rem 1.45rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(10, 20, 15, 0.82);
      backdrop-filter: blur(14px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
    }

    .site-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      font-family: var(--font-heading);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      white-space: nowrap;
      line-height: 1;
    }

    .brand-mark {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--color-accent-strong), var(--color-accent));
      box-shadow: 0 0 0 6px rgba(132, 192, 144, 0.14);
      flex: 0 0 auto;
    }

    .site-nav {
      display: flex;
      align-items: center;
      gap: 1.35rem;
    }

    .site-nav a {
      position: relative;
      padding-bottom: 0.25rem;
      font-size: 0.84rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: rgba(255, 255, 255, 0.74);
    }

    .site-nav a:hover,
    .site-nav a:focus-visible {
      color: #fff;
    }

    .site-nav .nav-link::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: linear-gradient(90deg, rgba(132, 192, 144, 0.95), rgba(132, 192, 144, 0.4));
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.2s ease;
    }

    .site-nav .nav-link:hover::after,
    .site-nav .nav-link:focus-visible::after,
    .site-nav .nav-current::after {
      transform: scaleX(1);
    }

    .site-nav .nav-cta {
      padding: 0.55rem 1rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
    }

    .page-shell {
      padding-top: 6.75rem;
    }

    .hero {
      position: relative;
      overflow: hidden;
      padding: clamp(7rem, 11vw, 8.75rem) 0 5rem;
    }

    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(5, 8, 6, 0.88), rgba(12, 22, 17, 0.92));
      z-index: 0;
    }

    .hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background: url('/images/hero/hero-main-1200w.jpg') center/cover no-repeat;
      opacity: 0.2;
      z-index: 0;
    }

    .hero-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
      gap: 1.4rem;
      align-items: start;
    }

    .eyebrow,
    .snapshot-card__eyebrow,
    .hero-note__eyebrow {
      margin: 0 0 0.85rem;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-accent-strong);
    }

    h1,
    h2,
    h3 {
      margin: 0;
      font-family: var(--font-heading);
      line-height: 1.06;
      letter-spacing: -0.035em;
    }

    h1 {
      max-width: 11ch;
      font-size: clamp(2.6rem, 5vw, 4.5rem);
    }

    .hero-copy .lede,
    .panel p,
    .mini-card p,
    .snapshot-card p,
    .footer-copy {
      color: var(--color-text-muted);
    }

    .hero-copy .lede {
      max-width: 58ch;
      margin: 1rem 0 0;
      font-size: 1.08rem;
    }

    .trust-list {
      list-style: none;
      margin: 1.35rem 0 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .trust-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      color: #eef3e7;
    }

    .trust-dot {
      width: 9px;
      height: 9px;
      margin-top: 0.4rem;
      border-radius: 999px;
      flex: 0 0 auto;
      background: linear-gradient(135deg, var(--color-accent-strong), var(--color-accent));
    }

    .cta-row {
      display: flex;
      gap: 0.85rem;
      flex-wrap: wrap;
      margin-top: 1.45rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: 0.9rem 1.25rem;
      border-radius: 999px;
      font-weight: 700;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .btn:hover,
    .btn:focus-visible {
      transform: translateY(-1px);
    }

    .btn-primary {
      color: #0f1c12;
      background: var(--color-accent);
      box-shadow: 0 12px 30px rgba(132, 192, 144, 0.22);
    }

    .btn-secondary {
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.05);
    }

    .hero-note,
    .snapshot-card,
    .mini-card,
    .panel,
    .final-cta {
      border: 1px solid var(--color-line);
      border-radius: 22px;
      background: linear-gradient(180deg, rgba(11, 18, 14, 0.9), rgba(7, 12, 9, 0.94));
      box-shadow: var(--shadow);
    }

    .hero-note {
      padding: 1.35rem;
      backdrop-filter: blur(10px);
    }

    .hero-note h2 {
      font-size: 1.45rem;
      margin-bottom: 0.85rem;
    }

    .step-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.8rem;
      counter-reset: pricing-steps;
    }

    .step-list li {
      display: grid;
      grid-template-columns: 34px 1fr;
      gap: 0.85rem;
      align-items: start;
      color: var(--color-text-muted);
    }

    .step-list li::before {
      counter-increment: pricing-steps;
      content: counter(pricing-steps);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 999px;
      color: #0f1c12;
      font-weight: 700;
      background: linear-gradient(135deg, var(--color-accent-strong), var(--color-accent));
    }

    .section {
      padding: 3.25rem 0 0;
    }

    .snapshot-section {
      position: relative;
      z-index: 2;
      margin-top: -2.2rem;
      padding-top: 0;
    }

    .section-header {
      max-width: 680px;
      margin-bottom: 1.2rem;
    }

    .section-header h2 {
      font-size: clamp(1.9rem, 3vw, 2.8rem);
      margin-bottom: 0.55rem;
    }

    .section-header p {
      margin: 0;
      color: var(--color-text-muted);
    }

    .snapshot-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .snapshot-card {
      padding: 1.45rem;
    }

    .snapshot-card--alt {
      background: linear-gradient(180deg, rgba(13, 24, 19, 0.92), rgba(8, 13, 10, 0.96));
    }

    .snapshot-card__dimensions {
      display: inline-flex;
      margin: 0.8rem 0 0;
      padding: 0.38rem 0.72rem;
      border-radius: 999px;
      font-size: 0.82rem;
      color: #eef3e7;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.04);
    }

    .snapshot-card__price {
      margin: 1rem 0 0.55rem;
      font-family: var(--font-heading);
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1;
      color: #fff;
    }

    .snapshot-card__summary {
      margin: 0 0 0.85rem;
    }

    .snapshot-card__list {
      margin: 0 0 1rem;
      padding-left: 1.1rem;
      color: var(--color-text-muted);
    }

    .snapshot-card__list li + li {
      margin-top: 0.45rem;
    }

    .custom-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .mini-card {
      padding: 1.2rem;
    }

    .mini-card p {
      margin: 0.65rem 0 0.85rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
      gap: 1rem;
      align-items: start;
    }

    .panel {
      padding: 1.35rem;
    }

    .driver-list {
      display: grid;
      gap: 0.9rem;
      margin-top: 1rem;
    }

    .driver-item {
      padding-top: 0.9rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .driver-item:first-child {
      padding-top: 0;
      border-top: none;
    }

    .driver-item h3 {
      font-size: 1.1rem;
      margin-bottom: 0.3rem;
    }

    .driver-item p {
      margin: 0;
    }

    .checklist-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .checklist h3 {
      margin-bottom: 0.6rem;
      font-size: 1.1rem;
    }

    .checklist ul {
      margin: 0;
      padding-left: 1.1rem;
      color: var(--color-text-muted);
    }

    .checklist li + li {
      margin-top: 0.45rem;
    }

    .inline-link {
      color: var(--color-accent-strong);
      font-weight: 700;
    }

    .inline-link:hover,
    .inline-link:focus-visible {
      text-decoration: underline;
    }

    .link-strip {
      padding: 1rem 1.1rem;
      border: 1px solid var(--color-line);
      border-radius: 20px;
      background: linear-gradient(180deg, rgba(10, 18, 14, 0.88), rgba(8, 12, 10, 0.96));
      box-shadow: var(--shadow);
    }

    .link-strip h2 {
      margin-bottom: 0.85rem;
      font-size: 1.15rem;
    }

    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      padding: 0.7rem 0.95rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.04);
      color: #fff;
    }

    .chip:hover,
    .chip:focus-visible {
      color: var(--color-accent-strong);
      border-color: rgba(213, 246, 181, 0.28);
    }

    .final-cta {
      padding: 1.45rem;
      background: linear-gradient(135deg, rgba(132, 192, 144, 0.16), rgba(8, 12, 9, 0.96));
    }

    .final-cta__grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 0.85fr);
      gap: 1rem;
      align-items: start;
    }

    .final-cta__aside {
      padding: 1rem;
      border-radius: 18px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.04);
    }

    .final-cta__aside h3 {
      margin-bottom: 0.45rem;
      font-size: 1.08rem;
    }

    .footer {
      padding: 2.8rem 0 2.5rem;
    }

    .footer-copy {
      margin: 0;
      font-size: 0.92rem;
      text-align: center;
    }

    @media (max-width: 980px) {
      .hero-grid,
      .detail-grid,
      .final-cta__grid {
        grid-template-columns: 1fr;
      }

      .snapshot-grid,
      .custom-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 760px) {
      .site-header {
        top: 0.85rem;
        width: min(94vw, 760px);
        padding: 0.85rem 1rem;
      }

      .site-brand {
        font-size: 0.82rem;
      }

      .site-nav {
        gap: 0.65rem;
      }

      .site-nav a {
        font-size: 0.72rem;
      }

      .site-nav .nav-products,
      .site-nav .nav-locations,
      .site-nav .nav-blog {
        display: none;
      }

      .hero {
        padding-bottom: 4rem;
      }

      .trust-list,
      .checklist-grid {
        grid-template-columns: 1fr;
      }

      .cta-row {
        flex-direction: column;
        align-items: stretch;
      }

      .btn {
        width: 100%;
      }
    }
  </style>
${UNIVERSAL_NAV_STYLESHEET}
  <link rel="stylesheet" href="/cro.css">
</head>
<body>
${UNIVERSAL_NAV_MARKUP}

  <main class="page-shell">
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(config.hero.eyebrow)}</p>
          <h1>${escapeHtml(config.hero.title)}</h1>
          <p class="lede">${escapeHtml(config.hero.description)}</p>
${renderTrustPoints(config.hero.trustPoints)}
          <div class="cta-row">
            <a class="btn btn-primary" href="${escapeHtml(config.hero.primaryCta.href)}">${escapeHtml(config.hero.primaryCta.label)}</a>
            <a class="btn btn-secondary" href="${escapeHtml(config.hero.secondaryCta.href)}">${escapeHtml(config.hero.secondaryCta.label)}</a>
          </div>
        </div>
        <aside class="hero-note">
          <p class="hero-note__eyebrow">Start here</p>
          <h2>No calculator. Just usable starting numbers.</h2>
${renderStepList(config.hero.steps)}
        </aside>
      </div>
    </section>

    <section class="section snapshot-section">
      <div class="container">
        <div class="section-header">
          <h2>${escapeHtml(config.snapshots.title)}</h2>
          <p>${escapeHtml(config.snapshots.description)}</p>
        </div>
        <div class="snapshot-grid">
${renderSnapshotCards(config.snapshots.items)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>${escapeHtml(config.customProjects.title)}</h2>
          <p>${escapeHtml(config.customProjects.description)}</p>
        </div>
        <div class="custom-grid">
${renderCustomProjects(config.customProjects.items)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container detail-grid">
        <article class="panel">
          <h2>${escapeHtml(config.drivers.title)}</h2>
          <div class="driver-list">
${renderDrivers(config.drivers.items)}
          </div>
        </article>
        <article class="panel">
          <h2>${escapeHtml(config.quoteKit.title)}</h2>
          <p>${escapeHtml(config.quoteKit.description)}</p>
          <div class="checklist-grid">
            <div class="checklist">
              <h3>${escapeHtml(config.quoteKit.includedTitle)}</h3>
${renderSimpleList(config.quoteKit.includedItems)}
            </div>
            <div class="checklist">
              <h3>${escapeHtml(config.quoteKit.sendTitle)}</h3>
${renderSimpleList(config.quoteKit.sendItems)}
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="link-strip">
          <h2>${escapeHtml(config.links.title)}</h2>
          <div class="chip-row">
            ${renderLinkChips(config.links.items)}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" data-lsfs-case-studies="austin-high-end-residential-privacy,houston-restaurant-hedges,houston-storefront-hedges" data-lsfs-proof-title="What these scopes look like in the real world" data-lsfs-proof-copy="These are real published projects. They show the kind of structure reuse, mounted hedge work, privacy planning, and site constraints that usually affect price." data-lsfs-proof-layout="three" data-lsfs-proof-context="pricing_proof_section" data-lsfs-proof-secondary-href="/case-studies" data-lsfs-proof-secondary-label="Browse all project profiles"></div>
    </section>

    <section class="section">
      <div class="container">
        <div class="final-cta">
          <div class="final-cta__grid">
            <div>
              <h2>${escapeHtml(config.cta.title)}</h2>
              <p>${escapeHtml(config.cta.description)}</p>
              <div class="cta-row">
                <a class="btn btn-primary" href="${escapeHtml(config.cta.primary.href)}">${escapeHtml(config.cta.primary.label)}</a>
                <a class="btn btn-secondary" href="${escapeHtml(config.cta.secondary.href)}">${escapeHtml(config.cta.secondary.label)}</a>
              </div>
            </div>
            <aside class="final-cta__aside">
              <h3>${escapeHtml(config.cta.asideTitle)}</h3>
              <p>${escapeHtml(config.cta.asideText)}</p>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <section class="section lsfs-cro-section">
      <div class="container">
        <div class="lsfs-cro-card" data-lsfs-context="pricing_page_cta">
          <div>
            <p class="lsfs-cro-eyebrow">Need a tighter number?</p>
            <h2 class="lsfs-cro-title">Send dimensions and photos for a better pricing answer.</h2>
            <p class="lsfs-cro-copy">You do not need a long call just to get started. Share the project type, rough size, city, and any fire-rating or documentation needs and we can point you in the right direction.</p>
            <div class="lsfs-cro-actions">
              <a class="lsfs-cro-btn lsfs-cro-btn--primary" href="/contact" data-lsfs-cta="pricing_request_quote">Request pricing</a>
              <a class="lsfs-cro-btn lsfs-cro-btn--secondary" href="tel:+17609787335" data-lsfs-cta="pricing_call">Call (760) 978-7335</a>
              <a class="lsfs-cro-btn lsfs-cro-btn--tertiary" href="mailto:info@lonestarfauxscapes.com?subject=Pricing%20Request" data-lsfs-cta="pricing_email">Email your project</a>
            </div>
            <div class="lsfs-cro-context">
              <span class="lsfs-cro-pill">Fast install planning</span>
              <span class="lsfs-cro-pill">Custom fabrication when needed</span>
              <span class="lsfs-cro-pill">Fire-rated options available</span>
            </div>
            <div class="lsfs-cro-links">
              <a href="/case-studies" data-lsfs-cta="pricing_recent_local_work">See recent local work</a>
              <a href="mailto:info@lonestarfauxscapes.com?subject=Fire%20Documentation%20Request" data-lsfs-cta="pricing_fire_docs">Request fire-doc info</a>
            </div>
          </div>
          <div data-lsfs-quote-widget data-lsfs-form-context="pricing_page_quote" data-lsfs-form-title="Short quote form" data-lsfs-form-copy="Share the basics and we can give you a more useful next number." data-lsfs-service="Pricing request" data-lsfs-button="Request Pricing"></div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p class="footer-copy">&copy; ${year} Lone Star Faux Scapes, a <a href="https://geraniumstreet.com" target="_blank" rel="noopener">Geranium Street USA</a> brand. Serving Austin, Dallas, Houston, San Antonio, Fort Worth, and projects across Texas.</p>
      </div>
    </footer>
  </main>
${UNIVERSAL_NAV_SCRIPT}
  <script src="/case-study-proofs.js"></script>
  <script src="/cro.js"></script>
</body>
</html>`;
};

const output = buildPage(pricingPageConfig);
fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log(`Built pricing page: ${path.relative(process.cwd(), OUTPUT_FILE)}`);

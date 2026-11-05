import { BUSINESS_ID } from './home-schema.ts';
import { SITE_URL } from './site.ts';

/**
 * Types for the blog pipeline. scripts/build-content.mjs turns
 * content/blog/*.md into src/generated/posts/<slug>.ts (one `BlogPost` each),
 * src/generated/posts/index.ts (the light list for hubs) and
 * src/generated/blog-routes.ts. Nothing under src/generated is edited by hand.
 */

export interface TocEntry {
  /** The heading's `id` in `bodyHtml`, exactly as the live page has it. */
  id: string;
  text: string;
  level: 2 | 3;
}

export interface QuickAnswer {
  question: string;
  answer: string;
}

export interface SnapshotRow {
  label: string;
  value: string;
}

export type GuideModuleType =
  | 'comparisonMatrix'
  | 'checklist'
  | 'timeline'
  | 'pathCards'
  | 'planningGrid'
  | 'decisionTree'
  | 'proofInsert';

/**
 * A flagship guide module. `bodyHtml` holds a `<!-- guide-module:KEY -->`
 * comment where the module belongs. Which fields a module uses depends on its
 * type: comparisonMatrix (`columns`, rows of label/left/right), checklist
 * (`items`), timeline (`steps`, or `items` as bare titles), pathCards (`cards`,
 * or `items`), planningGrid and decisionTree (rows of label/value) and
 * proofInsert (one row of href/title/summary/image).
 */
export interface GuideModule {
  key: string;
  type: GuideModuleType;
  title: string;
  intro: string;
  columns: string[];
  rows: Record<string, string>[];
  items: string[];
  steps: { title: string; description: string }[];
  cards: { title: string; summary: string; bestFor: string }[];
}

export interface NextStep {
  href: string;
  label: string;
  description: string;
}

export interface SupportLink {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * The responsive copies of a photo that scripts/build-content.mjs writes to
 * public/images/blog-r/: AVIF and WebP at each of `widths`, named
 * `${base}-${width}.avif` and `${base}-${width}.webp`.
 */
export interface ImageVariants {
  /** Site-root path without the width and extension, e.g. `/images/blog-r/hedges-hedge-privacy-1-jpg`. */
  base: string;
  widths: number[];
}

export interface BlogPost {
  slug: string;
  /** `/blog/<slug>`. */
  path: string;
  /** The H1. */
  title: string;
  /** The exact `<title>` the live page has (em-dashes aside). */
  seoTitle: string;
  /** The exact meta description the live page has (em-dashes aside). */
  description: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  /** e.g. `Apr 3, 2026`. */
  displayDate: string;
  /** Only when the post's front matter sets `updated`. */
  updated?: string;
  category: string;
  tags: string[];
  /** Topic hub id (see BLOG_TOPICS in generated/posts/index.ts) and its label. */
  topic: string;
  topicLabel: string;
  audience: 'residential' | 'commercial' | 'mixed';
  /** The Texas city the post is about, with its page slug (`austin`), or empty. */
  city: string;
  citySlug: string;
  /** The service page the post points to, e.g. `/pool-privacy-hedge`. */
  primaryServiceHref: string;
  primaryServiceLabel: string;
  featured: boolean;
  featuredScore: number;
  /** Site-root path of the featured image, e.g. `/images/commercial/commercial-2.jpg`. */
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  /** Responsive copies of `image`; the page falls back to `image` itself without them. */
  imageVariants?: ImageVariants;
  summary: string;
  readingMinutes: number;
  toc: TocEntry[];
  /** Article body only: no h1, no CTA, header or footer. */
  bodyHtml: string;
  /** Slugs of related posts, best match first. */
  related: string[];
  supportLinks: SupportLink[];
  /** Present when the front matter has FAQs (the old page carried them as schema only). */
  faq?: FaqItem[];

  /** Flagship guide fields, set only when `guideType` is `flagship`. */
  guideType?: 'flagship';
  guideEyebrow?: string;
  guideAudience?: string;
  guidePromise?: string;
  quickAnswers?: QuickAnswer[];
  decisionSnapshot?: SnapshotRow[];
  guideModules?: GuideModule[];
  verifyTitle?: string;
  verifyItems?: string[];
  nextSteps?: NextStep[];
}

/** What a hub needs about a post: no body, no toc. */
export interface BlogPostSummary {
  slug: string;
  path: string;
  title: string;
  description: string;
  date: string;
  displayDate: string;
  category: string;
  topic: string;
  topicLabel: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  imageVariants?: ImageVariants;
  summary: string;
  readingMinutes: number;
  featuredScore: number;
  city: string;
  guideType?: 'flagship';
}

export interface BlogTopic {
  id: string;
  label: string;
  description: string;
  /** The service or hub page this topic leads to. */
  href: string;
  actionLabel: string;
  /** The post to start with, when the old hub names one. */
  leadSlug?: string;
}

/** The small part of a post the route manifest keeps (the rest loads with the page). */
export interface BlogPostingMeta {
  path: string;
  title: string;
  summary: string;
  image: string;
  datePublished: string;
  dateModified: string;
}

/** The BlogPosting JSON-LD node for a post, added to the shared @graph. */
export function blogPostingNode(meta: BlogPostingMeta): object {
  const url = `${SITE_URL}${meta.path}`;
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: meta.title,
    description: meta.summary,
    image: `${SITE_URL}${meta.image}`,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    author: { '@id': BUSINESS_ID },
    publisher: { '@id': BUSINESS_ID },
    mainEntityOfPage: { '@id': `${url}#webpage` },
    inLanguage: 'en-US',
  };
}

/* ------------------------------------------------------------ post body */

/** One question of a post's FAQ, as the page shows it. */
export interface PostFaqItem {
  /** The id of the question's `<h3>` in the body, kept so links to it still land. */
  id?: string;
  question: string;
  /** The answer as HTML (links kept); what the page renders. */
  answerHtml: string;
  /** The same answer as plain text, for the FAQPage markup. */
  answer: string;
}

/** A post's body in the order the page lays it out. */
export type BodySegment =
  | { kind: 'html'; html: string }
  | { kind: 'module'; key: string }
  | { kind: 'faq'; items: PostFaqItem[]; id: string; title: string; inBody: boolean };

const ENTITIES: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };

/** Plain text of a trusted HTML fragment: tags dropped, entities decoded, whitespace collapsed. */
export function htmlToText(html: string): string {
  return html
    .replace(/<\/(?:p|li|h\d|div|ul|ol)>|<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (whole, dec: string, hex: string, name: string) => {
      if (dec) return String.fromCodePoint(Number(dec));
      if (hex) return String.fromCodePoint(parseInt(hex, 16));
      return ENTITIES[name.toLowerCase()] ?? whole;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

const escapeText = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The ids the articles give their FAQ heading. */
const FAQ_IDS = ['faq', 'frequently-asked-questions'];

/**
 * The FAQ section of a body (an `<h2>` with one of the FAQ ids, up to the next
 * `<h2>`), cut out and parsed. The questions are `<h3>`s with ids or, in a few
 * articles, `<details>` with a `<summary>`.
 */
function cutFaq(html: string): { before: string; id: string; title: string; items: PostFaqItem[]; after: string } | null {
  for (const id of FAQ_IDS) {
    const open = `<h2 id="${id}">`;
    const start = html.indexOf(open);
    if (start < 0) continue;
    const titleEnd = html.indexOf('</h2>', start);
    const headEnd = titleEnd + '</h2>'.length;
    const next = html.slice(headEnd).search(/<h2[\s>]/);
    const end = next < 0 ? html.length : headEnd + next;
    const section = html.slice(headEnd, end);

    const items: PostFaqItem[] = [];
    if (section.includes('<h3 id=')) {
      const parts = section.split(/<h3 id="([^"]*)">/).slice(1);
      for (let index = 0; index < parts.length; index += 2) {
        const [question = '', ...rest] = parts[index + 1].split('</h3>');
        const answerHtml = rest.join('</h3>').trim();
        items.push({ id: parts[index], question: htmlToText(question), answerHtml, answer: htmlToText(answerHtml) });
      }
    } else {
      for (const match of section.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)) {
        const answerHtml = match[2].trim();
        items.push({ question: htmlToText(match[1]), answerHtml, answer: htmlToText(answerHtml) });
      }
    }
    if (items.length === 0) continue;
    return {
      before: html.slice(0, start),
      id,
      title: htmlToText(html.slice(start + open.length, titleEnd)),
      items,
      after: html.slice(end),
    };
  }
  return null;
}

/** The questions of a post's `faq` field, as the page shows them. */
function faqFromFields(faq: readonly FaqItem[]): PostFaqItem[] {
  return faq.map((item) => ({
    question: item.question,
    answerHtml: `<p>${escapeText(item.answer)}</p>`,
    answer: item.answer,
  }));
}

/**
 * Cuts a post's `bodyHtml` into the pieces the page lays out: the article
 * HTML, a flagship guide module wherever its `<!-- guide-module:KEY -->`
 * comment sits, and the FAQ section (parsed, so the page can render it as
 * questions to open and mark up exactly what it shows). A post whose body has
 * no FAQ section but whose front matter has questions (`fieldFaq`) gets them
 * as a FAQ block before its References, or at the end. Every heading id stays
 * in the output; nothing is rewritten.
 */
export function splitPostBody(bodyHtml: string, fieldFaq: readonly FaqItem[] = []): BodySegment[] {
  const cut = cutFaq(bodyHtml);
  let marked = bodyHtml;
  let faq: Extract<BodySegment, { kind: 'faq' }> | null = null;
  if (cut) {
    marked = `${cut.before}<!-- po-faq -->${cut.after}`;
    faq = { kind: 'faq', items: cut.items, id: cut.id, title: cut.title, inBody: true };
  } else if (fieldFaq.length > 0) {
    const at = bodyHtml.indexOf('<h2 id="references"');
    marked = at < 0 ? `${bodyHtml}<!-- po-faq -->` : `${bodyHtml.slice(0, at)}<!-- po-faq -->${bodyHtml.slice(at)}`;
    faq = { kind: 'faq', items: faqFromFields(fieldFaq), id: 'faq', title: 'Common questions', inBody: false };
  }
  const segments: BodySegment[] = [];
  marked.split(/<!--\s*(guide-module:[^\s>]+|po-faq)\s*-->/).forEach((part, index) => {
    if (index % 2 === 0) {
      if (part.trim() !== '') segments.push({ kind: 'html', html: part });
    } else if (part === 'po-faq') {
      if (faq) segments.push(faq);
    } else {
      segments.push({ kind: 'module', key: part.slice('guide-module:'.length) });
    }
  });
  return segments;
}

/**
 * The table of contents to show: each id once (the live pages repeat a few
 * generic H3 ids, and a list needs unique keys), and the FAQ's questions
 * folded into the one FAQ link when the page renders them as a list to open
 * (`faqId` is the id of the FAQ heading in the body, or null).
 */
export function pageToc(toc: readonly TocEntry[], faqId: string | null): TocEntry[] {
  const seen = new Set<string>();
  let inFaq = false;
  return toc.filter((entry) => {
    if (entry.level === 2) inFaq = entry.id === faqId;
    else if (inFaq) return false;
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
}

/* -------------------------------------------------------------- the hubs */

/** `Living Walls` becomes `living-walls`: the key of a category in the hubs' markup and filter. */
export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

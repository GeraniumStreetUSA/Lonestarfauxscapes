// Turns the blog posts (content/blog/*.md at the repo root) into typed modules.
//
//   node scripts/build-content.mjs      (npm run content; npm run build runs it first)
//
// Writes, all regenerated on every run (stale files are removed):
//   src/generated/posts/<slug>.ts         one typed `post` (BlogPost) per post
//   src/generated/posts/<slug>.page.tsx   the lazy route chunk: that post + BlogPostPage
//   src/generated/posts/index.ts          the light list the /blog and /guides hubs read
//   src/generated/blog-routes.ts          one Route per post
//   public/content/posts.json             the old site's /content/posts.json
//   public/content/case-studies.json      the old site's /content/case-studies.json (copied)
//
// The slug, <title>, meta description and heading ids of every post are the
// live page's: Search Console shows jump links to the heading anchors, so the
// rules here are ported one for one from the old builder (scripts/build-blog.js
// and scripts/blog-flagship-guides.js at the repo root). The article body is
// rendered with the same marked call, and the same internal-link rules apply.
// The old page's header, CTA blocks and footer are not part of `bodyHtml`.
//
// Owner rule: no em-dash anywhere. Every generated string has them replaced
// (a comma, or a colon in titles and headings) AFTER the heading ids are
// computed, so an id never changes. Sharp, marked and gray-matter come from
// the repo root's node_modules, as in make-images.mjs.

import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..');
const repoRoot = path.resolve(appRoot, '..');
const require = createRequire(path.join(repoRoot, 'package.json'));
const sharp = require('sharp');
const matter = require('gray-matter');
const { marked } = require('marked');

const CONTENT_DIR = path.join(repoRoot, 'content/blog');
const POSTS_DIR = path.join(appRoot, 'src/generated/posts');
const ROUTES_FILE = path.join(appRoot, 'src/generated/blog-routes.ts');
const PUBLIC_CONTENT = path.join(appRoot, 'public/content');
const VARIANT_DIR = path.join(appRoot, 'public/images/blog-r');
const VARIANT_URL = '/images/blog-r';
const VARIANT_WIDTHS = [480, 768, 1200];

const SITE_URL = 'https://lonestarfauxscapes.com';
const DEFAULT_BLOG_IMAGE = 'images/hedges/hedge-privacy-1.jpg';
const BRAND_NAME = 'Lone Star Faux Scapes';
const MAX_META_TITLE_LENGTH = 60;
const MAX_META_DESCRIPTION_LENGTH = 155;
const MAX_CRUMB_LENGTH = 60;
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DATE_PREFIX_SLUG_REGEX = /^\d{4}-\d{2}-\d{2}-(.+)$/;
const INTERNAL_HREF_REGEX = /href=(["'])([^"']+)\1/gi;
const LEGACY_BLOG_ROUTE_REGEX = /^(\/blog\/)([^/?#]+)([?#].*)?$/i;
/** `<!-- image: /images/x.jpg | what the picture shows -->`; the text after the bar is the alt. */
const IMAGE_COMMENT_REGEX = /<!--\s*image:\s*([^>]+?)\s*-->/gi;
/** Sizes the layout gives the hero and an in-body image (see posts.css). */
const HERO_SIZES = '(min-width: 1024px) 560px, calc(100vw - 32px)';
const BODY_SIZES = '(min-width: 1024px) 720px, calc(100vw - 32px)';
const GUIDE_MODULE_COMMENT_REGEX = /<!--\s*guide-module:\s*([a-z0-9-]+)\s*-->/gi;
const GUIDE_MODULE_TYPES = new Set([
  'comparisonMatrix',
  'checklist',
  'timeline',
  'pathCards',
  'planningGrid',
  'decisionTree',
  'proofInsert',
]);

/** The topic hubs of /guides, as the old builder had them. */
const TOPIC_CONFIG = {
  'artificial-hedges': {
    label: 'Artificial hedge guides',
    description: 'Privacy screens, pool privacy, HOA planning, durability, and installation advice.',
    href: '/artificial-hedge',
    actionLabel: 'Explore hedge installs',
  },
  'living-walls': {
    label: 'Living wall guides',
    description: 'Design, materials, outdoor performance, and maintenance planning for artificial living walls.',
    href: '/living-wall',
    actionLabel: 'Explore living walls',
  },
  'commercial-planning': {
    label: 'Commercial planning',
    description: 'Fire-rated options, documentation, sequencing, and buying guidance for teams specifying greenery.',
    href: '/commercial-resources',
    actionLabel: 'Use the resource hub',
  },
  'local-guides': {
    label: 'Texas city guides',
    description: 'Planning help for Austin, Dallas, Houston, San Antonio, and Fort Worth projects.',
    href: '/locations',
    actionLabel: 'See Texas coverage',
  },
};
const GUIDE_HUB_FEATURED_SLUGS = [
  'nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery',
  'indoor-vs-outdoor-artificial-living-walls-materials-and-design',
  'diy-vs-professional-artificial-hedge-installation',
];
const TOPIC_LEAD_SLUGS = {
  'artificial-hedges': 'diy-vs-professional-artificial-hedge-installation',
  'living-walls': 'indoor-vs-outdoor-artificial-living-walls-materials-and-design',
  'commercial-planning': 'nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery',
  'local-guides': 'dallas-privacy-without-the-watering-a-real-guide',
};
const CITY_PAGE_MAP = {
  austin: { slug: 'austin', label: 'Austin', href: '/austin' },
  dallas: { slug: 'dallas', label: 'Dallas', href: '/dallas' },
  houston: { slug: 'houston', label: 'Houston', href: '/houston' },
  'san antonio': { slug: 'san-antonio', label: 'San Antonio', href: '/san-antonio' },
  'fort worth': { slug: 'fort-worth', label: 'Fort Worth', href: '/fort-worth' },
};
const CITY_MATCHERS = Object.entries(CITY_PAGE_MAP).map(([key, meta]) => ({
  key,
  meta,
  regex: new RegExp(`\\b${key.replace(/\s+/g, '\\s+')}\\b`, 'i'),
}));
const FEATURED_KEYWORDS = /\b(complete guide|pricing|cost|roi|nfpa|astm|fire code|fire-rated artificial greenery|hoa approval|materials)\b/i;
const COMMERCIAL_SIGNAL_REGEX = /\b(commercial|multifamily|property manager|office|retail|restaurant|hotel|hospitality|architect|designer|general contractor|\bgc\b|specifier|submittal|shop drawing|acoustic|fire code|code|compliance|ahj)\b/i;
const RESIDENTIAL_SIGNAL_REGEX = /\b(home|homeowner|residential|backyard|pool|privacy|hoa|balcony|patio|fence)\b/i;
const LIVING_WALL_SIGNAL_REGEX = /\b(living wall|green wall)\b/i;
const FIRE_SIGNAL_REGEX = /\b(fire|nfpa|astm|submittal|code|documentation)\b/i;

// ---------------------------------------------------------------- text helpers

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);
const isProtocolRelativeUrl = (value) => value.startsWith('//');

const escapeHtmlAttribute = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const repairCommonEncodingIssues = (value) =>
  String(value ?? '')
    .replace(/â€™|â€˜/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/â€“|â€”/g, '-')
    .replace(/Â°F/g, '°F')
    .replace(/Â/g, '');

const normalizeText = (value) => repairCommonEncodingIssues(value).replace(/\s+/g, ' ').trim();
const cleanText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const truncateAtWordBoundary = (value, maxLength) => {
  const normalized = normalizeText(value);
  if (normalized.length <= maxLength) return normalized;
  const clipped = normalized.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(' ');
  const safeText = (lastSpace > Math.floor(maxLength * 0.6) ? clipped.slice(0, lastSpace) : clipped).trim();
  return `${safeText}…`;
};

const buildSeoTitle = (title) => {
  const baseTitle = normalizeText(title);
  if (!baseTitle) return BRAND_NAME;
  const withBrand = `${baseTitle} | ${BRAND_NAME}`;
  if (withBrand.length <= MAX_META_TITLE_LENGTH) return withBrand;
  if (baseTitle.length <= MAX_META_TITLE_LENGTH) return baseTitle;
  return truncateAtWordBoundary(baseTitle, MAX_META_TITLE_LENGTH);
};

const buildSeoDescription = (description) => truncateAtWordBoundary(description, MAX_META_DESCRIPTION_LENGTH);

const decodeEntities = (value) =>
  value
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');

const normalizeStringArray = (value) =>
  Array.isArray(value) ? value.map((item) => normalizeText(item)).filter(Boolean) : [];

/** The em-dash rule. Titles and headings get a colon, running text a comma. */
const EM_DASH = /\s*\u2014\s*/g;
const noEmDash = (value) => value.replace(EM_DASH, ', ');
const noEmDashInTitle = (value) => value.replace(EM_DASH, ': ');
const noEmDashInHtml = (html) =>
  html
    .replace(/<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/g, (_m, tag, attrs, inner) => `<${tag}${attrs}>${noEmDashInTitle(inner)}</${tag}>`)
    .replace(/<\/strong>\s*\u2014\s*/g, '</strong>: ')
    .replace(EM_DASH, ', ');

/** Replaces em-dashes in every string of a value; `id` fields are left alone. */
function scrub(value, key = '') {
  if (typeof value === 'string') {
    if (key === 'id') return value;
    if (key === 'bodyHtml') return noEmDashInHtml(value);
    if (key === 'title' || key === 'seoTitle' || key === 'text') return noEmDashInTitle(value);
    return noEmDash(value);
  }
  if (Array.isArray(value)) return value.map((item) => scrub(item, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, scrub(v, k)]));
  }
  return value;
}

// ------------------------------------------------------------------- links

const canonicalizeInternalHref = (href, slugAliasMap = new Map()) => {
  const raw = typeof href === 'string' ? href.trim() : '';
  if (!raw) return href;
  // Ignore external/special protocols and in-page anchors.
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(raw)) return href;
  if (raw.includes('${')) return href;

  const match = raw.match(/^([^?#]*)([?#].*)?$/);
  if (!match) return href;

  let pathname = match[1] || '';
  const suffix = match[2] || '';
  const lowerPath = pathname.toLowerCase();

  if (lowerPath === '/admin/index.html' || lowerPath === 'admin/index.html') return `/admin/${suffix}`;
  if (lowerPath === '/index.html' || lowerPath === 'index.html') return `/${suffix}`;
  if (lowerPath === '/blog.html' || lowerPath === 'blog.html') return `/blog${suffix}`;

  const legacyBlogMatch = pathname.match(LEGACY_BLOG_ROUTE_REGEX);
  if (legacyBlogMatch) {
    const resolvedSlug = slugAliasMap.get(legacyBlogMatch[2]);
    if (resolvedSlug) return `${legacyBlogMatch[1]}${resolvedSlug}${suffix || legacyBlogMatch[3] || ''}`;
  }

  if (lowerPath.endsWith('.html')) pathname = pathname.slice(0, -5);
  if (!pathname.startsWith('/') && !pathname.startsWith('./') && !pathname.startsWith('../')) pathname = `/${pathname}`;
  if (pathname.length > 1 && pathname.endsWith('/') && pathname !== '/admin/') pathname = pathname.replace(/\/+$/, '');
  pathname = pathname.replace(/\/{2,}/g, '/');
  return `${pathname}${suffix}`;
};

const normalizeInternalLinksInHtml = (html, slugAliasMap) =>
  html.replace(
    INTERNAL_HREF_REGEX,
    (_full, quote, href) => `href=${quote}${canonicalizeInternalHref(href, slugAliasMap)}${quote}`,
  );

// ------------------------------------------------------------------ slugs, dates

const sanitizeFrontmatterSlug = (value) => {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/** The front matter slug, else the file name without its date prefix. */
function resolvePostSlug(frontmatterSlug, fileSlug) {
  const explicitSlug = sanitizeFrontmatterSlug(frontmatterSlug);
  if (explicitSlug) return explicitSlug;
  const match = fileSlug.match(DATE_PREFIX_SLUG_REGEX);
  return match ? match[1] : fileSlug;
}

const toIsoDateKey = (value, fallbackDate) => {
  if (typeof value === 'string') {
    const dateMatch = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateMatch) return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
  }
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallbackDate.toISOString().slice(0, 10);
  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (iso) => {
  const match = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return String(iso || '');
  return `${MONTHS_SHORT[Number(match[2]) - 1]} ${Number(match[3])}, ${Number(match[1])}`;
};

// ------------------------------------------------------------------- images

const imageSizes = new Map();

/** Width and height of a site-root image path, read from the repo's files. */
async function imageSize(imagePath) {
  const clean = imagePath.split('?')[0].split('#')[0].replace(/^\//, '');
  if (!imageSizes.has(clean)) {
    const file = path.join(repoRoot, clean);
    if (!existsSync(file)) return null;
    const { width, height } = await sharp(file).metadata();
    imageSizes.set(clean, width && height ? { width, height } : null);
  }
  return imageSizes.get(clean);
}

const resolvePostImage = (imagePath, slug) => {
  const raw = typeof imagePath === 'string' ? imagePath.trim() : '';
  const normalized = raw || DEFAULT_BLOG_IMAGE;
  if (isAbsoluteUrl(normalized) || isProtocolRelativeUrl(normalized)) return normalized;
  if (existsSync(path.join(repoRoot, normalized.split('?')[0].split('#')[0].replace(/^\//, '')))) return normalized;
  console.warn(`  Missing image for ${slug}: ${normalized}. Falling back to ${DEFAULT_BLOG_IMAGE}`);
  return DEFAULT_BLOG_IMAGE;
};

const toSitePath = (imagePath) =>
  isAbsoluteUrl(imagePath) || isProtocolRelativeUrl(imagePath) || imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

const buildAltFromPath = (imagePath) => {
  const filename = String(imagePath || '').split('?')[0].split('#')[0].split('/').pop() || '';
  const alt = filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
  return alt || 'Blog image';
};

const buildInlineImageTag = ({ src, alt }) =>
  `<img src="${toSitePath(src)}" alt="${escapeHtmlAttribute(alt || buildAltFromPath(src))}" loading="lazy" decoding="async">`;

/** Adds width and height to every local <img> that lacks them (no layout shift). */

/**
 * Five posts carry their own <script> that adds `<prefix>-visible` to every
 * `<prefix>-reveal` block as it scrolls in; their <style> hides the block
 * until then. Scripts in bodyHtml never run on the new site, so the blocks
 * would stay hidden. Ship them in their finished state and drop the scripts.
 */
function settleScriptedBlocks(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>\s*/gi, '')
    .replace(/class="([^"]*?\b([a-z]+)-reveal\b[^"]*)"/g, (match, classes, prefix) =>
      classes.includes(`${prefix}-visible`) ? match : `class="${classes} ${prefix}-visible"`,
    );
}

async function addImageDimensions(html) {
  const tags = [...new Set(html.match(/<img\b[^>]*>/gi) ?? [])];
  let out = html;
  for (const tag of tags) {
    if (/\swidth=/i.test(tag)) continue;
    const src = /\ssrc=(["'])([^"']+)\1/i.exec(tag)?.[2];
    if (!src || isAbsoluteUrl(src) || isProtocolRelativeUrl(src)) continue;
    const size = await imageSize(src);
    if (!size) {
      console.warn(`  No dimensions for inline image ${src}`);
      continue;
    }
    out = out.replaceAll(tag, tag.replace(/<img\b/i, `<img width="${size.width}" height="${size.height}"`));
  }
  return out;
}

const fileHashes = new Map();
const contentHash = (imagePath) => {
  const file = path.join(repoRoot, imagePath.split('?')[0].split('#')[0].replace(/^\//, ''));
  if (!fileHashes.has(file)) fileHashes.set(file, existsSync(file) ? createHash('md5').update(readFileSync(file)).digest('hex') : file);
  return fileHashes.get(file);
};

/** A photo shows once per article: the hero, or a file already placed, is not repeated in the text. */
const uniqueBodyImages = (images, hero) => {
  const seen = new Set([contentHash(hero)]);
  return images.filter(({ src }) => {
    const key = contentHash(src);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const extractCommentImages = (markdown) => {
  const images = [];
  const cleaned = markdown.replace(IMAGE_COMMENT_REGEX, (_, raw) => {
    const [src, ...rest] = String(raw).split('|');
    const value = src.trim();
    if (value) images.push({ src: value, alt: rest.join('|').trim() });
    return '';
  });
  return { cleaned, images };
};

const insertImagesAfterHeadings = (html, imagePaths, maxInsertions = 3) => {
  if (!imagePaths || imagePaths.length === 0) return html;

  let result = '';
  let cursor = 0;
  let inserted = 0;
  const limit = Math.min(maxInsertions, imagePaths.length);

  while (inserted < limit) {
    const h2Start = html.indexOf('<h2', cursor);
    if (h2Start === -1) break;
    const h2Close = html.indexOf('</h2>', h2Start);
    if (h2Close === -1) break;

    const h2End = h2Close + '</h2>'.length;
    const nextH2Start = html.indexOf('<h2', h2End);

    let insertPos = h2End;
    const pStart = html.indexOf('<p', h2End);
    if (pStart !== -1 && (nextH2Start === -1 || pStart < nextH2Start)) {
      const pEnd = html.indexOf('</p>', pStart);
      if (pEnd !== -1 && (nextH2Start === -1 || pEnd < nextH2Start)) insertPos = pEnd + '</p>'.length;
    }

    result += html.slice(cursor, insertPos);
    result += `\n${buildInlineImageTag(imagePaths[inserted])}\n`;
    cursor = insertPos;
    inserted += 1;
  }

  result += html.slice(cursor);
  if (inserted < imagePaths.length) {
    result += `\n${imagePaths.slice(inserted).map(buildInlineImageTag).join('\n')}\n`;
  }
  return result;
};

// ------------------------------------------------- embedded components

/**
 * Five posts carry their own components (`hoa-`, `gw-`, `rva-`, `prv-`, `rst-`
 * classes) and a <style> block written for the old dark site. The styles now
 * live in src/styles/post-embeds.css, so the old block must not ship: it also
 * holds page-wide rules (`.article-hero`, `.breadcrumb`, `.article-content`)
 * that would leak into the new pages. What stays in the markup is made to need
 * no script and no inline style.
 */
const EMBED_PREFIXES = 'hoa|gw|rva|prv|rst';

const stripTags = (html) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/** Comparison tables get a row header, a label on every cell (phones show them as cards) and a name for the empty corner. */
function enhanceCompareTables(html) {
  const wrapper = new RegExp(`(<div class="(?:${EMBED_PREFIXES})-compare\\b[^"]*">\\s*)<table>([\\s\\S]*?)</table>`, 'g');
  return html.replace(wrapper, (_whole, open, inner) => {
    const [head = '', body = ''] = inner.split(/<\/thead>/);
    const labels = [...head.matchAll(/<th>([\s\S]*?)<\/th>/g)].map((m) => stripTags(m[1]));
    const header = head.replace(/<th>([\s\S]*?)<\/th>/g, (_m, text) =>
      stripTags(text) === '' ? '<th scope="col"><span class="po-e-sr">Topic</span></th>' : `<th scope="col">${text}</th>`,
    );
    const rows = body.replace(/<tr>([\s\S]*?)<\/tr>/g, (_row, cells) => {
      let column = -1;
      const out = cells.replace(/<td((?:\s[^>]*)?)>([\s\S]*?)<\/td>/g, (_cell, attrs, text) => {
        column += 1;
        if (column === 0) return `<th scope="row"${attrs}>${text}</th>`;
        return `<td${attrs} data-label="${escapeHtmlAttribute(labels[column] ?? '')}">${text}</td>`;
      });
      return `<tr>${out}</tr>`;
    });
    return `${open}<table>${header}</thead>${rows}</table>`;
  });
}

/** The scripts drew these in; now the finished state is in the markup. */
function settleEmbeddedComponents(html) {
  return enhanceCompareTables(
    html
      .replace(/<style\b[\s\S]*?<\/style>\s*/gi, '')
      // Inline colours were the old theme's; the cost bars' width becomes a custom property.
      .replace(/\sstyle="[^"]*"/gi, '')
      .replace(/(\sdata-width="(\d{1,3})")/g, '$1 style="--w:$2%"')
      // A leading emoji on a source chip is decoration; the chip's words say it all.
      .replace(new RegExp(`(<a class="(?:${EMBED_PREFIXES})-source-chip"[^>]*>)\\s*&#\\d+;\\s*`, 'g'), '$1'),
  );
}

// -------------------------------------------------------- responsive images

const variantCache = new Map();
const isNewer = async (out, source) => {
  try {
    return (await stat(out)).mtimeMs >= (await stat(source)).mtimeMs;
  } catch {
    return false;
  }
};

/**
 * AVIF and WebP at 480, 768 and 1200 w (never wider than the source) in
 * public/images/blog-r/<path-with-dashes>-<w>.<ext>. A file is skipped when it
 * exists and is newer than its source, so a rebuild only encodes what changed.
 * Returns `{ base, widths }` (the srcset is `${base}-${w}.avif ${w}w`), or null
 * for an image that is not in the repo.
 */
async function ensureVariants(sitePath) {
  const rel = sitePath.split('?')[0].split('#')[0].replace(/^\//, '');
  if (variantCache.has(rel)) return variantCache.get(rel);
  const source = path.join(repoRoot, rel);
  if (isAbsoluteUrl(sitePath) || !existsSync(source) || !rel.startsWith('images/')) {
    variantCache.set(rel, null);
    return null;
  }
  const name = rel.slice('images/'.length).replace(/[/.]+/g, '-').toLowerCase();
  const meta = await sharp(source).metadata();
  const sourceWidth = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
  const widths = VARIANT_WIDTHS.filter((w) => w <= sourceWidth);
  if (sourceWidth < VARIANT_WIDTHS[VARIANT_WIDTHS.length - 1] && !widths.includes(sourceWidth)) widths.push(sourceWidth);
  await mkdir(VARIANT_DIR, { recursive: true });
  await Promise.all(
    widths.flatMap((w) =>
      ['avif', 'webp'].map(async (ext) => {
        const out = path.join(VARIANT_DIR, `${name}-${w}.${ext}`);
        if (await isNewer(out, source)) return;
        const image = sharp(source).rotate().resize({ width: w, withoutEnlargement: true });
        await (ext === 'avif' ? image.avif({ quality: 50, effort: 4 }) : image.webp({ quality: 76, effort: 4 })).toFile(out);
      }),
    ),
  );
  const result = { base: `${VARIANT_URL}/${name}`, widths };
  variantCache.set(rel, result);
  return result;
}

const variantSources = ({ base, widths }, sizes) =>
  ['avif', 'webp']
    .map((ext) => {
      const srcset = widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
      return `<source type="image/${ext}" srcset="${srcset}" sizes="${sizes}">`;
    })
    .join('');

/** Every in-body photo of the repo becomes a <picture>; the <img> keeps its original src, which old image URLs and Google Images know. */
async function pictureifyImages(html) {
  const tags = [...new Set(html.match(/<img\b[^>]*>/gi) ?? [])];
  let out = html;
  for (const tag of tags) {
    const src = /\ssrc=(["'])([^"']+)\1/i.exec(tag)?.[2];
    if (!src) continue;
    const variants = await ensureVariants(src);
    if (!variants) continue;
    const img = tag
      .replace(/<img\b/i, (m) => (/\sloading=/i.test(tag) ? m : `${m} loading="lazy"`))
      .replace(/<img\b/i, (m) => (/\sdecoding=/i.test(tag) ? m : `${m} decoding="async"`));
    out = out.replaceAll(tag, `<picture>${variantSources(variants, BODY_SIZES)}${img}</picture>`);
  }
  return out;
}

// ------------------------------------------------------------ headings and toc

/**
 * Heading ids, ported as is (the live ids depend on every quirk): h2 and h3
 * only, text lowercased, anything but a-z 0-9 space and hyphen dropped, spaces
 * to hyphens, cut at 50 characters. No ids and no toc under three headings.
 */
function addHeadingIds(htmlContent) {
  const headingRegex = /<h([23])>(.*?)<\/h\1>/gi;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1]);
    // `## New wording {#old-id}` keeps a heading's live anchor when its wording
    // changes (Google links to these anchors).
    const pinned = /\s*\{#([a-z0-9-]+)\}\s*$/.exec(match[2]);
    const raw = match[2].replace(/<[^>]*>/g, '');
    const text = pinned ? raw.replace(/\s*\{#[a-z0-9-]+\}\s*$/, '') : raw;
    const id = pinned
      ? pinned[1]
      : text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50);
    headings.push({ level, raw, text, id });
  }

  if (headings.length < 3) return { toc: [], content: htmlContent };

  let modifiedContent = htmlContent;
  headings.forEach(({ level, raw, text, id }) => {
    const originalHeading = new RegExp(`<h${level}>${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h${level}>`, 'i');
    modifiedContent = modifiedContent.replace(originalHeading, `<h${level} id="${id}">${text}</h${level}>`);
  });

  return {
    toc: headings.map(({ level, text, id }) => ({ id, text: decodeEntities(text), level })),
    content: modifiedContent,
  };
}

// ----------------------------------------------------------- flagship guides

const normalizeStringList = (value) => (Array.isArray(value) ? value.map(cleanText).filter(Boolean) : []);

const normalizeModule = (item) => ({
  key: cleanText(item?.key),
  type: cleanText(item?.type),
  title: cleanText(item?.title),
  intro: cleanText(item?.intro),
  columns: normalizeStringList(item?.columns),
  rows: Array.isArray(item?.rows)
    ? item.rows.map((row) =>
        Object.fromEntries(
          Object.entries(row ?? {}).filter(([, v]) => typeof v === 'string' || typeof v === 'number').map(([k, v]) => [k, cleanText(v)]),
        ),
      )
    : [],
  items: normalizeStringList(item?.items),
  steps: Array.isArray(item?.steps)
    ? item.steps
        .map((s) => ({ title: cleanText(s?.title), description: cleanText(s?.description) }))
        .filter((s) => s.title && s.description)
    : [],
  cards: Array.isArray(item?.cards)
    ? item.cards
        .map((c) => ({ title: cleanText(c?.title), summary: cleanText(c?.summary), bestFor: cleanText(c?.bestFor) }))
        .filter((c) => c.title && (c.summary || c.bestFor))
    : [],
});

/** Throws on what the old builder threw on; warns where it warned. */
function validateModule(module, slug) {
  const where = `[flagship-guides] ${slug}: module "${module.key}" (${module.type})`;
  if (!GUIDE_MODULE_TYPES.has(module.type)) throw new Error(`${where}: unsupported type`);
  const rowsNeedLabelValue = module.type === 'decisionTree';
  if (rowsNeedLabelValue) {
    if (module.rows.length === 0) throw new Error(`${where}: missing rows`);
    module.rows.forEach((row, i) => {
      if (!row.label || !row.value) throw new Error(`${where}: row ${i + 1} is missing label or value`);
    });
  }
  if (module.type === 'proofInsert') {
    if (module.rows.length !== 1) throw new Error(`${where}: expected exactly 1 proof row, got ${module.rows.length}`);
    const [row] = module.rows;
    if (!row.href || !row.title || !row.summary) throw new Error(`${where}: proof row is missing href, title, or summary`);
  }
  if (module.type === 'comparisonMatrix' && (module.columns.length === 0 || module.rows.length === 0)) {
    console.warn(`${where}: missing columns or rows`);
  }
  if (module.type === 'checklist' && module.items.length === 0) console.warn(`${where}: missing items`);
  if (module.type === 'timeline' && module.steps.length === 0 && module.items.length === 0) console.warn(`${where}: missing steps`);
  if (module.type === 'pathCards' && module.cards.length === 0 && module.items.length === 0) console.warn(`${where}: missing cards`);
  if (module.type === 'planningGrid' && module.rows.length === 0) console.warn(`${where}: missing rows`);
}

function normalizeGuide(data, post) {
  if (cleanText(data?.guideType) !== 'flagship') return null;

  const modules = (Array.isArray(data.guideModules) ? data.guideModules : [])
    .map(normalizeModule)
    .filter((module) => module.key && module.type);
  const seen = new Set();
  for (const module of modules) {
    if (seen.has(module.key)) throw new Error(`[flagship-guides] Duplicate module key "${module.key}" in guide "${post.slug}"`);
    seen.add(module.key);
    validateModule(module, post.slug);
  }

  const pairs = (value, a, b) =>
    Array.isArray(value)
      ? value.map((item) => ({ [a]: cleanText(item?.[a]), [b]: cleanText(item?.[b]) })).filter((item) => item[a] && item[b])
      : [];

  return {
    guideType: 'flagship',
    guideEyebrow: cleanText(data.guideEyebrow),
    guideAudience: cleanText(data.guideAudience),
    guidePromise: cleanText(data.guidePromise || post.summary),
    quickAnswers: pairs(data.quickAnswers, 'question', 'answer'),
    decisionSnapshot: pairs(data.decisionSnapshot, 'label', 'value'),
    guideModules: modules,
    verifyTitle: cleanText(data.verifyTitle || 'What To Verify'),
    verifyItems: normalizeStringList(data.verifyItems),
    nextSteps: Array.isArray(data.nextSteps)
      ? data.nextSteps
          .map((item) => ({ href: cleanText(item?.href), label: cleanText(item?.label), description: cleanText(item?.description) }))
          .filter((item) => item.href && item.label && item.description)
      : [],
  };
}

/** Keeps the module placeholders in the body in one exact form and checks they match the modules. */
function normalizeModulePlaceholders(html, guideModules, slug) {
  const used = new Set();
  const keys = new Set(guideModules.map((module) => module.key));
  const out = html.replace(GUIDE_MODULE_COMMENT_REGEX, (_m, key) => {
    const normalized = cleanText(key);
    if (!keys.has(normalized)) throw new Error(`[flagship-guides] ${slug}: placeholder "${normalized}" has no module`);
    used.add(normalized);
    return `<!-- guide-module:${normalized} -->`;
  });
  for (const key of keys) {
    if (!used.has(key)) console.warn(`[flagship-guides] ${slug}: module "${key}" has no placeholder in the body`);
  }
  return out;
}

// ------------------------------------------------------ topic, city, related

const inferCityMeta = (post) => {
  const explicitCity = normalizeText(post.city).toLowerCase().replace(/,\s*tx\b/i, '');
  if (explicitCity) {
    const directMatch = CITY_MATCHERS.find(({ key }) => explicitCity.includes(key));
    if (directMatch) return directMatch.meta;
  }
  const searchableText = normalizeText([post.title, post.summary, post.tags.join(' ')].join(' ')).toLowerCase();
  const inferred = CITY_MATCHERS.find(({ regex }) => regex.test(searchableText));
  return inferred ? inferred.meta : null;
};

const normalizeAudienceValue = (value) => {
  const normalized = normalizeText(value).toLowerCase();
  if (!normalized) return '';
  if (/(mixed|both|all|residential and commercial)/.test(normalized)) return 'mixed';
  if (/(commercial|architect|designer|contractor|property manager|multifamily)/.test(normalized)) return 'commercial';
  if (/(residential|homeowner|home)/.test(normalized)) return 'residential';
  return '';
};

const searchable = (post) => normalizeText([post.title, post.summary, post.category, post.tags.join(' ')].join(' '));

const inferAudience = (post) => {
  const explicitAudience = normalizeAudienceValue(post.audience);
  if (explicitAudience) return explicitAudience;
  const text = searchable(post);
  const isCommercial = COMMERCIAL_SIGNAL_REGEX.test(text);
  const isResidential = RESIDENTIAL_SIGNAL_REGEX.test(text);
  if (isCommercial && isResidential) return 'mixed';
  if (isCommercial) return 'commercial';
  if (isResidential) return 'residential';
  return 'mixed';
};

const inferPrimaryService = (post) => {
  const explicitServicePage = canonicalizeInternalHref(post.servicePage || '');
  if (explicitServicePage) return { href: explicitServicePage, label: 'See the matching service page' };

  const text = searchable(post);
  if (/\bpool\b/i.test(text)) return { href: '/pool-privacy-hedge', label: 'See pool privacy screens' };
  if (/\bhoa\b/i.test(text)) return { href: '/hoa-approved-artificial-hedge', label: 'See HOA-friendly hedge options' };
  if (LIVING_WALL_SIGNAL_REGEX.test(text)) return { href: '/living-wall', label: 'See artificial living wall installs' };
  if (FIRE_SIGNAL_REGEX.test(text) && /\bhedge\b/i.test(text)) {
    return { href: '/fire-rated-artificial-hedge', label: 'See fire-rated hedge options' };
  }
  if (COMMERCIAL_SIGNAL_REGEX.test(text)) return { href: '/commercial', label: 'See commercial greenery installs' };
  if (RESIDENTIAL_SIGNAL_REGEX.test(text)) return { href: '/residential', label: 'See residential privacy installs' };
  return { href: '/artificial-hedge', label: 'See artificial hedge installs' };
};

const inferTopicId = (post) => {
  const explicitTopic = sanitizeFrontmatterSlug(post.topic);
  if (explicitTopic && TOPIC_CONFIG[explicitTopic]) return explicitTopic;

  const text = searchable(post);
  if (post.cityMeta || /local updates/i.test(post.category || '')) return 'local-guides';
  if (/living walls|design/i.test(post.category || '')) return 'living-walls';
  if (LIVING_WALL_SIGNAL_REGEX.test(text)) {
    return /compliance/i.test(post.category || '') ? 'commercial-planning' : 'living-walls';
  }
  if (/compliance/i.test(post.category || '') || COMMERCIAL_SIGNAL_REGEX.test(text) || FIRE_SIGNAL_REGEX.test(text)) {
    return 'commercial-planning';
  }
  return 'artificial-hedges';
};

const inferFeaturedScore = (post) => {
  if (post.featured === true) return 120;
  const text = searchable(post);
  let score = 0;
  if (/complete guide/i.test(post.title)) score += 80;
  if (FEATURED_KEYWORDS.test(text)) score += 40;
  if (post.tags.length >= 4) score += 10;
  return score;
};

const buildPostSupportLinks = (post) => {
  const links = [];
  const seen = new Set();
  const pushLink = (href, label, description) => {
    const normalizedHref = canonicalizeInternalHref(href || '');
    if (!normalizedHref || seen.has(normalizedHref)) return;
    seen.add(normalizedHref);
    links.push({ href: normalizedHref, label, description });
  };

  pushLink(post.primaryServiceHref, post.primaryServiceLabel, 'Go straight to the service page that matches this article.');
  if (post.cityMeta) {
    pushLink(post.cityMeta.href, `See the ${post.cityMeta.label} city page`, 'Use the local page for city-specific planning, FAQs, and service details.');
  }
  if (post.audience === 'commercial') {
    pushLink('/commercial', 'See commercial installs', 'Use this page for lobbies, retail, hospitality, multifamily, and other commercial scopes.');
    pushLink('/commercial-resources', 'Request fire-doc and spec help', 'Use the resource hub when you need documentation, sequencing, or submittal support.');
  } else if (post.audience === 'residential') {
    pushLink('/residential', 'See residential installs', 'Use this page for backyard privacy, pool screening, and homeowner planning.');
  } else {
    pushLink('/commercial', 'See commercial installs', 'Use this page for offices, retail, hospitality, and property teams.');
    pushLink('/residential', 'See residential installs', 'Use this page for backyard privacy, pool screening, and homeowner planning.');
  }
  pushLink('/pricing', 'See ballpark pricing', 'Get a quick starting point before you reach out with measurements.');
  pushLink('/case-studies', 'See recent local work', 'Browse project snapshots and proof from recent installs.');
  return links.slice(0, 4);
};

const enrichPost = (post) => {
  const cityMeta = inferCityMeta(post);
  const audience = inferAudience(post);
  const primaryService = inferPrimaryService(post);
  const topic = inferTopicId({ ...post, cityMeta });
  const featuredScore = inferFeaturedScore(post);
  const enriched = {
    ...post,
    cityMeta,
    city: cityMeta?.label || normalizeText(post.city),
    citySlug: cityMeta?.slug || '',
    audience,
    primaryServiceHref: primaryService.href,
    primaryServiceLabel: primaryService.label,
    topic,
    topicLabel: TOPIC_CONFIG[topic].label,
    featured: post.featured === true || featuredScore > 0,
    featuredScore,
  };
  return { ...enriched, supportLinks: buildPostSupportLinks(enriched) };
};

const scoreRelatedPost = (current, candidate) => {
  if (!candidate || current.slug === candidate.slug) return -Infinity;
  let score = 0;
  if (current.topic && current.topic === candidate.topic) score += 40;
  if (normalizeText(current.category).toLowerCase() === normalizeText(candidate.category).toLowerCase()) score += 25;
  if (current.citySlug && current.citySlug === candidate.citySlug) score += 25;
  if (current.primaryServiceHref && current.primaryServiceHref === candidate.primaryServiceHref) score += 18;
  if (current.audience && current.audience === candidate.audience) score += 12;

  const currentTags = new Set(current.tags.map((tag) => tag.toLowerCase()).filter(Boolean));
  const sharedTags = candidate.tags.map((tag) => tag.toLowerCase()).filter((tag) => currentTags.has(tag)).length;
  score += Math.min(sharedTags * 6, 18);
  score += Math.min(candidate.featuredScore || 0, 18);
  return score;
};

const selectRelatedPosts = (posts, current, limit = 3) =>
  posts
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => ({ candidate, score: scoreRelatedPost(current, candidate) }))
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : b.candidate.date.localeCompare(a.candidate.date)))
    .slice(0, limit)
    .map(({ candidate }) => candidate);

// ------------------------------------------------------------------- build

const plainWords = (html) => html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;

const crumbLabel = (title) => {
  if (title.length <= MAX_CRUMB_LENGTH) return title;
  const clipped = title.slice(0, MAX_CRUMB_LENGTH - 1);
  return `${clipped.slice(0, clipped.lastIndexOf(' ')).trim()}…`;
};

const tsFile = (header, body) => `// ${header}\n// Generated by scripts/build-content.mjs. Do not edit by hand.\n\n${body}`;

async function readPosts(now) {
  const todayIsoDate = now.toISOString().slice(0, 10);
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md')).sort();
  const posts = [];
  const seenSlugs = new Set();

  for (const file of files) {
    const { data, content } = matter(await readFile(path.join(CONTENT_DIR, file), 'utf-8'));
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    const summary = typeof data.summary === 'string' ? data.summary.trim() : '';

    if (data.draft === true || data.published === false) {
      console.log(`  Draft: ${file} (skipped)`);
      continue;
    }
    if (!title || !summary) {
      console.log(`  Skipped: ${file} (missing title or summary)`);
      continue;
    }

    const fileSlug = file.replace(/\.md$/, '');
    const slug = resolvePostSlug(data.slug, fileSlug);
    if (seenSlugs.has(slug)) throw new Error(`Duplicate blog slug detected: "${slug}" from ${file}`);
    seenSlugs.add(slug);

    const publishDate = toIsoDateKey(data.date, now);
    if (publishDate > todayIsoDate) {
      console.log(`  Scheduled: ${slug} (publishes ${publishDate})`);
      continue;
    }

    const image = resolvePostImage(data.image, slug);
    const post = {
      fileSlug,
      slug,
      title,
      date: publishDate,
      datePublished: publishDate,
      dateModified: toIsoDateKey(data.updated ?? data.date, now),
      updated: data.updated ? toIsoDateKey(data.updated, now) : undefined,
      displayDate: formatDisplayDate(publishDate),
      image,
      socialImage: resolvePostImage(data.socialImage || data.image, slug),
      summary,
      category: data.category || 'Guides',
      tags: normalizeStringArray(data.tags),
      relatedUrl: data.relatedUrl || '',
      faq: Array.isArray(data.faq) ? data.faq : [],
      seoTitle: data.seoTitle || '',
      seoDescription: data.seoDescription || '',
      canonical: data.canonical ? String(data.canonical) : `${SITE_URL}/blog/${slug}`,
      robots: data.noindex === true ? 'noindex, follow' : String(data.robots || 'index, follow'),
      city: typeof data.city === 'string' ? data.city.trim() : '',
      topic: typeof data.topic === 'string' ? data.topic.trim() : '',
      audience: typeof data.audience === 'string' ? data.audience.trim() : '',
      servicePage: typeof data.servicePage === 'string' ? data.servicePage.trim() : '',
      schemaAbout: typeof data.schemaAbout === 'string' ? data.schemaAbout.trim() : '',
      featured: data.featured === true,
    };
    post.guide = normalizeGuide(data, post);

    const { cleaned, images } = extractCommentImages(content);
    const { toc, content: withIds } = addHeadingIds(marked(cleaned));
    post.toc = toc;
    post.body = insertImagesAfterHeadings(withIds, uniqueBodyImages(images, image), 3);
    posts.push(enrichPost(post));
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

async function main() {
  const now = new Date();
  console.log('Building blog content...');
  const posts = await readPosts(now);
  if (posts.length === 0) throw new Error('No blog posts found in content/blog');

  const slugAliasMap = new Map();
  for (const post of posts) if (post.slug !== post.fileSlug) slugAliasMap.set(post.fileSlug, post.slug);
  for (const post of posts) post.relatedPosts = selectRelatedPosts(posts, post, 3);

  // ---- one BlogPost per post
  const built = [];
  for (const post of posts) {
    const size = await imageSize(toSitePath(post.image));
    if (!size) throw new Error(`${post.slug}: no dimensions for featured image ${post.image}`);

    let body = normalizeInternalLinksInHtml(post.body, slugAliasMap);
    if (post.guide) body = normalizeModulePlaceholders(body, post.guide.guideModules, post.slug);
    body = await addImageDimensions(body);
    body = settleEmbeddedComponents(settleScriptedBlocks(body));
    body = await pictureifyImages(body);
    const heroVariants = await ensureVariants(toSitePath(post.image));

    const seoTitle = buildSeoTitle(post.seoTitle || post.title);
    const description = buildSeoDescription(post.seoDescription || post.summary);
    const guide = post.guide
      ? {
          ...post.guide,
          nextSteps: post.guide.nextSteps.map((step) => ({ ...step, href: canonicalizeInternalHref(step.href, slugAliasMap) })),
          guideModules: post.guide.guideModules.map((module) =>
            module.type === 'proofInsert'
              ? { ...module, rows: module.rows.map((row) => ({ ...row, href: canonicalizeInternalHref(row.href, slugAliasMap) })) }
              : module,
          ),
        }
      : {};
    const faq = post.faq
      .map((item) => ({ question: cleanText(item?.question), answer: cleanText(item?.answer) }))
      .filter((item) => item.question && item.answer);

    built.push(
      scrub({
        slug: post.slug,
        path: `/blog/${post.slug}`,
        title: normalizeText(post.title),
        seoTitle,
        description,
        date: post.date,
        displayDate: post.displayDate,
        ...(post.updated ? { updated: post.updated } : {}),
        category: normalizeText(post.category),
        tags: post.tags,
        topic: post.topic,
        topicLabel: post.topicLabel,
        audience: post.audience,
        city: post.city,
        citySlug: post.citySlug,
        primaryServiceHref: post.primaryServiceHref,
        primaryServiceLabel: post.primaryServiceLabel,
        featured: post.featured,
        featuredScore: post.featuredScore,
        image: toSitePath(post.image),
        imageWidth: size.width,
        imageHeight: size.height,
        imageAlt: normalizeText(post.title),
        ...(heroVariants ? { imageVariants: heroVariants } : {}),
        summary: normalizeText(post.summary),
        readingMinutes: Math.max(1, Math.round(plainWords(body) / 220)),
        toc: post.toc,
        bodyHtml: body,
        related: post.relatedPosts.map((related) => related.slug),
        supportLinks: post.supportLinks,
        ...(faq.length > 0 ? { faq } : {}),
        ...guide,
      }),
    );
  }

  // ---- src/generated/posts
  await rm(POSTS_DIR, { recursive: true, force: true });
  await mkdir(POSTS_DIR, { recursive: true });
  const literal = (value) => JSON.stringify(value, null, 2);

  for (const post of built) {
    await writeFile(
      path.join(POSTS_DIR, `${post.slug}.ts`),
      tsFile(
        post.path,
        `import type { BlogPost } from '../../data/blog.ts';\n\nexport const post: BlogPost = ${literal(post)};\n`,
      ),
    );
    await writeFile(
      path.join(POSTS_DIR, `${post.slug}.page.tsx`),
      tsFile(
        `The lazy page chunk for ${post.path}: this post's data with the shared template.`,
        `import BlogPostPage from '../../pages/BlogPostPage';\nimport type { PageProps } from '../../routes';\nimport { post } from './${post.slug}';\n\nexport default function Page({ route }: PageProps) {\n  return <BlogPostPage route={route} post={post} />;\n}\n`,
      ),
    );
  }

  const summaries = built.map((post) => ({
    slug: post.slug,
    path: post.path,
    title: post.title,
    description: post.description,
    date: post.date,
    displayDate: post.displayDate,
    category: post.category,
    topic: post.topic,
    topicLabel: post.topicLabel,
    image: post.image,
    imageWidth: post.imageWidth,
    imageHeight: post.imageHeight,
    imageAlt: post.imageAlt,
    ...(post.imageVariants ? { imageVariants: post.imageVariants } : {}),
    summary: post.summary,
    readingMinutes: post.readingMinutes,
    featuredScore: post.featuredScore,
    city: post.city,
    ...(post.guideType ? { guideType: post.guideType } : {}),
  }));
  const categories = [...new Set(summaries.map((post) => post.category))];
  const topics = Object.entries(TOPIC_CONFIG).map(([id, config]) => ({
    id,
    ...config,
    ...(summaries.some((post) => post.slug === TOPIC_LEAD_SLUGS[id]) ? { leadSlug: TOPIC_LEAD_SLUGS[id] } : {}),
  }));
  const featured = GUIDE_HUB_FEATURED_SLUGS.filter((slug) => summaries.some((post) => post.slug === slug));

  await writeFile(
    path.join(POSTS_DIR, 'index.ts'),
    tsFile(
      'The light post list for the /blog and /guides hubs (newest first).',
      `import type { BlogPostSummary, BlogTopic } from '../../data/blog.ts';\n\n` +
        `/** Every published post, newest first. Posts with \`guideType\` are the flagship guides. */\n` +
        `export const POSTS: readonly BlogPostSummary[] = ${literal(summaries)};\n\n` +
        `/** The categories in use (front matter \`category\`), in the order they first appear. */\n` +
        `export const BLOG_CATEGORIES: readonly string[] = ${literal(categories)};\n\n` +
        `/** The /guides topic hubs, as the old builder had them. */\n` +
        `export const BLOG_TOPICS: readonly BlogTopic[] = ${literal(topics)};\n\n` +
        `/** The posts the /guides hub features first, in order. */\n` +
        `export const FEATURED_GUIDE_SLUGS: readonly string[] = ${literal(featured)};\n`,
    ),
  );

  // ---- src/generated/blog-routes.ts
  const routeEntries = built.map((post) => {
    const meta = {
      path: post.path,
      title: post.title,
      summary: post.summary,
      image: post.image,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
    };
    return `  {
    path: ${JSON.stringify(post.path)},
    type: 'post',
    title: ${JSON.stringify(post.seoTitle)},
    description: ${JSON.stringify(post.description)},
    robots: 'index',
    sitemap: true,
    breadcrumbs: [HOME, BLOG, { label: ${JSON.stringify(crumbLabel(post.title))}, href: ${JSON.stringify(post.path)} }],
    hasQuoteForm: false,
    load: () => import('./posts/${post.slug}.page'),
    schema: () => [blogPostingNode(${JSON.stringify(meta)})],
  },`;
  });
  await writeFile(
    ROUTES_FILE,
    tsFile(
      'One route per blog post (`/blog/<slug>`).',
      `import { blogPostingNode } from '../data/blog.ts';\nimport type { Crumb, Route } from '../routes.ts';\n\n` +
        `const HOME: Crumb = { label: 'Home', href: '/' };\nconst BLOG: Crumb = { label: 'Blog', href: '/blog' };\n\n` +
        `/**\n * Title and description are the live page's own. Each post's text loads\n * with its page (\`./posts/<slug>.page\`), so the manifest stays small.\n */\n` +
        `export const BLOG_ROUTES: readonly Route[] = [\n${routeEntries.join('\n')}\n];\n`,
    ),
  );

  // ---- public/content/*.json (the old site served both)
  await mkdir(PUBLIC_CONTENT, { recursive: true });
  const postsJson = posts.map((post) => {
    const { body, toc, faq, relatedPosts, supportLinks, cityMeta, guide, updated, ...rest } = post;
    void [body, toc, faq, relatedPosts, supportLinks, cityMeta, guide, updated];
    return scrub(rest);
  });
  await writeFile(path.join(PUBLIC_CONTENT, 'posts.json'), `${JSON.stringify(postsJson, null, 2)}\n`);
  await copyFile(path.join(repoRoot, 'content/case-studies.json'), path.join(PUBLIC_CONTENT, 'case-studies.json'));

  console.log(`Blog content built: ${built.length} posts, ${built.filter((p) => p.guideType).length} flagship guides.`);
}

main().catch((error) => {
  console.error('Blog content build failed.');
  console.error(error);
  process.exitCode = 1;
});

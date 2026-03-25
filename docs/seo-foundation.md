# SEO Foundation

## Goal

Create one reusable SEO layer for the site so canonicals, robots directives, sitemap eligibility, social tags, and structured data stay consistent across:

- static marketing pages
- city and service pages
- generated blog posts
- generated case studies
- utility routes that must stay live but should not rank

This was implemented without changing the existing autoblogger file flow:

`content/blog/*.md -> scripts/build-blog.js -> blog/*.html -> vite build`

Image paths, markdown locations, and existing required frontmatter fields were left intact.

## What Changed

### Shared SEO layer

- Added [`seo/foundation.js`](/C:/dev/loanstar/seo/foundation.js)
  - normalizes canonical URLs
  - normalizes robots directives
  - decides sitemap eligibility
  - extracts existing page metadata safely
  - builds one JSON-LD graph per page
  - emits reusable Organization, WebSite, HomeAndConstructionBusiness, Service, WebPage, BreadcrumbList, FAQPage, BlogPosting, and Article markup
- Added [`seo/vite-plugin.js`](/C:/dev/loanstar/seo/vite-plugin.js)
  - applies the shared SEO layer to every built HTML page
  - warns on duplicate indexable titles and descriptions during build
- Wired the plugin into [`vite.config.ts`](/C:/dev/loanstar/vite.config.ts)

### Sitemap and crawl controls

- Updated [`scripts/generate-sitemap.js`](/C:/dev/loanstar/scripts/generate-sitemap.js)
  - reuses the same canonical and robots logic as the build layer
  - excludes static utility routes through shared rules
  - excludes generated content if it is `noindex` or not self-canonical
  - uses `updated` when available for `lastmod`
- Updated [`config/indexing-rules.js`](/C:/dev/loanstar/config/indexing-rules.js)
  - keeps hedge builder utility pages out of the XML sitemap
- Updated [`sitemap.html`](/C:/dev/loanstar/sitemap.html)
  - removed utility hedge-builder links from the HTML sitemap

### Generated content compatibility

- Updated [`scripts/build-blog.js`](/C:/dev/loanstar/scripts/build-blog.js)
- Updated [`scripts/build-case-studies.js`](/C:/dev/loanstar/scripts/build-case-studies.js)

Both generators now support these optional frontmatter fields without changing existing required fields:

```yaml
seoTitle: "Optional custom title"
seoDescription: "Optional custom meta description"
socialImage: "images/example.webp"
canonical: "https://lonestarfauxscapes.com/blog/example-post"
robots: "noindex, follow"
noindex: true
updated: 2026-03-05
```

Notes:

- `noindex: true` is additive. Old posts keep indexing normally.
- `canonical` is optional. If omitted, the default route URL is used.
- `socialImage` is optional. If omitted, the normal page image is used.
- Existing autoblogger posts with only `title`, `summary`, `date`, `image`, `category`, `tags`, and optional `faq` still build the same way.

### Utility route protection

- Updated [`_headers`](/C:/dev/loanstar/_headers)
  - `noindex, nofollow` for `/admin`, `/admin/`, `/admin/*`, and `/admin/config.yml`
  - `noindex, follow` for `/sitemap`, `/terms`, `/privacy`, `/hedge-builder-commercial`, and `/hedge-builder-residential`

## Structured Data Coverage

| Page type | Schema emitted |
| --- | --- |
| Homepage | `Organization`, `WebSite`, `WebPage`, `HomeAndConstructionBusiness`, `Service`, `FAQPage` |
| Service pages | `Organization`, `HomeAndConstructionBusiness`, `Service`, `WebPage`, `BreadcrumbList`, `FAQPage` when FAQ content exists |
| City pages | `Organization`, `HomeAndConstructionBusiness`, `Service`, `WebPage`, `BreadcrumbList` |
| Blog index | `Organization`, `WebPage` (`Blog` type) and `BreadcrumbList` |
| Blog post | `Organization`, `WebPage`, `BlogPosting`, `BreadcrumbList`, `FAQPage` when FAQ content exists |
| Case studies index | `Organization`, `WebPage` (`CollectionPage` type), `BreadcrumbList` |
| Case study detail | `Organization`, `WebPage`, `Article`, `BreadcrumbList` |
| Utility pages | `WebPage` only, plus `noindex` |

Business facts were pulled from existing repo content only:

- brand: `Lone Star Faux Scapes`
- phone: `(760) 978-7335`
- address: `21933 Briarcliff Dr, Spicewood, TX 78669, US`
- hours: `Mo-Fr 08:00-16:00`

## Before / After Examples

### 1. Homepage `/`

Before:

- metadata and schema lived only in [`index.html`](/C:/dev/loanstar/index.html)
- no shared sitewide canonical or robots logic
- future edits risked drift between homepage and inner pages

After:

- build injects one normalized metadata block and one JSON-LD graph
- canonical is always `https://lonestarfauxscapes.com/`
- homepage emits `Organization`, `WebSite`, `WebPage`, `HomeAndConstructionBusiness`, service summaries, and `FAQPage`

### 2. Service page `/living-wall`

Before:

- page-specific title, description, OG tags, and JSON-LD were manually maintained
- breadcrumb/schema consistency depended on the individual source file
- duplicate schema scripts could remain in final output

After:

- build strips old JSON-LD and replaces it with one normalized graph
- page emits consistent canonical, robots, OG, Twitter, `Service`, `BreadcrumbList`, and `FAQPage`
- service pages inherit the same sitemap and canonical rules as the rest of the site

### 3. Generated blog post `/blog/{slug}`

Before:

- [`scripts/build-blog.js`](/C:/dev/loanstar/scripts/build-blog.js) emitted standalone SEO tags and `BlogPosting` schema
- no shared override contract for `noindex`, `canonical`, or `socialImage`
- sitemap eligibility was based mostly on draft/date state

After:

- generated posts can optionally set `noindex`, `robots`, `canonical`, `socialImage`, and `updated`
- build output is normalized by the same Vite SEO layer as static pages
- final post output includes canonical, robots, OG, Twitter, `BlogPosting`, and `BreadcrumbList`

Case studies now use the same optional metadata contract, but emit `Article` instead of `BlogPosting`.

## Verification

Syntax checks:

- `node --check seo/foundation.js`
- `node --check seo/vite-plugin.js`
- `node --check scripts/generate-sitemap.js`
- `node --check scripts/build-blog.js`
- `node --check scripts/build-case-studies.js`

Build:

- `npm run build`

Manual spot checks performed in `dist/`:

- homepage has canonical, robots, OG/Twitter, and homepage schema graph
- service page has a single `Service`, single `BreadcrumbList`, and single `FAQPage`
- city page has consistent canonical, OG/Twitter, and local service-area business schema
- blog post has canonical, robots, article social metadata, and `BlogPosting`
- case study has canonical, robots, article social metadata, and `BreadcrumbList`
- XML sitemap does not include hedge builder, privacy, terms, or HTML sitemap routes
- utility hedge-builder page is emitted with `noindex, follow`

## Remaining Notes

- The build still reports pre-existing Vite warnings for legacy non-module `<script>` tags.
- The build still reports pre-existing unresolved `__VITE_ASSET__...` placeholders in some pages.
- Those warnings were already present and were not introduced by this SEO foundation work.

## Recommended Next Steps

1. Convert remaining legacy page scripts to `type="module"` or otherwise modernize the static page script loading.
2. Decide whether any blog or case study entries should actually use the new optional `noindex` or custom canonical fields.
3. Add Search Console validation after deploy:
   - inspect homepage
   - inspect one city page
   - inspect one service page
   - inspect one blog post
   - inspect one case study

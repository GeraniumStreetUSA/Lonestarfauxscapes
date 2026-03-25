# Content Governance

## Goal

Keep the site useful, indexable, and maintainable as pricing, city pages, case studies, blog content, and technical resources grow.

This document is the quality bar for future additions. If a new page or asset fails the bar below, it should not be indexed and may not deserve to be published at all.

## Core Rules

- Do not publish unsupported claims.
- Do not fabricate testimonials, project stats, guarantees, or local office claims.
- Do not create pages that only swap a city name and keep the same substance.
- Do not add sitemap URLs unless the page is canonical, indexable, and useful on its own.
- If a page is helpful to users but weak for search, keep it live and mark it `noindex, follow`.
- If a page is junk, spam, or internal-only, remove it and return `410 Gone` where appropriate.

## Indexation Rules

### Indexable by default

- Homepage
- Main service pages
- Pricing page
- Core city pages with strong unique value
- Blog index
- High-quality blog posts
- Case-study index and real case-study detail pages
- Commercial resource hub

### Usually `noindex, follow`

- Utility pages that must exist but are not ranking targets
- Suburb/service-area support pages without enough unique proof
- Search-like or filter-like pages
- Builder/configurator pages if they are not intended ranking targets

### Remove or block

- Junk URLs
- Report pages
- Lighthouse artifacts
- Test/demo/staging routes
- Spam content
- Duplicate static exports with no user value

## Pricing Update Rules

### Source of truth

- Update `content/pricing-page.js`
- Rebuild with:
  - `npm run build:pricing`
  - `npm run build`

### Publish criteria

- Public numbers must be owner-approved.
- Numbers must be framed as planning examples or ranges, not universal promises.
- If a category varies too much for a truthful public number, keep it custom-quoted.
- Do not add owner-review notes or TODO text to customer-facing pricing copy.

### Current approved public examples

- Artificial hedge
  - `10 ft long x 6 ft tall x about 1 ft deep`
  - `$2,500+ installed`
- Artificial living wall
  - `10 ft x 10 ft wall`
  - `$2,500+ installed`

## City Page Rules

### Quality bar for indexable city pages

A city page should only be indexable if it has:

- a direct city-specific H1 and intro
- distinct use cases for that market
- distinct local FAQ coverage
- meaningful service-page links
- honest proof or clearly labeled nearby proof
- a clear CTA path

### Current policy

- Core cities can be indexable.
- Surrounding suburb pages should remain `noindex, follow` unless they earn promotion with real proof and distinct value.
- Use service-area language, not fake physical-office claims.

### Update workflow

1. Edit the city page HTML.
2. If the page changes indexation status, update:
   - `seo/foundation.js`
   - `_headers`
   - any sitemap/indexing rules that apply
3. Run `npm run build`.
4. Re-check sitemap membership and robots output.

## Case Study Rules

### Source of truth

- Use `content/case-studies/_template.md`
- Add new entries under `content/case-studies/`
- Rebuild with:
  - `npm run build:case-studies`
  - `npm run build`

### Required fields

- title
- city
- project type
- audience (`residential` or `commercial`)
- problem solved
- scope
- before/after or supporting imagery
- related service pages

### Optional only if real

- client quote
- fire-rating notes
- documentation notes
- install timing specifics
- dimensions
- material or product names

### Content rule

- If a quote is not real, leave it blank.
- If metrics are not verified, do not invent them.
- If a project is nearby but not in that exact city, label it honestly as a Texas or metro-area proof point.

## Blog Governance Rules

### Source of truth

- Add posts in `content/blog/`
- Rebuild with:
  - `npm run build:blog`
  - `npm run build`

### Minimum quality bar

A blog post should not be published unless it has:

- a clear search intent
- a real answer, not filler
- at least one strong next step into a money page
- at least one relevant internal link to a service page, city page, pricing page, case study, or B2B hub
- original value beyond what the service page already says

### Internal-linking rules

- Use readable anchors.
- Link only where the next page actually helps the reader.
- Prefer one pricing link, one service/city link, and one proof/resource link when relevant.
- Avoid stuffing repeated city/service anchors into every paragraph.

### Frontmatter / metadata guidance

Optional fields already supported by the generator include:

- `topic`
- `audience`
- `city`
- `servicePage`
- `featured`
- SEO override fields where needed

Only use overrides when they improve clarity. Do not create duplicate intent by overriding metadata to target unrelated keywords.

## Technical Docs / B2B Resource Rules

### What can be published

- Fire-rated option explanations
- request-based documentation workflows
- shop drawing / framing coordination guidance
- sequencing guidance
- sample / consultation request paths

### What cannot be faked

- downloadable spec sheets that do not exist
- test reports that are not on hand
- warranty documents that are not finalized
- acoustic claims without support

If the file does not exist, use a request CTA instead of a fake download button.

## Image and Media Rules

- Every new image path must resolve in the repo and in the built output.
- Prefer compressed WebP or AVIF when possible.
- Keep descriptive alt text for content images.
- Avoid publishing oversized originals when a smaller derivative will do.
- After adding a post or case study, confirm the image renders in local preview and in the built output.

## Thin Content Prevention Rules

Use this decision test before adding or keeping a page:

1. Would the page still be useful if the target keyword were removed from the title?
2. Does it have information, proof, or structure not already covered elsewhere?
3. Does it deserve to rank on its own, or is it only a doorway into another page?

If the answer to those questions is weak:

- merge it into a stronger parent page
- keep it live but `noindex, follow`
- or do not publish it

## Maintenance Checklist For Any New Content

- Add or update the source content.
- Run the appropriate build command.
- Run `npm run build`.
- Check the rendered page in local preview.
- Confirm:
  - canonical tag is correct
  - robots tag is correct
  - schema exists and parses
  - internal links work
  - images resolve
  - no placeholder or owner-review text is visible
- Confirm whether the page belongs in the sitemap.

## Escalation Rules

Get business-owner approval before publishing:

- new public pricing ranges
- new warranty claims
- new guarantee language
- new compliance or certification claims
- new downloadable documentation
- new address, hours, or physical-location claims

# Case Study System

## Goal
Package project proof in a reusable way that supports trust, internal linking, and future SEO growth without inventing quotes or stats.

## Source of truth
- Markdown source lives in `content/case-studies/`
- Generator lives in `scripts/build-case-studies.js`
- Output pages:
  - `case-studies.html`
  - `case-studies/*.html`
- Generated data file:
  - `content/case-studies.json`

## Content model

### Required fields
- `title`
- `slug`
- `date`
- `summary`
- `city`
- `location`
- `projectType`
- `problemSolved`
- `image`

### Recommended fields
- `updated`
- `audience`
- `scope`
- `dimensions`
- `material`
- `installTime`
- `documentationNotes`
- `relatedServices`
- `featuredPages`
- `tags`

### Optional fields
- `fireRatingNotes`
- `beforeImages`
- `afterImages`
- `quote`
- `quoteAuthor`
- `quoteRole`
- `seoTitle`
- `seoDescription`
- `socialImage`
- `draft`

## Authoring rules
- Use `content/case-studies/_template.md` for new entries.
- Do not fabricate testimonials or client quotes.
- Do not add fake project counts, timelines, or dimensions.
- If a detail is unknown, leave it blank or omit it.
- Use `documentationNotes` and `fireRatingNotes` only when the project actually required that detail.

## What the generator produces

### Detail pages
Each case-study detail page now includes:
- Better top-line project metadata
- Before/after media support when available
- Project snapshot cards for scope, material, install timing, and documentation
- Optional quote block
- Related service links
- A shared CRO block with quote form, phone, and email actions

### Hub page
The case-study index now shows:
- More useful card metadata
- Problem solved
- Install timing
- Stronger card links into detail pages
- A shared quote CTA at the bottom

### Data feed
`content/case-studies.json` is generated from the same markdown. It is used by `case-study-proofs.js` to render proof-card sections on other pages.

## Reusable proof sections

### How they work
Pages can add a placeholder like:

```html
<div
  data-lsfs-case-studies="austin-high-end-residential-privacy,houston-storefront-hedges"
  data-lsfs-proof-title="Recent Texas install snapshots"
  data-lsfs-proof-copy="Real project profiles that show scope and install planning."
  data-lsfs-proof-context="homepage_proof_section"
  data-lsfs-proof-secondary-href="/case-studies"
  data-lsfs-proof-secondary-label="Browse all project profiles"
></div>
```

Then load:

```html
<script src="/case-study-proofs.js"></script>
```

### Supported placeholder attributes
- `data-lsfs-case-studies`
  - Comma-separated list of case-study slugs to render
- `data-lsfs-proof-title`
  - Section heading
- `data-lsfs-proof-copy`
  - Section intro text
- `data-lsfs-proof-layout`
  - Use `three` for a three-card layout
- `data-lsfs-proof-context`
  - Tracking context for CTA clicks
- `data-lsfs-proof-secondary-href`
  - Optional secondary text link
- `data-lsfs-proof-secondary-label`
  - Optional secondary text label

## Seeded case studies
- `austin-high-end-residential-privacy`
- `houston-restaurant-hedges`
- `houston-storefront-hedges`

These were chosen because the repo already had image assets and supportable project framing for them.

## Scaling later
- Add new markdown entry
- Run `npm run build:case-studies` or `npm run build`
- Reference the new slug inside any proof-section placeholder

No page-specific component rewrite is needed to feature a new project profile.

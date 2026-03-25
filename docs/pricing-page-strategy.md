# Pricing Page Strategy

## Goal

Keep `/pricing` useful for pricing-intent visitors without turning it into a long guide that hurts trust or readability.

## Current Direction

The page is now intentionally short.

It does five jobs only:

1. Show two owner-approved starting examples.
2. Explain which project types are still custom-quoted.
3. Show the few factors that move pricing the most.
4. Tell the visitor what to send for a better ballpark.
5. Push the visitor to call or request pricing.

## Owner-Approved Public Starting Examples

- Artificial hedge
  - Example used on page: `10 ft long x 6 ft tall x about 1 ft deep`
  - Public starting number: `$2,500+ installed`

- Artificial living wall
  - Example used on page: `10 ft x 10 ft wall`
  - Public starting number: `$2,500+ installed`

These are presented as planning examples, not universal flat pricing.

## Still Custom-Quoted

- Fence extensions
- Commercial feature walls
- Pool privacy screens

Reason: these categories still vary too much by attachment method, access, code requirements, sightlines, and fabrication to publish a cleaner public number yet.

## Copy Strategy

### 1. Fast answer first

The page leads with:

- two visible starting examples
- a short explanation of what to do next
- direct quote CTAs

That removes the "I have to call just to learn anything" problem without making the page feel like homework.

### 2. Less explanation, more signal

The previous version had too many sections and too much explanatory copy.

The current version keeps only:

- starting examples
- custom-quoted categories
- pricing drivers
- quote prep
- CTA

### 3. Plain language only

The page avoids internal-sounding phrases, vague premium language, and long framing text.

The copy should read like a confident estimator, not a brochure.

## UI / UX Direction

- Short scan length on desktop and mobile
- Strong price cards near the top
- Fewer paragraphs, more visual grouping
- Site-consistent typography and color treatment
- Clear hierarchy: hero -> examples -> custom quote categories -> cost drivers -> CTA

## Implementation Files

- `content/pricing-page.js`
  - Source of truth for pricing examples, custom-quoted categories, quote checklist, and CTA copy.

- `scripts/build-pricing.js`
  - Generates `pricing.html` from the structured source file.

- `pricing.html`
  - Generated output committed to the repo.

- `package.json`
  - Runs `build:pricing` during the main build.

## Update Workflow

When the pricing page changes:

1. Edit `content/pricing-page.js`
2. Run `npm run build:pricing`
3. Review `pricing.html`
4. Run `npm run build`

## Workflow Safety

This pricing setup remains separate from the autoblogger flow.

It does not change:

- `content/blog/**`
- blog generation logic
- blog image handling
- case study generation logic

It only changes the pricing-specific source file and generator.

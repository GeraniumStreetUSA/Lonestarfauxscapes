# B2B Resource Hub

## What was built
- Added `/commercial-resources` as a top-level commercial resource hub for:
  - Architects
  - Designers
  - General Contractors
  - Property managers / property teams
- Added a shared request workflow using the existing `cro.js` quick-form widget instead of fake download buttons.
- Added a recent commercial proof section powered by `case-study-proofs.js`.

## What content was reused
- `commercial.html`
  - Fire-rated options
  - CAD / shop drawings / submittals language
  - AHJ / GC portal support language
  - Acoustic options
  - Branding / logo integration
  - Texas install crew and prefabrication language
- `living-wall.html`
  - Commercial living wall positioning
  - 1 to 3 day install framing for many interior scopes
  - Acoustic and branded-wall language
- `fire-rated-artificial-hedge.html`
  - NFPA 701 Method 2 support
  - Fire documentation, MSDS / SDS, and inspector-support language
- `vallum-frx.html`
  - Public warranty reference:
    - 1-year structural warranty
    - 3-year foliage color warranty

## What was intentionally not fabricated
- No public download buttons were added for documents that do not exist in the repo.
- No blanket warranty promise was added across all systems.
- No fake test reports, spec sheets, or sample libraries were created.

## Request workflow
- The hub tells commercial visitors to send:
  - drawings or rough dimensions
  - city and project type
  - fire-doc / AHJ / GC portal needs
  - photos when available
- The page then routes them into the existing quick quote / contact flow.
- This keeps the workflow honest and avoids offering the wrong package for the wrong assembly.

## Internal linking added
- `commercial.html`
  - Replaced fake download buttons with:
    - link to `/commercial-resources`
    - fire-doc request email CTA
    - sample / consultation request email CTA
  - Added a commercial-resource-hub link in the FAQ area
- `living-wall.html`
  - Added a direct link to `/commercial-resources`
  - Renamed the Tally CTA from `Download Spec Sheet` to `Request Living Wall Specs`
- `scripts/build-blog.js`
  - Added contextual links to `/commercial-resources` for commercial / fire / submittal / specifier-oriented blog posts

## Related cleanup done in the same pass
- Removed misleading fake-download behavior from the main commercial page hero.
- Replaced unsupported warranty language on `commercial.html` with more accurate product-specific wording.

## Files involved
- `commercial-resources.html`
- `commercial.html`
- `living-wall.html`
- `scripts/build-blog.js`

## Notes for future expansion
- If real downloadable assets are created later, wire them into this hub only after the files exist and the product / scope mapping is clear.
- If a real spec-document library is added, keep the request flow for project-specific warranty notes and AHJ / GC routing rather than replacing everything with public downloads.

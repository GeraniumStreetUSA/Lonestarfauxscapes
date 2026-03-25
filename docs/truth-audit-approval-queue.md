# Truth Audit Approval Queue

This is a page-by-page review queue.

Nothing in this file means "delete now."

It means:

- here is the claim
- here is the current evidence status
- here is the default recommendation
- you decide what happens next

## How To Use This Queue

Decision options:

- `KEEP` = leave as-is
- `REWRITE` = keep the idea, but tighten the wording
- `REMOVE` = remove the claim entirely
- `PROVE` = keep only after owner documentation is provided

Suggested workflow:

1. Review the `High Priority Queue` first.
2. Mark each item `KEEP`, `REWRITE`, `REMOVE`, or `PROVE`.
3. After approval, do one controlled rewrite pass.

## Source Logic Used

Repo-backed evidence:

- current case-study sources in `content/case-studies/`
- public page copy
- blog source markdown

External sources used to support technical/compliance language:

- NFPA 701 official overview:
  - https://www.nfpa.org/codes-and-standards/nfpa-701-standard-development/701
- ASTM E84 official standard overview:
  - https://www.astm.org/e0084-24.html
- NFPA official-definition excerpt for AHJ:
  - https://www.nfpa.org/api/files?path=%2Ffiles%2FAboutTheCodes%2F412%2F412_A2019_AIR_AAA_SRStatements.pdf
- ICC digital code references for interior finishes / decorative materials:
  - https://codes.iccsafe.org/content/IBC2018P5/chapter-8-interior-finishes
  - https://codes.iccsafe.org/content/get-pdf/7739/CHAPTER8.html
  - https://codes.iccsafe.org/content/IFC2024V1.0/chapter-8-interior-finish-decorative-materials-and-furnishings
- Geranium Street product/support pages:
  - https://geraniumstreet.com/product/artificial-boxwood-hedge-mat-fire-rated-medium-green/
  - https://geraniumstreet.com/product/artificial-boxwood-hedge-mat-uv-rated-long-leaf-12ct/
  - https://geraniumstreet.com/product/living-wall-mat-uv-rated/
  - https://geraniumstreet.com/product/artificial-uv-rated-fire-retardant-living-wall/
  - https://geraniumstreet.com/hospitality/products/
  - https://geraniumstreet.com/commercial/products/
  - https://geraniumstreet.com/product/storefront-hedge/

## High Priority Queue

These are the claims most likely to create truth, legal, or trust issues if left untouched.

### Homepage

File:

- [index.html](/C:/dev/loanstar/index.html)

Items:

1. `index.html:205` and `index.html:3430`
   Claim: exact lifespan language, `5-8 years` in direct sun and `10+ years` indoors/shade.
   Status: `Weak`
   Why: the parent-brand sources support UV-rated / UV-stable language, but not this exact sitewide range for all homepage use.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `index.html:3612`
   Claim: `Licensed & Insured.`
   Status: `Unverified business claim`
   Why: no public proof in repo.
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Living Wall Page

File:

- [living-wall.html](/C:/dev/loanstar/living-wall.html)

Items:

1. `living-wall.html:1326`, `1343`, `1384`, `1403`
   Claim: exact install timing, `1-3 days`.
   Status: `Weak`
   Why: operational claim, not backed by a production standard in the repo.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `living-wall.html:1465`
   Claim: `1-year structural warranty, 3-year foliage color warranty`.
   Status: `Unverified`
   Why: no warranty sheet was found in the repo or the parent-brand sources checked.
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `living-wall.html:1523`, `1602`, `1662`, `1825`
   Claim: exact indoor/outdoor lifespan ranges.
   Status: `Weak`
   Why: directionally plausible, but not proven for all systems on this page.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

4. `living-wall.html:1674`, `1828`
   Claim: fire-rated option with test data available on request.
   Status: `Supported`
   Why: parent-brand sources support fire-rated living-wall products and NFPA 701-tested product paths.
   Default: `KEEP`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Artificial Hedge Page

File:

- [artificial-hedge.html](/C:/dev/loanstar/artificial-hedge.html)

Items:

1. `artificial-hedge.html:27`, `1567`
   Claim: exact UV/lifespan range `5-8 years`.
   Status: `Weak`
   Why: parent-brand sources support UV-rated language, not this exact range as a universal public promise.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `artificial-hedge.html:1654`
   Claim: `NFPA 701 certified hedges for commercial projects requiring fire compliance.`
   Status: `Mostly supported`
   Why: fire-rated hedge products are supported; safer if phrased as product-specific or option-based.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Fire-Rated Artificial Hedge Page

File:

- [fire-rated-artificial-hedge.html](/C:/dev/loanstar/fire-rated-artificial-hedge.html)

Items:

1. `fire-rated-artificial-hedge.html:67`, `1017`, `1128`
   Claim: fire-rated materials are required in `most` commercial occupancies in Texas.
   Status: `Overstated`
   Why: official code logic supports requirement-by-classification/AHJ, not a universal `most occupancies` rule.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `fire-rated-artificial-hedge.html:1142`
   Claim: `We've worked with fire marshals across Texas and understand their requirements.`
   Status: `Unsupported as written`
   Why: repo contains no direct proof of those working relationships.
   Default: `REMOVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `fire-rated-artificial-hedge.html:1190`
   Claim: `NFPA 701 certified fire-rated artificial hedges for Texas commercial projects.`
   Status: `Mostly supported`
   Why: the product concept is supported; the wording is still broader than product-specific proof.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Commercial Wall Page

File:

- [commercial-wall.html](/C:/dev/loanstar/commercial-wall.html)

Items:

1. `commercial-wall.html:1142`, `1163`, `1243`
   Claim: `90+ mph wind rating`.
   Status: `Unverified`
   Why: no engineering or product-sheet backup found in repo or checked parent-brand pages.
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `commercial-wall.html:1162`, `1240`
   Claim: `20" x 20" modular panels`.
   Status: `Partially supported`
   Why: supported for hedge-mat products on parent-brand pages, but not necessarily for every fabricated commercial wall assembly on this page.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `commercial-wall.html:1222`, `1269`
   Claim: LEED/environmental certification support.
   Status: `Unverified`
   Why: no LEED, SDS, VOC, or environmental-certification documents were found in repo.
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

4. `commercial-wall.html:1256`, `1261`, `1288`, `1401`
   Claim: documentation/submittal support for fire-rated options.
   Status: `Mostly supported`
   Why: this is believable if framed as support available on request; avoid implying a fixed package always exists.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Commercial Resource Hub

File:

- [commercial-resources.html](/C:/dev/loanstar/commercial-resources.html)

Items:

1. `commercial-resources.html:279`
   Claim: Vallum FRX has `1-year structural and 3-year foliage color coverage`.
   Status: `Unverified`
   Why: repeated in repo, but no primary warranty source was found in this audit.
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Vallum FRX Page

File:

- [vallum-frx.html](/C:/dev/loanstar/vallum-frx.html)

Items:

1. `vallum-frx.html:598-599`, `618-624`
   Claim: `1 Year` structural warranty and `3 Years` foliage color warranty.
   Status: `Unverified`
   Why: no warranty source found during this pass.
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `vallum-frx.html:597`
   Claim: `UV-PE HD` foliage material.
   Status: `Unverified`
   Why: technically specific product-material claim with no supporting data sheet found.
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `vallum-frx.html:545`, `660`
   Claim: `NFPA 701 Certified` / `NFPA 701 certified hedges`
   Status: `Mostly supported`
   Why: fire-rated parent-brand products are supported, but product-specific wording is safer than blanket phrasing.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Pool Privacy Hedge Page

File:

- [pool-privacy-hedge.html](/C:/dev/loanstar/pool-privacy-hedge.html)

Items:

1. `pool-privacy-hedge.html:28`, `1066`
   Claim: `5-10 years` in direct sun.
   Status: `Weak`
   Why: UV-rated is supportable; this exact lifespan range is not proven.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `pool-privacy-hedge.html:28`
   Claim: `chlorine resistant`.
   Status: `Unverified`
   Why: no product test or source found for chlorine resistance.
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `pool-privacy-hedge.html:1221`
   Claim: `1-2 days` install.
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Pool Living Wall Page

File:

- [pool-living-wall.html](/C:/dev/loanstar/pool-living-wall.html)

Items:

1. `pool-living-wall.html:26`, `1104`, `1161`, `1303`
   Claim: exact `5-10 years` / `5-10+ years` lifespan language.
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `pool-living-wall.html:1064`, `1193`, `1230`
   Claim: exact `1-2 days` / `1-3 days` install timing.
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `pool-living-wall.html:1177`
   Claim: fire-rated foliage available for HOAs, commercial insurance, or personal preference.
   Status: `Supported in part`
   Why: fire-rated living-wall product options are supported by parent-brand sources; HOA/insurance framing is broader than current proof.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

4. `pool-living-wall.html:1303`
   Claim: `same commercial-grade materials installed at hotels and resorts`.
   Status: `Unsupported as written`
   Why: no source ties this page's product/system to installed hotel/resort projects.
   Default: `REMOVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Austin

File:

- [austin.html](/C:/dev/loanstar/austin.html)

Items:

1. `austin.html:982`
   Claim: coordination with Austin fire marshals.
   Status: `Unsupported as written`
   Default: `REMOVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `austin.html:1014`
   Claim: `NFPA 701 certified for commercial projects.`
   Status: `Mostly supported`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Arlington

File:

- [arlington.html](/C:/dev/loanstar/arlington.html)

Items:

1. `arlington.html:952`, `1041`
   Claim: work near AT&T Stadium / Globe Life Field and multiple completed installs there.
   Status: `Unsupported as written`
   Default: `REMOVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `arlington.html:948`, `994`
   Claim: documentation for Arlington inspectors.
   Status: `Weak`
   Why: supportable if framed as available on request, not guaranteed in every case.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `arlington.html:990`, `1037`
   Claim: exact `2-4 days` timing.
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

4. `arlington.html:1018`
   Claim: `NFPA 701 certified for commercial projects.`
   Status: `Mostly supported`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Dallas

File:

- [dallas.html](/C:/dev/loanstar/dallas.html)

Items:

1. `dallas.html:1014`
   Claim: `Las Colinas, airport-adjacent work, and mixed-use installs.`
   Status: `Weak`
   Why: area-served language is fine; "work" can imply direct project proof.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `dallas.html:1043`
   Claim: `NFPA 701 certified for commercial projects.`
   Status: `Mostly supported`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Houston / San Antonio / Fort Worth

Files:

- [houston.html](/C:/dev/loanstar/houston.html)
- [san-antonio.html](/C:/dev/loanstar/san-antonio.html)
- [fort-worth.html](/C:/dev/loanstar/fort-worth.html)

Items:

1. `houston.html:1023`
2. `san-antonio.html:1018`
3. `fort-worth.html:1014`

Claim: `NFPA 701 certified for commercial projects.`
Status: `Mostly supported`
Why: fire-rated product options are supported; blanket city-card wording is still broader than needed.
Default: `REWRITE`
Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Plano

File:

- [plano.html](/C:/dev/loanstar/plano.html)

Items:

1. `plano.html:7`, `863`, `1061`
   Claim: `100% custom fabrication` / `Every project is 100% custom.`
   Status: `Overstated`
   Why: likely directionally true, but absolute.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `plano.html:1022`, `1069`, `1073`
   Claim: exact timing and lead-time claims.
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `plano.html:1081`
   Claim: most residential installs do not require permits.
   Status: `Unverified jurisdictional claim`
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

4. `plano.html:1120`
   Claim: `NFPA 701 certified for commercial projects.`
   Status: `Mostly supported`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Frisco

File:

- [frisco.html](/C:/dev/loanstar/frisco.html)

Items:

1. `frisco.html:1020`
   Claim: `Professional appearance guaranteed`
   Status: `Unsupported guarantee`
   Default: `REMOVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `frisco.html:7`, `863`, `1065`
   Claim: `100% custom fabrication` / `Every project is 100% custom.`
   Status: `Overstated`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `frisco.html:1022`, `1073`
   Claim: exact timing/lead-time.
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

4. `frisco.html:1120`
   Claim: `NFPA 701 certified for commercial projects.`
   Status: `Mostly supported`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Irving

File:

- [irving.html](/C:/dev/loanstar/irving.html)

Items:

1. `irving.html:7`, `13`, `30`, `857`, `893`, `905`, `1015`, `1204`
   Claim: strong Las Colinas / business-district proof framing.
   Status: `Weak`
   Why: place references are real, but they read like project-proof unless softened to service-area language.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `irving.html:1061`
   Claim: `We regularly work with property management companies throughout Las Colinas`
   Status: `Unsupported as written`
   Default: `REMOVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `irving.html:1065`
   Claim: experience with `Las Colinas office towers`
   Status: `Unsupported as written`
   Default: `REMOVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

4. `irving.html:1069`
   Claim: exact `2-5 days`.
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

5. `irving.html:1073`
   Claim: all commercial installs include certification and documentation for inspectors and fire marshals.
   Status: `Overstated`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

6. `irving.html:1120`
   Claim: `NFPA 701 certified for commercial projects.`
   Status: `Mostly supported`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Sugar Land

File:

- [sugar-land.html](/C:/dev/loanstar/sugar-land.html)

Items:

1. `sugar-land.html:1015`
   Claim: `America's best places to live`
   Status: `Unsupported unless cited`
   Default: `REMOVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `sugar-land.html:7`, `863`
   Claim: `100% custom fabrication`
   Status: `Overstated`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `sugar-land.html:1022`, `1073`
   Claim: exact timing / lead-time.
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

4. `sugar-land.html:1120`
   Claim: `NFPA 701 certified for commercial projects.`
   Status: `Mostly supported`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### The Woodlands

File:

- [the-woodlands.html](/C:/dev/loanstar/the-woodlands.html)

Items:

1. `the-woodlands.html:7`
   Claim: `100% custom fabrication`
   Status: `Overstated`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `the-woodlands.html:1022`, `1073`
   Claim: exact timing / lead-time.
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `the-woodlands.html:1120`
   Claim: `NFPA 701 certified for commercial projects.`
   Status: `Mostly supported`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

## Medium Priority Queue

These are worth cleaning, but they are less urgent than the high-priority items above.

### Sourced Claims You Can Lean On More Confidently

These are not approvals for every current sentence on the site.

They are claims that now have enough external support to reuse carefully.

1. Fire-rated hedge products exist.
   Source support:
   - Geranium Street fire-rated hedge mat product page
   - Geranium Street hospitality/commercial product catalogs

2. UV-rated hedge products exist.
   Source support:
   - Geranium Street UV-rated hedge mat product pages

3. UV-rated living-wall products exist.
   Source support:
   - Geranium Street living wall mat UV-rated product page

4. Fire-rated living-wall products exist.
   Source support:
   - Geranium Street artificial UV-rated fire-retardant living wall page

5. Low-maintenance / no-watering hedge and wall language is supportable.
   Source support:
   - parent-brand UV-rated hedge and living-wall product pages

6. Rolling hedge / caster-based product concepts exist.
   Source support:
   - Geranium Street storefront hedge page

7. NFPA 701 versus ASTM E84 framing is source-backed.
   Source support:
   - NFPA official standard overview
   - ASTM official standard overview
   - ICC code references for interior finishes and decorative materials

### Artificial Boxwood Hedge

File:

- [artificial-boxwood-hedge.html](/C:/dev/loanstar/artificial-boxwood-hedge.html)

Items:

1. `artificial-boxwood-hedge.html:61`, `1035`, `1106`, `1111`, `1250`
   Claim: mobile hedge system details such as rolling hedge units and locking casters.
   Status: `Partially supported`
   Why: parent-brand storefront hedge pages support rolling hedge concepts and caster-based products.
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. `artificial-boxwood-hedge.html:63`, `1132`, `1258`
   Claim: weighted bases, sandbag pockets, and stake-down options for outdoor stability.
   Status: `Unverified`
   Why: those exact stabilization details were not backed by current external sources.
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. `artificial-boxwood-hedge.html:65`, `1096`, `1266`, `1289`
   Claim: fire-rated boxwood availability and documentation support.
   Status: `Supported to mostly supported`
   Why: parent-brand fire-rated hedge mat exists and NFPA 701-tested language is supported.
   Default: `KEEP` for availability, `REWRITE` if you want tighter product-specific language.
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Residential

File:

- [residential.html](/C:/dev/loanstar/residential.html)

Items:

1. `residential.html:1907`, `2122`
   Claim: `Most residential installs finish in 1-2 days`
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Installation Page

File:

- [installation.html](/C:/dev/loanstar/installation.html)

Items:

1. `installation.html:1017`, `1194`
   Claim: projects complete in `2-4 days`
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Fence Extensions

File:

- [fence-extensions.html](/C:/dev/loanstar/fence-extensions.html)

Items:

1. `fence-extensions.html:1444`, `1585`, `1786`
   Claim: exact `1-2 day` install / turnaround language
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### HOA Page

File:

- [hoa-approved-artificial-hedge.html](/C:/dev/loanstar/hoa-approved-artificial-hedge.html)

Items:

1. `hoa-approved-artificial-hedge.html:1110`
   Claim: `5-10 years of Texas sun exposure`
   Status: `Weak`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

## Blog Approval Queue

### Rewrite or prove before treating as trust-safe

1. [2025-12-09-artificial-hedges-vs-real-plants-in-texas-which-is.md](/C:/dev/loanstar/content/blog/2025-12-09-artificial-hedges-vs-real-plants-in-texas-which-is.md)
   Issues:
   - exact cost model and 10-year comparison math
   - warranty-based assumptions
   - `10-15 years or more`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

2. [2025-12-10-faux-green-walls-vs-real-plants-for-texas-homes.md](/C:/dev/loanstar/content/blog/2025-12-10-faux-green-walls-vs-real-plants-for-texas-homes.md)
   Issues:
   - unsourced `$3k fine` anecdote
   - `5-10 years` warranty claim
   - `No plant casualties guaranteed`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

3. [2025-12-11-artificial-vs-real-boxwood-texas.md](/C:/dev/loanstar/content/blog/2025-12-11-artificial-vs-real-boxwood-texas.md)
   Issues:
   - `guaranteed for a decade or more`
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

4. [2025-12-12-artificial-vs-real-living-walls-for-texas-homes.md](/C:/dev/loanstar/content/blog/2025-12-12-artificial-vs-real-living-walls-for-texas-homes.md)
   Issues:
   - exact lifespan ranges
   - rebate / incentive claims
   - cost breakdown specifics
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

5. [2025-12-13-why-fire-rated-artificial-hedges-are-ideal-for-tex.md](/C:/dev/loanstar/content/blog/2025-12-13-why-fire-rated-artificial-hedges-are-ideal-for-tex.md)
   Issues:
   - exact lifespan ranges
   - broad `California Title 19 adopted by many Texas jurisdictions` style claim should be reviewed carefully
   Default: `REWRITE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

6. [2025-12-14-faux-living-walls-transforming-texas-office-spaces.md](/C:/dev/loanstar/content/blog/2025-12-14-faux-living-walls-transforming-texas-office-spaces.md)
   Issues:
   - exact lifespan ranges
   - GREENGUARD claim
   - Dallas permit-growth stat
   - Dallas ASTM-enforcement wording
   Default: `PROVE`
   Owner decision: `[ ] KEEP  [ ] REWRITE  [ ] REMOVE  [ ] PROVE`

### Lower-risk blog posts

These are the posts least likely to need major truth edits because they already use process-based language and official-source framing:

- [2026-02-03-firewise-artificial-hedges-for-multi-family-units.md](/C:/dev/loanstar/content/blog/2026-02-03-firewise-artificial-hedges-for-multi-family-units.md)
- [2026-02-21-nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery.md](/C:/dev/loanstar/content/blog/2026-02-21-nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery.md)
- [2026-02-21-texas-fire-code-requirements-for-artificial-plants-in-commercial-buildings.md](/C:/dev/loanstar/content/blog/2026-02-21-texas-fire-code-requirements-for-artificial-plants-in-commercial-buildings.md)
- [2026-02-23-dallas-privacy-without-the-watering-a-real-guide-t.md](/C:/dev/loanstar/content/blog/2026-02-23-dallas-privacy-without-the-watering-a-real-guide-t.md)
- [2026-02-23-houston-s-no-water-greenery-fix-choosing-artificia.md](/C:/dev/loanstar/content/blog/2026-02-23-houston-s-no-water-greenery-fix-choosing-artificia.md)

## Pages With No Critical Flag In This Pass

These were not the focus of the current approval queue, or no major unsupported claims stood out relative to the rest of the site:

- [pricing.html](/C:/dev/loanstar/pricing.html)
- [contact.html](/C:/dev/loanstar/contact.html)
- [case-studies.html](/C:/dev/loanstar/case-studies.html)

That does not mean `perfect`.

It means they did not surface as top truth-risk pages in this audit pass.

## Suggested Order For Your Review

1. Homepage
2. Living wall
3. Fire-rated / commercial pages
4. Austin / Arlington / Irving / Frisco / Plano
5. Older blog posts

## Bottom Line

You do not have a sitewide "fake business" problem.

You have a "too-specific copy" problem.

That is much easier to fix.

Most of the risky items can be solved by changing:

- exact numbers
- guarantees
- implied local proof
- blanket compliance wording

without losing the core sales message.

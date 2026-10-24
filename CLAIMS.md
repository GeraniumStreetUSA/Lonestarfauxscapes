# Claim register

Every number and factual claim on the rebuilt site: where it appears, and its source or owner confirmation. Anything marked **owner** stays unshipped until you confirm it. Written for the homepage first; more pages are added as they're built.

Status key:
- **ok**: sourced or owner-confirmed.
- **soft**: generic process or category language, no number. Flag it if wrong.
- **owner**: needs your confirmation before launch.

## Homepage

| Claim | Where | Source | Status |
|---|---|---|---|
| Phone (760) 978-7335 | Header, hero, contact, schema | Owner decision 2026-10-12 | ok |
| info@lonestarfauxscapes.com | Contact, form error, schema | Live site | owner (OWNER-NEEDS #3) |
| "A Geranium Street USA brand" | Hero, contact, footer, schema `parentOrganization` | Live site; owner explained the parent 2026-10-12 | ok |
| Serving Dallas, Fort Worth, Houston, Austin, San Antonio | Hero trust line, link band, service area, schema `areaServed` | 5 indexed metro pages; truth audit: "statewide likely true, owner confirmation recommended" | owner (OWNER-NEEDS #18) |
| Hedge panels 20 in | Estimator, systems cards, FAQ | `docs/truth-audit.md` lists 20" hedge mats as sourced | ok (OWNER-NEEDS #9 to double-check) |
| Living wall panels 40 in | Estimator, systems cards, FAQ | `docs/truth-audit.md` lists 40" wall mats as sourced | ok (OWNER-NEEDS #9) |
| Fence extension uses 20 in hedge panels on a frame above an existing fence | Estimator, systems card | Inferred from `/fence-extensions` | owner |
| Estimator ranges (run 4 to 300 ft, heights by system) | Estimator | Design choice for the tool, not a product limit | soft |
| "No watering, no trimming" | Hero, FAQ | `docs/truth-audit.md`: low-maintenance and no-watering language approved | ok |
| "Rinse off dust and pollen now and then" | FAQ | General care; matches `/blog/artificial-hedge-maintenance-and-care-for-texas-homeowners` | soft |
| UV-rated hedge and wall options exist | Four questions | `docs/truth-audit.md`: UV-rated options backed by Geranium Street | ok |
| Indoor-grade foliage "can fade faster outside" | Four questions | General material fact, hedged | soft |
| Texas Property Code Chapter 202 governs HOA deed-restriction enforcement | Four questions | Tex. Prop. Code Ch. 202, "Construction and Enforcement of Restrictive Covenants" | ok (cite the statute on the HOA guide) |
| Fire-rated options exist for hedges and walls | Dark chapter, FAQ | `docs/truth-audit.md`: allowed as "options exist". No certificate claims | ok |
| NFPA 701 = flame test for textiles and films; ASTM E84 = surface burning of building materials | Dark chapter | Standard titles: NFPA 701 "Fire Tests for Flame Propagation of Textiles and Films"; ASTM E84 "Surface Burning Characteristics of Building Materials" | ok |
| Process: send numbers, site review, written quote, panels cut to layout, mounted | Process, quote, FAQ, systems cards | Generic. The written quote after a site review comes from the brief's wording | soft (OWNER-NEEDS #12, #13) |
| Panels "can mount to many fences or to a freestanding frame" | FAQ | Live product pages | soft |
| Case studies: Austin residential privacy, Houston restaurant patio, Houston storefront | Texas installs, hero caption, commercial caption | `content/case-studies.json`, real photos | ok (Austin area left out, OWNER-NEEDS #15) |
| Hero photo: Austin | Hero caption | Austin case study photos | ok |
| No prices, no warranty, no lifespan, no timelines, no licence, no reviews, no founding year | Whole homepage | Left out on purpose (OWNER-NEEDS #2, #6, #7, #11, #13, #17) | ok |

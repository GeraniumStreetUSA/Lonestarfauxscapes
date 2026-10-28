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
| NFPA 701 = flame propagation test for textiles, films and decorative materials; judged on flame spread and flaming drips | Fire chapter | NFPA 701 standard title and test criteria | ok |
| "Many Texas cities adopt the International Fire Code, which points artificial decorative vegetation in many commercial buildings to NFPA 701, documented by the manufacturer" | Fire chapter | IFC decorative-vegetation provision as applied by state fire codes (e.g. Oregon State Fire Marshal holiday decor guidance, Minnesota R. 7511.0807); no section number quoted because it differs by edition | ok (soft: varies by city and edition) |
| "Our fire-rated hedges and walls are built for NFPA 701" and "Ask for the NFPA 701 documentation" | Fire chapter, FAQ | Owner direction 2026-10-26 ("talk NFPA more"; no ASTM E84 test). Needs the NFPA 701 report on file (OWNER-NEEDS #10) | owner |
| No ASTM E84 mention anywhere | Whole site | Owner 2026-10-26: no ASTM E84 test | ok |
| Process: send numbers; emailed assessment and rough quote (3D render when it helps); site review sets the final invoice; build; install | Process, quote "what happens next", FAQ | Owner, 2026-10-28 | ok |
| Panels "can mount to many fences or to a freestanding frame" | FAQ | Live product pages | soft |
| Case studies: Austin residential privacy, Houston restaurant patio, Houston storefront | Texas installs, hero caption, commercial caption | `content/case-studies.json`, real photos | ok (Austin area left out, OWNER-NEEDS #15) |
| Hero photo: Austin | Hero caption | Austin case study photos | ok |
| Austin story: 16 ft wire mesh screen, 130 ft run, facing a neighboring remodel, failing live screen, panels on the existing mesh with screen backing, boxwood, UV-resistant materials | Section after the hero | `content/case-studies.json` (austin-high-end-residential-privacy): problemSolved, scope, dimensions, material, documentationNotes | ok |
| "Green on day one. Nothing to water." | Austin story | Case study: "immediate coverage and no irrigation upkeep" | ok |
| Starting prices: hedge from $99 / linear ft (6 ft x 12 in), fence extension from $65 / linear ft (3 ft), living wall from $18 / sq ft, privacy wall from $699 / unit (4 x 4 ft); every one "+ installation, quoted after a site review" | Estimator, systems cards, Four questions, FAQ, meta description | Owner release 2026-10-25 (same as califauxscapes.com/pricing, checked live 2026-10-25); single source `app/src/data/starting-prices.ts` | ok |
| Estimator figure = released rate x size, rounded to $10; privacy wall unit price never multiplied | Estimator | Arithmetic on released prices | ok |
| No installed totals, no warranty, no lifespan, no timelines, no licence, no reviews, no founding year | Whole homepage | Left out on purpose (OWNER-NEEDS #2, #6, #7, #11, #13, #17) | ok |

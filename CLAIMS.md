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
| ~~Hedge panels 20 in~~ (removed) | Was: estimator, systems cards, FAQ | No panel size or panel count is shown for hedges, fence extensions or the privacy wall (owner 2026-11-04, see Owner decisions 2026-11-04 below) | removed |
| ~~Living wall panels 40 in~~ (removed) | Was: estimator, systems cards, FAQ | No panel size is shown anywhere; the living wall may show its area in sq ft (owner 2026-11-04) | removed |
| Fence extension is fixed to the face of an existing fence or wall (see Owner corrections 2026-11-04). The 20 in panel size is removed (owner 2026-11-04) | Estimator, systems card | Attachment: owner 2026-11-04 (Califauxscapes handoff, confirmed for Texas) | ok (attachment) |
| Estimator ranges (run 4 to 300 ft, heights by system) | Estimator | Design choice for the tool, not a product limit | soft |
| "No watering, no trimming" | Hero, FAQ | `docs/truth-audit.md`: low-maintenance and no-watering language approved | ok |
| "Rinse off dust and pollen now and then" | FAQ | General care; matches `/blog/artificial-hedge-maintenance-and-care-for-texas-homeowners` | soft |
| Standard foliage is UV-stabilized for outdoor sun | Four questions, system pages, FAQ | `docs/truth-audit.md`: UV-rated options backed by Geranium Street; owner 2026-11-04 (Califauxscapes handoff, confirmed for Texas): standard foliage is UV-stabilized only | ok |
| Indoor-grade foliage "can fade faster outside" | Four questions | General material fact, hedged | soft |
| Texas Property Code Chapter 202 governs HOA deed-restriction enforcement | Four questions | Tex. Prop. Code Ch. 202, "Construction and Enforcement of Restrictive Covenants" | ok (cite the statute on the HOA guide) |
| Fire-rated foliage is available for hedges and walls, as an upgrade at extra cost (see Owner corrections 2026-11-04) | Dark chapter, FAQ | `docs/truth-audit.md`: allowed as "options exist". No certificate claims. Owner 2026-11-04: an upgrade, never standard | ok |
| NFPA 701 = flame propagation test for textiles, films and decorative materials; judged on flame spread and flaming drips | Fire chapter | NFPA 701 standard title and test criteria | ok |
| "Many Texas cities adopt the International Fire Code, which points artificial decorative vegetation in many commercial buildings to NFPA 701, documented by the manufacturer" | Fire chapter | IFC decorative-vegetation provision as applied by state fire codes (e.g. Oregon State Fire Marshal holiday decor guidance, Minnesota R. 7511.0807); no section number quoted because it differs by edition | ok (soft: varies by city and edition) |
| Fire-rated foliage is built for NFPA 701, as an upgrade at extra cost, and "Ask for the NFPA 701 documentation" (never "our hedges are fire-rated") | Fire chapter, FAQ, system pages, Terms section 7 | Owner direction 2026-10-26 ("talk NFPA more"; no ASTM E84 test). Owner 2026-11-04: NFPA 701 report on file (tested through Intertek). Intertek is never named on the site: its name is not used in marketing without Intertek's written approval; the full, unaltered report goes to AHJs and clients on request | ok |
| No ASTM E84 claim about Lone Star products anywhere; the NFPA 701 vs ASTM E84 explainer post keeps its general explanation of both standards | Whole site; `/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery` | Owner 2026-10-26 (no ASTM E84 test); owner 2026-11-04 (keep the explainer, no product claim) | ok |
| Process: send numbers; emailed assessment and rough quote (3D render when it helps); site review sets the final invoice; build; install | Process, quote "what happens next", FAQ | Owner, 2026-10-28 | ok |
| A hedge mounts on the face of many fences and walls, about 2 to 3 in deep; a freestanding hedge stands on its own posts set in concrete; the site review confirms what the fence can carry | FAQ, hedge pages | Owner 2026-11-04 (Califauxscapes handoff, confirmed for Texas) for the depths and the posts; the rest is generic | ok |
| Case studies: Austin residential privacy, Houston restaurant patio, Houston storefront | Texas installs, hero caption, commercial caption | `content/case-studies.json`, real photos | ok (Austin area left out, OWNER-NEEDS #15) |
| Hero photo: Austin | Hero caption | Austin case study photos | ok |
| Austin story: 16 ft wire mesh screen, 130 ft run, facing a neighboring remodel, failing live screen, panels on the existing mesh with screen backing, boxwood, UV-resistant materials | Section after the hero | `content/case-studies.json` (austin-high-end-residential-privacy): problemSolved, scope, dimensions, material, documentationNotes | ok |
| "Green on day one. Nothing to water." | Austin story | Case study: "immediate coverage and no irrigation upkeep" | ok |
| Starting prices: hedge on your fence or wall from $99 / linear ft at 6 ft tall (scales with height), freestanding hedge from $200 / linear ft (see Owner corrections 2026-11-04), fence extension from $81 / linear ft (3 ft over the fence, $18 per linear ft per ft of foliage), living wall from $18 / sq ft, privacy wall from $699 / unit (4 ft × 4 ft with standard base, in the price caption only); every one "+ installation, quoted after a site review", for standard UV-stabilized foliage (fire-rated costs extra) | Estimator, systems cards, hedge hero, metro and hub system rows, Four questions, FAQ, meta description | Owner release 2026-10-25 (same as califauxscapes.com/pricing, checked live 2026-10-25); hedge tiers: owner 2026-11-04 (Califauxscapes handoff, confirmed for Texas); single source `app/src/data/starting-prices.ts` | ok |
| Estimator figure = released rate x size, rounded to $10; privacy wall unit price never multiplied | Estimator | Arithmetic on released prices | ok |
| No installed totals, no warranty, no lifespan, no timelines, no licence, no reviews, no founding year | Whole homepage | Left out on purpose (OWNER-NEEDS #2, #6, #7, #11, #13, #17) | ok |

## Owner corrections 2026-11-04

Source for every row: owner 2026-11-04 (Califauxscapes handoff, confirmed for Texas). Tests that fail if the old claims return: `app/tests/claims.test.ts`.

| Claim | Where | Replaces | Status |
|---|---|---|---|
| Hedge on your fence or wall: from $99 per linear ft, priced at 6 ft tall, single-sided, about 2 to 3 in deep, and the price scales with height (see Owner decisions 2026-11-04). Freestanding hedge: from $200 per linear ft, 6 ft × 7 in, a full 3D hedge on posts set in concrete. Material starting prices, installation quoted after a site review. Every hedge price names its tier. | `starting-prices.ts` (`STARTING_PRICES.hedge`, `['hedge-freestanding']`, `HEDGE_TIERS`), estimator (two hedge chips, plan drawn 3 in vs 7 in deep), homepage, system pages, hub and metro system rows, hero sightline drawing (hedge 3 in deep on the fence face) | One hedge price, "6 ft x 12 in" | ok |
| Fire-rated foliage is an upgrade at extra cost on every product (living walls, hedges, fence extensions, privacy walls), with documentation on request. Standard foliage is UV-stabilized only. No figure is released for the upgrade: the site says "extra cost". The local fire authority (AHJ) makes the final call. The fire-rated hedge page stays and describes the upgrade and when it is required. Vallum FRX is the one exception (see Owner decisions 2026-11-04). | `FR_STATEMENT` and `FR_PRICE_NOTE` in `starting-prices.ts`, homepage, system, hub and metro pages, Terms section 7, blog posts, estimator (note under the price) | "UV + FR", "fire-rated as standard", "our hedges are fire-rated" | ok |
| A fence extension attaches to the face of the fence or wall, generally with steel square tube, and comes down 1 ft for every 2 ft of extension height, so a 3 ft extension overlaps the fence by 1.5 ft; the foliage covers the tube at the bottom. | `claims-copy.ts` (`EXTENSION_ATTACHMENT`), fence-extension page and FAQ ("How does it attach to my fence?"), hubs, installation page, pool pages, blog | "on top of the fence", "frame above an existing fence", "extends the posts" | ok |
| Extending a vinyl fence is much harder and generally not recommended. | Fence-extension page and FAQ ("Can I extend a vinyl fence?"), residential hub, pool privacy page, installation page, blog posts that discuss fence types | (new) | ok |

Open, not yet released by the owner: a fire-rated price, and a height cap for the hedge on a fence or wall (the estimator takes 3 to 10 ft). A fire-rated figure for Vallum FRX is not released either: it is quoted after a site review.

## Owner decisions 2026-11-04 (pricing facts)

Source for every row: owner 2026-11-04. Tests: `app/tests/starting-prices.test.ts`, `app/tests/estimator.test.ts`, `app/tests/claims.test.ts`.

| Claim | Where | Replaces | Status |
|---|---|---|---|
| No panel sizes and no panel counts for privacy products. Owner: "just don't put size, keep it simple, non confusing for the privacy, only ones that need it are the movable hedges." Removed: the estimator's "N panels" readout, its "How the panels are counted" details, the "20 in panels", "40 in panels" and "4 × 4 ft units" chip and plan labels (the plan keeps the run length and drawing, no per-panel ticks or unit blocks), "Panels: 20 in wide" fact rows, the systems cards' module line, the "What size are the panels?" FAQ, panel sizes in the DIY and hedge-vs-real blog bodies. The living wall may still show its area in sq ft. Movable hedges (casters on `/artificial-boxwood-hedge`, the `/hedge-builder-*` forms) keep their sizes. The privacy wall keeps "4 ft × 4 ft with standard base" in its price caption: that is its priced product, not a panel module. | Estimator, home, system, use-case, metro, hub and pricing pages, Four questions, blog | "Hedge panels 20 in", "Living wall panels 40 in", the 20 in panel in the fence-extension row, "4 × 4 ft units" | owner |
| Hedge on your fence or wall: $99 per linear ft is the price at 6 ft tall, and the price scales with height ($16.50 per sq ft of hedge face: 8 ft is $132 per linear ft, 4 ft is $66, 3 ft is $49.50). The estimator's height slider runs 3 to 10 ft (default 6). Freestanding stays $200 per linear ft at a fixed 6 ft × 7 in. | `starting-prices.ts` (`STARTING_PRICES.hedge`, `HEDGE_BASE_HEIGHT_FT`, `hedgeRatePerLinearFt`), estimator, pricing page, hedge pages | "Taller runs may be priced to your site" | owner (the 8 ft and 4 ft figures are the owner's worked examples) |
| Fence extension: $18 per linear ft per foot of foliage, and the foliage is the extension height over the fence × 1.5 (it comes down 1 ft over the fence face for every 2 ft of extension). 3 ft over the fence is 4.5 ft of foliage, $81 per linear ft. Owner: "4.5 = 81 usd per lin ft at 3 ft over the fence, do it 18 usd a lin ft per ft height." The estimator's height slider runs 2 to 6 ft over the fence in half feet (default 3). | `starting-prices.ts` (`STARTING_PRICES['fence-extension']`, `FENCE_EXTENSION_RATE_PER_FT_OF_FOLIAGE`, `fenceExtensionRatePerLinearFt`), estimator, fence-extension page, pricing page, home, metro and hub price lines | "$65 per linear ft, 3 ft extension" | owner |
| Vallum FRX only comes fire-rated (NFPA 701) as standard, so it is priced above standard living wall foliage (fire-rated foliage costs extra). No figure is released: it is quoted after a site review. Owner: "vallum only comes in FR". Every other product keeps "fire-rated foliage is an upgrade at extra cost". | `/vallum-frx`, living wall page options, commercial hub, two blog posts that describe Vallum FRX | "Vallum FRX: fire rating is an upgrade at extra cost" | owner |

## Blog posts (cleanup 2026-11-04)

All 34 posts: every dollar figure removed (134), fabricated statistics and unsourced lifespans, warranties, timelines, wind and acoustic numbers removed or hedged, every "our products are tested / certified" line replaced with "built for NFPA 701; ask for the NFPA 701 documentation for the exact system you choose", ASTM E84 never tied to Lone Star products, 6 infographics with baked-in prices or certifications removed, the owner's 5-step process used where posts describe a project. Headings were left untouched (Google shows jump links to them); five headings still promise numbers the bodies no longer give (listed in tasks/todo.md for the owner).

## Terms of Service (rewritten 2026-11-04)

Owner: "edit it to be compliant for Texas and protects us first and foremost". The old warranty promise ("We stand behind our work", typical coverage list) is replaced by: warranties only as written in the Project Agreement, with a conspicuous disclaimer of implied warranties to the extent Texas law allows. Adds: Project Agreement controls; estimates and estimator results are not offers; customer responsibilities (HOA, permits, property lines, Texas 811, existing structures); Texas Property Code Chapter 27 notice for residential defect claims; Chapter 53 lien rights; liability capped at the project price; Texas law and venue in the project county. Needs review by a Texas attorney before launch.

Do not publish `downloads/NFPA-701-Sample-Report.pdf` (old site, never shipped): it calls itself a certificate, carries a seal-like watermark, and promises "project-specific certifications provided with each commercial installation".

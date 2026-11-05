# Concept: "Read the yard"

Lone Star sells one thing: a green line where a bare one stands now. The site reads like the plan a Texas builder sketches on a clipboard in your backyard. It is top down, in daylight, with the fence run measured and written on the drawing.

This is not Califauxscapes, which uses night, lime, front-view elevations and a tile-grid install reveal. Lone Star uses daylight, ink and one green, a top-down site plan, and a line that draws.

## Who arrives, and what they need, in order

1. **"Can this fix my problem?"** (a neighbor's second story, a bare fence, a blank wall, a pool in full view). The hero names the problem and the fix in one line.
2. **"What would mine take?"** They answer this themselves in the estimator on screen 2. That is a small commitment that carries into the quote form.
3. **The four fears, in this order:** Will it look fake? Will Texas sun ruin it? Will my HOA allow it? What will it cost? These get one answer-first block each.
4. **"Who are these people?"** Answered with a parent-company provenance line, real Texas jobs and a plain process. No invented stats.
5. **"Okay."** The quote form is already half filled in ("Step 2 of 2"). The phone number is always one tap away.

## Palette (WCAG checked)

| Role | Name | Hex | Contrast |
|---|---|---|---|
| ground | Caliche | `#EDECE6` | |
| ground-alt | Cut limestone | `#E1DFD6` | |
| ink | Live oak | `#15211B` | 14.0:1 on Caliche, 12.4:1 on Limestone |
| muted | Cedar shade | `#4D5852` | 6.3:1 on Caliche, 5.6:1 on Limestone |
| accent | Boxwood | `#2E5A2C` | 6.8:1 on Caliche; Caliche on Boxwood 6.8:1 (buttons) |
| signal | Noon | `#F2B53A` | 9.1:1 on ink. **Never text on light** (1.6:1). Used for run lines and points on the plan, and the dark chapter only |
| on-dark muted | Dry grass | `#A9B3AD` | 7.7:1 on ink |
| on-dark green | Live leaf | `#8FC08A` | 8.0:1 on ink |
| line | | `rgb(21 33 27 / 0.14)` | hairlines and property lines |

There is one dark chapter (ink ground) for fire and commercial. No Texas flags, decorative stars, cowhide, rope type or western kitsch.

## Type

Changed 2026-10-26: the owner called the expanded Archivo "AI slop".

| Role | Family | Use |
|---|---|---|
| Display | **Besley** variable (Clarendon), 700 to 800, tracking -0.02 to -0.03em | H1, H2, H3, the hero display line, figures, wordmark |
| Text and UI | **Libre Franklin** variable (Franklin Gothic), 400 to 700 | Body 17 to 18 px, leading 1.55, labels, buttons |
| Measure | **JetBrains Mono** 500 | Only real measurements and scene labels |

Clarendon with Franklin Gothic is the old American sign-painter and newspaper pairing: plainspoken and confident, not tech. Both fonts are OFL, self-hosted woff2, and the two preloaded files. The fallbacks are metric-matched to Georgia and Arial.

## Drawing language: the site plan

- **Property line:** a long-short dashed ink line at 14%.
- **Fence run:** a solid 2 px line in Boxwood on light (Noon on dark), with round end points and a run-length callout in mono.
- **Hedge or wall:** a band of short perpendicular ticks along the run, one tick per panel (20 in hedge, 40 in wall), so the panel count is visible on the drawing.
- **Context:** house footprint (hatched), pool (rounded rectangle, single line), a live oak canopy (one circle), and a north arrow in the corner of every plan.
- **Setback:** a thin dimension line between the run and the property line, labeled.
- All labels are DOM text over the SVG. Geometry is deterministic so prerender and hydration match.

## Signature: "the plan draws itself"

Lives in the estimator at screen 2.

- The visitor picks a system and sets the run length (slider plus number), height, and city or ZIP.
- The fence run draws along the property line of a fixed yard plan (`stroke-dashoffset`, 600 ms, `cubic-bezier(.2,.7,.2,1)`). Then the panel ticks land along it, left to right, the way a crew works. The run-length callout counts to the new value.
- Readout: `48 ft run x 12 in per ft / 20 in panels = 29 panels` and `48 ft x 6 ft = 288 sq ft`, followed by the qualifier "Dimensions only. Your quote comes after a site review." No dollar figure.
- Above 120 ft the run wraps a second side of the yard (a corner lot), so 30 ft and 300 ft look different.
- Reduced motion and `?qa=1` show the finished drawing instantly. The prerendered HTML already contains the 40 ft default drawing, so content never waits on motion.
- On the homepage only, the hero's property line continues down into the estimator plan as one thin dashed line: the page's spine.

## Voice

Plainspoken Texas builder. Short sentences. It names the condition (sun, heat, hail, humidity, freezes, HOA review, fire code) and the fix. Outcomes are hedged ("can", "often", "typically"). Any figure has its arithmetic beside it. There are no em-dashes. Banned: y'all, howdy, "everything's bigger", Lone Star puns, "beat the heat", maintenance-free, fireproof, "identical to real", revolutionary, game-changing, cutting-edge, transform, elevate, stunning, breathtaking.

**Eyebrow system:** a mono plan callout with a short leader tick, e.g. `◦ RUN A`, `◦ SITE REVIEW`, `◦ FIRE CODE`. Each one carries information, so there are no decorative eyebrows.

## Homepage order

1. **Header:** wordmark, Systems, Projects, Areas, Guides, phone, "Get a free quote".
2. **Hero:**
   - H1: "Artificial hedges and living walls, installed in Texas."
   - Subline names the pain: "Privacy from the second-story window next door. Green on the bare fence. No watering, no trimming."
   - One primary CTA, plus the phone and the line "A Geranium Street USA brand".
   - Photo of a real install, with a separate phone crop.
   - A "For homes / For businesses" fork.
3. **Estimator, "Measure your run":** the signature.
4. **Link band:** systems and the 5 metros (crawlable, compact).
5. **Four questions:** realism (close-up of leaf and seam), Texas sun, HOA (Texas Property Code § 202.007 text cited, never a promise of approval), cost (how a quote is built, no figures).
6. **Systems:** four cards.
7. **Dark chapter: commercial and fire.** NFPA 701 in plain words: what it is, where fire code asks for it, what to ask for. No ASTM E84 (owner: no such test).
8. **Texas installs:** the 3 real case studies.
9. **Process:** send dimensions, site review, build, install. No timelines.
10. **Quote form:** "Step 2 of 2", prefilled from the estimator.
11. **FAQ** (FAQPage schema) and **service area**, then contact and footer.
12. **Sticky CTA:** a desktop pill hidden while a primary CTA is in view, and a phone bar with Call and Quote.

## Card anatomy (systems)

1. Plan thumbnail strip: a top-down drawing of the system on a lot, with a mono module note (`20 IN PANELS`).
2. Photo at 4:3, slightly desaturated (`saturate(.92)`).
3. Title.
4. "Quoted after a site review" (or a released price, from one data file).
5. Three spec rows as a `<dl>`: Module, Height, Best for.
6. One link, whose text is the card's accessible name.

Cards sit on a 1 px Cedar-line grid with square corners. The only rounding on the site is on buttons and the sticky pill (4 px).

## Motion rules

- Content never depends on motion. Reveals fail open.
- Reduced motion shows the final state. `?qa=1` turns everything off.
- Micro motion only: buttons lift 2 px, arrows nudge 3 px, card photos settle over 700 ms.
- GSAP and Lenis are desktop only and dynamically imported. The estimator drawing uses the Web Animations API.

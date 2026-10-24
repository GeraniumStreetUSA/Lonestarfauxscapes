# Phase 2 brief: React scaffold and homepage mock

Repo: `/Volumes/hermes_agent/websites/Lonestarfauxscapes`, branch `rebuild/homepage`. Build the new app in `app/`. Do not touch any file outside `app/`. **No git commits, no push, no branch changes**: the orchestrator commits after review.

Read first, in this order:
1. `CONCEPT.md`: palette, type, drawing language, signature, homepage order, card anatomy. This is the design spec.
2. `/Volumes/hermes_agent/websites/califaux-main/design.md`: quality bar and structural reference (sections 6, 7, 9, 12).
3. `/Volumes/hermes_agent/websites/califaux-main/app/src` (read only): study `sections/HomeEstimator.tsx`, `lib/estimator.ts`, `components/HomeElevation.tsx`, `lib/elevation-geometry.ts`, `sections/HomeQuoteSection.tsx`, `hooks/use-lead-form.ts`, `components/StickyGetQuoteCTA.tsx`, `components/Turnstile.tsx`, `lib/reveal-deadline.ts`, `index.css`. Reimplement the patterns. **Do not copy its copy, palette, fonts, elevation drawings or install motion.**
4. `OWNER-NEEDS.md` and `IMAGE-PROMPTS.md`: what is not confirmed, and which photos to use.

## Hard rules

- No em-dash (U+2014) anywhere: copy, alt, aria, titles, comments in user-facing strings. Use colons, commas, periods or parentheses.
- Use only the copy in the deck below. Do not add facts, numbers, timelines, ratings, warranties, crews, licences, reviews or project counts. If a layout needs more words, ask the orchestrator in your final report instead of inventing them.
- No dollar figures anywhere.
- Never generate images. Use only the real photos listed below.
- Banned words: y'all, howdy, everything's bigger, beat the heat, maintenance-free, fireproof, identical to real, revolutionary, game-changing, cutting-edge, transform, elevate, stunning, breathtaking.

## Stack for this phase

- Vite 7, React 19, TypeScript 5.9 (strict), Tailwind 3.4, react-router-dom 7, react-helmet-async, react-hook-form, zod, @hookform/resolvers, lucide-react, clsx.
- No Radix needed yet: use native inputs (radio groups as real `<input type="radio">` in a `<fieldset>` with a `<legend>`).
- GSAP is not needed for this phase. Use the Web Animations API for the plan drawing.
- `app/package.json` gets its own scripts: `dev` (port 5180), `build`, `preview`, `typecheck` (`tsc -b`), and `test` (`node --test` over `tests/*.test.ts` using `--experimental-strip-types`, or tsx if needed).
- Prerender is NOT in this phase. Structure the code so it can be added (deterministic SVG geometry, no `window` access during render, static imports of homepage sections, no `<style>` in component bodies).

## Fonts

- Archivo variable (wght 400 to 820, wdth 100 to 125): get it with `git -C .. show redesign/panel-by-panel:public/fonts/archivo-400_820-normal.woff2 > public/fonts/archivo-var.woff2`.
- JetBrains Mono 500, latin woff2, from the `@fontsource/jetbrains-mono` npm package. Copy the single woff2 into `public/fonts/`, then remove the package.
- `@font-face` with `font-display: swap`, preload both, and metric-matched Arial fallbacks (compute `size-adjust`, `ascent-override` and `descent-override`, or use the capsize/fontaine values for Archivo).

## Images

Copy from `../public/case-studies/` into `app/public/images/` with clean kebab-case names. Generate AVIF and WebP at 480, 768 and 1200 w with sharp (`../node_modules/sharp` exists; add a small `scripts/make-images.mjs`).
- **Hero:** `austin-high-end-residential-privacy/artificial boxwood privacy austin-06.avif`. Alt: "Tall artificial boxwood privacy wall behind live oaks in an Austin backyard". Caption: "Boxwood privacy wall, Austin".
- **Process (install step):** `austin-08.avif` (has a watermark; acceptable for the mock). Alt: "Installer fixing hedge panels to a steel mesh fence".
- **Commercial chapter:** `houston-restaurant-hedges/HOUSTON-RESTAURAUNT-HEDGE-05.avif`. Alt: "Artificial boxwood hedge barriers along a Houston restaurant patio".
- **Texas installs cards:** austin-06 (Austin), houston restaurant 04, houston storefront 05. Use the title, city and `problemSolved` from `../content/case-studies.json`.
- **System cards:** use the same real photos for now (hedge: austin-06 crop; living wall: `../images/living_walls/` best available; fence extension: `../images/fence/` best available; commercial: houston storefront 04). These are uncaptioned and never imply a place.

Every `<img>` has src, width, height and alt, plus `loading="lazy"` except the hero. The hero gets `fetchpriority="high"` and a preload.

## Signature: the plan draws itself (most important piece)

See CONCEPT.md, "Drawing language" and "Signature".

- **`src/lib/estimator.ts`** (React-free, unit tested):
  - Systems: `hedge` (20 in panels), `fence-extension` (20 in panels), `living-wall` (40 in panels).
  - Run: 4 to 300 ft, default 40. Height ranges: hedge 3 to 12 ft (default 6); fence extension 1 to 4 ft (default 2); living wall 3 to 20 ft (default 8).
  - `panelsAcross = ceil(run_in / module_in)`, `rows = ceil(height_in / module_in)`, `panels = across * rows`, `area = run * height` sq ft.
  - Expose the arithmetic strings, for example `40 ft x 12 = 480 in / 20 in = 24 across`, `6 ft x 12 = 72 in / 20 in = 3.6, so 4 rows`, `24 x 4 = 96 panels`, `40 ft x 6 ft = 240 sq ft`. Use the `×` and `÷` characters for display.
  - Clamp and round inputs. Tests cover module sizes, rounding up, clamps and arithmetic strings.
- **`src/lib/yard-plan-geometry.ts`** (React-free, deterministic): a fixed top-down yard in a 640 x 420 viewBox.
  - Contents: a property line (dashed), a house footprint (hatched) near the bottom, a pool outline, one live oak canopy circle, and a north arrow.
  - The run is drawn along the back property line starting at the left corner. Length maps from feet to px on a log scale so 30 ft and 300 ft differ. Beyond the back line's capacity (about 120 ft), it turns the corner down the side line.
  - Returns the polyline points, total px length, tick positions (one tick per panel across; when ticks would be closer than 3 px, show every Nth tick and say so in a label), and label anchor points.
- **`<YardPlan>`:**
  - SVG plus DOM labels positioned over it (no `<svg:text>`).
  - When the run changes, the fence run draws with `stroke-dashoffset` over 600 ms, `cubic-bezier(.2,.7,.2,1)`. Then ticks appear left to right (a stagger totalling 300 ms or less). The run-length label counts up.
  - Prerendered and initial markup show the finished default drawing. Animation only runs on user change, never on first paint.
  - Reduced motion or `?qa=1`: instant.
- **`<HomeEstimator>`:**
  - Left column: the system radio group (44 px chips), a run slider plus a number field editing the same value (the number field commits on blur or Enter), a height slider plus number, and city or ZIP.
  - Right column: plan card with the plan, readout figures in large display type (`96 panels`, `240 sq ft`), arithmetic in mono, the qualifier, and the "send to quote" button.
  - Only the figures and arithmetic sit in `aria-live="polite"`.
  - "Send" writes to a tiny store (`src/lib/estimate-store.ts`) and scrolls to `#quote`. The form prefills service, location and a 160 character estimate summary without overwriting fields the visitor typed.

## Quote form

Posts JSON to `/api/contact` (existing Pages Function in `../functions/api/contact.js`; read it).

- **Payload:** `{ name, email, phone, location, service, message, website (honeypot), turnstileToken }`.
- `service` = the chip label plus " / " plus the project type (Residential or Commercial). `message` is required by the API: if empty, compose it from the estimate summary.
- Turnstile site key `0x4AAAAAACV8gs7CEDMYDaQu`: load the script on first form interaction only. In dev (`localhost`) skip Turnstile and show the payload in a dev-only notice instead of posting, so no real lead is sent.
- Analytics (`src/lib/analytics.ts`): push to `window.dataLayer` and call `gtag` if present. Event names stay the same: `cta_click`, `phone_click`, `email_click`, `form_start` (deduped per form), `form_submit`, `form_submit_error`. No PII.
- Underline inputs, labels always visible, real error messages linked with `aria-describedby`.

## Accessibility and motion

- Skip link to `#main`. 44 px targets below 1024 px.
- `:focus-visible` ring: 2 px solid Boxwood (Noon on the dark chapter), 3 px offset. Write the selector so no utility can remove it (double `:focus-visible`).
- Global reduced-motion rules. `?qa=1` sets `data-qa-mode` on `<html>` and disables all motion.
- Never leave content at `opacity: 0` in markup: reveals arm only from JS, and only for elements below the fold.
- Sticky CTA:
  - Desktop: a pill bottom-right, hidden while any `[data-primary-cta]` is in view.
  - Mobile: a bottom bar with Call and "Get a free quote".
  - Rendered after `<main>`.

## Copy deck (use verbatim)

**SEO**
- Title: `Artificial Hedges & Living Walls in Texas | Lone Star Faux Scapes`
- Description: `Artificial hedges, living walls and fence extensions built to your run. Serving Dallas, Fort Worth, Houston, Austin and San Antonio. Free quote.`
- Canonical: `https://lonestarfauxscapes.com/`. Add robots `noindex` for now (the rebuild is not live).

**Header:** wordmark "Lone Star Faux Scapes" (with a small plan-mark: a square property line with one solid side in Boxwood). Nav: Systems (`#systems`), Projects (`/case-studies`), Areas (`/locations`), Guides (`/guides`). Phone `(760) 978-7335` (`tel:+17609787335`). Button: "Get a free quote" (`#quote`).

**Hero**
- H1: `Artificial hedges and living walls, installed in Texas.`
- Sub: `Privacy from the second-story window next door. Green on the bare fence. No watering, no trimming.`
- Primary CTA: `Get a free quote` (`#quote`, `data-primary-cta`). Then a phone link: `or call (760) 978-7335`.
- Trust line: `A Geranium Street USA brand. Serving Dallas, Fort Worth, Houston, Austin and San Antonio.`
- Fork links: `For homes` (`/residential`) and `For businesses` (`/commercial`).
- Photo caption: `Boxwood privacy wall, Austin`.

**Estimator**
- Callout: `◦ MEASURE YOUR RUN`
- H2: `How long is the line you want green?`
- Body: `Pick a system and set the run. We draw it, count the panels and send the numbers with your quote. No prices here: every quote follows a site review.`
- System labels: `Hedge` (note `20 in panels`), `Fence extension` (note `20 in panels`), `Living wall` (note `40 in panels`).
- Field labels: `Run length (ft)`, `Height (ft)`, `City or ZIP`.
- Qualifier: `Dimensions only, not a quote. Final panel layout is set at the site review.`
- Button: `Send these numbers to my quote`.

**Link band**
- `Systems`: Artificial hedges `/artificial-hedge`, Living walls `/living-wall`, Fence extensions `/fence-extensions`, Commercial walls `/commercial-wall`, Fire-rated hedges `/fire-rated-artificial-hedge`, Pool privacy `/pool-privacy-hedge`.
- `Areas`: Dallas `/dallas`, Fort Worth `/fort-worth`, Houston `/houston`, Austin `/austin`, San Antonio `/san-antonio`.

**Four questions**
- H2: `Four things everyone asks first.`
1. `Will it look fake?` / `Leaf density and seams are what give artificial greenery away. Look at both up close, on real Texas jobs, before you decide.` / link `See Texas jobs` to `#projects`.
2. `Will Texas sun wear it out?` / `UV-rated hedge and wall options are made for outdoor sun. Indoor-grade foliage is not, and it can fade faster outside. Match the rating to your wall's exposure.` / link `How long hedges last in Texas heat` to `/blog/how-long-do-artificial-hedges-last-in-texas-heat`.
3. `Will my HOA allow it?` / `Many Texas HOAs review fence and landscaping changes. Texas Property Code Chapter 202 governs how HOA deed restrictions are enforced, but it does not promise approval. Read your HOA's rules, then submit specs and photos with your request.` / link `HOA approval in Texas` to `/blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas`.
4. `What will it cost?` / `It depends on run length, height, system, mounting and site access. That is why the estimator shows dimensions, not dollars. Your written quote follows a site review.` / link `How pricing works` to `/pricing`.

**Systems** (`id="systems"`)
- H2: `Four systems. Measured to your site.`
- Every card's price line: `Quoted after a site review`.
1. `Artificial hedge`. Module `20 in panels`. Mount `Fence, frame or wall`. Best for `Backyard privacy, pool screens`. Link `Artificial hedges` to `/artificial-hedge`.
2. `Living wall`. Module `40 in panels`. Mount `Wall or frame`. Best for `Courtyards, patios, interiors`. Link `Living walls` to `/living-wall`.
3. `Fence extension`. Module `20 in panels`. Mount `Frame above an existing fence`. Best for `Second-story sightlines`. Link `Fence extensions` to `/fence-extensions`.
4. `Commercial wall`. Module `Per system spec`. Mount `Wall or freestanding frame`. Best for `Restaurants, retail, multifamily`. Link `Commercial walls` to `/commercial-wall`.

**Dark chapter**
- Callout: `◦ FIRE CODE`
- H2: `Commercial jobs answer to the fire marshal.`
- Body: `Restaurants, retail and multifamily projects often need greenery with a documented fire rating. Two standards come up. NFPA 701 is a flame test for textiles and films. ASTM E84 measures surface burning of building materials. Which one your project needs depends on the code path and your fire marshal. Ask for the documentation that matches your system before you order.`
- Links: `Fire-rated hedges` (`/fire-rated-artificial-hedge`), `Vallum FRX walls` (`/vallum-frx`), `NFPA 701 vs ASTM E84` (`/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery`), `Commercial projects` (`/commercial`).
- Photo caption: `Patio hedge barriers, Houston`.

**Texas installs** (`id="projects"`)
- H2: `Recent Texas jobs.`
- Three cards from `case-studies.json`: photo, city as a mono callout, title, `problemSolved`, link `Read the case study` to `path`.
- Under the cards: `All case studies` (`/case-studies`).

**Process**
- H2: `How a job runs.`
1. `Send your numbers` / `Run, height, city, and photos if you have them.`
2. `Site review` / `Measurements, mounting and access are confirmed. Then you get a written quote.`
3. `Build` / `Panels are cut and staged to your layout.`
4. `Install` / `The run is mounted to your fence, frame or wall.`
- Use the install photo on step 4 only. Steps 1 to 3 use small plan drawings, not photos.

**Quote** (`id="quote"`)
- Callout: `◦ STEP 2 OF 2` (show `◦ STEP 1 OF 2: MEASURE YOUR RUN` above the estimator H2 instead of `◦ MEASURE YOUR RUN` if it reads well; your call, keep one).
- H2: `Get a free quote.`
- Body: `Tell us where and what. We reply with next steps.`
- What happens next: `1. We read your numbers and photos.` `2. We set up a site review.` `3. You get a written quote.`
- Fields: Name, Email, Phone (optional), City or ZIP, System (chips: Artificial hedge, Living wall, Fence extension, Commercial wall, Not sure yet), Project type (Residential, Commercial), Details (placeholder `What needs covering? Rough size, fence type, photos to share.`), and a hidden honeypot `website`.
- Button: `Send my quote request`. Success: `Got it. We will be in touch at the email you gave.` Error: `That did not send. Call (760) 978-7335 or email info@lonestarfauxscapes.com.`

**FAQ** (visible; FAQPage JSON-LD built from the same array)
- H2: `Questions, answered plainly.`
1. `Do artificial hedges need watering or trimming?` / `No watering and no trimming. Rinse off dust and pollen now and then.`
2. `Can it mount on my existing fence?` / `Often, yes. Panels can mount to many fences or to a freestanding frame. The site review confirms what your fence can carry.`
3. `Is it fire-rated?` / `Fire-rated options are available for hedges and walls. Ask for the documentation for the exact system you choose.`
4. `How is the price set?` / `By run length, height, system, mounting and site access. You get a written quote after a site review.`
5. `Will my HOA approve it?` / `We cannot promise approval. Check your HOA's rules and submit product specs and photos with your request.`
6. `What size are the panels?` / `Hedge panels are 20 in. Living wall panels are 40 in. The estimator above counts them for your run.`

**Service area**
- H2: `Where we work.`
- Five links (Dallas, Fort Worth, Houston, Austin, San Antonio) to the metro paths.
- Line under them: `Somewhere else in Texas? Ask.` (links to `#quote`).

**Contact block:** `Call (760) 978-7335`, `Email info@lonestarfauxscapes.com`, `A Geranium Street USA brand` (link `https://geraniumstreet.com`, `rel="noopener"`).

**Footer:** columns for Systems, Areas and Company (Projects `/case-studies`, Guides `/guides`, Blog `/blog`, Pricing `/pricing`, Contact `/contact`, Privacy `/privacy`, Terms `/terms`). Bottom line: `© 2026 Lone Star Faux Scapes. A Geranium Street USA brand.`

**JSON-LD on the homepage:**
- WebSite, WebPage, and one `HomeAndConstructionBusiness` node (`@id` `https://lonestarfauxscapes.com/#business`): name, url, telephone `+1-760-978-7335`, email, `parentOrganization` Geranium Street USA, and `areaServed` as the five cities plus State Texas. No street address, no licence, no opening hours, no ratings.
- FAQPage from the visible FAQ.

## Done for this phase

- `cd app && npm run typecheck && npm test && npm run build` all pass.
- Running `grep -rnP '\x{2014}' app/src app/index.html app/dist` (macOS: use `rg '\x{2014}'`) returns nothing.
- Screenshots (Playwright from `../node_modules/playwright` or `npx playwright`), full page and first viewport, at 1440x900 and 390x844, with `?qa=1`, saved to `app/.screens/` (gitignored). Also one screenshot after changing the run to 180 ft (the corner wrap).
- Self-check against CONCEPT.md: daylight ground, one green, no tile-grid reveal, no Califauxscapes look. The homepage must look finished and premium, not like a wireframe.
- **Final report (under 250 words):** files created, what was verified, anything you could not do, and every place you needed copy that was not in the deck.

# Phase 2b brief: the "Out of sight" hero

Repo: `/Volumes/hermes_agent/websites/Lonestarfauxscapes`, branch `rebuild/homepage`, app in `app/` (React 19, Vite 7, TS, Tailwind 3). Work only in `app/`. **No git commits, no push, no branch changes, nothing leaves this machine.** The dev server for the owner runs on port 5180; use a different port (for example 5181) for your own checks and stop it when done.

## Why this exists

The owner rated the current homepage 3/10:
- The hero is "weak and boring".
- The drawings are "cool but really hard to understand".
- There are no micro or macro interactions and no scroll animation, so the site feels flat.

The owner expects a 10/10 that feels like it sets the direction for web design for the next couple of years, while never being confusing. This prototype is the hero plus the transition right after it. The rest of the page comes later. The owner reviews this before anything else is built, so it has to land.

Read first:
- `CONCEPT.md` (palette, type, voice, banned words).
- `tasks/todo.md`, the "Phase 2b" section.
- The current `app/src/sections/HomeHero.tsx`, `index.css`, `tailwind.config.js` and `src/lib/motion.ts`.
- Load these skills if they are available to you, and apply them: `impeccable`, `anthropic-skills:gsap`, `anthropic-skills:emil-design-eng`, `design-taste-frontend`.

## Hard rules (unchanged)

- No em-dash (U+2014) anywhere.
- No invented facts. Prices come only from `src/data/starting-prices.ts`.
- Never generate images. Code-drawn SVG illustration is fine. Photos are real only (already in `app/public/images/`). The boxwood texture can come from a real photo (for example `git -C .. show redesign/panel-by-panel:images/site/boxwood-tile-320.webp`, or crop one from a real close-up).
- Not Califauxscapes: no tile-grid reveal over a photo, no lime-on-midnight, no front elevations with dimension lines.
- Banned words: y'all, howdy, everything's bigger, beat the heat, maintenance-free, fireproof, identical to real, revolutionary, game-changing, cutting-edge, transform, elevate, stunning, breathtaking.
- Prerender-safe:
  - Deterministic SVG geometry.
  - No `window` access during render.
  - Static imports for homepage sections.
  - No `<style>` in component bodies.
  - The initial markup shows a meaningful final state.
  - Motion is laid on from effects only and fails open.
  - Reduced motion and `?qa=1` (`html[data-qa-mode]`) show the finished state with no animation.
  - Never leave content at inline `opacity: 0`.

## The idea: privacy is a line of sight

Every buyer's real problem is someone looking in. The hero draws that look and lets the visitor block it.

### Scene: an axonometric Texas backyard

Use a 3/4 axonometric view (isometric or dimetric), drawn as clean ink linework on Caliche. It must be readable at a glance by a homeowner. **Not top-down.**
- **Elements:**
  - The visitor's yard, with a concrete pool deck and a pool whose water has a subtle shimmer.
  - One live oak with a canopy of soft clustered strokes; it can sway very slightly.
  - A 6 ft cedar board-on-board fence along the back property line.
  - Past the fence, the neighbor's two-story house with a clearly drawn second-story window.
  - Optionally, a person-scale cue (a lounge chair by the pool) so heights read.
- **Sightline:** a translucent Noon (`#F2B53A`) cone from the neighbor's window down onto the pool and lounge chair.
- **Hedge:** sits along the fence line and rises from fence height. Its two visible faces are filled with the real boxwood texture (SVG `<pattern>` with the image, skewed or projected to each face, a darker shade on the side face, and a crisp top edge). This mix of drawn world and real material is the signature. Make it beautiful.
- **Real geometry:** compute in a React-free, unit-tested module (`src/lib/sightline-geometry.ts`):
  - Model it in feet in 3D, then project to 2D.
  - The window eye height (about 17 ft), the fence line, and the target (pool and chair) define the line.
  - The cone is clipped at the hedge top plane.
  - "Out of sight" is true when the hedge top is at or above where the sightline crosses the fence line, for the whole cone. Tune the layout so that threshold is about 7 to 8 ft.
  - Above the threshold, the cone stops at the hedge and the yard behind is clear. Below it, part of the cone still reaches the pool.

### Load sequence

About 2.2 s total, desktop and phone, skipped under reduced motion and `?qa=1`.
1. The scene inks itself in. Linework draws with `stroke-dashoffset` in quick, overlapping passes: ground and property line first, then house, fence, pool and oak.
2. The window lights (a small warm glow) and the sightline cone sweeps out from it to the pool. The label "Neighbor's window" ticks in, then "In view" appears on the pool in Noon.
3. The hedge rises from the fence top to 8 ft with a firm, satisfying ease: no bounce, a quick settle. The cone retracts and clips at the hedge, the pool label flips to "Out of sight" in Boxwood, and the window glow dims.
4. The height handle appears with a one-time hint: "Drag to raise or lower the hedge".

**Prerendered and initial HTML:** show the finished state (hedge 8 ft, out of sight). On the client, when motion is allowed, start the sequence immediately on hydration from the pre-sequence state without a visible flash. For example, have a CSS class on `<html>` set by a tiny inline head script when motion is allowed (not prerender, not reduced motion, not qa) that hides only the decorative linework until the sequence starts, with a hard 1.5 s fail-open timeout. Headline, copy and CTAs are never hidden.

### Interaction

- **Drag to set the hedge height**, 3 to 12 ft:
  - Use a visible grab handle on the hedge's top edge, with pointer events and touch support.
  - It is a real `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-valuetext` (for example "8 feet, out of sight"). Arrow keys change it by 1 ft; Page Up and Page Down by 3 ft.
  - The cone, the labels and the readout (`Hedge 8 ft`) update every frame.
  - Crossing the threshold triggers a small, satisfying state change: the label flips, the window glow dims or brightens, and the cone retracts or reaches.
- **Desktop only (fine pointer):**
  - A very subtle parallax tilt of the scene layers toward the cursor (a few px, spring-smoothed).
  - The hedge handle gets a hover affordance.
  - The cursor becomes `ns-resize` while dragging.
- Keep it simple and obvious. A homeowner should get it in under 3 seconds with zero reading.

### Copy (use verbatim; ask in your report if you need more)

- **H1** (one element, two spans):
  - Small line: `Artificial hedges and living walls, installed in Texas`
  - Display line: `Out of sight. Still green.`
- **Sub:** `Your neighbor's second story looks straight into your yard. A hedge built to the right height can take that view away. No watering, no trimming.`
- **Price anchor:** build it from the data file, e.g. `Hedges from $99 / linear ft + installation, quoted after a site review`. Use the existing formatters.
- **Primary CTA:** `Get a free quote` (`#quote`, `data-primary-cta`). Secondary: `or call (760) 978-7335`.
- **Trust line:** keep the existing one (`A Geranium Street USA brand. Serving Dallas, Fort Worth, Houston, Austin and San Antonio.`). Keep the For homes / For businesses fork links if they fit; your call on placement.
- **Scene labels:** `Neighbor's window`, `Your pool`, `In view`, `Out of sight`, `Hedge {n} ft`, `6 ft fence`.

### Composition

- **Desktop:**
  - The display line is huge: Archivo expanded, tight, confident.
  - The scene is large: at least 55% of the first viewport, ideally bleeding to the right edge.
  - The first viewport at 1440x900 must show the H1, the sub, the CTA and the scene with the sightline. Nothing important below the fold.
- **Phone (390x844):**
  - Design it separately, do not shrink the desktop layout.
  - The scene is framed tighter on the window, fence, hedge and pool, and stays legible. Labels stay at 13 px minimum.
  - The handle is a 44 px target.
  - The display line comes first, then the scene, then the CTA.
- **Look:** daylight, generous whitespace, one green, Noon used only for the sightline. Premium, calm, crafted, a little playful. No clutter, no hairline overload.

### Section right after: "drawing to real"

A short scroll-scrubbed transition, with no scroll-jacking: a native `position: sticky` stage about 160 to 200vh tall.
1. A frame sized and placed like the drawn hedge face expands (`clip-path: inset(...)`, scrubbed) to a full-bleed real photo: `hero-austin-boxwood-wall` (real Austin job).
2. The photo settles from scale 1.08 to 1.
3. A caption fades up: `The real thing, Austin.`
4. A one-line statement appears: `Real installs, measured to the foot.` Use it or propose better, plain words.

Fallbacks: without JS, or with reduced motion or qa, it's a static full-bleed photo with its caption. Phone gets the same idea with less travel.

## Motion stack

- GSAP 3 and ScrollTrigger, dynamically imported inside effects, for the scrubbed transition and the desktop polish.
- Lenis smooth scroll on desktop with a fine pointer and no reduced motion, dynamically imported. Native scroll everywhere else.
- Web Animations API for the load sequence, so first paint doesn't wait for GSAP.
- Use transforms, clip-path and opacity only. Hit 60 fps on a mid laptop: no layout thrash, no filters animating on large areas.
- Arm a fail-open deadline (pattern: `califaux-main/app/src/lib/reveal-deadline.ts`) so the final state always appears.
- Add these to the existing site where cheap (they set the bar for later sections):
  - A button hover fill sweep.
  - A magnetic primary CTA on desktop.
  - The header shrinking to a compact state after scrolling.

## Done

- `npm run typecheck`, `npm test` (add geometry tests: threshold, clipping, projection determinism) and `npm run build` pass. The em-dash scan is clean.
- Screenshots in `app/.screens/hero/` from the production build:
  - 1440x900 and 390x844, final state.
  - 3 to 4 frames of the load sequence.
  - Hedge at 4 ft ("In view") and at 10 ft.
  - Mid-transition and end of the drawing-to-real section.
  - `?qa=1`.
- Also record a short screen video or GIF of the load sequence and a drag (Playwright `recordVideo`) to `app/.screens/hero/`.
- Critique your own frames like an Awwwards jury and iterate until it is truly excellent. Check that a first-time visitor understands the scene instantly.
- **Final report (under 250 words):** what you built, files, anything you decided, any copy you needed, and known limits.

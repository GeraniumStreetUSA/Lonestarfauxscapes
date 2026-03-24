# Homepage Elevation — Design Spec

> **Direction:** Elevate the existing dark-botanical DNA to compete at award level.
> **Constraint:** 90+ Lighthouse mobile AND desktop. Mobile speed is priority #1.
> **Approach:** Progressive enhancement — Layer 0 (static premium) → Layer 1 (lightweight motion) → Layer 2 (desktop-only heavy effects). Zero new runtime dependencies. Leverage existing GSAP + ScrollTrigger + mobile perf mode gate.

---

## Design Direction: "Botanical Precision"

**Primary ingredients:** Motion as brand system + Depth & atmosphere + Micro-interaction craft
**Secondary:** Tactile craft (grain/texture at current subtle level)

**What people will remember:**
1. The hero feels *alive* — parallax depth, slow Ken Burns, botanical mark that breathes
2. Every section transition is a distinct visual moment, not just "more content below"
3. Buttons and cards feel engineered — weighted, responsive, with precise feedback

---

## Architecture Constraint

**No new npm dependencies.** Everything is vanilla JS + GSAP (already loaded). Lottie via CDN `<script>` only if used, gated behind IntersectionObserver (loads only when visible). All new CSS goes in a single new file `homepage-motion.css` to keep separation clean.

**Mobile:** All enhancements gated behind `window.__LSFS_MOBILE_PERF_MODE === false`. Mobile gets Layer 0 (static premium look via CSS) + basic opacity reveals. No transforms, no GSAP, no Lottie on mobile.

**Desktop:** Full motion suite — GSAP scroll timelines, parallax, scrub-linked animations, micro-interactions, Lottie accents.

---

## Section-by-Section Elevation

### 1. Hero (#hero)

**Current:** Static image, botanical SVG draws in, text fades up, then nothing.

**Elevated:**
- **Parallax depth (CSS only):** Split hero into background (image, 0.4x scroll), midground (gradient fog layer, 0.7x), foreground (text, 1x). Uses `transform: translate3d()` driven by a single rAF scroll listener already in index.js. Mobile: flat, no parallax.
- **Ken Burns on hero image:** CSS `@keyframes` — 25s slow pan-zoom. Runs after botanical mark settles. `animation-play-state: paused` until mark animation completes (via CSS `animation-delay`). GPU-composited (transform only).
- **Headline upgrade:** Replace generic `slideUp` with word-by-word blur-to-sharp reveal. Each word starts at `filter: blur(4px); opacity: 0` and lands at `blur(0); opacity: 1` with 80ms stagger. Desktop only via GSAP. Mobile: simple fadeIn (current behavior).
- **Scroll cue:** Thin animated line at hero bottom, `opacity` pulse 0.3→1→0.3 on 2s loop. Fades out on first scroll via IntersectionObserver. Pure CSS animation.
- **CTA micro-pulse:** After text reveals complete, primary CTA scales 1→1.04→1 once. CSS animation with appropriate delay.

**Performance impact:** Zero new JS on mobile. Desktop adds ~20 lines to existing GSAP timeline. CSS adds ~40 lines.

### 2. Why People Call Us (value props — 4 cards)

**Current:** 4 identical dark bordered boxes with text. No icons, no visual differentiation.

**Elevated:**
- **Animated counter/icon accent:** Each card gets a small inline SVG icon (leaf, sun, flame, ruler) that draws on scroll-reveal. SVG stroke animation via CSS `stroke-dashoffset` — same technique as the botanical mark, much simpler. ~4 lines of SVG per icon.
- **Staggered reveal:** Cards reveal left-to-right with 100ms stagger instead of all at once. GSAP `stagger` on desktop, CSS `transition-delay` on mobile.
- **Hover state upgrade:** On hover, the card's top border transitions from transparent to green accent gradient (left→right wipe). CSS transition, no JS.
- **Number accent:** Add a large, semi-transparent number (01, 02, 03, 04) behind each card title as a typographic layer. `font-size: 4rem; opacity: 0.06; position: absolute`. Zero perf cost.

### 3. Products (4-column with photos)

**Current:** Small images on top of text-heavy cards. Generic hover (existing tilt).

**Elevated:**
- **Image scale on hover:** On card hover, the image zooms to 1.05x inside its container (`overflow: hidden`). CSS `transform: scale(1.05)` with 0.4s ease. Smooth, no layout shift.
- **Reveal choreography:** Instead of all 4 appearing at once, stagger from left with each card sliding up 20px + fading in, 120ms apart. GSAP on desktop, `transition-delay` on mobile.
- **CTA arrow animation:** The "SEE [X] OPTIONS" button arrow slides right 4px on hover, returns on leave. CSS `transform: translateX(4px)` transition.
- **Subtle image overlay gradient:** Add a bottom-to-top dark gradient over each product image so the title below has better visual separation from the photo. CSS `linear-gradient` on `::after` pseudo.

### 4. Case Studies (project snapshots)

**Current:** 3 cards with real photos, dense text, small tags. Good content, flat presentation.

**Elevated:**
- **Photo hover parallax:** On card hover, the image shifts slightly in the opposite direction of the cursor (2-3px max). Uses existing `card-effects.js` mouse tracking. Desktop only.
- **Tag pills animation:** Tags slide in from left with stagger on card reveal. CSS transitions with delays.
- **Read more arrow:** Same arrow-slide hover as products section for consistency.
- **Card border glow on hover:** Subtle green glow on border (`box-shadow: 0 0 20px rgba(76,175,80,0.1)`) on hover. CSS transition.

### 5. Solutions Path (Commercial / Architect / Residential)

**Current:** 3 identical cards. No visual differentiation between paths.

**Elevated:**
- **Distinct accent color per path:** Commercial gets a warm amber accent. Architect gets a cool blue-gray. Residential keeps green. Applied to the pill badge, the bullet dots, and the CTA hover state. CSS variables per card.
- **Hover card lift:** On hover, card translates up 6px with enhanced shadow. CSS transform + box-shadow transition.
- **Icon accent per path:** Small inline SVG next to each pill badge (building, compass, home). Stroke-animated on reveal like the value prop icons.

### 6. Coverage / Texas Map

**Current:** SVG Texas outline with pulsing city dots. Functional but flat.

**Elevated:**
- **Map draw-in on scroll:** When the section enters viewport, the Texas outline draws itself (SVG `stroke-dasharray` → `stroke-dashoffset` animation, same technique as botanical mark). City dots pulse in sequentially after outline completes. GSAP timeline on desktop, CSS animation on mobile (simplified).
- **City link hover → dot highlight:** Hovering a city name in the left column highlights the corresponding dot on the map (scale up + brighter glow). CSS class toggle via JS mouseover. Desktop only.
- **"Why clients move forward" text reveal:** The 3 points (Custom fabrication, Commercial-ready, One team) stagger-reveal on scroll instead of appearing all at once.

### 7. FAQ

**Current:** Bare `<details>` with `+` icons. Lots of dead whitespace.

**Elevated:**
- **Smooth open/close animation:** CSS `grid-template-rows: 0fr → 1fr` transition on the answer panel. The `+` icon rotates 45° to become `×` on open. Pure CSS, no JS needed.
- **Tighter spacing:** Reduce vertical padding between items. The current spacing wastes screen space.
- **Active state accent:** When an item is open, its left border gets a green accent line (3px, matches blockquote style from blog). CSS `border-left` transition.
- **Staggered reveal:** FAQ items fade in with 60ms stagger on scroll. Lightweight.

### 8. Contact / CTA Section

**Current:** Functional form with trust pills. The conversion moment doesn't feel premium.

**Elevated:**
- **Section entrance animation:** The heading "Call us or send the project details" types in character-by-character on scroll. GSAP `SplitText`-style effect (manual implementation using the existing split-text.js pattern). Desktop only. Mobile: instant.
- **Form field focus effects:** On focus, the input's border transitions to green accent with a subtle glow (`box-shadow: 0 0 0 2px rgba(76,175,80,0.2)`). Label floats up with a smooth transition. CSS transitions.
- **Submit button state machine:** Default → Hover (scale 1.02 + glow) → Active (scale 0.98 + pressed) → Loading (spinner) → Success (confetti, already exists). Each state has a distinct, intentional animation.
- **Trust pills entrance:** The 4 trust pills below the CTAs slide in from bottom with stagger on section reveal.

### 9. Section Transitions (Global)

**Current:** Each section just ends and the next starts. No visual connection between them.

**Elevated:**
- **Gradient blend dividers:** Between key sections, add a CSS gradient that blends the background of one section into the next. `background: linear-gradient(to bottom, var(--section-a-bg), var(--section-b-bg))` in a thin (60-80px) spacer div. Zero performance cost.
- **Scroll progress indicator:** A thin (2px) green line at the very top of the viewport that grows from left to right as you scroll down the page. CSS `position: fixed; scaleX()` driven by a single scroll event. Fades out at top (0%) and completes at bottom (100%).

### 10. Global Micro-Interactions

- **Cursor glow (desktop only):** A very subtle radial gradient (20px, 0.03 opacity) that follows the cursor across dark sections. Uses existing `mousemove` tracking in card-effects.js. CSS `radial-gradient` positioned via CSS custom properties. Adds ambient life to dark areas.
- **Link hover underline animation:** All text links get an underline that grows from left to right on hover (not instant). CSS `background-size` transition on `background-image: linear-gradient()`.
- **Button press depth:** All `.btn` elements get a `translateY(1px)` on `:active` to feel like physical buttons being pressed. CSS only.

---

## What We're NOT Doing

- No WebGL / Three.js (kills mobile scores)
- No heavy video backgrounds (bandwidth + LCP)
- No page transition API (MPA, not worth the complexity)
- No new npm dependencies
- No framework migration
- No restructuring the section order
- No content changes — only visual/motion treatment
- No Lottie (the SVG stroke animations achieve the same effect with zero download cost)

---

## Performance Budget

| Metric | Target | How We Stay Under |
|--------|--------|-------------------|
| Mobile LCP | < 2.5s | Hero image already preloaded, no new blocking resources |
| Mobile CLS | < 0.1 | No layout shifts — all animations use transform/opacity |
| Mobile INP | < 200ms | No new event listeners on mobile, all passive |
| New CSS | < 4KB gzipped | Single file, composited properties only |
| New JS | 0 on mobile | Everything gated behind perf mode check |
| Desktop JS delta | ~60 lines | Added to existing GSAP timeline init |

---

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| Create | `homepage-motion.css` | All new motion styles, parallax layers, transitions |
| Modify | `index.html` | Add parallax layer divs, scroll cue, section dividers, SVG icons, number accents |
| Modify | `index.js` | Add GSAP scroll timelines, parallax scroll handler, map draw-in |
| Modify | `enhancements.css` | Add desktop-only cursor glow, enhanced hover states |
| Modify | `reveal.js` | Add stagger support for grouped reveals |
| Create | `scroll-progress.js` | Thin scroll progress bar (desktop only, ~15 lines) |

# Homepage Elevation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the homepage from a 5/10 to a 10/10 — memorable, engaging, premium — while maintaining 90+ Lighthouse on both mobile and desktop.

**Architecture:** Progressive enhancement in 3 layers. Layer 0 = CSS-only premium look (mobile + desktop). Layer 1 = lightweight reveal choreography (GSAP desktop, CSS mobile). Layer 2 = desktop-only scroll narratives and micro-interactions. All new motion CSS in a single file `homepage-motion.css`. All new GSAP code added to the existing lazy-load flow in `index.js`. Zero new npm dependencies. Mobile perf mode gate (`__LSFS_MOBILE_PERF_MODE`) ensures mobile gets no new JS.

**Tech Stack:** Vanilla CSS3 (transforms, @keyframes, grid-template-rows transitions) + GSAP 3.12.2 ScrollTrigger (already loaded) + `gsap.matchMedia()` for responsive gating. SVG stroke animations for icons (same technique as existing botanical mark).

**Spec:** `docs/superpowers/specs/2026-03-23-homepage-elevation-design.md`

---

## Task 1: Create homepage-motion.css foundation

**Files:**
- Create: `homepage-motion.css`
- Modify: `index.html` (add stylesheet link)
- Modify: `scripts/post-build.js` (add to copy list)

This task creates the new CSS file with all Layer 0 styles — things that make the page look premium with zero JS. This is the foundation everything else builds on.

- [ ] **Step 1: Create `homepage-motion.css` with root variables and reduced-motion gate**

```css
/* homepage-motion.css — Layer 0: Static premium (no JS required) */

/* ─── Reduced Motion Gate ─── */
@media (prefers-reduced-motion: reduce) {
  .hm-parallax-bg, .hm-parallax-mid, .hm-scroll-cue,
  .hm-ken-burns, .hm-counter-draw, .hm-progress-bar {
    animation: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 2: Add hero parallax layer styles**

```css
/* ─── Hero Parallax Layers ─── */
.hm-parallax-bg {
  will-change: transform;
  transition: transform 0.1s linear;
}
.hm-parallax-mid {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(5,10,7,0) 0%,
    rgba(5,10,7,0.3) 40%,
    rgba(5,10,7,0.7) 100%);
  pointer-events: none;
  will-change: transform;
  z-index: 1;
}

/* ─── Hero Ken Burns ─── */
@keyframes hm-ken-burns {
  0%   { transform: scale(1) translate(0, 0); }
  50%  { transform: scale(1.06) translate(-1%, -0.5%); }
  100% { transform: scale(1) translate(0, 0); }
}
.hm-ken-burns {
  animation: hm-ken-burns 25s ease-in-out infinite;
  animation-delay: 2.5s; /* after botanical mark settles */
}

/* ─── Scroll Cue ─── */
@keyframes hm-scroll-cue-pulse {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50%      { opacity: 0.8; transform: translateY(4px); }
}
.hm-scroll-cue {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 32px;
  background: rgba(76,175,80,0.5);
  animation: hm-scroll-cue-pulse 2s ease-in-out infinite;
  z-index: 10;
  transition: opacity 0.5s ease;
}
.hm-scroll-cue.hm-hidden { opacity: 0; pointer-events: none; }

/* ─── CTA Micro-Pulse ─── */
@keyframes hm-cta-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.04); }
}
.hm-cta-pulse {
  animation: hm-cta-pulse 0.6s ease-in-out 1;
  animation-delay: 2s; /* after text reveals */
}
```

- [ ] **Step 3: Add section transition dividers and scroll progress bar**

```css
/* ─── Section Gradient Dividers ─── */
.hm-section-divider {
  height: 64px;
  background: linear-gradient(180deg, var(--from, transparent), var(--to, transparent));
  pointer-events: none;
}

/* ─── Scroll Progress Bar ─── */
.hm-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #4caf50, #81c784);
  transform-origin: left;
  transform: scaleX(0);
  z-index: 10000;
  pointer-events: none;
  transition: transform 0.05s linear;
}
```

- [ ] **Step 4: Add value card enhancements (number accent, border-top wipe, icon placeholder)**

```css
/* ─── Value Card Enhancements ─── */
.hm-card-number {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  font-size: 4rem;
  font-weight: 800;
  opacity: 0.04;
  color: #fff;
  line-height: 1;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}

.hm-card-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 0.75rem;
  stroke: #4caf50;
  stroke-width: 1.5;
  fill: none;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  transition: stroke-dashoffset 0.8s ease;
}
.hm-card-icon.hm-drawn { stroke-dashoffset: 0; }

/* Card border-top wipe on hover */
.live-card::before,
[class*="path-card"]::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #4caf50, #81c784);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}
.live-card:hover::before,
[class*="path-card"]:hover::before {
  transform: scaleX(1);
}
```

- [ ] **Step 5: Add product card image hover zoom and CTA arrow**

```css
/* ─── Product Card Image Zoom ─── */
.live-card .card-media {
  overflow: hidden;
}
.live-card .card-media img {
  transition: transform 0.5s ease;
}
.live-card:hover .card-media img {
  transform: scale(1.05);
}

/* ─── CTA Arrow Animation ─── */
.btn .arrow-icon,
.arrow-cta span {
  display: inline-block;
  transition: transform 0.25s ease;
}
.btn:hover .arrow-icon,
.arrow-cta:hover span {
  transform: translateX(4px);
}

/* ─── Button Press Depth ─── */
.btn:active {
  transform: translateY(1px) !important;
  transition: transform 0.05s ease;
}

/* ─── Link Underline Grow ─── */
.article-content a,
.hm-underline-grow {
  background-image: linear-gradient(#4caf50, #4caf50);
  background-size: 0% 1px;
  background-position: left bottom;
  background-repeat: no-repeat;
  transition: background-size 0.3s ease;
}
.article-content a:hover,
.hm-underline-grow:hover {
  background-size: 100% 1px;
}
```

- [ ] **Step 6: Add FAQ smooth open/close animation**

```css
/* ─── FAQ Smooth Transition ─── */
#faq details {
  border-left: 3px solid transparent;
  transition: border-color 0.3s ease;
}
#faq details[open] {
  border-left-color: #4caf50;
}
#faq details summary {
  cursor: pointer;
  list-style: none;
}
#faq details summary::after {
  content: '+';
  float: right;
  font-size: 1.2rem;
  color: #4caf50;
  transition: transform 0.3s ease;
}
#faq details[open] summary::after {
  transform: rotate(45deg);
}
/* Smooth expand — uses grid trick */
#faq .faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s ease;
}
#faq details[open] .faq-answer {
  grid-template-rows: 1fr;
}
#faq .faq-answer > * {
  overflow: hidden;
}
```

- [ ] **Step 7: Add form focus glow and solutions path accent colors**

```css
/* ─── Form Focus Glow ─── */
#cta-form input:focus,
#cta-form select:focus,
#cta-form textarea:focus {
  border-color: #4caf50 !important;
  box-shadow: 0 0 0 3px rgba(76,175,80,0.12);
  outline: none;
}

/* ─── Solutions Path Accent Colors ─── */
#commercial .live-card { --path-accent: #d4a054; }
#commercial .live-card .pill,
#commercial .live-card li::before { background: var(--path-accent) !important; }

.path-card:nth-child(2) { --path-accent: #7b9eb8; }
.path-card:nth-child(2) .pill,
.path-card:nth-child(2) li::before { background: var(--path-accent) !important; }

/* Residential keeps default green accent */

/* ─── Card Hover Lift ─── */
.live-card,
[class*="path-card"] {
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}
.live-card:hover,
[class*="path-card"]:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}
```

- [ ] **Step 8: Add mobile-safe overrides**

```css
/* ─── Mobile: Keep It Fast ─── */
@media (max-width: 991px) {
  .hm-ken-burns { animation: none; }
  .hm-parallax-bg,
  .hm-parallax-mid { transform: none !important; }
  .hm-scroll-cue { display: none; }
  .hm-progress-bar { display: none; }
  .hm-card-number { display: none; }
  .hm-card-icon { stroke-dashoffset: 0; } /* show immediately, no draw */
  .live-card:hover,
  [class*="path-card"]:hover {
    transform: none;
    box-shadow: none;
  }
  .live-card:hover .card-media img {
    transform: none;
  }
}
```

- [ ] **Step 9: Link stylesheet in index.html (after enhancements.css)**

Add `<link rel="stylesheet" href="/homepage-motion.css">` after the existing enhancements.css link.

- [ ] **Step 10: Add to post-build.js copy list**

Add `'homepage-motion.css'` to the CSS files array in `scripts/post-build.js`.

- [ ] **Step 11: Verify — load localhost:4000, confirm no visual regressions, confirm mobile has no new animations**

- [ ] **Step 12: Commit**

```bash
git add homepage-motion.css index.html scripts/post-build.js
git commit -m "feat: add homepage-motion.css foundation — Layer 0 premium styles"
```

---

## Task 2: Add hero parallax layers, scroll cue, and Ken Burns to HTML

**Files:**
- Modify: `index.html` (hero section ~lines 890-940)

- [ ] **Step 1: Wrap existing hero background image in parallax container**

Find the hero `<picture>` element. Wrap it in a div with class `hm-parallax-bg`. Add the Ken Burns class to the `<picture>` or `<img>` inside.

- [ ] **Step 2: Add midground fog layer**

Add `<div class="hm-parallax-mid" aria-hidden="true"></div>` inside the hero, after the background image wrapper, before the text content.

- [ ] **Step 3: Add scroll cue element**

Add `<div class="hm-scroll-cue" aria-hidden="true"></div>` at the bottom of the hero section, before the closing `</section>`.

- [ ] **Step 4: Add primary CTA pulse class**

Add class `hm-cta-pulse` to the "Request a Quote" button.

- [ ] **Step 5: Verify — hero should now have subtle Ken Burns on desktop, scroll cue pulsing at bottom, gradient fog layer adding depth**

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add hero parallax layers, Ken Burns, and scroll cue"
```

---

## Task 3: Add value card number accents and SVG icons

**Files:**
- Modify: `index.html` (value prop cards in "Why People Call Us" section)

- [ ] **Step 1: Add number accents to each of the 4 value cards**

Inside each card, add: `<span class="hm-card-number" aria-hidden="true">01</span>` (02, 03, 04 for subsequent cards).

- [ ] **Step 2: Add inline SVG icons to each card**

Add a small SVG before each card title. Each SVG should be ~3-4 lines using `stroke-dasharray` ready paths:

Card 1 (Installed in days): clock icon
Card 2 (Built for Texas): sun icon
Card 3 (Fire-rated): flame icon
Card 4 (Custom fit): ruler/measure icon

Each SVG gets class `hm-card-icon`.

- [ ] **Step 3: Verify — cards should show faint numbers and green stroke icons**

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add value card number accents and SVG stroke icons"
```

---

## Task 4: Add section gradient dividers

**Files:**
- Modify: `index.html` (between each major section)

- [ ] **Step 1: Add divider elements between sections**

Between each major section pair, add:
```html
<div class="hm-section-divider" aria-hidden="true" style="--from: var(--color-bg); --to: var(--color-bg-alt);"></div>
```

Adjust `--from` and `--to` per transition. Place between:
- Hero → Products
- Products → Case Studies
- Case Studies → Solutions
- Solutions → Coverage
- Coverage → FAQ
- FAQ → Contact

- [ ] **Step 2: Verify — smooth gradient blends between sections instead of hard cuts**

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add gradient dividers between homepage sections"
```

---

## Task 5: Scroll progress bar and scroll cue hide logic

**Files:**
- Create: `scroll-progress.js` (~20 lines)
- Modify: `index.html` (add progress bar div + script tag)

- [ ] **Step 1: Create scroll-progress.js**

```javascript
// scroll-progress.js — Desktop-only scroll progress bar + scroll cue hide
(function() {
  if (window.__LSFS_MOBILE_PERF_MODE) return;

  var bar = document.querySelector('.hm-progress-bar');
  var cue = document.querySelector('.hm-scroll-cue');
  if (!bar) return;

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = 'scaleX(' + Math.min(progress, 1) + ')';

      // Hide scroll cue after first meaningful scroll
      if (cue && scrollTop > 100) {
        cue.classList.add('hm-hidden');
      }
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
```

- [ ] **Step 2: Add progress bar element to index.html (first child of body, after nav)**

```html
<div class="hm-progress-bar" aria-hidden="true"></div>
```

- [ ] **Step 3: Add script tag for scroll-progress.js (deferred)**

- [ ] **Step 4: Add to post-build.js copy list**

- [ ] **Step 5: Verify — green progress line grows as you scroll on desktop, hidden on mobile**

- [ ] **Step 6: Commit**

```bash
git add scroll-progress.js index.html scripts/post-build.js
git commit -m "feat: add scroll progress bar and scroll cue auto-hide"
```

---

## Task 6: GSAP scroll choreography (desktop only)

**Files:**
- Modify: `index.js` (add to existing GSAP initialization block)

This is the biggest motion upgrade. All additions go inside the existing `gsap.matchMedia("(min-width: 768px)")` block in index.js.

- [ ] **Step 1: Add hero parallax scroll handler**

Inside the GSAP desktop block, add a ScrollTrigger that translates the hero background at 0.4x scroll speed:

```javascript
// Hero parallax
gsap.to('.hm-parallax-bg', {
  y: 200,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});
```

- [ ] **Step 2: Add hero headline word-by-word blur reveal**

```javascript
// Headline blur-to-sharp reveal
var words = document.querySelectorAll('#hero-heading .word');
if (words.length) {
  gsap.from(words, {
    filter: 'blur(4px)',
    opacity: 0,
    y: 8,
    duration: 0.5,
    stagger: 0.08,
    delay: 1.4,
    ease: 'power2.out'
  });
}
```

Note: This requires wrapping each word in the H1 in a `<span class="word">`. Will be done in index.html modification.

- [ ] **Step 3: Add staggered reveals for card groups**

```javascript
// Staggered card reveals
gsap.utils.toArray('.hm-stagger-group').forEach(function(group) {
  var cards = group.querySelectorAll('.live-card, .gs-reveal, [data-reveal]');
  gsap.from(cards, {
    y: 24,
    opacity: 0,
    duration: 0.5,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: group,
      start: 'top 80%',
      once: true
    }
  });
});
```

- [ ] **Step 4: Add SVG icon draw-in on scroll**

```javascript
// Icon draw on scroll
gsap.utils.toArray('.hm-card-icon').forEach(function(icon) {
  gsap.to(icon, {
    strokeDashoffset: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: icon,
      start: 'top 85%',
      once: true
    }
  });
});
```

- [ ] **Step 5: Add Texas map draw-in sequence**

```javascript
// Texas map outline draw + city dot stagger
var mapOutline = document.querySelector('.texas-outline');
if (mapOutline) {
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#coverage',
      start: 'top 70%',
      once: true
    }
  });
  tl.from(mapOutline, { strokeDashoffset: 1000, duration: 1.2, ease: 'power2.inOut' })
    .from('.map-pin', { scale: 0, opacity: 0, stagger: 0.15, duration: 0.4, ease: 'back.out(2)' }, '-=0.3');
}
```

- [ ] **Step 6: Add FAQ stagger reveal**

```javascript
// FAQ stagger
gsap.from('#faq details', {
  y: 12,
  opacity: 0,
  stagger: 0.06,
  duration: 0.4,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '#faq',
    start: 'top 75%',
    once: true
  }
});
```

- [ ] **Step 7: Wrap H1 words in spans for blur reveal**

In index.html, modify the H1 to wrap each word in `<span class="word">`. Only needed if split-text.js doesn't already handle it.

- [ ] **Step 8: Add `hm-stagger-group` class to card container divs**

Add the class to the parent containers of: value cards, product cards, case study cards, solutions path cards.

- [ ] **Step 9: Verify on desktop — scroll through entire page, check all animations fire correctly**

- [ ] **Step 10: Verify on mobile — resize to 375px, confirm zero new animations, no layout shifts**

- [ ] **Step 11: Commit**

```bash
git add index.js index.html
git commit -m "feat: add GSAP scroll choreography — parallax, stagger reveals, map draw-in"
```

---

## Task 7: Coverage map city hover interaction

**Files:**
- Modify: `index.js` (add city-dot highlight logic)
- Modify: `homepage-motion.css` (add highlighted dot style)

- [ ] **Step 1: Add CSS for highlighted map pin**

```css
.map-pin.hm-highlight {
  transform: scale(1.5);
  filter: drop-shadow(0 0 8px rgba(76,175,80,0.6));
  transition: transform 0.2s ease, filter 0.2s ease;
}
```

- [ ] **Step 2: Add JS mouseover/mouseout on city links to toggle map pin highlight**

```javascript
// City link → map pin hover connection (desktop only)
if (!window.__LSFS_MOBILE_PERF_MODE) {
  document.querySelectorAll('#coverage a[href*="/"]').forEach(function(link) {
    var city = link.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    var pin = document.querySelector('.map-pin[data-city="' + city + '"], .map-pin[data-city="' + link.textContent.trim() + '"]');
    if (!pin) return;
    link.addEventListener('mouseenter', function() { pin.classList.add('hm-highlight'); });
    link.addEventListener('mouseleave', function() { pin.classList.remove('hm-highlight'); });
  });
}
```

- [ ] **Step 3: Verify — hovering "Dallas" in city list highlights Dallas dot on map**

- [ ] **Step 4: Commit**

```bash
git add index.js homepage-motion.css
git commit -m "feat: add city link hover → map pin highlight interaction"
```

---

## Task 8: Desktop cursor glow

**Files:**
- Modify: `enhancements.css` (add cursor glow styles)
- Modify: `card-effects.js` (extend existing mousemove handler)

- [ ] **Step 1: Add cursor glow CSS**

In enhancements.css:
```css
.hm-cursor-glow {
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(76,175,80,0.03) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  will-change: transform;
}
@media (max-width: 991px) {
  .hm-cursor-glow { display: none; }
}
```

- [ ] **Step 2: Add cursor glow element to index.html**

```html
<div class="hm-cursor-glow" aria-hidden="true"></div>
```

- [ ] **Step 3: Update card-effects.js to move the glow**

Add to the existing mousemove handler:
```javascript
var glow = document.querySelector('.hm-cursor-glow');
if (glow) {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
}
```

- [ ] **Step 4: Verify — subtle green glow follows cursor on dark sections, invisible on mobile**

- [ ] **Step 5: Commit**

```bash
git add enhancements.css card-effects.js index.html
git commit -m "feat: add desktop cursor glow ambient effect"
```

---

## Task 9: FAQ smooth animation upgrade

**Files:**
- Modify: `index.html` (restructure FAQ details/answer for grid transition)

The CSS is already in homepage-motion.css (Task 1 Step 6). This task restructures the HTML to support the grid-template-rows transition.

- [ ] **Step 1: Wrap each FAQ answer in the grid container structure**

Each `<details>` answer content needs to be wrapped:
```html
<details>
  <summary>Question text <span class="faq-toggle">+</span></summary>
  <div class="faq-answer">
    <div>
      <p>Answer text here</p>
    </div>
  </div>
</details>
```

The outer `.faq-answer` gets `grid-template-rows: 0fr → 1fr` transition. The inner `<div>` gets `overflow: hidden`.

- [ ] **Step 2: Remove any existing inline `+` characters if the CSS `::after` handles it**

Check if the current HTML has literal `+` text or if it's already CSS-generated. Avoid duplicate icons.

- [ ] **Step 3: Reduce vertical padding between FAQ items**

Adjust spacing in homepage-motion.css if the current FAQ has excessive whitespace.

- [ ] **Step 4: Verify — open/close FAQ items, confirm smooth height animation, green left border on open**

- [ ] **Step 5: Commit**

```bash
git add index.html homepage-motion.css
git commit -m "feat: upgrade FAQ with smooth open/close animation and accent border"
```

---

## Task 10: Final polish and Lighthouse verification

**Files:**
- All modified files from Tasks 1-9

- [ ] **Step 1: Run `npx vite build` and verify no build errors**

- [ ] **Step 2: Check new CSS file size**

```bash
wc -c homepage-motion.css
# Target: under 6KB uncompressed, under 2KB gzipped
```

- [ ] **Step 3: Run Lighthouse audit on desktop (via Chrome DevTools)**

Target: 90+ Performance, 90+ Accessibility

- [ ] **Step 4: Run Lighthouse audit on mobile (simulated via Chrome DevTools)**

Target: 90+ Performance. Check:
- No new blocking resources on mobile
- LCP unchanged (hero image still preloaded)
- CLS = 0 (no layout shifts from new elements)
- No new JS executing on mobile

- [ ] **Step 5: Cross-browser check — verify in Chrome and Safari (or Firefox)**

- [ ] **Step 6: Test reduced-motion preference — verify all decorative animations stop**

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: homepage elevation — premium motion, parallax, micro-interactions

- Hero: parallax depth layers, Ken Burns, word blur reveal, scroll cue
- Value cards: SVG stroke icons, number accents, border-top wipe hover
- Products: image zoom hover, CTA arrow animation
- Solutions: distinct accent colors per path, hover lift
- Coverage: SVG map draw-in, city hover interaction
- FAQ: smooth grid open/close, accent border
- Contact: focus glow, trust pill stagger
- Global: scroll progress bar, section gradient dividers, cursor glow,
  button press depth, link underline grow animation
- Performance: zero new JS on mobile, all motion gated behind perf mode
- Accessibility: respects prefers-reduced-motion throughout"
```

---

## Summary of New/Modified Files

| File | Action | Lines Added (est.) |
|------|--------|--------------------|
| `homepage-motion.css` | Create | ~200 |
| `scroll-progress.js` | Create | ~25 |
| `index.html` | Modify | ~80 (parallax divs, SVG icons, number accents, stagger classes, FAQ structure) |
| `index.js` | Modify | ~70 (GSAP timelines, parallax, map draw, stagger) |
| `enhancements.css` | Modify | ~15 (cursor glow) |
| `card-effects.js` | Modify | ~5 (cursor glow positioning) |
| `scripts/post-build.js` | Modify | ~2 (file copy list) |

**Total new code:** ~400 lines across 7 files
**New JS on mobile:** 0 lines
**New dependencies:** 0

# Guide Hub And Installation Proof Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `Gallery` from the main nav, split `Guides` and `Blog` into distinct jobs, and add real project proof to `/installation`.

**Architecture:** Treat `index.html` as the nav source of truth, then sync the universal nav across top-level pages. Use `/guides` as the curated, high-intent hub and keep `/blog` as the broader archive, with the blog build script updating both pages from the same post dataset. Add project proof to the installation page by reusing the existing case-study proof component that already reads from `content/case-studies.json`.

**Tech Stack:** Static HTML, build-time Node scripts, shared nav sync, generated case-study/blog content, lightweight Node verification.

---

### Task 1: Add A Regression Check

**Files:**
- Create: `scripts/check-guide-hub.js`

- [ ] Add a small Node verification script that checks:
  - top-level nav uses `Projects` and `Guides`
  - top-level nav no longer exposes `Gallery`
  - `blog.html` contains guide-hub language
  - `installation.html` includes a published-project proof block and proof script

- [ ] Run:

```bash
node scripts/check-guide-hub.js
```

Expected before implementation: failure with missing `Projects`, missing installation proof, and old nav entries.

### Task 2: Rework Main Navigation

**Files:**
- Modify: `index.html`
- Modify via sync: `scripts/shared-nav.js`, top-level `*.html`

- [ ] Change the source nav in `index.html` so the main links become:
  - `Installation`
  - `Projects` -> `/case-studies`
  - `Guides` -> `/guides`
  - `Pricing`
  - `Get Quote`

- [ ] Remove the top-level `Gallery` nav item from desktop and mobile nav.

- [ ] Run:

```bash
npm run sync:nav
```

Expected: synced nav updates across top-level pages and `scripts/shared-nav.js`.

### Task 3: Split Guides From Blog

**Files:**
- Modify: `blog.html`
- Modify: `scripts/build-blog.js`

- [ ] Make `/guides` the curated, question-led guide hub.
- [ ] Reposition `/blog` as the broader knowledge archive with a clear path back to Guides.
- [ ] Change build-time featured/topic selection so safer planning guides lead `/guides` instead of weaker legacy broad guide posts.

- [ ] Run:

```bash
npm run build:blog
```

Expected: `blog.html` refreshes with updated featured/topic/article sections and keeps generated post data intact.

### Task 4: Add Published Project Proof To Installation

**Files:**
- Modify: `installation.html`

- [ ] Replace the weaker gallery CTA with a project-proof CTA to `/case-studies`.
- [ ] Add a published-project proof block using `data-lsfs-case-studies`.
- [ ] Include `cro.css` and `case-study-proofs.js` so the shared proof component renders.
- [ ] Tighten any touched installation copy where unsupported timing/lifespan phrasing would undercut the truthfulness goal.

- [ ] Run:

```bash
node scripts/check-guide-hub.js
```

Expected: verification passes for nav, guide hub copy, and installation proof wiring.

### Task 5: Full Verification

**Files:**
- Verify: `index.html`
- Verify: `blog.html`
- Verify: `installation.html`
- Verify generated outputs as needed

- [ ] Run:

```bash
node scripts/check-guide-hub.js
npm run build
```

Expected:
- regression check passes
- full site build exits with code `0`


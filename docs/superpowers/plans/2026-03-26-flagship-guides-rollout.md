# Flagship Guides Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable flagship-guide article system for Lone Star Faux Scapes and apply it to four first-wave guides: `nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery`, `diy-vs-professional-artificial-hedge-installation`, `how-to-get-hoa-approval-for-artificial-hedges-in-texas`, and `indoor-vs-outdoor-artificial-living-walls-materials-and-design`.

**Architecture:** Keep article authorship in markdown frontmatter and body files under `content/blog/`, but move flagship rendering into a dedicated build helper so `scripts/build-blog.js` stops carrying all layout responsibility. Use explicit guide-module placeholders inside markdown to interleave utility blocks with prose, copy a dedicated stylesheet to the built site, and verify generated HTML with a Node regression script instead of relying on manual visual checks.

**Tech Stack:** Node.js build scripts, gray-matter frontmatter, marked markdown rendering, static HTML generation, CSS, ripgrep/Node-based verification.

---

## File Map

- Create: `scripts/blog-flagship-guides.js`
  Purpose: Normalize flagship-guide frontmatter and render reusable guide sections and custom modules.
- Create: `scripts/check-flagship-guides.js`
  Purpose: Verify generated flagship guides contain the required backbone and per-guide custom modules.
- Create: `flagship-guides.css`
  Purpose: Add reusable flagship-guide layout, utility blocks, and visual rhythm styles without bloating `scripts/build-blog.js` further.
- Modify: `scripts/build-blog.js`
  Purpose: Detect `guideType: flagship`, inject module placeholders into article HTML, and include the flagship stylesheet and wrappers.
- Modify: `scripts/post-build.js`
  Purpose: Copy `flagship-guides.css` into `dist/`.
- Modify: `content/blog/2026-02-21-nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery.md`
  Purpose: First commercial flagship guide using comparison + checklist modules.
- Modify: `content/blog/2026-02-21-diy-vs-professional-artificial-hedge-installation.md`
  Purpose: First install-planning flagship guide using timeline + path cards.
- Modify: `content/blog/2026-02-21-how-to-get-hoa-approval-for-artificial-hedges-in-texas.md`
  Purpose: First HOA flagship guide using planning grid + checklist modules.
- Modify: `content/blog/2026-02-21-indoor-vs-outdoor-artificial-living-walls-materials-and-design.md`
  Purpose: First living-wall comparison flagship guide using comparison + decision-tree + proof-insert modules.

## Scope Note

The approved spec defines the flagship-guide system broadly, but this rollout plan intentionally stops at:

- reusable flagship-guide framework
- first-wave module library
- four pilot guides
- regression verification

Do **not** convert every guide in this plan. After these four pages ship and validate, write a second rollout plan for the next batch.

### Task 1: Create The Failing Regression Check

**Files:**
- Create: `scripts/check-flagship-guides.js`

- [ ] **Step 1: Write the failing verification script for the first flagship guide**

```js
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function assertContains(content, needle, label, failures) {
  if (!content.includes(needle)) {
    failures.push(`${label}: missing "${needle}"`);
  }
}

const checks = [
  {
    slug: 'nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery',
    required: [
      'data-guide-template="flagship"',
      'Quick Answers',
      'Decision Snapshot',
      'data-guide-module="comparison-matrix"',
      'data-guide-module="checklist"',
      'What To Verify',
      'Where to go next',
    ],
  },
];

const failures = [];

for (const check of checks) {
  const relativePath = path.join('blog', `${check.slug}.html`);
  if (!fs.existsSync(path.join(rootDir, relativePath))) {
    failures.push(`${check.slug}: generated file does not exist`);
    continue;
  }

  const html = read(relativePath);
  check.required.forEach((needle) => {
    assertContains(html, needle, check.slug, failures);
  });
}

if (failures.length > 0) {
  console.error('Flagship guide verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Flagship guide verification passed.');
```

- [ ] **Step 2: Run the verification to confirm it fails**

Run: `node scripts/check-flagship-guides.js`

Expected: FAIL because the generated NFPA guide does not yet include the flagship wrapper or module blocks.

- [ ] **Step 3: Commit the failing test harness**

```bash
git add scripts/check-flagship-guides.js
git commit -m "test: add flagship guide verification harness"
```

### Task 2: Build The Reusable Flagship Guide Framework And Convert The NFPA Guide

**Files:**
- Create: `scripts/blog-flagship-guides.js`
- Create: `flagship-guides.css`
- Modify: `scripts/build-blog.js`
- Modify: `scripts/post-build.js`
- Modify: `content/blog/2026-02-21-nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery.md`

- [ ] **Step 1: Create the flagship guide renderer helper**

```js
// scripts/blog-flagship-guides.js
const GUIDE_MODULE_COMMENT_REGEX = /<!--\s*guide-module:\s*([a-z0-9-]+)\s*-->/gi;

const cleanText = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const normalizeStringList = (value) =>
  Array.isArray(value) ? value.map(cleanText).filter(Boolean) : [];

const normalizeQuickAnswers = (value) =>
  Array.isArray(value)
    ? value.map((item) => ({
        question: cleanText(item?.question),
        answer: cleanText(item?.answer),
      })).filter((item) => item.question && item.answer)
    : [];

const normalizeDecisionSnapshot = (value) =>
  Array.isArray(value)
    ? value.map((item) => ({
        label: cleanText(item?.label),
        value: cleanText(item?.value),
      })).filter((item) => item.label && item.value)
    : [];

const normalizeModules = (value) =>
  Array.isArray(value)
    ? value.map((item) => ({
        key: cleanText(item?.key),
        type: cleanText(item?.type),
        title: cleanText(item?.title),
        intro: cleanText(item?.intro),
        columns: normalizeStringList(item?.columns),
        rows: Array.isArray(item?.rows) ? item.rows : [],
        items: normalizeStringList(item?.items),
      })).filter((item) => item.key && item.type && item.title)
    : [];

export function normalizeFlagshipGuide(data, post) {
  if (cleanText(data?.guideType) !== 'flagship') return null;
  return {
    eyebrow: cleanText(data.guideEyebrow),
    audience: cleanText(data.guideAudience),
    promise: cleanText(data.guidePromise || post.summary),
    quickAnswers: normalizeQuickAnswers(data.quickAnswers),
    decisionSnapshot: normalizeDecisionSnapshot(data.decisionSnapshot),
    modules: normalizeModules(data.guideModules),
    verifyTitle: cleanText(data.verifyTitle || 'What To Verify'),
    verifyItems: normalizeStringList(data.verifyItems),
    nextSteps: Array.isArray(data.nextSteps)
      ? data.nextSteps.map((item) => ({
          href: cleanText(item?.href),
          label: cleanText(item?.label),
          description: cleanText(item?.description),
        })).filter((item) => item.href && item.label && item.description)
      : [],
  };
}

function renderQuickAnswers(guide) {
  if (guide.quickAnswers.length === 0) return '';
  return `<section class="flagship-block flagship-block--answers"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Quick Answers</p><h2>What most readers need to know first</h2></div><div class="flagship-answer-grid">${guide.quickAnswers.map((item) => `<article class="flagship-answer-card"><h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p></article>`).join('')}</div></section>`;
}

function renderDecisionSnapshot(guide) {
  if (guide.decisionSnapshot.length === 0) return '';
  return `<section class="flagship-block flagship-block--snapshot"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Decision Snapshot</p><h2>The shortest practical summary</h2></div><div class="flagship-snapshot-grid">${guide.decisionSnapshot.map((item) => `<article class="flagship-snapshot-card"><span>${escapeHtml(item.label)}</span><p>${escapeHtml(item.value)}</p></article>`).join('')}</div></section>`;
}

function renderComparisonMatrix(module) {
  const [leftLabel = 'Option A', rightLabel = 'Option B'] = module.columns;
  return `<section class="flagship-block" data-guide-module="comparison-matrix"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Comparison Matrix</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><div class="flagship-matrix"><div class="flagship-matrix__row flagship-matrix__row--head"><span>Decision Point</span><span>${escapeHtml(leftLabel)}</span><span>${escapeHtml(rightLabel)}</span></div>${module.rows.map((row) => `<div class="flagship-matrix__row"><span>${escapeHtml(cleanText(row?.label))}</span><span>${escapeHtml(cleanText(row?.left))}</span><span>${escapeHtml(cleanText(row?.right))}</span></div>`).join('')}</div></section>`;
}

function renderChecklist(module) {
  return `<section class="flagship-block" data-guide-module="checklist"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Checklist</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><ul class="flagship-checklist">${module.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`;
}

function renderGuideModule(module) {
  if (!module) return '';
  if (module.type === 'comparisonMatrix') return renderComparisonMatrix(module);
  if (module.type === 'checklist') return renderChecklist(module);
  return '';
}

export function injectFlagshipGuideModules(htmlContent, guide) {
  if (!guide) return htmlContent;
  return htmlContent.replace(GUIDE_MODULE_COMMENT_REGEX, (_, key) => {
    const module = guide.modules.find((entry) => entry.key === cleanText(key));
    return renderGuideModule(module);
  });
}

export function renderFlagshipGuideIntro(post, guide) {
  return `<div class="flagship-intro" data-guide-template="flagship"><p class="flagship-intro__eyebrow">${escapeHtml(guide.eyebrow || 'Flagship Guide')}</p><div class="flagship-intro__meta">${guide.audience ? `<span>${escapeHtml(guide.audience)}</span>` : ''}<span>${escapeHtml(post.displayDate)}</span></div><p class="flagship-intro__promise">${escapeHtml(guide.promise)}</p>${renderQuickAnswers(guide)}${renderDecisionSnapshot(guide)}</div>`;
}

export function renderFlagshipGuideOutro(guide) {
  const verifyBlock = guide.verifyItems.length > 0 ? `<section class="flagship-block flagship-block--verify"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Truthfulness Check</p><h2>${escapeHtml(guide.verifyTitle)}</h2></div><ul class="flagship-checklist">${guide.verifyItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>` : '';
  const nextStepBlock = guide.nextSteps.length > 0 ? `<section class="flagship-block flagship-block--next"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Where to go next</p><h2>Choose the next page that fits your project</h2></div><div class="flagship-next-grid">${guide.nextSteps.map((item) => `<a class="flagship-next-card" href="${escapeHtml(item.href)}"><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.description)}</p></a>`).join('')}</div></section>` : '';
  return `${verifyBlock}${nextStepBlock}`;
}
```

- [ ] **Step 2: Create the stylesheet for flagship utility blocks**

```css
/* flagship-guides.css */
.article-content[data-guide-template="flagship"] { display: block; }
.flagship-intro { display: grid; gap: 1.5rem; margin-bottom: 2.25rem; }
.flagship-intro__eyebrow, .flagship-block__eyebrow { color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.78rem; font-weight: 700; }
.flagship-intro__meta { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.flagship-intro__meta span { padding: 0.38rem 0.7rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); font-size: 0.82rem; color: rgba(255,255,255,0.82); }
.flagship-intro__promise { margin: 0; font-size: 1.05rem; line-height: 1.75; color: rgba(255,255,255,0.9); }
.flagship-block { margin: 2.2rem 0; padding: 1.4rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); }
.flagship-block__head { display: grid; gap: 0.5rem; margin-bottom: 1rem; }
.flagship-block__head h2 { margin: 0; font-size: clamp(1.4rem, 2.6vw, 1.9rem); }
.flagship-block__head p { margin: 0; color: rgba(255,255,255,0.72); font-size: 0.98rem; }
.flagship-answer-grid, .flagship-snapshot-grid, .flagship-next-grid { display: grid; gap: 1rem; }
@media (min-width: 760px) { .flagship-answer-grid, .flagship-snapshot-grid, .flagship-next-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.flagship-answer-card, .flagship-snapshot-card, .flagship-next-card { padding: 1rem 1.05rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); background: rgba(5,10,7,0.55); }
.flagship-answer-card h3, .flagship-next-card strong { display: block; margin: 0 0 0.35rem; }
.flagship-answer-card p, .flagship-snapshot-card p, .flagship-next-card p { margin: 0; color: rgba(255,255,255,0.74); }
.flagship-snapshot-card span { display: block; margin-bottom: 0.35rem; color: var(--color-accent); font-size: 0.76rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.flagship-matrix { display: grid; gap: 0.35rem; }
.flagship-matrix__row { display: grid; grid-template-columns: minmax(160px, 1.1fr) minmax(0, 1fr) minmax(0, 1fr); gap: 0.8rem; padding: 0.85rem 0.95rem; border-radius: 14px; background: rgba(5,10,7,0.58); border: 1px solid rgba(255,255,255,0.06); }
.flagship-matrix__row--head { font-weight: 700; color: #fff; }
.flagship-checklist { display: grid; gap: 0.7rem; margin: 0; padding-left: 1.2rem; }
.flagship-checklist li { color: rgba(255,255,255,0.86); }
```

- [ ] **Step 3: Wire flagship guides into the blog build**

```js
// scripts/build-blog.js
import {
  injectFlagshipGuideModules,
  normalizeFlagshipGuide,
  renderFlagshipGuideIntro,
  renderFlagshipGuideOutro,
} from './blog-flagship-guides.js';
```

```js
// scripts/build-blog.js
  post.guide = normalizeFlagshipGuide(data, post);
```

```js
// scripts/build-blog.js
    const contentWithImages = insertImagesAfterHeadings(contentWithIds, commentImages, 3);
    const contentWithGuideModules = post.guide
      ? injectFlagshipGuideModules(contentWithImages, post.guide)
      : contentWithImages;
    post.toc = toc;
    post.content = contentWithGuideModules;
```

```js
// scripts/build-blog.js
  const guideIntro = post.guide ? renderFlagshipGuideIntro(post, post.guide) : '';
  const guideOutro = post.guide ? renderFlagshipGuideOutro(post, post.guide) : '';
  const guideStylesheet = post.guide ? '  <link rel="stylesheet" href="/flagship-guides.css">\n' : '';
```

```js
// scripts/build-blog.js
${UNIVERSAL_NAV_STYLESHEET}
${guideStylesheet}  <link rel="stylesheet" href="/cro.css">
```

```js
// scripts/build-blog.js
    <article class="article-content"${post.guide ? ' data-guide-template="flagship"' : ''}>
      ${guideIntro}
      ${post.toc}
      ${articleBody}
      ${guideOutro}

      <div class="estimate-note">
```

```js
// scripts/post-build.js
  { src: './flagship-guides.css', dest: 'flagship-guides.css' },
```

- [ ] **Step 4: Convert the NFPA guide frontmatter and add module placeholders**

```md
guideType: flagship
guideEyebrow: "Commercial planning guide"
guideAudience: "For architects, designers, GCs, property managers, and owners comparing fire documentation paths"
guidePromise: "Understand which fire standard usually matters, what to verify, and what to ask for before submittals."
quickAnswers:
  - question: "Which standard is most common for decorative greenery?"
    answer: "NFPA 701 is the most common starting point when artificial greenery is treated as a decorative material."
  - question: "When does ASTM E84 usually enter the conversation?"
    answer: "When the installation may be treated as an interior finish or wall-surface system."
  - question: "Should you assume one standard covers every project?"
    answer: "No. The right answer depends on classification, occupancy, and AHJ review."
decisionSnapshot:
  - label: "Fastest starting point"
    value: "Treat decorative greenery and interior finish questions separately before asking for submittals."
  - label: "Most common mistake"
    value: "Requesting one test report without confirming how the project will be classified."
  - label: "What to decide first"
    value: "Whether the installation is being reviewed as a decorative material or a finish system."
guideModules:
  - key: "comparison-matrix"
    type: "comparisonMatrix"
    title: "NFPA 701 vs ASTM E84"
    intro: "Use this matrix when you need the shortest side-by-side explanation before you ask a manufacturer or AHJ for documentation."
    columns:
      - "NFPA 701"
      - "ASTM E84"
    rows:
      - label: "Designed for"
        left: "Decorative textiles and films"
        right: "Interior finish materials"
      - label: "Measures"
        left: "Flame propagation and afterflame response"
        right: "Flame spread index and smoke-developed index"
      - label: "Typical use"
        left: "Decorative greenery and freestanding materials"
        right: "Wall and ceiling finish discussions"
  - key: "submittal-checklist"
    type: "checklist"
    title: "What to verify before submittals"
    intro: "Use this before anyone treats a generic fire report like project-ready documentation."
    items:
      - "The report names the actual product line being installed."
      - "The test method is stated explicitly."
      - "The report is current enough for the project team and AHJ."
      - "The documentation matches how the greenery is being classified."
verifyTitle: "What To Verify"
verifyItems:
  - "How the local jurisdiction is likely to classify the installation."
  - "Whether the project team needs decorative-material documentation, interior-finish documentation, or both."
  - "Whether the quoted product is the exact tested product line."
nextSteps:
  - href: "/commercial-resources"
    label: "Use the commercial resource hub"
    description: "Move into spec help, documentation workflow, and project coordination."
  - href: "/case-studies/houston-storefront-hedges"
    label: "See a related commercial project"
    description: "Use a real install to ground the planning conversation."
  - href: "/blog/fire-rated-artificial-greenery-for-texas-commercial-properties"
    label: "Read the broader fire-rated guide"
    description: "Step up into the larger commercial fire-planning resource."
```

```md
<!-- guide-module:comparison-matrix -->
```

```md
<!-- guide-module:submittal-checklist -->
```

- [ ] **Step 5: Run the build and verify the NFPA guide passes**

Run: `npm run build:blog`

Expected: PASS with `Updated: ./blog.html with ... posts` and no build error.

Run: `node scripts/check-flagship-guides.js`

Expected: PASS with `Flagship guide verification passed.`

- [ ] **Step 6: Commit the framework and first guide**

```bash
git add scripts/blog-flagship-guides.js scripts/build-blog.js scripts/post-build.js flagship-guides.css scripts/check-flagship-guides.js content/blog/2026-02-21-nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery.md blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery.html
git commit -m "feat: add flagship guide framework and convert nfpa guide"
```

### Task 3: Add Timeline And Path Modules And Convert The DIY Guide

**Files:**
- Modify: `scripts/blog-flagship-guides.js`
- Modify: `scripts/check-flagship-guides.js`
- Modify: `content/blog/2026-02-21-diy-vs-professional-artificial-hedge-installation.md`

- [ ] **Step 1: Extend the verification script to cover the DIY guide**

```js
// scripts/check-flagship-guides.js
checks.push({
  slug: 'diy-vs-professional-artificial-hedge-installation',
  required: [
    'data-guide-template="flagship"',
    'Quick Answers',
    'Decision Snapshot',
    'data-guide-module="timeline"',
    'data-guide-module="path-cards"',
    'What To Verify',
    'Where to go next',
  ],
});
```

- [ ] **Step 2: Run the verification to confirm the new guide still fails**

Run: `node scripts/check-flagship-guides.js`

Expected: FAIL because the DIY guide has not been upgraded yet.

- [ ] **Step 3: Add `timeline` and `pathCards` renderers**

```js
// scripts/blog-flagship-guides.js
function renderTimeline(module) {
  return `<section class="flagship-block" data-guide-module="timeline"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Process Timeline</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><ol class="flagship-timeline">${module.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol></section>`;
}

function renderPathCards(module) {
  return `<section class="flagship-block" data-guide-module="path-cards"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Cost Paths</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><div class="flagship-next-grid">${module.rows.map((row) => `<article class="flagship-next-card"><strong>${escapeHtml(cleanText(row?.label))}</strong><p>${escapeHtml(cleanText(row?.value))}</p></article>`).join('')}</div></section>`;
}

function renderGuideModule(module) {
  if (!module) return '';
  if (module.type === 'comparisonMatrix') return renderComparisonMatrix(module);
  if (module.type === 'checklist') return renderChecklist(module);
  if (module.type === 'timeline') return renderTimeline(module);
  if (module.type === 'pathCards') return renderPathCards(module);
  return '';
}
```

```css
/* flagship-guides.css */
.flagship-timeline { display: grid; gap: 0.9rem; margin: 0; padding-left: 1.25rem; }
.flagship-timeline li { color: rgba(255,255,255,0.86); }
```

- [ ] **Step 4: Convert the DIY guide to flagship frontmatter**

```md
guideType: flagship
guideEyebrow: "Installation planning guide"
guideAudience: "For homeowners deciding whether to handle a hedge install themselves or hire a pro"
guidePromise: "Know when DIY is realistic, where professional help changes the outcome, and what usually goes wrong."
quickAnswers:
  - question: "Can a homeowner handle a basic hedge install?"
    answer: "Yes, when the job is a straightforward fence attachment on a stable surface."
  - question: "When should you stop calling it a DIY project?"
    answer: "When the install requires framing, height access, structural work, or commercial coordination."
  - question: "What is the biggest DIY risk?"
    answer: "Treating a structural or long-run install like a simple panel attachment job."
decisionSnapshot:
  - label: "DIY is strongest when"
    value: "The fence is sound, the height is manageable, and the scope is limited."
  - label: "Professional help matters most when"
    value: "The project needs framing, large coverage, height access, or commercial coordination."
  - label: "What to decide first"
    value: "Whether the job is a fence attachment or a structure-building project."
guideModules:
  - key: "project-timeline"
    type: "timeline"
    title: "How to decide in the right order"
    intro: "Use this sequence before you buy panels or book labor."
    items:
      - "Check the mounting surface before you price anything."
      - "Decide whether the work is simple attachment or structural framing."
      - "Match the install path to height, scale, and access risk."
      - "Only compare costs after the scope is honest."
  - key: "cost-paths"
    type: "pathCards"
    title: "Three practical installation paths"
    intro: "Most projects fall into one of these buckets."
    rows:
      - label: "Weekend DIY"
        value: "Best for short fence runs and simple attachment jobs."
      - label: "Hybrid approach"
        value: "Use a contractor for structure or prep, then handle panel attachment yourself."
      - label: "Full professional install"
        value: "Best for large runs, height, commercial scope, or custom framing."
verifyItems:
  - "Whether the fence or wall is actually stable enough for panel attachment."
  - "Whether the manufacturer warranty depends on installation method."
  - "Whether height, access, or framing pushes the project out of DIY territory."
nextSteps:
  - href: "/installation"
    label: "Review the installation process"
    description: "See how Lone Star handles fabrication, site review, and install planning."
  - href: "/case-studies/austin-high-end-residential-privacy"
    label: "See a real privacy-wall project"
    description: "Use a large install example to calibrate what pro scope really looks like."
  - href: "/blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas"
    label: "Read the HOA approval guide"
    description: "Move into approval planning if your install sits in a restricted community."
```

```md
<!-- guide-module:project-timeline -->
```

```md
<!-- guide-module:cost-paths -->
```

- [ ] **Step 5: Run the build and verification**

Run: `npm run build:blog`

Expected: PASS.

Run: `node scripts/check-flagship-guides.js`

Expected: PASS with both NFPA and DIY guides covered.

- [ ] **Step 6: Commit the DIY conversion**

```bash
git add scripts/blog-flagship-guides.js scripts/check-flagship-guides.js flagship-guides.css content/blog/2026-02-21-diy-vs-professional-artificial-hedge-installation.md blog/diy-vs-professional-artificial-hedge-installation.html
git commit -m "feat: convert diy hedge installation to flagship guide"
```

### Task 4: Add Planning Grid Support And Convert The HOA Guide

**Files:**
- Modify: `scripts/blog-flagship-guides.js`
- Modify: `scripts/check-flagship-guides.js`
- Modify: `content/blog/2026-02-21-how-to-get-hoa-approval-for-artificial-hedges-in-texas.md`

- [ ] **Step 1: Extend the verification script to cover the HOA guide**

```js
// scripts/check-flagship-guides.js
checks.push({
  slug: 'how-to-get-hoa-approval-for-artificial-hedges-in-texas',
  required: [
    'data-guide-template="flagship"',
    'Quick Answers',
    'Decision Snapshot',
    'data-guide-module="planning-grid"',
    'data-guide-module="checklist"',
    'What To Verify',
    'Where to go next',
  ],
});
```

- [ ] **Step 2: Run the verification to confirm the HOA guide fails before implementation**

Run: `node scripts/check-flagship-guides.js`

Expected: FAIL because the HOA guide is not yet converted.

- [ ] **Step 3: Add a `planningGrid` renderer**

```js
// scripts/blog-flagship-guides.js
function renderPlanningGrid(module) {
  return `<section class="flagship-block" data-guide-module="planning-grid"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Planning Grid</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><div class="flagship-snapshot-grid">${module.rows.map((row) => `<article class="flagship-snapshot-card"><span>${escapeHtml(cleanText(row?.label))}</span><p>${escapeHtml(cleanText(row?.value))}</p></article>`).join('')}</div></section>`;
}

function renderGuideModule(module) {
  if (!module) return '';
  if (module.type === 'comparisonMatrix') return renderComparisonMatrix(module);
  if (module.type === 'checklist') return renderChecklist(module);
  if (module.type === 'timeline') return renderTimeline(module);
  if (module.type === 'pathCards') return renderPathCards(module);
  if (module.type === 'planningGrid') return renderPlanningGrid(module);
  return '';
}
```

- [ ] **Step 4: Convert the HOA guide frontmatter**

```md
guideType: flagship
guideEyebrow: "Homeowner approval guide"
guideAudience: "For Texas homeowners navigating HOA review before installing artificial hedges"
guidePromise: "Know what to submit, what the HOA is likely to care about, and what to verify before you treat a denial as final."
quickAnswers:
  - question: "Do most homeowners need HOA approval first?"
    answer: "Yes, if the property sits in a deed-restricted community with architectural review."
  - question: "What makes approval smoother?"
    answer: "A complete submission with a sample, photos, site plan, and a clear water-conservation argument."
  - question: "What is the biggest mistake?"
    answer: "Submitting too little detail and waiting until denial to clarify scope."
decisionSnapshot:
  - label: "What to do first"
    value: "Read the CC&Rs and architectural guidelines before choosing a product."
  - label: "What most boards want"
    value: "A clean visual result, clear placement, and enough documentation to understand the request."
  - label: "Where projects stall"
    value: "When the homeowner assumes the hedge will be understood without a complete package."
guideModules:
  - key: "approval-planning-grid"
    type: "planningGrid"
    title: "What To Lock Down Before You Submit"
    intro: "Use this planning grid before you send the application package."
    rows:
      - label: "Scope"
        value: "Where the hedge goes, total height, and whether the project changes the fence line."
      - label: "Appearance"
        value: "The exact product, color, realism level, and supporting photos."
      - label: "Submission package"
        value: "Spec sheet, physical sample, photos, and a simple site sketch."
      - label: "Parallel approvals"
        value: "Municipal permit needs, if the project changes structure or height."
  - key: "submission-checklist"
    type: "checklist"
    title: "Application Checklist"
    intro: "Use this to make the HOA review easier, faster, and less emotional."
    items:
      - "Completed application form or written request."
      - "Product spec sheet with dimensions and material description."
      - "A physical sample panel if possible."
      - "Completed-install photos using the same or similar product."
      - "A simple site plan or fence sketch."
verifyItems:
  - "Whether the CC&Rs speak directly about artificial landscaping."
  - "Whether height changes trigger a city or HOA issue."
  - "Whether your application clearly shows the finished appearance, not just the product name."
nextSteps:
  - href: "/hoa-approved-artificial-hedge"
    label: "See HOA-friendly hedge options"
    description: "Move from process into products that fit this conversation."
  - href: "/case-studies/austin-high-end-residential-privacy"
    label: "See a real privacy-wall project"
    description: "Use a published install as visual proof when discussing appearance."
  - href: "/pricing"
    label: "Get ballpark pricing"
    description: "Move into budget planning once the approval path looks realistic."
```

```md
<!-- guide-module:approval-planning-grid -->
```

```md
<!-- guide-module:submission-checklist -->
```

- [ ] **Step 5: Run the build and verification**

Run: `npm run build:blog`

Expected: PASS.

Run: `node scripts/check-flagship-guides.js`

Expected: PASS with NFPA, DIY, and HOA guides covered.

- [ ] **Step 6: Commit the HOA conversion**

```bash
git add scripts/blog-flagship-guides.js scripts/check-flagship-guides.js content/blog/2026-02-21-how-to-get-hoa-approval-for-artificial-hedges-in-texas.md blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas.html
git commit -m "feat: convert hoa approval guide to flagship format"
```

### Task 5: Add Decision Tree And Proof Insert Support And Convert The Indoor vs Outdoor Guide

**Files:**
- Modify: `scripts/blog-flagship-guides.js`
- Modify: `scripts/check-flagship-guides.js`
- Modify: `content/blog/2026-02-21-indoor-vs-outdoor-artificial-living-walls-materials-and-design.md`

- [ ] **Step 1: Extend the verification script to cover the indoor/outdoor guide**

```js
// scripts/check-flagship-guides.js
checks.push({
  slug: 'indoor-vs-outdoor-artificial-living-walls-materials-and-design',
  required: [
    'data-guide-template="flagship"',
    'Quick Answers',
    'Decision Snapshot',
    'data-guide-module="comparison-matrix"',
    'data-guide-module="decision-tree"',
    'data-guide-module="proof-insert"',
    'What To Verify',
    'Where to go next',
  ],
});
```

- [ ] **Step 2: Run the verification to confirm the new guide fails**

Run: `node scripts/check-flagship-guides.js`

Expected: FAIL because the living-wall guide is not yet converted.

- [ ] **Step 3: Add `decisionTree` and `proofInsert` renderers**

```js
// scripts/blog-flagship-guides.js
function renderDecisionTree(module) {
  return `<section class="flagship-block" data-guide-module="decision-tree"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Decision Tree</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><div class="flagship-next-grid">${module.rows.map((row) => `<article class="flagship-next-card"><strong>${escapeHtml(cleanText(row?.label))}</strong><p>${escapeHtml(cleanText(row?.value))}</p></article>`).join('')}</div></section>`;
}

function renderProofInsert(module) {
  const image = cleanText(module.rows?.[0]?.image);
  const href = cleanText(module.rows?.[0]?.href);
  const title = cleanText(module.rows?.[0]?.title);
  const summary = cleanText(module.rows?.[0]?.summary);

  return `<section class="flagship-block" data-guide-module="proof-insert"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Project Proof</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><a class="flagship-next-card" href="${escapeHtml(href)}">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">` : ''}<strong>${escapeHtml(title)}</strong><p>${escapeHtml(summary)}</p></a></section>`;
}

function renderGuideModule(module) {
  if (!module) return '';
  if (module.type === 'comparisonMatrix') return renderComparisonMatrix(module);
  if (module.type === 'checklist') return renderChecklist(module);
  if (module.type === 'timeline') return renderTimeline(module);
  if (module.type === 'pathCards') return renderPathCards(module);
  if (module.type === 'planningGrid') return renderPlanningGrid(module);
  if (module.type === 'decisionTree') return renderDecisionTree(module);
  if (module.type === 'proofInsert') return renderProofInsert(module);
  return '';
}
```

- [ ] **Step 4: Convert the indoor/outdoor guide frontmatter**

```md
guideType: flagship
guideEyebrow: "Living wall comparison guide"
guideAudience: "For homeowners, designers, and commercial buyers deciding between indoor and outdoor living wall systems"
guidePromise: "Choose the right materials, mounting path, and planning route for the environment you are actually building in."
quickAnswers:
  - question: "Can the same panel be used indoors and outdoors?"
    answer: "Outdoor-rated panels can go indoors, but indoor-only panels should not go outside."
  - question: "Where do the biggest cost differences come from?"
    answer: "Outdoor-rated materials, structural mounting, and weather-rated hardware."
  - question: "What changes the decision fastest?"
    answer: "Exposure, mounting surface, fire-review context, and visual distance."
decisionSnapshot:
  - label: "Indoor priority"
    value: "Appearance, texture, lighting, and close-up realism."
  - label: "Outdoor priority"
    value: "UV performance, weather-rated mounting, and long-term durability."
  - label: "What to decide first"
    value: "Whether the project is truly indoors, truly outdoors, or in a gray zone like a covered patio."
guideModules:
  - key: "environment-comparison"
    type: "comparisonMatrix"
    title: "Indoor vs Outdoor Living Walls"
    intro: "Use this matrix to avoid choosing an indoor visual solution for an outdoor performance problem."
    columns:
      - "Indoor"
      - "Outdoor"
    rows:
      - label: "Material priority"
        left: "Realism and texture"
        right: "UV stability and weather performance"
      - label: "Mounting priority"
        left: "Flat attachment and clean interior finish"
        right: "Ventilation, structure, and corrosion resistance"
      - label: "Code pressure"
        left: "Commercial interiors may trigger fire-review"
        right: "Usually lower, but not zero near egress or covered spaces"
  - key: "environment-decision-tree"
    type: "decisionTree"
    title: "Which path fits your project?"
    intro: "Use the actual environment, not the design mood board, to choose the system."
    rows:
      - label: "Interior feature wall"
        value: "Prioritize realism, lighting, and close-up finish quality."
      - label: "Covered patio or balcony"
        value: "Treat this as an exposure and code-review question before you choose product."
      - label: "Fully exterior wall"
        value: "Choose UV-rated materials and weather-rated mounting from the start."
  - key: "living-wall-proof"
    type: "proofInsert"
    title: "How this looks in a real project"
    intro: "Use a published Texas install to connect the guide to a real site condition."
    rows:
      - title: "Austin residential privacy wall"
        href: "/case-studies/austin-high-end-residential-privacy"
        image: "/case-studies/austin-high-end-residential-privacy/artificial%20boxwood%20privacy%20austin-05.avif"
        summary: "A real project showing how an exterior privacy wall changes once structure, exposure, and maintenance reality are taken seriously."
verifyItems:
  - "Whether the wall is truly indoor, fully outdoor, or a mixed condition."
  - "Whether the mounting surface can support the chosen system."
  - "Whether commercial fire-review applies based on occupancy and jurisdiction."
nextSteps:
  - href: "/living-wall"
    label: "See living wall options"
    description: "Move from comparison into the service page."
  - href: "/case-studies/austin-high-end-residential-privacy"
    label: "See the published project profile"
    description: "Ground the comparison in a real installed example."
  - href: "/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery"
    label: "Read the fire standards guide"
    description: "Use this if the project might face commercial documentation review."
```

```md
<!-- guide-module:environment-comparison -->
```

```md
<!-- guide-module:environment-decision-tree -->
```

```md
<!-- guide-module:living-wall-proof -->
```

- [ ] **Step 5: Run the build and verification**

Run: `npm run build:blog`

Expected: PASS.

Run: `node scripts/check-flagship-guides.js`

Expected: PASS with all four first-wave guides covered.

- [ ] **Step 6: Commit the living-wall conversion**

```bash
git add scripts/blog-flagship-guides.js scripts/check-flagship-guides.js content/blog/2026-02-21-indoor-vs-outdoor-artificial-living-walls-materials-and-design.md blog/indoor-vs-outdoor-artificial-living-walls-materials-and-design.html
git commit -m "feat: convert living wall comparison guide to flagship format"
```

### Task 6: Final Verification

**Files:**
- Verify: `scripts/check-flagship-guides.js`
- Verify: `scripts/build-blog.js`
- Verify: `scripts/post-build.js`
- Verify: `flagship-guides.css`
- Verify: `blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery.html`
- Verify: `blog/diy-vs-professional-artificial-hedge-installation.html`
- Verify: `blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas.html`
- Verify: `blog/indoor-vs-outdoor-artificial-living-walls-materials-and-design.html`

- [ ] **Step 1: Run the flagship guide regression check**

Run: `node scripts/check-flagship-guides.js`

Expected: PASS with `Flagship guide verification passed.`

- [ ] **Step 2: Run the blog build**

Run: `npm run build:blog`

Expected: PASS with updated generated guide pages and updated `guides.html` / `blog.html`.

- [ ] **Step 3: Run the full site build**

Run: `npm run build`

Expected: PASS with exit code `0`.

- [ ] **Step 4: Commit the final verified rollout**

```bash
git add scripts/check-flagship-guides.js scripts/blog-flagship-guides.js scripts/build-blog.js scripts/post-build.js flagship-guides.css content/blog/2026-02-21-nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery.md content/blog/2026-02-21-diy-vs-professional-artificial-hedge-installation.md content/blog/2026-02-21-how-to-get-hoa-approval-for-artificial-hedges-in-texas.md content/blog/2026-02-21-indoor-vs-outdoor-artificial-living-walls-materials-and-design.md blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery.html blog/diy-vs-professional-artificial-hedge-installation.html blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas.html blog/indoor-vs-outdoor-artificial-living-walls-materials-and-design.html
git commit -m "feat: ship first-wave flagship guides"
```

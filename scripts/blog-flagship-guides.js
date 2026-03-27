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
    ? value
      .map((item) => ({
        question: cleanText(item?.question),
        answer: cleanText(item?.answer),
      }))
      .filter((item) => item.question && item.answer)
    : [];

const normalizeDecisionSnapshot = (value) =>
  Array.isArray(value)
    ? value
      .map((item) => ({
        label: cleanText(item?.label),
        value: cleanText(item?.value),
      }))
      .filter((item) => item.label && item.value)
    : [];

const normalizeModules = (value) =>
  Array.isArray(value)
    ? value
      .map((item) => ({
        key: cleanText(item?.key),
        type: cleanText(item?.type),
        title: cleanText(item?.title),
        intro: cleanText(item?.intro),
        columns: normalizeStringList(item?.columns),
        rows: Array.isArray(item?.rows) ? item.rows : [],
        items: normalizeStringList(item?.items),
      }))
      .filter((item) => item.key && item.type && item.title)
    : [];

const normalizeNextSteps = (value) =>
  Array.isArray(value)
    ? value
      .map((item) => ({
        href: cleanText(item?.href),
        label: cleanText(item?.label),
        description: cleanText(item?.description),
      }))
      .filter((item) => item.href && item.label && item.description)
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
    nextSteps: normalizeNextSteps(data.nextSteps),
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

const moduleRenderers = {
  comparisonMatrix: renderComparisonMatrix,
  checklist: renderChecklist,
};

function warnMalformedModule(module, reason) {
  console.warn(`[flagship-guides] Malformed module "${module.key}" (${module.type}): ${reason}`);
}

function validateGuideModulePayload(module) {
  if (!module) return;

  if (module.type === 'comparisonMatrix') {
    if (module.columns.length === 0) {
      warnMalformedModule(module, 'missing columns');
    }
    if (module.rows.length === 0) {
      warnMalformedModule(module, 'missing rows');
    }
  }

  if (module.type === 'checklist' && module.items.length === 0) {
    warnMalformedModule(module, 'missing items');
  }
}

function renderGuideModule(module) {
  if (!module) return '';
  const renderer = moduleRenderers[module.type];
  if (!renderer) {
    return `<!-- unsupported guide module: ${module.key} (${module.type}) -->`;
  }
  return renderer(module);
}

export function injectFlagshipGuideModules(htmlContent, guide) {
  if (!guide) return htmlContent;

  const modulesByKey = new Map(guide.modules.map((module) => [module.key, module]));
  for (const module of guide.modules) {
    if (!moduleRenderers[module.type]) {
      console.warn(`[flagship-guides] Unsupported module type "${module.type}" for key "${module.key}"`);
    }
    validateGuideModulePayload(module);
  }

  return htmlContent.replace(GUIDE_MODULE_COMMENT_REGEX, (_, key) => {
    const normalizedKey = cleanText(key);
    const module = modulesByKey.get(normalizedKey);
    if (!module) {
      console.warn(`[flagship-guides] Missing guide module for placeholder "${normalizedKey}"`);
      return `<!-- missing guide module: ${normalizedKey} -->`;
    }
    return renderGuideModule(module);
  });
}

export function renderFlagshipGuideIntro(post, guide) {
  return `<div class="flagship-intro" data-guide-template="flagship"><p class="flagship-intro__eyebrow">${escapeHtml(guide.eyebrow || 'Flagship Guide')}</p><div class="flagship-intro__meta">${guide.audience ? `<span>${escapeHtml(guide.audience)}</span>` : ''}<span>${escapeHtml(post.displayDate)}</span></div><p class="flagship-intro__promise">${escapeHtml(guide.promise)}</p>${renderQuickAnswers(guide)}${renderDecisionSnapshot(guide)}</div>`;
}

export function renderFlagshipGuideOutro(guide) {
  const verifyBlock = guide.verifyItems.length > 0
    ? `<section class="flagship-block flagship-block--verify"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Truthfulness Check</p><h2>${escapeHtml(guide.verifyTitle)}</h2></div><ul class="flagship-checklist">${guide.verifyItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`
    : '';

  const nextStepBlock = guide.nextSteps.length > 0
    ? `<section class="flagship-block flagship-block--next"><div class="flagship-block__head"><p class="flagship-block__eyebrow">Where to go next</p><h2>Choose the next page that fits your project</h2></div><div class="flagship-next-grid">${guide.nextSteps.map((item) => `<a class="flagship-next-card" href="${escapeHtml(item.href)}"><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.description)}</p></a>`).join('')}</div></section>`
    : '';

  return `${verifyBlock}${nextStepBlock}`;
}

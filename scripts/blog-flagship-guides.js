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

const normalizeTimelineSteps = (value) =>
  Array.isArray(value)
    ? value
      .map((item) => ({
        title: cleanText(item?.title),
        description: cleanText(item?.description),
      }))
      .filter((item) => item.title && item.description)
    : [];

const normalizePathCards = (value) =>
  Array.isArray(value)
    ? value
      .map((item) => ({
        title: cleanText(item?.title),
        summary: cleanText(item?.summary),
        bestFor: cleanText(item?.bestFor),
      }))
      .filter((item) => item.title && (item.summary || item.bestFor))
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
        steps: normalizeTimelineSteps(item?.steps),
        stepsSourceCount: Array.isArray(item?.steps) ? item.steps.length : 0,
        cards: normalizePathCards(item?.cards),
        cardsSourceCount: Array.isArray(item?.cards) ? item.cards.length : 0,
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

  const modules = normalizeModules(data.guideModules);
  const seenModuleKeys = new Set();
  for (const module of modules) {
    if (seenModuleKeys.has(module.key)) {
      throw new Error(`[flagship-guides] Duplicate module key "${module.key}" in guide "${cleanText(post?.slug) || 'unknown'}"`);
    }
    seenModuleKeys.add(module.key);
  }

  return {
    eyebrow: cleanText(data.guideEyebrow),
    audience: cleanText(data.guideAudience),
    promise: cleanText(data.guidePromise || post.summary),
    quickAnswers: normalizeQuickAnswers(data.quickAnswers),
    decisionSnapshot: normalizeDecisionSnapshot(data.decisionSnapshot),
    modules,
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

function getGuideModuleConfig(moduleType) {
  return GUIDE_MODULE_REGISTRY[moduleType] || null;
}

function getRequiredGuideModuleConfig(module) {
  const moduleConfig = getGuideModuleConfig(cleanText(module?.type));
  if (!moduleConfig) {
    throw new Error(`[flagship-guides] Unsupported module type "${cleanText(module?.type)}" for key "${cleanText(module?.key)}"`);
  }
  if (typeof moduleConfig.render !== 'function') {
    throw new Error(`[flagship-guides] Missing renderer for module type "${cleanText(module?.type)}"`);
  }
  return moduleConfig;
}

function renderComparisonMatrix(module) {
  const moduleMeta = getRequiredGuideModuleConfig(module);
  const [leftLabel = 'Option A', rightLabel = 'Option B'] = module.columns;

  return `<section class="flagship-block" data-guide-module="${moduleMeta.token}"><div class="flagship-block__head"><p class="flagship-block__eyebrow">${moduleMeta.eyebrow}</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><div class="flagship-matrix"><div class="flagship-matrix__row flagship-matrix__row--head"><span>Decision Point</span><span>${escapeHtml(leftLabel)}</span><span>${escapeHtml(rightLabel)}</span></div>${module.rows.map((row) => `<div class="flagship-matrix__row"><span>${escapeHtml(cleanText(row?.label))}</span><span>${escapeHtml(cleanText(row?.left))}</span><span>${escapeHtml(cleanText(row?.right))}</span></div>`).join('')}</div></section>`;
}

function renderChecklist(module) {
  const moduleMeta = getRequiredGuideModuleConfig(module);
  return `<section class="flagship-block" data-guide-module="${moduleMeta.token}"><div class="flagship-block__head"><p class="flagship-block__eyebrow">${moduleMeta.eyebrow}</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><ul class="flagship-checklist">${module.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`;
}

function renderTimeline(module) {
  const moduleMeta = getRequiredGuideModuleConfig(module);
  const steps = module.steps.length > 0
    ? module.steps
    : module.items.map((item) => ({ title: item, description: '' }));

  return `<section class="flagship-block" data-guide-module="${moduleMeta.token}"><div class="flagship-block__head"><p class="flagship-block__eyebrow">${moduleMeta.eyebrow}</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><ol class="flagship-timeline">${steps.map((step, index) => `<li class="flagship-timeline__item"><span class="flagship-timeline__step">Step ${index + 1}</span><div><h3>${escapeHtml(step.title)}</h3>${step.description ? `<p>${escapeHtml(step.description)}</p>` : ''}</div></li>`).join('')}</ol></section>`;
}

function renderPathCards(module) {
  const moduleMeta = getRequiredGuideModuleConfig(module);
  const cards = module.cards.length > 0
    ? module.cards
    : module.items.map((item) => ({ title: item, summary: '', bestFor: '' }));

  return `<section class="flagship-block" data-guide-module="${moduleMeta.token}"><div class="flagship-block__head"><p class="flagship-block__eyebrow">${moduleMeta.eyebrow}</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><div class="flagship-path-grid">${cards.map((card) => `<article class="flagship-path-card"><h3>${escapeHtml(card.title)}</h3>${card.summary ? `<p>${escapeHtml(card.summary)}</p>` : ''}${card.bestFor ? `<p><strong>Best for:</strong> ${escapeHtml(card.bestFor)}</p>` : ''}</article>`).join('')}</div></section>`;
}

function renderPlanningGrid(module) {
  const moduleMeta = getRequiredGuideModuleConfig(module);
  return `<section class="flagship-block" data-guide-module="${moduleMeta.token}"><div class="flagship-block__head"><p class="flagship-block__eyebrow">${moduleMeta.eyebrow}</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><div class="flagship-snapshot-grid">${module.rows.map((row) => `<article class="flagship-snapshot-card"><span>${escapeHtml(cleanText(row?.label))}</span><p>${escapeHtml(cleanText(row?.value))}</p></article>`).join('')}</div></section>`;
}

function renderDecisionTree(module) {
  const moduleMeta = getRequiredGuideModuleConfig(module);
  if (module.rows.length === 0) {
    throw new Error(`[flagship-guides] Malformed module "${module.key}" (${module.type}): missing rows`);
  }
  module.rows.forEach((row, index) => {
    const rowLabel = cleanText(row?.label);
    const rowValue = cleanText(row?.value);
    if (!rowLabel || !rowValue) {
      throw new Error(`[flagship-guides] Malformed module "${module.key}" (${module.type}): row ${index + 1} is missing label or value`);
    }
  });
  return `<section class="flagship-block" data-guide-module="${moduleMeta.token}"><div class="flagship-block__head"><p class="flagship-block__eyebrow">${moduleMeta.eyebrow}</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><div class="flagship-next-grid">${module.rows.map((row) => `<article class="flagship-next-card"><strong>${escapeHtml(cleanText(row?.label))}</strong><p>${escapeHtml(cleanText(row?.value))}</p></article>`).join('')}</div></section>`;
}

function renderProofInsert(module) {
  const moduleMeta = getRequiredGuideModuleConfig(module);
  const row = module.rows[0];
  const href = cleanText(row?.href);
  const title = cleanText(row?.title);
  const summary = cleanText(row?.summary);
  const image = cleanText(row?.image);
  if (!href || !title || !summary) {
    throw new Error(`[flagship-guides] Malformed module "${module.key}" (${module.type}): proof row is missing href, title, or summary`);
  }

  return `<section class="flagship-block" data-guide-module="${moduleMeta.token}"><div class="flagship-block__head"><p class="flagship-block__eyebrow">${moduleMeta.eyebrow}</p><h2>${escapeHtml(module.title)}</h2><p>${escapeHtml(module.intro)}</p></div><a class="flagship-next-card" href="${escapeHtml(href)}">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">` : ''}<strong>${escapeHtml(title)}</strong><p>${escapeHtml(summary)}</p></a></section>`;
}

const GUIDE_MODULE_REGISTRY = Object.freeze({
  comparisonMatrix: { token: 'comparison-matrix', eyebrow: 'Comparison Matrix', render: renderComparisonMatrix },
  checklist: { token: 'checklist', eyebrow: 'Checklist', render: renderChecklist },
  timeline: { token: 'timeline', eyebrow: 'Timeline', render: renderTimeline },
  pathCards: { token: 'path-cards', eyebrow: 'Path Cards', render: renderPathCards },
  planningGrid: { token: 'planning-grid', eyebrow: 'Planning Grid', render: renderPlanningGrid },
  decisionTree: { token: 'decision-tree', eyebrow: 'Decision Tree', render: renderDecisionTree },
  proofInsert: { token: 'proof-insert', eyebrow: 'Project Proof', render: renderProofInsert },
});

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
    module.rows.forEach((row, index) => {
      const rowLabel = cleanText(row?.label);
      const rowLeft = cleanText(row?.left);
      const rowRight = cleanText(row?.right);
      const missingFields = [];
      if (!rowLabel) missingFields.push('label');
      if (!rowLeft) missingFields.push('left');
      if (!rowRight) missingFields.push('right');
      if (missingFields.length > 0) {
        warnMalformedModule(module, `row ${index + 1} is missing ${missingFields.join(', ')}`);
      }
    });
  }

  if (module.type === 'checklist' && module.items.length === 0) {
    warnMalformedModule(module, 'missing items');
  }

  if (module.type === 'timeline') {
    if (module.stepsSourceCount > 0 && module.steps.length < module.stepsSourceCount) {
      warnMalformedModule(module, `${module.stepsSourceCount - module.steps.length} step(s) ignored because each step must include both title and description`);
    }
    if (module.steps.length === 0 && module.items.length === 0) {
      warnMalformedModule(module, 'missing steps');
    }
  }

  if (module.type === 'pathCards') {
    if (module.cardsSourceCount > 0 && module.cards.length < module.cardsSourceCount) {
      warnMalformedModule(module, `${module.cardsSourceCount - module.cards.length} card(s) ignored because each card must include title and summary or bestFor`);
    }
    if (module.cards.length === 0 && module.items.length === 0) {
      warnMalformedModule(module, 'missing cards');
    }
  }

  if (module.type === 'planningGrid') {
    if (module.rows.length === 0) {
      warnMalformedModule(module, 'missing rows');
    }
    module.rows.forEach((row, index) => {
      const rowLabel = cleanText(row?.label);
      const rowValue = cleanText(row?.value);
      const missingFields = [];
      if (!rowLabel) missingFields.push('label');
      if (!rowValue) missingFields.push('value');
      if (missingFields.length > 0) {
        warnMalformedModule(module, `row ${index + 1} is missing ${missingFields.join(', ')}`);
      }
    });
  }

  if (module.type === 'decisionTree') {
    if (module.rows.length === 0) {
      throw new Error(`[flagship-guides] Malformed module "${module.key}" (${module.type}): missing rows`);
    }
    module.rows.forEach((row, index) => {
      const rowLabel = cleanText(row?.label);
      const rowValue = cleanText(row?.value);
      if (!rowLabel || !rowValue) {
        throw new Error(`[flagship-guides] Malformed module "${module.key}" (${module.type}): row ${index + 1} is missing label or value`);
      }
    });
  }

  if (module.type === 'proofInsert') {
    if (module.rows.length === 0) {
      throw new Error(`[flagship-guides] Malformed module "${module.key}" (${module.type}): missing proof row`);
    }
    if (module.rows.length > 1) {
      warnMalformedModule(module, `${module.rows.length - 1} extra proof row(s) ignored`);
    }
    const row = module.rows[0];
    const missingFields = [];
    if (!cleanText(row?.href)) missingFields.push('href');
    if (!cleanText(row?.title)) missingFields.push('title');
    if (!cleanText(row?.summary)) missingFields.push('summary');
    if (missingFields.length > 0) {
      throw new Error(`[flagship-guides] Malformed module "${module.key}" (${module.type}): proof row is missing ${missingFields.join(', ')}`);
    }
  }
}

function renderGuideModule(module) {
  if (!module) return '';
  const moduleConfig = getRequiredGuideModuleConfig(module);
  return moduleConfig.render(module);
}

export function injectFlagshipGuideModules(htmlContent, guide) {
  if (!guide) return htmlContent;

  const modulesByKey = new Map();
  for (const module of guide.modules) {
    if (modulesByKey.has(module.key)) {
      throw new Error(`[flagship-guides] Duplicate module key "${module.key}" detected during injection`);
    }
    modulesByKey.set(module.key, module);
    getRequiredGuideModuleConfig(module);
    validateGuideModulePayload(module);
  }

  const usedKeys = new Set();
  const injectedHtml = htmlContent.replace(GUIDE_MODULE_COMMENT_REGEX, (_, key) => {
    const normalizedKey = cleanText(key);
    const module = modulesByKey.get(normalizedKey);
    if (!module) {
      console.warn(`[flagship-guides] Missing guide module for placeholder "${normalizedKey}"`);
      return `<!-- missing guide module: ${normalizedKey} -->`;
    }
    usedKeys.add(normalizedKey);
    return renderGuideModule(module);
  });

  for (const moduleKey of modulesByKey.keys()) {
    if (!usedKeys.has(moduleKey)) {
      console.warn(`[flagship-guides] Orphaned module "${moduleKey}" is defined in frontmatter but has no placeholder`);
    }
  }

  return injectedHtml;
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

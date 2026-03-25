(function () {
  const DATA_URL = '/content/case-studies.json';
  const SELECTOR = '[data-lsfs-case-studies]';
  const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  function parseSlugList(value) {
    return cleanText(value)
      .split(',')
      .map((item) => cleanText(item))
      .filter(Boolean);
  }

  function normalizePath(value) {
    const cleaned = cleanText(value);
    if (!cleaned) return '';
    if (/^https?:\/\//i.test(cleaned)) return cleaned;
    return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  }

  function sanitizeId(value) {
    const cleaned = cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return cleaned.replace(/^-+|-+$/g, '') || 'proof';
  }

  function prefersReducedMotion() {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  }

  function formatCount(current, total) {
    const currentLabel = String(current + 1).padStart(2, '0');
    const totalLabel = String(total).padStart(2, '0');
    return `${currentLabel} / ${totalLabel}`;
  }

  function uniqueValues(entries, selector) {
    return Array.from(
      new Set(
        entries
          .map(selector)
          .map((value) => cleanText(value))
          .filter(Boolean)
      )
    );
  }

  function buildSummaryPills(entries) {
    const cities = uniqueValues(entries, (entry) => entry.city);
    const audiences = uniqueValues(entries, (entry) => entry.audience || entry.category);

    const pills = [
      `${entries.length} published snapshot${entries.length === 1 ? '' : 's'}`,
      `${cities.length} Texas ${cities.length === 1 ? 'city' : 'cities'}`,
    ];

    if (audiences.length > 0) {
      pills.push(audiences.join(' + '));
    }

    return pills.slice(0, 3);
  }

  function factBlocksFor(entry) {
    const blocks = [];

    if (entry.problemSolved) {
      blocks.push({
        label: 'Problem solved',
        value: entry.problemSolved,
      });
    }

    if (entry.installTime) {
      blocks.push({
        label: 'Install timing',
        value: entry.installTime,
      });
    } else if (entry.dimensions) {
      blocks.push({
        label: 'Project size',
        value: entry.dimensions,
      });
    } else if (Array.isArray(entry.scope) && entry.scope.length > 0) {
      blocks.push({
        label: 'Scope snapshot',
        value: entry.scope[0],
      });
    }

    if (entry.documentationNotes) {
      blocks.push({
        label: 'Project note',
        value: entry.documentationNotes,
      });
    } else if (entry.fireRatingNotes) {
      blocks.push({
        label: 'Fire-rating note',
        value: entry.fireRatingNotes,
      });
    } else if (Array.isArray(entry.material) && entry.material.length > 0) {
      blocks.push({
        label: 'Material',
        value: entry.material[0],
      });
    }

    if (blocks.length < 3 && Array.isArray(entry.scope) && entry.scope.length > 1) {
      blocks.push({
        label: 'Extra scope',
        value: entry.scope[1],
      });
    }

    if (blocks.length < 3 && entry.displayDate) {
      blocks.push({
        label: 'Published',
        value: entry.displayDate,
      });
    }

    return blocks.slice(0, 3);
  }

  function compactMeta(entry) {
    return [entry.dimensions, entry.installTime, entry.displayDate]
      .map((value) => cleanText(value))
      .find(Boolean) || cleanText(entry.projectType) || 'Published project profile';
  }

  function imageFor(entry) {
    if (Array.isArray(entry.afterImages) && entry.afterImages.length > 0) {
      return entry.afterImages[0];
    }

    if (Array.isArray(entry.beforeImages) && entry.beforeImages.length > 0) {
      return entry.beforeImages[0];
    }

    return entry.image || '/images/commercial/commercial-1.webp';
  }

  function detailHrefFor(entry) {
    return normalizePath(entry.path || `/case-studies/${entry.slug}`);
  }

  function serviceHrefFor(entry) {
    if (Array.isArray(entry.relatedServices) && entry.relatedServices.length > 0) {
      return normalizePath(entry.relatedServices[0]);
    }

    return '/pricing';
  }

  function serviceLabelFor(href) {
    return href === '/pricing' ? 'Get ballpark pricing' : 'View matching service';
  }

  function thumbEyebrow(entry) {
    return [entry.city || 'Texas', entry.projectType || entry.category || 'Project profile']
      .filter(Boolean)
      .join(' | ');
  }

  function spotlightEyebrow(entry) {
    return [entry.city || 'Texas', entry.audience || entry.category || 'Project profile', entry.displayDate]
      .filter(Boolean)
      .join(' | ');
  }

  function renderThumb(entry, sectionLabel, hostId, index) {
    const thumbId = `${hostId}-tab-${index}`;
    const panelId = `${hostId}-panel`;

    return `
      <button
        class="lsfs-proof-thumb"
        id="${escapeHtml(thumbId)}"
        type="button"
        role="tab"
        aria-controls="${escapeHtml(panelId)}"
        aria-selected="${index === 0 ? 'true' : 'false'}"
        tabindex="${index === 0 ? '0' : '-1'}"
        data-proof-index="${index}"
        data-lsfs-cta="${escapeHtml(`${sectionLabel}_${entry.slug}_select`)}"
      >
        <span class="lsfs-proof-thumb__media">
          <span class="lsfs-proof-thumb__index">${escapeHtml(String(index + 1).padStart(2, '0'))}</span>
          <img src="${escapeHtml(imageFor(entry))}" alt="${escapeHtml(entry.title)}" loading="lazy" decoding="async">
        </span>
        <span class="lsfs-proof-thumb__body">
          <span class="lsfs-proof-thumb__eyebrow">${escapeHtml(thumbEyebrow(entry))}</span>
          <span class="lsfs-proof-thumb__title">${escapeHtml(entry.title)}</span>
          <span class="lsfs-proof-thumb__meta">${escapeHtml(compactMeta(entry))}</span>
        </span>
      </button>
    `;
  }

  function renderDot(sectionLabel, entry, index) {
    return `
      <button
        class="lsfs-proof-dot"
        type="button"
        aria-label="Show snapshot ${index + 1}"
        aria-pressed="${index === 0 ? 'true' : 'false'}"
        data-proof-index="${index}"
        data-lsfs-cta="${escapeHtml(`${sectionLabel}_${entry.slug}_dot`)}"
      ></button>
    `;
  }

  function renderSection(host, entries, hostIndex) {
    const title = cleanText(host.getAttribute('data-lsfs-proof-title')) || 'Recent Texas project profiles';
    const copy = cleanText(host.getAttribute('data-lsfs-proof-copy')) || 'Recent installs with the problem solved, likely scope, and the clearest next step.';
    const sectionLabel = cleanText(host.getAttribute('data-lsfs-proof-context')) || 'proof_section';
    const secondaryHref = normalizePath(host.getAttribute('data-lsfs-proof-secondary-href'));
    const secondaryLabel = cleanText(host.getAttribute('data-lsfs-proof-secondary-label'));
    const isThreeUp = cleanText(host.getAttribute('data-lsfs-proof-layout')) === 'three';
    const hostId = `lsfs-proof-${sanitizeId(sectionLabel)}-${hostIndex}`;
    const panelId = `${hostId}-panel`;
    const pills = buildSummaryPills(entries);
    const showNav = entries.length > 1;

    host.classList.add('lsfs-proof-section');
    host.setAttribute('data-lsfs-context', sectionLabel);
    host.innerHTML = `
      <div class="lsfs-proof-shell${isThreeUp ? ' lsfs-proof-shell--three' : ''}">
        <div class="lsfs-proof-head">
          <div class="lsfs-proof-intro">
            <p class="lsfs-proof-kicker">Published work</p>
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(copy)}</p>
          </div>
          <div class="lsfs-proof-head__meta">
            <div class="lsfs-proof-pills">
              ${pills.map((pill) => `<span class="lsfs-proof-pill">${escapeHtml(pill)}</span>`).join('')}
            </div>
            <div class="lsfs-proof-head__actions">
              ${secondaryHref && secondaryLabel ? `
                <a class="lsfs-proof-browse" href="${escapeHtml(secondaryHref)}" data-lsfs-cta="${escapeHtml(`${sectionLabel}_secondary`)}">
                  ${escapeHtml(secondaryLabel)}
                </a>
              ` : ''}
              ${showNav ? `
                <div class="lsfs-proof-nav" aria-label="Snapshot controls">
                  <button class="lsfs-proof-nav__btn" type="button" data-proof-prev aria-label="Previous snapshot">
                    <span aria-hidden="true">&larr;</span>
                  </button>
                  <button class="lsfs-proof-nav__btn" type="button" data-proof-next aria-label="Next snapshot">
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
        <div
          class="lsfs-proof-spotlight"
          id="${escapeHtml(panelId)}"
          role="tabpanel"
          aria-labelledby="${escapeHtml(`${hostId}-tab-0`)}"
          tabindex="-1"
        >
          <div class="lsfs-proof-spotlight__media">
            <img class="lsfs-proof-spotlight__image" alt="" loading="eager" decoding="async">
            <span class="lsfs-proof-spotlight__tag" data-proof-tag></span>
            <div class="lsfs-proof-spotlight__frame">
              <span class="lsfs-proof-spotlight__status">Published project profile</span>
              <span class="lsfs-proof-spotlight__count" data-proof-count>${escapeHtml(formatCount(0, entries.length))}</span>
            </div>
          </div>
          <div class="lsfs-proof-spotlight__content">
            <div class="lsfs-proof-spotlight__eyebrow" data-proof-eyebrow></div>
            <h3 class="lsfs-proof-spotlight__title" data-proof-title></h3>
            <p class="lsfs-proof-spotlight__summary" data-proof-summary></p>
            <div class="lsfs-proof-spotlight__chips" data-proof-chips></div>
            <div class="lsfs-proof-spotlight__facts" data-proof-facts></div>
            <div class="lsfs-proof-spotlight__actions">
              <a class="lsfs-proof-card__link" data-proof-detail href="#">Read project profile</a>
              <a class="lsfs-proof-card__ghost" data-proof-service href="#">View matching service</a>
            </div>
          </div>
        </div>
        <div class="lsfs-proof-rail-shell">
          <div class="lsfs-proof-progress" aria-hidden="true">
            <span class="lsfs-proof-progress__bar" data-proof-progress></span>
          </div>
          <div class="lsfs-proof-rail" role="tablist" aria-label="${escapeHtml(title)} snapshots">
            ${entries.map((entry, index) => renderThumb(entry, sectionLabel, hostId, index)).join('')}
          </div>
          ${showNav ? `
            <div class="lsfs-proof-dots" aria-label="Choose a snapshot">
              ${entries.map((entry, index) => renderDot(sectionLabel, entry, index)).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    bindSection(host, entries, hostId);
  }

  function bindSection(host, entries, hostId) {
    const spotlight = host.querySelector('.lsfs-proof-spotlight');
    const spotlightImage = host.querySelector('.lsfs-proof-spotlight__image');
    const spotlightTag = host.querySelector('[data-proof-tag]');
    const count = host.querySelector('[data-proof-count]');
    const eyebrow = host.querySelector('[data-proof-eyebrow]');
    const title = host.querySelector('[data-proof-title]');
    const summary = host.querySelector('[data-proof-summary]');
    const chips = host.querySelector('[data-proof-chips]');
    const facts = host.querySelector('[data-proof-facts]');
    const detailLink = host.querySelector('[data-proof-detail]');
    const serviceLink = host.querySelector('[data-proof-service]');
    const progress = host.querySelector('[data-proof-progress]');
    const prevButton = host.querySelector('[data-proof-prev]');
    const nextButton = host.querySelector('[data-proof-next]');
    const thumbs = Array.from(host.querySelectorAll('.lsfs-proof-thumb'));
    const dots = Array.from(host.querySelectorAll('.lsfs-proof-dot'));
    const rail = host.querySelector('.lsfs-proof-rail');
    const panelId = `${hostId}-panel`;
    let activeIndex = 0;

    function syncProgress(index) {
      if (!progress) return;
      const percentage = entries.length <= 1
        ? 100
        : ((index + 1) / entries.length) * 100;
      progress.style.width = `${percentage}%`;
    }

    function renderFacts(entry) {
      return factBlocksFor(entry)
        .map((block) => `
          <article class="lsfs-proof-fact">
            <span class="lsfs-proof-fact__label">${escapeHtml(block.label)}</span>
            <p>${escapeHtml(block.value)}</p>
          </article>
        `)
        .join('');
    }

    function renderChips(entry) {
      return [entry.audience || entry.category, entry.city, entry.projectType]
        .map((value) => cleanText(value))
        .filter(Boolean)
        .map((value) => `<span class="lsfs-proof-chip">${escapeHtml(value)}</span>`)
        .join('');
    }

    function updateControls(index) {
      thumbs.forEach((thumb, thumbIndex) => {
        const isActive = thumbIndex === index;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-selected', isActive ? 'true' : 'false');
        thumb.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      if (prevButton) {
        prevButton.disabled = index === 0;
      }

      if (nextButton) {
        nextButton.disabled = index === entries.length - 1;
      }
    }

    function setActive(index, options) {
      const nextIndex = Math.max(0, Math.min(index, entries.length - 1));
      if (nextIndex === activeIndex && !options?.force) return;

      activeIndex = nextIndex;
      const entry = entries[nextIndex];
      const detailHref = detailHrefFor(entry);
      const serviceHref = serviceHrefFor(entry);
      const activeThumb = thumbs[nextIndex];

      spotlight.setAttribute('aria-labelledby', activeThumb ? activeThumb.id : `${hostId}-tab-${nextIndex}`);
      spotlight.id = panelId;
      spotlightImage.src = imageFor(entry);
      spotlightImage.alt = entry.title || 'Published project profile';
      spotlightTag.textContent = [entry.city || 'Texas', entry.projectType || entry.category || 'Project profile']
        .filter(Boolean)
        .join(' / ');
      count.textContent = formatCount(nextIndex, entries.length);
      eyebrow.textContent = spotlightEyebrow(entry);
      title.textContent = entry.title || 'Project profile';
      summary.textContent = entry.summary || 'Published project details.';
      chips.innerHTML = renderChips(entry);
      facts.innerHTML = renderFacts(entry);
      detailLink.href = detailHref;
      serviceLink.href = serviceHref;
      serviceLink.textContent = serviceLabelFor(serviceHref);
      updateControls(nextIndex);
      syncProgress(nextIndex);

      if (options?.scroll !== false && activeThumb) {
        activeThumb.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }

    function move(delta) {
      setActive(activeIndex + delta, { scroll: true });
    }

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        setActive(index, { scroll: true });
      });

      thumb.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          const nextIndex = Math.min(index + 1, entries.length - 1);
          setActive(nextIndex, { scroll: true });
          thumbs[nextIndex]?.focus();
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          const nextIndex = Math.max(index - 1, 0);
          setActive(nextIndex, { scroll: true });
          thumbs[nextIndex]?.focus();
        } else if (event.key === 'Home') {
          event.preventDefault();
          setActive(0, { scroll: true });
          thumbs[0]?.focus();
        } else if (event.key === 'End') {
          event.preventDefault();
          const lastIndex = entries.length - 1;
          setActive(lastIndex, { scroll: true });
          thumbs[lastIndex]?.focus();
        }
      });
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        setActive(index, { scroll: true });
      });
    });

    prevButton?.addEventListener('click', () => move(-1));
    nextButton?.addEventListener('click', () => move(1));

    if (
      entries.length > 1 &&
      rail &&
      rail.scrollWidth > rail.clientWidth + 8 &&
      'IntersectionObserver' in window
    ) {
      const observer = new IntersectionObserver((records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const index = Number(visible.target.getAttribute('data-proof-index'));
        if (Number.isNaN(index)) return;
        setActive(index, { scroll: false });
      }, {
        root: rail,
        threshold: [0.55, 0.8],
      });

      thumbs.forEach((thumb) => observer.observe(thumb));
    }

    setActive(0, { force: true, scroll: false });

    // Stabilize height: measure all entries to find the tallest, then lock the content panel
    // Deferred to avoid forced reflow during initial paint
    if (entries.length > 1 && spotlight) {
      const stabilize = () => {
        let maxHeight = 0;
        for (let i = 0; i < entries.length; i++) {
          setActive(i, { force: true, scroll: false });
          const h = spotlight.getBoundingClientRect().height;
          if (h > maxHeight) maxHeight = h;
        }
        if (maxHeight > 0) {
          spotlight.style.minHeight = `${maxHeight}px`;
        }
        setActive(0, { force: true, scroll: false });
      };
      if ('requestIdleCallback' in window) {
        requestIdleCallback(stabilize);
      } else {
        setTimeout(stabilize, 200);
      }
    }
  }

  function renderFallback(host) {
    const title = cleanText(host.getAttribute('data-lsfs-proof-title')) || 'Project profiles';
    const copy = cleanText(host.getAttribute('data-lsfs-proof-copy')) || 'Browse recent project profiles for install examples and scope details.';
    const sectionLabel = cleanText(host.getAttribute('data-lsfs-proof-context')) || 'proof_section';
    const secondaryHref = normalizePath(host.getAttribute('data-lsfs-proof-secondary-href')) || '/case-studies';
    const secondaryLabel = cleanText(host.getAttribute('data-lsfs-proof-secondary-label')) || 'Browse project profiles';

    host.classList.add('lsfs-proof-section');
    host.setAttribute('data-lsfs-context', sectionLabel);
    host.innerHTML = `
      <div class="lsfs-proof-shell">
        <div class="lsfs-proof-intro">
          <p class="lsfs-proof-kicker">Published work</p>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(copy)}</p>
        </div>
        <div class="lsfs-cro-links">
          <a href="${escapeHtml(secondaryHref)}" data-lsfs-cta="${escapeHtml(`${sectionLabel}_fallback`)}">${escapeHtml(secondaryLabel)}</a>
        </div>
      </div>
    `;
  }

  async function loadEntries() {
    const response = await fetch(DATA_URL, { credentials: 'same-origin' });
    if (!response.ok) {
      throw new Error(`Case study data request failed with ${response.status}`);
    }

    const payload = await response.json();
    return Array.isArray(payload) ? payload : [];
  }

  function pickEntries(allEntries, host) {
    const slugs = parseSlugList(host.getAttribute('data-lsfs-case-studies'));
    if (slugs.length === 0) return [];

    const bySlug = new Map(allEntries.map((entry) => [cleanText(entry.slug), entry]));
    return slugs
      .map((slug) => bySlug.get(slug))
      .filter(Boolean);
  }

  function init() {
    const hosts = Array.from(document.querySelectorAll(SELECTOR));
    if (hosts.length === 0) return;

    loadEntries()
      .then((entries) => {
        hosts.forEach((host, hostIndex) => {
          const matches = pickEntries(entries, host);
          if (matches.length === 0) {
            renderFallback(host);
            return;
          }

          renderSection(host, matches, hostIndex);
        });
      })
      .catch((error) => {
        console.warn('Case study proof sections could not load.', error);
        hosts.forEach((host) => renderFallback(host));
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

(function () {
  const PHONE_HREF = 'tel:+17609787335';
  const PHONE_LABEL = '(760) 978-7335';
  const EMAIL_ADDRESS = 'info@lonestarfauxscapes.com';
  const EMAIL_HREF = `mailto:${EMAIL_ADDRESS}`;
  const FALLBACK_CONTACT_URL = 'https://contact-form.atrex92.workers.dev';
  const TURNSTILE_PROD_SITEKEY = '0x4AAAAAACV8gs7CEDMYDaQu';
  const TURNSTILE_TEST_SITEKEY = '1x00000000000000000000AA';
  const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  const LOCAL_PREVIEW_HOSTS = new Set(['localhost', '127.0.0.1']);
  const GALLERY_JOURNEY_KEY = 'lsfs_gallery_journey';
  const MOBILE_BREAKPOINT = 860;
  let turnstilePromise = null;
  let widgetCounter = 0;
  const startedForms = new WeakSet();

  function resolveTurnstileSitekey() {
    const explicit =
      typeof window.__LSFS_TURNSTILE_SITEKEY === 'string'
        ? window.__LSFS_TURNSTILE_SITEKEY.trim()
        : '';

    if (explicit) return explicit;

    return LOCAL_PREVIEW_HOSTS.has(window.location.hostname)
      ? TURNSTILE_TEST_SITEKEY
      : TURNSTILE_PROD_SITEKEY;
  }

  function normalizePathname(pathname) {
    let normalized = pathname || window.location.pathname || '/';
    if (normalized.endsWith('/index.html')) normalized = normalized.slice(0, -11) || '/';
    if (normalized.endsWith('.html')) normalized = normalized.slice(0, -5) || '/';
    if (normalized !== '/' && normalized.endsWith('/')) normalized = normalized.slice(0, -1);
    return normalized || '/';
  }

  function getPageType(pathname = normalizePathname()) {
    if (pathname === '/') return 'homepage';
    if (pathname === '/pricing') return 'pricing_page';
    if (pathname === '/contact') return 'contact_page';
    if (pathname === '/residential') return 'residential_page';
    if (pathname === '/living-wall') return 'living_wall_page';
    if (/^\/blog\/[^/]+$/.test(pathname)) return 'blog_post';
    if (pathname === '/blog') return 'blog_index';
    if (pathname === '/gallery') return 'gallery_page';
    if (pathname === '/case-studies' || /^\/case-studies\/[^/]+$/.test(pathname)) return 'case_study';
    if (/^\/(austin|dallas|houston|san-antonio|fort-worth)$/.test(pathname)) return 'city_page';
    if (/^\/(artificial-hedge|fire-rated-artificial-hedge|pool-privacy-hedge|fence-extensions|commercial-wall|commercial)$/.test(pathname)) {
      return 'service_page';
    }
    return 'marketing_page';
  }

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function sectionLabelFor(element) {
    if (!element) return 'page';
    const explicit = element.closest('[data-lsfs-context]');
    if (explicit) return cleanText(explicit.getAttribute('data-lsfs-context'));

    const region = element.closest('section, article, aside, header, footer, nav, form, main');
    if (!region) return 'page';

    const heading = region.querySelector('h1, h2, h3');
    if (heading) return cleanText(heading.textContent).slice(0, 80);

    if (region.getAttribute('aria-label')) return cleanText(region.getAttribute('aria-label')).slice(0, 80);
    if (region.id) return cleanText(region.id).slice(0, 80);
    return region.tagName.toLowerCase();
  }

  function buildPagePayload(extra) {
    return Object.assign({
      page_path: normalizePathname(),
      page_type: getPageType(),
      page_title: document.title,
    }, extra || {});
  }

  function track(eventName, props) {
    const payload = buildPagePayload(props);

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: eventName }, payload));
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }

    document.dispatchEvent(new CustomEvent('lsfs:tracking', {
      detail: Object.assign({ event: eventName }, payload),
    }));

    if (window.localStorage && window.localStorage.getItem('lsfs_debug_events') === '1') {
      console.log('[LSFS CRO]', eventName, payload);
    }

    return payload;
  }

  function getElementText(element) {
    const explicit = element.getAttribute('data-lsfs-cta-label');
    if (explicit) return cleanText(explicit);
    return cleanText(element.textContent || element.getAttribute('aria-label') || element.value || '');
  }

  function resolveFieldValue(form, names) {
    for (const name of names) {
      const field = form.querySelector(`[name="${name}"]`);
      if (field && cleanText(field.value)) return field.value;
    }
    return '';
  }

  function resolveAudienceValue(form) {
    return cleanText(resolveFieldValue(form, ['audience', 'project-type', 'type']));
  }

  function resolveLocationValue(form) {
    return cleanText(resolveFieldValue(form, ['location', 'city']));
  }

  function clearFieldErrors(form) {
    form.querySelectorAll('.is-error').forEach((field) => {
      field.classList.remove('is-error');
      field.removeAttribute('aria-invalid');
    });
  }

  function markFieldError(form, name) {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    field.classList.add('is-error');
    field.setAttribute('aria-invalid', 'true');
  }

  function markValidationErrors(form, fields) {
    clearFieldErrors(form);
    fields.forEach((field) => markFieldError(form, field));
  }

  function buildFormProps(form, extra) {
    const audience = resolveAudienceValue(form);

    const serviceInterest = cleanText(
      form.querySelector('[name="service"]')?.value ||
      form.getAttribute('data-lsfs-service') ||
      form.getAttribute('data-lsfs-form-service')
    );

    return Object.assign({
      form_name: cleanText(form.getAttribute('data-lsfs-track-form') || form.id || form.name || 'contact_form'),
      form_context: cleanText(form.getAttribute('data-lsfs-form-context') || sectionLabelFor(form)),
      audience: audience || 'unspecified',
      service_interest: serviceInterest || 'unspecified',
    }, extra || {});
  }

  function markFormStarted(form, extra) {
    if (!form || startedForms.has(form)) return;
    startedForms.add(form);
    track('form_start', buildFormProps(form, extra));
  }

  function trackFormSuccess(form, extra) {
    track('form_submit', buildFormProps(form, extra));
  }

  function trackFormError(form, extra) {
    track('form_submit_error', buildFormProps(form, extra));
  }

  function rememberGallerySource(label) {
    try {
      window.sessionStorage.setItem(GALLERY_JOURNEY_KEY, JSON.stringify({
        label,
        path: normalizePathname(),
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn('Could not store gallery journey.', error);
    }
  }

  function readGallerySource() {
    try {
      const raw = window.sessionStorage.getItem(GALLERY_JOURNEY_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      if (Date.now() - Number(parsed.timestamp || 0) > 1000 * 60 * 60 * 24) {
        window.sessionStorage.removeItem(GALLERY_JOURNEY_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  function maybeTrackGalleryJourney(destination, label) {
    const source = readGallerySource();
    if (!source) return;

    track('gallery_contact_journey', {
      source_path: source.path || 'unknown',
      source_label: source.label || 'gallery',
      destination: destination || 'contact',
      cta_text: label || 'contact',
    });

    try {
      window.sessionStorage.removeItem(GALLERY_JOURNEY_KEY);
    } catch {
      // Ignore storage cleanup failures.
    }
  }

  function isGalleryLink(element) {
    const href = cleanText(element.getAttribute('href'));
    if (!href) return false;
    if (href.includes('/gallery') || href.includes('/case-studies')) return true;
    return Boolean(element.closest('.gallery, .gallery-grid, .project-card, .case-study-card, .case-study-grid'));
  }

  function isContactAction(element) {
    const href = cleanText(element.getAttribute('href'));
    const text = getElementText(element).toLowerCase();
    return href.startsWith('/contact') || href.startsWith('#contact') || href.startsWith(PHONE_HREF) || href.startsWith(EMAIL_HREF) ||
      /quote|pricing|call|email|contact/.test(text);
  }

  function bindLinkTracking() {
    document.querySelectorAll('a[href]').forEach((link) => {
      if (link.dataset.lsfsTracked === '1') return;
      link.dataset.lsfsTracked = '1';

      link.addEventListener('click', () => {
        const href = cleanText(link.getAttribute('href'));
        const label = getElementText(link) || href;
        const context = sectionLabelFor(link);

        if (isGalleryLink(link)) {
          rememberGallerySource(label || 'gallery_link');
        }

        if (href.startsWith('tel:')) {
          track('phone_click', {
            cta_text: label || 'phone',
            cta_context: context,
            destination: 'phone',
          });
          maybeTrackGalleryJourney('phone', label);
          return;
        }

        if (href.startsWith('mailto:')) {
          track('email_click', {
            cta_text: label || 'email',
            cta_context: context,
            destination: 'email',
          });
          maybeTrackGalleryJourney('email', label);
          return;
        }

        const looksLikeCta = link.matches('.btn, .hero__cta, .lsfs-cta, .nav-cta, .lsfs-mobile-cta, .lsfs-cro-btn') || link.hasAttribute('data-lsfs-cta');
        if (looksLikeCta || isContactAction(link)) {
          track('cta_click', {
            cta_text: label || 'cta',
            cta_context: context,
            cta_variant: cleanText(link.getAttribute('data-lsfs-cta')) || 'default',
            destination: href || 'button',
          });
          if (isContactAction(link)) maybeTrackGalleryJourney(href || 'contact', label);
        }
      });
    });

    document.querySelectorAll('button').forEach((button) => {
      if (button.dataset.lsfsTracked === '1') return;
      button.dataset.lsfsTracked = '1';

      if (button.type === 'submit' || button.matches('.btn, .btn-cta, .form-submit, .lsfs-cro-btn')) {
        button.addEventListener('click', () => {
          track('cta_click', {
            cta_text: getElementText(button) || 'button',
            cta_context: sectionLabelFor(button),
            cta_variant: cleanText(button.getAttribute('data-lsfs-cta')) || 'button',
            destination: 'button',
          });
        });
      }
    });
  }

  function bindFormStartTracking() {
    document.querySelectorAll('form[data-lsfs-track-form], #cta-form, #contact-form, form[data-lsfs-quick-form]').forEach((form) => {
      if (form.dataset.lsfsStartBound === '1') return;
      form.dataset.lsfsStartBound = '1';
      form.addEventListener('focusin', () => markFormStarted(form), { once: true });
      form.addEventListener('pointerdown', () => markFormStarted(form), { once: true });
      form.addEventListener('touchstart', () => markFormStarted(form), { once: true, passive: true });
    });
  }

  function loadTurnstileScript() {
    if (turnstilePromise) return turnstilePromise;

    turnstilePromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-lsfs-turnstile="1"]');
      if (existing) {
        if (window.turnstile) {
          resolve(window.turnstile);
          return;
        }
        existing.addEventListener('load', () => resolve(window.turnstile), { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      script.dataset.lsfsTurnstile = '1';
      script.onload = () => resolve(window.turnstile);
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return turnstilePromise;
  }

  function ensureTurnstile(form) {
    const slot = form.querySelector('.lsfs-turnstile');
    if (!slot || slot.dataset.rendered === '1') return Promise.resolve();

    return loadTurnstileScript()
      .then(() => {
        if (!window.turnstile || slot.dataset.rendered === '1') return;
        const widgetId = window.turnstile.render(slot, {
          sitekey: resolveTurnstileSitekey(),
          theme: 'dark',
        });
        slot.dataset.rendered = '1';
        form.dataset.lsfsTurnstileId = String(widgetId);
      })
      .catch(() => undefined);
  }

  function resetTurnstile(form) {
    if (!window.turnstile) return;
    const widgetId = form.dataset.lsfsTurnstileId;
    if (!widgetId) return;
    try {
      window.turnstile.reset(widgetId);
    } catch (error) {
      console.warn('Turnstile reset failed.', error);
    }
  }

  function setStatus(form, kind, message) {
    const status = form.querySelector('.lsfs-quick-form__status');
    if (!status) return;
    if (!message) {
      status.className = 'lsfs-quick-form__status';
      status.textContent = '';
      return;
    }
    status.className = 'lsfs-quick-form__status is-visible';
    if (kind === 'success') status.classList.add('lsfs-quick-form__status--success');
    if (kind === 'error') status.classList.add('lsfs-quick-form__status--error');
    status.textContent = message;
  }

  function validateQuickForm(form) {
    const name = cleanText(form.querySelector('[name="name"]')?.value);
    const email = cleanText(form.querySelector('[name="email"]')?.value);
    const audience = resolveAudienceValue(form);
    const message = cleanText(form.querySelector('[name="message"]')?.value);
    const missingFields = [];

    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!audience) missingFields.push('audience');
    if (!message) missingFields.push('message');

    if (missingFields.length > 0) {
      return {
        message: 'Please fill out name, email, project type, and project details.',
        fields: missingFields,
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        message: 'Please enter a valid email address.',
        fields: ['email'],
      };
    }

    return {
      message: '',
      fields: [],
    };
  }

  async function sendContactRequest(payload) {
    const endpoints = ['/api/contact', FALLBACK_CONTACT_URL];
    let lastError = new Error('Could not send your request.');

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        if (response.ok && data.success) {
          return data;
        }

        lastError = new Error(cleanText(data.error) || 'Could not send your request.');
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }

  function buildQuickFormPayload(form) {
    const service = cleanText(form.querySelector('[name="service"]')?.value);
    const audience = resolveAudienceValue(form);
    const serviceLine = [service, audience].filter(Boolean).join(' | ');

    return {
      name: cleanText(form.querySelector('[name="name"]')?.value),
      email: cleanText(form.querySelector('[name="email"]')?.value),
      phone: cleanText(form.querySelector('[name="phone"]')?.value),
      location: resolveLocationValue(form),
      service: serviceLine || service || audience || 'Quote Request',
      message: cleanText(form.querySelector('[name="message"]')?.value),
      turnstileToken: cleanText(form.querySelector('[name="cf-turnstile-response"]')?.value),
      website: cleanText(form.querySelector('[name="website"]')?.value),
    };
  }

  function renderQuickForm(host) {
    const title = cleanText(host.getAttribute('data-lsfs-form-title') || 'Short quote form');
    const copy = cleanText(host.getAttribute('data-lsfs-form-copy') || 'Share the basics and we can point you in the right direction.');
    const button = cleanText(host.getAttribute('data-lsfs-button') || 'Request a Quote');
    const defaultLocation = cleanText(host.getAttribute('data-lsfs-location'));
    const defaultService = cleanText(host.getAttribute('data-lsfs-service'));
    const formContext = cleanText(host.getAttribute('data-lsfs-form-context') || sectionLabelFor(host));

    widgetCounter += 1;
    if (!host.id) host.id = `lsfs-quick-quote-${widgetCounter}`;

    host.innerHTML = `
      <div class="lsfs-quick-form-card">
        <div class="lsfs-quick-form-card__intro">
          <h3>${title}</h3>
          <p>${copy}</p>
        </div>
        <form class="lsfs-quick-form" data-lsfs-quick-form data-lsfs-track-form="quick_quote" data-lsfs-form-context="${formContext}" data-lsfs-service="${defaultService || 'Quote Request'}" novalidate>
          <div class="lsfs-quick-form__row">
            <div class="lsfs-quick-form__field">
              <label for="${host.id}-name">Name</label>
              <input id="${host.id}-name" name="name" type="text" autocomplete="name" placeholder="Your name" required>
            </div>
            <div class="lsfs-quick-form__field">
              <label for="${host.id}-email">Email</label>
              <input id="${host.id}-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
            </div>
          </div>
          <div class="lsfs-quick-form__row">
            <div class="lsfs-quick-form__field">
              <label for="${host.id}-phone">Phone</label>
              <input id="${host.id}-phone" name="phone" type="tel" autocomplete="tel" placeholder="Optional">
            </div>
            <div class="lsfs-quick-form__field">
              <label for="${host.id}-audience">Project type</label>
              <select id="${host.id}-audience" name="audience" required>
                <option value="">Select one</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Architect / Designer / GC">Architect / Designer / GC</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </div>
          </div>
          <div class="lsfs-quick-form__field lsfs-quick-form__field--full">
            <label for="${host.id}-location">City / project location</label>
            <input id="${host.id}-location" name="location" type="text" autocomplete="address-level2" value="${defaultLocation}" placeholder="Dallas, Austin, Houston...">
          </div>
          <div class="lsfs-quick-form__field lsfs-quick-form__field--full">
            <label for="${host.id}-message">Project details</label>
            <textarea id="${host.id}-message" name="message" placeholder="Rough size, what needs coverage or privacy, and anything important like fire-rating or HOA review." required></textarea>
          </div>
          <p class="lsfs-quick-form__note">Send rough dimensions, city, and photos if you have them. We only use this to reply about your project.</p>
          <input class="lsfs-quick-form__trap" name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
          <input name="service" type="hidden" value="${defaultService}">
          <div class="lsfs-turnstile"></div>
          <button class="lsfs-cro-btn lsfs-cro-btn--primary lsfs-quick-form__submit" type="submit">${button}</button>
          <div class="lsfs-quick-form__status" aria-live="polite"></div>
        </form>
      </div>
    `;

    const form = host.querySelector('form');
    if (!form) return;

    const submitButton = form.querySelector('.lsfs-quick-form__submit');
    form.addEventListener('input', () => clearFieldErrors(form));
    form.addEventListener('change', () => clearFieldErrors(form));
    form.addEventListener('focusin', () => ensureTurnstile(form), { once: true });
    form.addEventListener('pointerdown', () => ensureTurnstile(form), { once: true });
    form.addEventListener('touchstart', () => ensureTurnstile(form), { once: true, passive: true });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      markFormStarted(form);

      const validation = validateQuickForm(form);
      if (validation.message) {
        markValidationErrors(form, validation.fields);
        setStatus(form, 'error', validation.message);
        trackFormError(form, { reason: 'validation' });
        return;
      }

      submitButton.disabled = true;
      const originalLabel = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      setStatus(form, '', '');
      ensureTurnstile(form).catch(() => undefined);

      try {
        const payload = buildQuickFormPayload(form);
        await sendContactRequest(payload);
        clearFieldErrors(form);
        setStatus(form, 'success', 'Thanks. We received your request and will reply with the clearest next step as soon as we can.');
        trackFormSuccess(form);
        form.reset();
        if (defaultLocation) {
          const locationInput = form.querySelector('[name="location"]');
          if (locationInput) locationInput.value = defaultLocation;
        }
        resetTurnstile(form);
      } catch (error) {
        setStatus(form, 'error', cleanText(error.message) || `Something went wrong. Please call ${PHONE_LABEL}.`);
        trackFormError(form, { reason: 'request_failed' });
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    });
  }

  function initQuoteWidgets() {
    document.querySelectorAll('[data-lsfs-quote-widget]').forEach((host) => {
      if (host.dataset.lsfsWidgetReady === '1') return;
      host.dataset.lsfsWidgetReady = '1';
      renderQuickForm(host);
    });
  }

  function getStickyTarget() {
    const quickFormHost = document.querySelector('[data-lsfs-quote-widget]');
    if (quickFormHost) return `#${quickFormHost.id}`;
    if (document.getElementById('contact')) return '#contact';
    return '/contact';
  }

  function initMobileSticky() {
    if (document.body?.getAttribute('data-lsfs-sticky-cta') === 'off') return;
    if (getPageType() === 'contact_page') return;

    const sticky = document.createElement('div');
    sticky.className = 'lsfs-mobile-sticky';
    sticky.setAttribute('data-lsfs-context', 'mobile_sticky_cta');
    sticky.innerHTML = `
      <div class="lsfs-mobile-sticky__copy">
        <span class="lsfs-mobile-sticky__label">Need pricing or a quote?</span>
        <span class="lsfs-mobile-sticky__title">Call now or send the project details.</span>
      </div>
      <div class="lsfs-mobile-sticky__actions">
        <a class="lsfs-mobile-sticky__btn lsfs-mobile-sticky__btn--call" href="${PHONE_HREF}" data-lsfs-cta="mobile_call">Call</a>
        <a class="lsfs-mobile-sticky__btn lsfs-mobile-sticky__btn--quote" href="${getStickyTarget()}" data-lsfs-cta="mobile_quote">Get Quote</a>
      </div>
    `;

    document.body.appendChild(sticky);
    document.body.classList.add('lsfs-has-mobile-sticky');
    bindLinkTracking();

    const footer = document.querySelector('footer');
    const contactTarget = document.querySelector(getStickyTarget().startsWith('#') ? getStickyTarget() : 'footer');

    function updateSticky() {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        sticky.classList.remove('is-visible');
        return;
      }

      const passedHero = window.scrollY > 280;
      const footerNear = footer ? footer.getBoundingClientRect().top < window.innerHeight + 80 : false;
      const targetVisible = contactTarget ? contactTarget.getBoundingClientRect().top < window.innerHeight * 0.88 : false;
      sticky.classList.toggle('is-visible', passedHero && !footerNear && !targetVisible);
    }

    requestAnimationFrame(() => {
      updateSticky();
      window.addEventListener('scroll', updateSticky, { passive: true });
      window.addEventListener('resize', updateSticky);
    });
  }

  function init() {
    initQuoteWidgets();
    bindLinkTracking();
    bindFormStartTracking();
    initMobileSticky();
  }

  window.LSFSCRO = {
    emailHref: EMAIL_HREF,
    phoneHref: PHONE_HREF,
    phoneLabel: PHONE_LABEL,
    track,
    markFormStarted,
    trackFormSuccess,
    trackFormError,
    init,
    ensureTurnstile,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

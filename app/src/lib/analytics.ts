/**
 * Analytics, with the event names the live site's LSFSCRO layer already uses:
 * cta_click, phone_click, email_click, form_start (once per form),
 * form_submit, form_submit_error.
 *
 * Pushes to window.dataLayer and calls gtag when the page has them. Payloads
 * never carry personal data: no names, emails, phones, locations or message
 * text, only what was clicked and where.
 */

type Payload = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pagePayload(extra: Payload): Payload {
  return {
    page_path: window.location.pathname,
    page_type: window.location.pathname === '/' ? 'home' : 'page',
    page_title: document.title,
    ...extra,
  };
}

export function track(event: string, extra: Payload = {}): void {
  if (typeof window === 'undefined') return;
  const payload = pagePayload(extra);
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...payload });
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, payload);
  }
}

const startedForms = new Set<string>();

/** form_start fires once per form per page view. */
export function trackFormStart(formName: string, extra: Payload = {}): void {
  if (startedForms.has(formName)) return;
  startedForms.add(formName);
  track('form_start', { form_name: formName, ...extra });
}

function clean(text: string | null | undefined): string {
  return (text ?? '').replace(/\s+/g, ' ').trim().slice(0, 80);
}

/** The heading of the section a click came from, for cta_context. */
function contextFor(el: Element): string {
  const explicit = el.closest('[data-context]');
  if (explicit) return clean(explicit.getAttribute('data-context'));
  const region = el.closest('section, header, footer, nav, form, aside');
  if (!region) return 'page';
  const heading = region.querySelector('h1, h2, h3');
  return clean(heading?.textContent) || clean(region.id) || region.tagName.toLowerCase();
}

/**
 * One delegated listener for the whole page: phone and email links, plus any
 * element marked data-cta (the quote buttons and the estimator's send).
 */
export function installClickTracking(): () => void {
  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    const el = target?.closest('a[href], button[data-cta]');
    if (!el) return;
    const href = el.getAttribute('href') ?? '';
    const text = clean(el.getAttribute('data-cta-label') || el.textContent || el.getAttribute('aria-label'));
    const context = contextFor(el);

    if (href.startsWith('tel:')) {
      track('phone_click', { cta_text: text, cta_context: context, destination: 'phone' });
    } else if (href.startsWith('mailto:')) {
      track('email_click', { cta_text: text, cta_context: context, destination: 'email' });
    } else if (el.hasAttribute('data-cta')) {
      track('cta_click', {
        cta_text: text,
        cta_context: context,
        cta_variant: el.getAttribute('data-cta') || 'default',
        destination: href || 'button',
      });
    }
  };
  document.addEventListener('click', onClick, { capture: true });
  return () => document.removeEventListener('click', onClick, { capture: true });
}

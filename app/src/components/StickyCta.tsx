import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CONTACT, STICKY } from '../data/home-content';
import { BUSINESS } from '../data/site';

/** True while any element matching the selector is at least `ratio` visible. */
function useAnyVisible(selector: string, ratio: number, initial: boolean): boolean {
  const [visible, setVisible] = useState(initial);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(false);
      return;
    }
    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= ratio) seen.add(entry.target);
          else seen.delete(entry.target);
        });
        setVisible(seen.size > 0);
      },
      { threshold: [0, ratio, 1] },
    );
    const observeAll = () => document.querySelectorAll(selector).forEach((el) => io.observe(el));
    observeAll();
    // Observe newly added matches and forget removed ones. Never reset the
    // observer here: frequent DOM writes (typing, count-ups) would drop its
    // pending entries and leave `visible` stale.
    const mo = new MutationObserver(() => {
      observeAll();
      let changed = false;
      seen.forEach((el) => {
        if (!el.isConnected) {
          seen.delete(el);
          io.unobserve(el);
          changed = true;
        }
      });
      if (changed) setVisible(seen.size > 0);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [selector, ratio]);
  return visible;
}

/**
 * Phones only: Call and "Get a free quote" in a bottom bar. (Desktop needs
 * no floating button: the sticky header carries the quote button.) The bar
 * stands down while a primary CTA or the quote form is on screen, and it is
 * rendered after <main> so it never precedes the hero CTA in tab order.
 */
export default function StickyCta() {
  const primaryInView = useAnyVisible('[data-primary-cta]', 0.5, true);
  const formInView = useAnyVisible('[data-lead-form]', 0.25, false);
  const pillHidden = primaryInView || formInView;

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-[rgb(237_236_230/0.94)] px-3 pt-2 backdrop-blur-md transition-[opacity,transform] duration-200 [padding-bottom:max(8px,env(safe-area-inset-bottom))] lg:hidden ${
          pillHidden ? 'pointer-events-none translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
        inert={pillHidden}
      >
        <div className="flex gap-2">
          <a
            href={BUSINESS.phoneHref}
            aria-label={CONTACT.call}
            className="btn btn-compact flex-none border border-control bg-transparent text-ink"
          >
            <Phone size={17} strokeWidth={2.2} aria-hidden="true" />
            {STICKY.call}
          </a>
          <a href="#quote" className="btn btn-primary btn-compact flex-1" data-cta="sticky_mobile">
            {STICKY.quote}
          </a>
        </div>
      </div>
    </>
  );
}

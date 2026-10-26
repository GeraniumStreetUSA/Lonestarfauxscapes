import { Phone } from 'lucide-react';
import { useEffect, useRef } from 'react';

import PlanMark from '../components/PlanMark';
import { BUSINESS, HEADER_NAV } from '../data/site';
import { CONTACT, HERO } from '../data/home-content';

/**
 * Wordmark, four links, the phone and one button. Sticky: it follows the
 * visitor. Desktop keeps it in view (with a soft shadow once the page moves).
 * Phones slide it away while scrolling down, to give the page its height
 * back (the bottom bar carries Call and the quote), and bring it back on the
 * first scroll up. Transform only, so nothing below it ever jumps.
 */
export default function SiteHeader() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const phone = window.matchMedia('(max-width: 1023px)');
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      el.toggleAttribute('data-scrolled', y > 8);
      const down = y > lastY + 4;
      const up = y < lastY - 4;
      if (phone.matches && down && y > el.offsetHeight * 2) el.setAttribute('data-tucked', '');
      if (!phone.matches || up || y <= el.offsetHeight) el.removeAttribute('data-tucked');
      if (down || up) lastY = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    /* Keyboard users always see the header they tab into. */
    const onFocus = () => el.removeAttribute('data-tucked');
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('focusin', onFocus);
    return () => {
      window.removeEventListener('scroll', onScroll);
      el.removeEventListener('focusin', onFocus);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header ref={ref} className="site-header">
      <div className="wrap header-grid">
        <a href="/" className="header-brand -ml-1 inline-flex items-center gap-2.5 px-1">
          <PlanMark className="h-6 w-6 flex-none" />
          <span className="whitespace-nowrap font-display text-[18px] font-[750] leading-none tracking-[-0.012em] max-[359px]:text-[16px] sm:text-[18px]">
            {BUSINESS.name}
          </span>
        </a>

        <nav className="header-nav">
          <ul className="flex items-center justify-between sm:justify-start sm:gap-9 lg:gap-0 xl:gap-1">
            {HEADER_NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center px-1 text-[15px] font-[560] text-ink underline-offset-[6px] transition-colors hover:text-boxwood hover:underline lg:px-2.5 xl:px-3.5"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions flex items-center gap-2 lg:gap-5 xl:gap-6">
          <a
            href={BUSINESS.phoneHref}
            className="hidden min-h-11 items-center gap-2 whitespace-nowrap text-[15px] font-[620] tabular hover:text-boxwood lg:inline-flex"
          >
            <Phone size={16} strokeWidth={2} aria-hidden="true" />
            {BUSINESS.phoneDisplay}
          </a>
          <a
            href={BUSINESS.phoneHref}
            aria-label={CONTACT.call}
            className="inline-flex h-11 w-11 items-center justify-center rounded-btn border border-rule text-boxwood lg:hidden"
          >
            <Phone size={18} strokeWidth={2} aria-hidden="true" />
          </a>
          <a href="#quote" className="btn btn-primary btn-compact hidden lg:inline-flex" data-cta="header">
            {HERO.cta}
          </a>
        </div>
      </div>
    </header>
  );
}

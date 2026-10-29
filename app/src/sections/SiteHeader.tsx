import { ArrowDown, Menu, Phone, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import PlanMark from '../components/PlanMark';
import { BUSINESS, HEADER_NAV, MENU_LINKS } from '../data/site';
import { HEADER, HERO } from '../data/home-content';

/**
 * Wordmark, four links, the phone and one button. Sticky: it follows the
 * visitor. Desktop keeps it in view (with a soft shadow once the page moves).
 * Phones slide it away while scrolling down, to give the page its height
 * back (the bottom bar carries Call and the quote), and bring it back on the
 * first scroll up. Transform only, so nothing below it ever jumps.
 *
 * Phones get one row (wordmark, a Quote button, Menu); the links open in a
 * full-screen sheet with the phone number and the quote button. The inline
 * nav stays in the markup (hidden on phones) so crawlers see the same links.
 */
export default function SiteHeader() {
  const ref = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  /* The sheet: lock the page behind it, Escape closes, focus moves in and back. */
  useEffect(() => {
    if (!menuOpen) return;
    const html = document.documentElement;
    html.classList.add('menu-open');
    sheet.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      html.classList.remove('menu-open');
      document.removeEventListener('keydown', onKey);
      menuButton.current?.focus();
    };
  }, [menuOpen]);

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
      /* Pinned elements further down (Austin photo, question bar) read this
         to sit under the header while it shows, and at the top when it tucks. */
      document.documentElement.toggleAttribute('data-header-tucked', el.hasAttribute('data-tucked'));
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
        <a href="/" className="header-brand -ml-1 inline-flex min-w-0 items-center gap-2 px-1 sm:gap-2.5">
          <PlanMark className="h-6 w-6 flex-none max-[379px]:hidden" />
          <span className="whitespace-nowrap font-display text-[16px] font-[750] leading-none tracking-[-0.012em] max-[379px]:text-[15.5px] sm:text-[18px]">
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
          <a href="#quote" className="btn btn-primary btn-compact header-quote" data-cta="header">
            <span className="lg:hidden">{HEADER.quoteShort}</span>
            <span className="hidden lg:inline">{HERO.cta}</span>
          </a>
          <button
            ref={menuButton}
            type="button"
            className="header-menu-btn lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} strokeWidth={2.2} aria-hidden="true" />
            <span className="sr-only">{HEADER.menu}</span>
          </button>
        </div>
      </div>

      {/* Portalled to <body>: the sticky header's backdrop blur would otherwise
          become the containing block of this fixed sheet. */}
      {menuOpen ? createPortal(
        <div ref={sheet} id="site-menu" className="menu-sheet lg:hidden" role="dialog" aria-modal="true" aria-label={HEADER.menu}>
          <div className="menu-sheet-top">
            <a href="/" className="header-brand inline-flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
              <PlanMark className="h-6 w-6 flex-none" />
              <span className="font-display text-[18px] font-[750] leading-none">{BUSINESS.name}</span>
            </a>
            <button type="button" className="header-menu-btn" onClick={() => setMenuOpen(false)}>
              <X size={22} strokeWidth={2.2} aria-hidden="true" />
              <span className="sr-only">{HEADER.close}</span>
            </button>
          </div>
          <nav aria-label={HEADER.menu}>
            <ul className="menu-sheet-links">
              {MENU_LINKS.map((item, index) => (
                <li key={item.href} style={{ ['--i' as string]: index }}>
                  <a href={item.href} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="menu-sheet-foot">
            <a href={BUSINESS.phoneHref} className="menu-sheet-phone tabular">
              <Phone size={20} strokeWidth={2} aria-hidden="true" />
              {BUSINESS.phoneDisplay}
            </a>
            <a href="#quote" className="btn btn-primary btn-lg w-full" onClick={() => setMenuOpen(false)} data-cta="menu">
              {HERO.cta}
              <ArrowDown size={18} strokeWidth={2.2} className="nudge-down" aria-hidden="true" />
            </a>
          </div>
        </div>,
        document.body,
      ) : null}
    </header>
  );
}

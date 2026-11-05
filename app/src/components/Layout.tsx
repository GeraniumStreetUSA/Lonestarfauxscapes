import { useEffect, type ReactNode } from 'react';

import { armAccordions } from '../lib/accordion';
import { QuoteHrefContext } from '../lib/quote-href';
import { armReveals, armSectionMotion } from '../lib/reveal';
import { startSmoothScroll } from '../lib/smooth-scroll';
import type { Route } from '../routes';
import SiteFooter from '../sections/SiteFooter';
import SiteHeader from '../sections/SiteHeader';
import StickyCta from './StickyCta';

/**
 * The shell every page shares: skip link, scroll progress, header, <main>,
 * the phone bottom bar and the footer, plus the page-level motion. The quote
 * buttons in the chrome go to the quote page (`/quote`), never down to the
 * bottom of the page (owner, 2026-11-05).
 */
export default function Layout({ route, children }: { route: Route; children: ReactNode }) {
  useEffect(() => armReveals(), []);
  useEffect(() => armSectionMotion(), []);
  useEffect(() => armAccordions(), []);
  useEffect(() => startSmoothScroll(), []);

  return (
    <QuoteHrefContext.Provider value={route.path === '/quote' ? '#quote' : '/quote'}>
      <a
        href="#main"
        className="sr-only-focusable fixed left-3 top-3 z-50 inline-flex min-h-11 items-center bg-ink px-4 text-[15px] font-[620] text-caliche"
      >
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <StickyCta />
      <SiteFooter />
    </QuoteHrefContext.Provider>
  );
}

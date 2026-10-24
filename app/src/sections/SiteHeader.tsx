import { Phone } from 'lucide-react';

import PlanMark from '../components/PlanMark';
import { BUSINESS, HEADER_NAV } from '../data/site';
import { CONTACT, HERO } from '../data/home-content';

/**
 * Wordmark, four links, the phone and one button. Static, not fixed: on a
 * phone the bottom bar carries Call and the quote, so the header can scroll
 * away and give the page its height back. One <nav>, placed by CSS grid: in
 * the header row on desktop, on its own row (44 px targets) below 1024 px.
 */
export default function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-rule bg-caliche">
      <div className="wrap header-grid">
        <a href="/" className="header-brand -ml-1 inline-flex items-center gap-2.5 px-1">
          <PlanMark className="h-6 w-6 flex-none" />
          <span className="whitespace-nowrap text-[17px] font-[720] leading-none tracking-[-0.012em] [font-stretch:112%] max-[359px]:text-[15px] max-[359px]:[font-stretch:106%] sm:text-[18px]">
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

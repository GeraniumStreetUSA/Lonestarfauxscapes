import { ArrowDown, ArrowUp, ArrowUpRight, Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';

import FooterFence from '../components/FooterFence';
import PlanMark from '../components/PlanMark';
import { CONTACT, FOOTER, HERO } from '../data/home-content';
import { AREA_LINKS, BUSINESS, COMPANY_LINKS, SYSTEM_LINKS, type NavLink } from '../data/site';

function Column({ index, title, links }: { index: number; title: string; links: readonly NavLink[] }) {
  return (
    <details className="ft-col" data-fold open>
      <summary className="ft-col-head">
        <span className="ft-col-index" aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        {title}
        <Plus size={16} strokeWidth={2.2} className="ft-col-icon" aria-hidden="true" />
      </summary>
      <ul className="ft-list">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="ft-link">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * The back fence: the page ends where the hero began. A drawn hedge runs the
 * full width with a neighbor's sightline that follows the cursor and always
 * lands on the hedge; then the closing line (the hero's headline, answered),
 * the quote button, and the site's links as a title block.
 *
 * Same links as before, all plain crawlable anchors in a labelled <nav>.
 */
export default function SiteFooter() {
  /* Phones: the three link lists fold shut after load (contact stays open);
     every link stays in the markup either way. */
  const block = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    block.current?.querySelectorAll('details[data-fold]').forEach((d) => d.removeAttribute('open'));
  }, []);

  return (
    <footer className="ft">
      <FooterFence />

      <div className="ft-body">
        <div className="wrap">
          <div className="ft-close">
            <div>
              <a href="/" className="ft-brand">
                <PlanMark className="h-6 w-6 flex-none" />
                <span>{BUSINESS.name}</span>
              </a>
              <p className="ft-line" aria-hidden="true">
                <span>{HERO.display[0]}</span>
                <span>{HERO.display[1]}</span>
              </p>
            </div>
            <div className="ft-act">
              <p className="t-small max-w-[40ch] text-cedar">{HERO.trust}</p>
              <div className="ft-act-row">
                <a href="#quote" className="btn btn-primary" data-cta="footer">
                  {HERO.cta}
                  <ArrowDown size={18} strokeWidth={2.2} className="nudge-down" aria-hidden="true" />
                </a>
                <a href={BUSINESS.phoneHref} className="ft-phone tabular">
                  {BUSINESS.phoneDisplay}
                </a>
              </div>
            </div>
          </div>

          <nav ref={block} aria-label="Footer" className="ft-block">
            <Column index={1} title={FOOTER.columns.systems} links={SYSTEM_LINKS} />
            <Column index={2} title={FOOTER.columns.areas} links={AREA_LINKS} />
            <Column index={3} title={FOOTER.columns.company} links={COMPANY_LINKS} />
            <div className="ft-col">
              <p className="ft-col-head">
                <span className="ft-col-index" aria-hidden="true">
                  04
                </span>
                {FOOTER.columns.contact}
              </p>
              <ul className="ft-list">
                <li>
                  <a href={BUSINESS.phoneHref} className="ft-link tabular">
                    {BUSINESS.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={BUSINESS.emailHref} className="ft-link [overflow-wrap:anywhere]">
                    {BUSINESS.email}
                  </a>
                </li>
                <li>
                  <a href={BUSINESS.parent.url} rel="noopener" className="ft-link">
                    {CONTACT.brand}
                    <ArrowUpRight size={15} strokeWidth={2.2} className="ft-out" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <div className="ft-bottom">
            <p className="m-0">{FOOTER.bottom}</p>
            <a href="#main" className="ft-top">
              {FOOTER.top}
              <ArrowUp size={15} strokeWidth={2.2} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

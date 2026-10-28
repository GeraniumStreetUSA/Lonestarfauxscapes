import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { CONTACT, FOOTER } from '../data/home-content';
import { AREA_LINKS, BUSINESS, COMPANY_LINKS, SYSTEM_LINKS, type NavLink } from '../data/site';
import { motionAllowed } from '../lib/motion';

function Column({ index, title, links }: { index: number; title: string; links: readonly NavLink[] }) {
  return (
    <div className="ft-col">
      <p className="ft-col-head">
        <span className="ft-col-index" aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        {title}
      </p>
      <ul className="ft-list">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="ft-link">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The finale: the drawing's title block on an ink ground, under a full-width
 * wordmark whose letters are filled with the real boxwood texture. The fill
 * grows up the letters as the footer arrives (the hero's hedge, once more),
 * and on desktop a patch of sun follows the cursor across the leaves.
 *
 * Same links as before, all plain crawlable anchors in a labelled <nav>.
 * The textured copies of the wordmark are decorative (aria-hidden); the real
 * text is the home link underneath them. Motion fails open: the letters ship
 * full, and only a below-the-fold footer is armed to grow.
 */
export default function SiteFooter() {
  const mark = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = mark.current;
    if (!el || !motionAllowed() || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.grow = 'armed';
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.dataset.grow = 'go';
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    const deadline = window.setTimeout(() => {
      if (el.dataset.grow === 'armed') el.dataset.grow = 'go';
    }, 10000);

    /* The sun patch: desktop, fine pointer only. */
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--sun-x', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
      el.style.setProperty('--sun-y', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
    };
    const onEnter = () => el.setAttribute('data-sun', '');
    const onLeave = () => el.removeAttribute('data-sun');
    if (fine) {
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);
    }

    return () => {
      io.disconnect();
      window.clearTimeout(deadline);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      delete el.dataset.grow;
    };
  }, []);

  const [first, ...rest] = BUSINESS.name.split(' ');
  const second = rest.slice(0, 1).join(' ');
  const tail = rest.slice(1).join(' ');
  const lines = (
    <>
      <span className="ft-mark-line">
        {first} {second}
      </span>{' '}
      <span className="ft-mark-line">{tail}</span>
    </>
  );

  return (
    <footer className="on-ink ft">
      <div className="wrap">
        <a ref={mark} href="/" className="ft-mark">
          <span className="ft-mark-base">{lines}</span>
          <span className="ft-mark-fill" aria-hidden="true">
            {lines}
          </span>
          <span className="ft-mark-sun" aria-hidden="true">
            {lines}
          </span>
        </a>

        <nav aria-label="Footer" className="ft-block">
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
                <a href={BUSINESS.phoneHref} className="ft-link ft-link-strong tabular">
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
    </footer>
  );
}

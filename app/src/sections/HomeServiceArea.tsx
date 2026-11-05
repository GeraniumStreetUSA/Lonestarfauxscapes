import { ArrowRight, ArrowUpRight, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

import Callout from '../components/Callout';
import TexasMap, { formatCoords, METRO_COORDS } from '../components/TexasMap';
import { CONTACT, SERVICE_AREA } from '../data/home-content';
import { AREA_LINKS, BUSINESS } from '../data/site';

/** "Call (760) 978-7335" as a small verb over the number it reaches. */
function verbAndValue(text: string): [string, string] {
  const at = text.indexOf(' ');
  return [text.slice(0, at), text.slice(at + 1)];
}

/**
 * Where we work: the five metros as a list beside a survey sheet of Texas.
 * Hovering or focusing a metro lights its pin; hovering a pin lights the row.
 * Then the contact block, set like a drawing's title block.
 */
export default function HomeServiceArea() {
  const [callVerb, callValue] = verbAndValue(CONTACT.call);
  const [emailVerb, emailValue] = verbAndValue(CONTACT.email);
  const [active, setActive] = useState<string | null>(null);

  return (
    <section aria-labelledby="area-title" className="section bg-limestone">
      <div className="wrap">
        <div className="area-grid" data-reveal>
          <div className="area-head">
            <Callout text={SERVICE_AREA.callout} />
            <h2 id="area-title" className="t-h2 mt-5">
              {SERVICE_AREA.title}
            </h2>
            <p className="t-lede mt-5 max-w-[38ch] text-cedar">{SERVICE_AREA.intro}</p>
          </div>

          <div className="area-map">
            <TexasMap active={active} onActive={setActive} />
          </div>

          <ul className="area-list">
            {AREA_LINKS.map((area, index) => (
              <li key={area.href}>
                <a
                  href={area.href}
                  className="area-row group"
                  data-on={active === area.label ? 'true' : undefined}
                  onPointerEnter={() => setActive(area.label)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(area.label)}
                  onBlur={() => setActive(null)}
                >
                  <span className="area-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="area-name">{area.label}</span>
                  <span className="area-coords" aria-hidden="true">
                    {formatCoords(METRO_COORDS[area.label])}
                  </span>
                  <ArrowRight size={22} strokeWidth={2} className="area-arrow" aria-hidden="true" />
                </a>
              </li>
            ))}
            <li>
              <a href="/quote" className="area-row area-row-else group" data-cta="elsewhere">
                <span className="area-index" aria-hidden="true">
                  +
                </span>
                <span className="area-else">
                  {SERVICE_AREA.elsewhere} <strong>{SERVICE_AREA.elsewhereAction}</strong>
                </span>
                <ArrowRight size={20} strokeWidth={2.2} className="area-arrow" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <ul className="rule-grid contact-strip m-0 mt-16 list-none p-0 max-sm:hidden sm:grid-cols-3 lg:mt-20" data-reveal>
          <li>
            <a href={BUSINESS.phoneHref} className="contact-cell">
              <Phone size={20} strokeWidth={2} aria-hidden="true" />
              <span className="grid">
                <span className="t-label text-cedar">{callVerb}</span>{' '}
                <span className="contact-value tabular">{callValue}</span>
              </span>
            </a>
          </li>
          <li>
            <a href={BUSINESS.emailHref} className="contact-cell">
              <Mail size={20} strokeWidth={2} aria-hidden="true" />
              <span className="grid min-w-0">
                <span className="t-label text-cedar">{emailVerb}</span>{' '}
                <span className="contact-value [overflow-wrap:anywhere]">{emailValue}</span>
              </span>
            </a>
          </li>
          <li>
            <a href={BUSINESS.parent.url} rel="noopener" className="contact-cell">
              <ArrowUpRight size={20} strokeWidth={2} aria-hidden="true" />
              <span className="contact-value">{CONTACT.brand}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

import { ArrowRight, ArrowUpRight, Mail, Phone } from 'lucide-react';

import VicinityMap from '../components/VicinityMap';
import { CONTACT, SERVICE_AREA } from '../data/home-content';
import { AREA_LINKS, BUSINESS } from '../data/site';

/** "Call (760) 978-7335" as a small verb over the number it reaches. */
function verbAndValue(text: string): [string, string] {
  const at = text.indexOf(' ');
  return [text.slice(0, at), text.slice(at + 1)];
}

/**
 * The five metros beside their vicinity map, the "elsewhere" line, then the
 * contact block set like a drawing's title block.
 */
export default function HomeServiceArea() {
  const [callVerb, callValue] = verbAndValue(CONTACT.call);
  const [emailVerb, emailValue] = verbAndValue(CONTACT.email);

  return (
    <section aria-labelledby="area-title" className="section bg-limestone">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20" data-reveal>
          <div>
            <h2 id="area-title" className="t-h2">
              {SERVICE_AREA.title}
            </h2>
            <ul className="m-0 mt-9 list-none border-t-2 border-ink p-0">
              {AREA_LINKS.map((area) => (
                <li key={area.href} className="border-b border-rule">
                  <a
                    href={area.href}
                    className="group flex min-h-[64px] items-center justify-between gap-6 py-3 text-[clamp(1.375rem,1.1rem+1vw,2rem)] font-display font-[720] tracking-[-0.02em] transition-colors hover:text-boxwood"
                  >
                    {area.label}
                    <ArrowRight
                      size={22}
                      strokeWidth={2}
                      className="flex-none text-boxwood transition-transform duration-200 group-hover:translate-x-[3px]"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
            <a href="#quote" className="link-go mt-6" data-cta="elsewhere">
              {SERVICE_AREA.elsewhere}
              <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </a>
          </div>
          <div className="lg:pt-[5.75rem]">
            <VicinityMap />
          </div>
        </div>

        <ul className="rule-grid contact-strip m-0 mt-16 list-none p-0 sm:grid-cols-3 lg:mt-20" data-reveal>
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

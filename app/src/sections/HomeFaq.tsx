import { Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { FAQ } from '../data/home-content';

/**
 * Visible questions and answers; HomeSeo builds the FAQPage schema from the
 * same array. The markup ships every answer open (desktop shows them all, and
 * crawlers read them either way); on phones they fold shut after load, so the
 * list is a quick scan of questions you tap to open.
 */
export default function HomeFaq() {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el || !window.matchMedia('(max-width: 767px)').matches) return;
    el.querySelectorAll('details').forEach((d) => d.removeAttribute('open'));
  }, []);

  return (
    <section aria-labelledby="faq-title" className="section pt-0 lg:pt-0">
      <div className="wrap">
        <div className="grid gap-10 border-t border-rule pt-[var(--section-y)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <h2 id="faq-title" className="t-h2 max-w-[12ch]" data-reveal>
          {FAQ.title}
        </h2>
        <div ref={list} className="faq-list m-0 grid gap-x-12 md:grid-cols-2" data-reveal>
          {FAQ.items.map((item) => (
            <details key={item.question} className="faq-item border-t-2 border-ink" open>
              <summary className="faq-q">
                <span>{item.question}</span>
                <Plus size={18} strokeWidth={2.2} className="faq-icon" aria-hidden="true" />
              </summary>
              <p className="faq-a m-0 text-cedar">{item.answer}</p>
            </details>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

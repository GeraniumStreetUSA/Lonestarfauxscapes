import { Plus } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';

import type { FaqItem } from '../../lib/faq-schema';

export { faqSchemaNode } from '../../lib/faq-schema';
export type { FaqItem } from '../../lib/faq-schema';

interface FaqListProps {
  items: readonly FaqItem[];
  title?: string;
  id?: string;
}

/**
 * The homepage's FAQ look for any page: details and summary with the Plus
 * icon. Every answer ships open (desktop shows them all and crawlers read
 * them either way); on phones they fold after load into a scan of questions.
 * Put the same array in `route.schema` with `faqSchemaNode(items, url)`, so
 * only visible questions are in the FAQPage.
 */
export default function FaqList({ items, title = 'Common questions', id = 'faq' }: FaqListProps) {
  const titleId = useId();
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el || !window.matchMedia('(max-width: 767px)').matches) return;
    el.querySelectorAll('details').forEach((d) => d.removeAttribute('open'));
  }, []);

  return (
    <section id={id} aria-labelledby={titleId} className="section pt-0">
      <div className="wrap">
        <div className="pk-faq">
          <h2 id={titleId} className="t-h2 pk-faq-title" data-reveal>
            {title}
          </h2>
          <div ref={list} className="pk-faq-list" data-reveal>
            {items.map((item) => (
              <details key={item.question} className="faq-item" open>
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

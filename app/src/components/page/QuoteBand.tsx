import { ArrowDown, ArrowRight } from 'lucide-react';
import { useId } from 'react';

import { BUSINESS } from '../../data/site';
import { useQuoteHref } from '../../lib/quote-href';

interface QuoteBandProps {
  title?: string;
  text?: string;
}

/**
 * The closing band for a page without the form: one short head, one line,
 * the quote button and the phone. About half a phone screen. The button goes
 * to `/contact#quote` (or `#quote` where the route has the form), from the
 * same context the header uses.
 */
export default function QuoteBand({
  title = 'Send us your measurements.',
  text = 'We email an assessment and a rough quote. A site review sets the final invoice.',
}: QuoteBandProps) {
  const quoteHref = useQuoteHref();
  const titleId = useId();
  const onPage = quoteHref.startsWith('#');
  const Arrow = onPage ? ArrowDown : ArrowRight;

  return (
    <section aria-labelledby={titleId} className="pk-band">
      <div className="wrap pk-band-inner" data-reveal>
        <div className="pk-band-copy">
          <h2 id={titleId} className="pk-band-title">
            {title}
          </h2>
          <p className="pk-band-text">{text}</p>
        </div>
        <div className="pk-band-actions">
          <a href={quoteHref} className="btn btn-primary btn-lg" data-primary-cta data-cta="quote_band">
            Get a free quote
            <Arrow size={18} strokeWidth={2.2} className={onPage ? 'nudge-down' : 'nudge-right'} aria-hidden="true" />
          </a>
          <p className="t-small text-cedar">
            or call{' '}
            <a href={BUSINESS.phoneHref} className="hero-phone">
              {BUSINESS.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

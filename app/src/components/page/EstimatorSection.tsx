import HomeEstimator from '../../sections/HomeEstimator';
import type { SystemId } from '../../lib/estimator';

interface EstimatorSectionProps {
  /** The system chip selected on load: `hedge`, `fence-extension`, `living-wall` or `privacy-wall`. */
  initialSystem?: SystemId;
  callout?: string;
  title?: string;
  body?: string;
}

/**
 * The homepage's "measure your run" estimator on a system page, started on
 * that page's system. "Send these numbers" fills the quote form below it, so
 * a page with the estimator should also render <QuoteSection> (and set
 * `hasQuoteForm: true` on its route). The wrapper lets the page kit trim the
 * phone view (the system picker and intro line, which the page already says).
 */
export default function EstimatorSection(props: EstimatorSectionProps) {
  return (
    <div className="pk-estimator">
      <HomeEstimator {...props} />
    </div>
  );
}

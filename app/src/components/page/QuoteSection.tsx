import HomeQuote from '../../sections/HomeQuote';

interface QuoteSectionProps {
  /** Defaults to a neutral "FREE QUOTE": the homepage's "STEP 2 OF 2" belongs to its estimator. */
  callout?: string;
  title?: string;
  body?: string;
}

/**
 * The homepage's quote form (`<section id="quote">`) on any page. A page that
 * renders it must set `hasQuoteForm: true` in its route in src/routes.ts:
 * that is what points the chrome's "Get a free quote" buttons (header, phone
 * bar, hero) at this `#quote` instead of at `/contact#quote`. Render it once
 * per page: the id is the anchor.
 */
export default function QuoteSection({ callout = '◦ FREE QUOTE', title, body }: QuoteSectionProps) {
  return <HomeQuote callout={callout} title={title} body={body} />;
}

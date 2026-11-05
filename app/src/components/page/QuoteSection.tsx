import HomeQuote from '../../sections/HomeQuote';

interface QuoteSectionProps {
  /** Defaults to a neutral "FREE QUOTE": the homepage's "STEP 2 OF 2" belongs to its estimator. */
  callout?: string;
  title?: string;
  body?: string;
  headingAs?: 'h1' | 'h2';
}

/**
 * The homepage's quote form (`<section id="quote">`) on any page; on /quote
 * it is the page itself. The "Get a free quote" buttons go to /quote, so a
 * form lower on a page is only for visitors who read that far. Render it
 * once per page: the id is the anchor.
 */
export default function QuoteSection({ callout = '◦ FREE QUOTE', title, body, headingAs }: QuoteSectionProps) {
  return <HomeQuote callout={callout} title={title} body={body} headingAs={headingAs} />;
}

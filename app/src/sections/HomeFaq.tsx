import { FAQ } from '../data/home-content';

/** Visible questions and answers; HomeSeo builds the FAQPage schema from the same array. */
export default function HomeFaq() {
  return (
    <section aria-labelledby="faq-title" className="section pt-0 lg:pt-0">
      <div className="wrap">
        <div className="grid gap-10 border-t border-rule pt-[var(--section-y)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <h2 id="faq-title" className="t-h2 max-w-[12ch]" data-reveal>
          {FAQ.title}
        </h2>
        <dl className="m-0 grid gap-x-12 md:grid-cols-2" data-reveal>
          {FAQ.items.map((item) => (
            <div key={item.question} className="border-t-2 border-ink py-6 pr-2">
              <dt className="text-[19px] font-[680] leading-snug tracking-[-0.01em] [font-stretch:106%]">{item.question}</dt>
              <dd className="m-0 mt-2.5 text-cedar">{item.answer}</dd>
            </div>
          ))}
        </dl>
        </div>
      </div>
    </section>
  );
}

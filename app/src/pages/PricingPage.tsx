import { ArrowRight } from 'lucide-react';

import Layout from '../components/Layout';
import FactRows from '../components/page/FactRows';
import PageHero from '../components/page/PageHero';
import PointList from '../components/page/PointList';
import QuoteSection from '../components/page/QuoteSection';
import Section from '../components/page/Section';
import { SYSTEMS_SECTION } from '../data/home-content';
import { PRICING_PAGE } from '../data/pages/utility/pricing';
import { PROCESS_STEPS } from '../data/pages/utility/process';
import { formatStartingPriceCaption, formatUsd, UNIT_LABELS } from '../data/starting-prices';
import type { PageProps } from '../routes';
import '../styles/utility.css';

/** The four released prices first, the commercial wall (no price) last. */
const SYSTEMS = [...SYSTEMS_SECTION.cards].sort((a, b) => Number(a.startingPrice === null) - Number(b.startingPrice === null));

/**
 * /pricing: the four released starting prices (rendered from
 * starting-prices.ts through its helpers, never typed here), the commercial
 * wall as "quoted after a site review", what moves a price, the owner's five
 * steps, what to send, then the quote form.
 */
export default function PricingPage({ route }: PageProps) {
  const { prices, drivers, process, send } = PRICING_PAGE;
  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout={PRICING_PAGE.callout}
        title={PRICING_PAGE.title}
        lede={PRICING_PAGE.lede}
        actions
      />

      <Section id={prices.id} callout={prices.callout} title={prices.title} intro={prices.intro} className="pt-0">
        <ul className="ut-p-prices" data-reveal>
          {SYSTEMS.map((card) => {
            const price = card.startingPrice;
            return (
              <li key={card.id} className="ut-p-price">
                <div className="ut-p-price-name">
                  <h3 className="t-h3">
                    <a href={card.link.href}>{card.title}</a>
                  </h3>
                  <p className="t-small text-cedar">
                    {card.mount}. {card.bestFor}.
                  </p>
                </div>
                {price ? (
                  <>
                    <p className="pk-price">
                      <span className="pk-price-word">from</span> <span className="pk-price-fig">{formatUsd(price.amount)}</span>
                      {price.per === 'unit' ? null : (
                        <span className="pk-price-word"> / {UNIT_LABELS[price.per]}</span>
                      )}
                    </p>
                    <p className="pk-price-caption">{formatStartingPriceCaption(price)}</p>
                  </>
                ) : (
                  <>
                    <p className="pk-price pk-price-text">{SYSTEMS_SECTION.quoted}</p>
                    <p className="pk-price-caption">{prices.commercial.text}</p>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="cost-drivers" callout={drivers.callout} title={drivers.title} tone="limestone">
        <PointList items={drivers.items} />
      </Section>

      <Section id="how-a-quote-is-built" callout={process.callout} title={process.title} intro={process.intro}>
        <PointList items={PROCESS_STEPS} />
        <p className="ut-p-more">
          <a href="/installation" className="link-go">
            How installation works
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </p>
      </Section>

      <Section id="what-to-send" callout={send.callout} title={send.title} intro={send.intro} tone="limestone">
        <FactRows items={send.facts} />
      </Section>

      <QuoteSection />
    </Layout>
  );
}

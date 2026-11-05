import { ArrowRight, Building2, Check, Fence, Flame, Hammer, MoveVertical, Plus, Ruler, Shapes, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import Layout from '../components/Layout';
import EstimatorSection from '../components/page/EstimatorSection';
import FaqList, { faqSchemaNode } from '../components/page/FaqList';
import Fold from '../components/page/Fold';
import PageHero from '../components/page/PageHero';
import QuoteSection from '../components/page/QuoteSection';
import Section from '../components/page/Section';
import PriceBoard from '../components/pricing/PriceBoard';
import { PRICING_PAGE } from '../data/pages/utility/pricing';
import { PROCESS_STEPS } from '../data/pages/utility/process';
import { SITE_URL } from '../data/site';
import type { PageProps } from '../routes';
import '../styles/pricing.css';

const DRIVER_ICONS: Record<(typeof PRICING_PAGE.drivers.items)[number]['icon'], LucideIcon> = {
  length: Ruler,
  height: MoveVertical,
  surface: Hammer,
  fence: Fence,
  custom: Shapes,
  access: Truck,
  fire: Flame,
  commercial: Building2,
};

/**
 * /pricing, visual first: the price board (a section drawing and a large
 * figure per system, both hedge tiers side by side), what the starting price
 * covers and what is extra, the estimator, the cost drivers as an icon grid,
 * the owner's five steps, the FAQ, then the quote form. Every figure is
 * rendered from starting-prices.ts, never typed here.
 */
export default function PricingPage({ route }: PageProps) {
  const { board, covers, drivers, process, faq } = PRICING_PAGE;
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    ...faqSchemaNode(faq.items, `${SITE_URL}${route.path}`),
  }).replace(/</g, '\\u003c');

  return (
    <Layout route={route}>
      <PageHero route={route} callout={PRICING_PAGE.callout} title={PRICING_PAGE.title} lede={PRICING_PAGE.lede} actions />

      <Section id={board.id} callout={board.callout} title={board.title} className="pt-0">
        <PriceBoard />
      </Section>

      <Section id={covers.id} callout={covers.callout} title={covers.title} tone="limestone">
        <div className="pr-covers" data-reveal>
          <div className="pr-cover">
            <h3 className="pr-cover-title">{covers.inTitle}</h3>
            <ul>
              {covers.in.map((item) => (
                <li key={item}>
                  <span className="pr-mark pr-mark-in" aria-hidden="true">
                    <Check size={16} strokeWidth={2.6} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="pr-cover">
            <h3 className="pr-cover-title">{covers.extraTitle}</h3>
            <ul>
              {covers.extra.map((item) => (
                <li key={item}>
                  <span className="pr-mark pr-mark-extra" aria-hidden="true">
                    <Plus size={16} strokeWidth={2.6} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <EstimatorSection />

      <Section id={drivers.id} callout={drivers.callout} title={drivers.title} tone="limestone">
        <ul className="pr-drivers" data-reveal>
          {drivers.items.map((item) => {
            const Icon = DRIVER_ICONS[item.icon];
            return (
              <li key={item.title} className="pr-driver">
                <Icon size={24} strokeWidth={1.75} className="pr-driver-icon" aria-hidden="true" />
                <h3 className="pr-driver-title">{item.title}</h3>
                <p className="pr-driver-text">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id={process.id} callout={process.callout} title={process.title}>
        <Fold summary={process.fold}>
          <ol className="pr-steps">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.title} className="pr-step">
                <span className="pr-step-num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="pr-step-title">{step.title}</h3>
                <p className="pr-step-text">{step.text}</p>
              </li>
            ))}
          </ol>
        </Fold>
        <p className="pr-more">
          <a href="/installation" className="link-go">
            How installation works
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </p>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <FaqList items={faq.items} title={faq.title} />

      <QuoteSection />
    </Layout>
  );
}

import { ArrowRight } from 'lucide-react';

import Callout from '../components/Callout';
import Layout from '../components/Layout';
import LostDrawing from '../components/LostDrawing';
import LinkRows from '../components/page/LinkRows';
import QuoteBand from '../components/page/QuoteBand';
import Section from '../components/page/Section';
import { AREA_ROWS, SYSTEM_ROWS } from '../data/pages/utility/links';
import type { PageProps } from '../routes';
import '../styles/utility.css';

/**
 * /404, served for any unknown address. The homepage line turned around
 * ("Out of sight.") over a site plan where the visitor's sightline runs into
 * a hedge; then where people were most likely headed (systems, areas) and the
 * way to reach us.
 */
export default function NotFoundPage({ route }: PageProps) {
  return (
    <Layout route={route}>
      <section className="section ut-p-404">
        <div className="wrap ut-p-404-grid">
          <div className="ut-p-404-copy">
            <Callout text="◦ ERROR 404" />
            <h1 className="hero-display ut-p-404-title">
              <span className="hero-display-line">
                <span>Out of sight.</span>
              </span>
              <span className="hero-display-line">
                <span>Page not found.</span>
              </span>
            </h1>
            <p className="t-lede ut-p-404-lede">
              A hedge did its job a little too well. The address you followed does not lead anywhere on this site. These
              pages do.
            </p>
            <div className="ut-p-404-actions">
              <a href="/" className="btn btn-primary">
                Back to the homepage
                <ArrowRight size={18} strokeWidth={2.2} className="nudge-right" aria-hidden="true" />
              </a>
              <a href="/quote" className="link-go">
                Get a free quote
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className="ut-p-404-figure m-0">
            <LostDrawing />
          </figure>
        </div>
      </section>

      <Section className="pt-0">
        <div className="ut-p-lost-grid">
          <div>
            <h2 className="t-h3 ut-p-lost-title" data-reveal>
              Systems
            </h2>
            <LinkRows items={SYSTEM_ROWS} />
          </div>
          <div>
            <h2 className="t-h3 ut-p-lost-title" data-reveal>
              Areas
            </h2>
            <LinkRows items={AREA_ROWS} />
            <h2 className="t-h3 ut-p-lost-title ut-p-lost-more" data-reveal>
              Or talk to us
            </h2>
            <LinkRows
              items={[
                { title: 'Contact', href: '/contact', text: 'Phone, email and the quote form.' },
                { title: 'Home', href: '/' },
              ]}
            />
          </div>
        </div>
      </Section>

      <QuoteBand />
    </Layout>
  );
}

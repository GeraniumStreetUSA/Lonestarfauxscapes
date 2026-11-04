import Layout from '../components/Layout';
import LinkRows from '../components/page/LinkRows';
import PageHero from '../components/page/PageHero';
import QuoteBand from '../components/page/QuoteBand';
import Section from '../components/page/Section';
import { AREA_ROWS, SYSTEM_ROWS } from '../data/pages/utility/links';
import type { PageProps } from '../routes';
import '../styles/utility.css';

/**
 * /404, served for any unknown address. One short page: where people were
 * most likely headed (systems, areas) and the way to reach us. The route has
 * no breadcrumbs, so the hero shows none.
 */
export default function NotFoundPage({ route }: PageProps) {
  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout="◦ ERROR 404"
        title="Page not found"
        lede="That address does not lead anywhere. These pages will."
      />

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

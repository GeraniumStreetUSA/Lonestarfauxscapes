import Breadcrumbs from '../components/page/Breadcrumbs';
import Layout from '../components/Layout';
import QuoteSection from '../components/page/QuoteSection';
import type { PageProps } from '../routes';

/**
 * /quote: the form first (owner, 2026-11-05: every "Get a free quote" button
 * comes here instead of jumping to the bottom of a page). Numbers sent from
 * any estimator are already filled in.
 */
export default function QuotePage({ route }: PageProps) {
  return (
    <Layout route={route}>
      <div className="wrap pt-5">
        <Breadcrumbs crumbs={route.breadcrumbs} />
      </div>
      <QuoteSection
        headingAs="h1"
        title="Get a free quote."
        body="Tell us where and what. We email an assessment and a rough quote; a site review sets the final invoice."
      />
    </Layout>
  );
}

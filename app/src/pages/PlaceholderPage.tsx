import Layout from '../components/Layout';
import PageHero from '../components/page/PageHero';
import QuoteBand from '../components/page/QuoteBand';
import type { PageProps } from '../routes';

/** The brand tails the live titles carry; the H1 is the title without one. */
const BRAND_SUFFIX = /\s*\|\s*(Lone Star Faux Scapes|Lone Star|LSFS)$/;

/**
 * Stands in for every page whose real template is not built yet: the page
 * hero (the trail, the title as the H1, the description as the lede, the
 * quote button) and the closing quote band, so it already reads as the same
 * site. The sheet label is the section the page sits in (its parent crumb).
 */
export default function PlaceholderPage({ route }: PageProps) {
  const crumbs = route.breadcrumbs;
  const parent = crumbs.length > 2 ? crumbs[crumbs.length - 2] : undefined;
  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout={parent ? `◦ ${parent.label}` : undefined}
        title={route.title.replace(BRAND_SUFFIX, '')}
        lede={route.description}
        actions
      />
      <QuoteBand />
    </Layout>
  );
}

import Layout from '../components/Layout';
import type { PageProps } from '../routes';
import HomeAustin from '../sections/HomeAustin';
import HomeEstimator from '../sections/HomeEstimator';
import HomeFaq from '../sections/HomeFaq';
import HomeFireChapter from '../sections/HomeFireChapter';
import HomeHero from '../sections/HomeHero';
import HomeInstalls from '../sections/HomeInstalls';
import HomeLinkBand from '../sections/HomeLinkBand';
import HomeProcess from '../sections/HomeProcess';
import HomeQuestions from '../sections/HomeQuestions';
import HomeQuote from '../sections/HomeQuote';
import HomeServiceArea from '../sections/HomeServiceArea';
import HomeSystems from '../sections/HomeSystems';

/**
 * The homepage, top to bottom in CONCEPT.md order. Every section is a static
 * import (no lazy chunks) so a prerender step can capture the whole page.
 */
export default function HomePage({ route }: PageProps) {
  return (
    <Layout route={route}>
      <HomeHero />
      <HomeAustin />
      <HomeEstimator />
      <HomeLinkBand />
      <HomeQuestions />
      <HomeSystems />
      <HomeFireChapter />
      <HomeInstalls />
      <HomeProcess />
      <HomeQuote />
      <HomeFaq />
      <HomeServiceArea />
    </Layout>
  );
}

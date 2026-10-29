import { useEffect } from 'react';

import HomeSeo from '../components/HomeSeo';
import StickyCta from '../components/StickyCta';
import { armAccordions } from '../lib/accordion';
import { armReveals, armSectionMotion } from '../lib/reveal';
import { startSmoothScroll } from '../lib/smooth-scroll';
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
import SiteFooter from '../sections/SiteFooter';
import SiteHeader from '../sections/SiteHeader';

/**
 * The homepage, top to bottom in CONCEPT.md order. Every section is a static
 * import (no lazy chunks) so a prerender step can capture the whole page.
 */
export default function HomePage() {
  useEffect(() => armReveals(), []);
  useEffect(() => armSectionMotion(), []);
  useEffect(() => armAccordions(), []);
  useEffect(() => startSmoothScroll(), []);

  return (
    <>
      <HomeSeo />
      <a
        href="#main"
        className="sr-only-focusable fixed left-3 top-3 z-50 inline-flex min-h-11 items-center bg-ink px-4 text-[15px] font-[620] text-caliche"
      >
        Skip to content
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
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
      </main>
      <StickyCta />
      <SiteFooter />
    </>
  );
}

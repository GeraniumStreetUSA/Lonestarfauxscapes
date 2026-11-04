import Layout from '../components/Layout';
import Picture from '../components/Picture';
import LinkRows from '../components/page/LinkRows';
import OptionGrid from '../components/page/OptionGrid';
import PageHero from '../components/page/PageHero';
import PointList from '../components/page/PointList';
import QuoteBand from '../components/page/QuoteBand';
import Section from '../components/page/Section';
import { INSTALLATION_PAGE } from '../data/pages/utility/installation';
import { PROCESS_STEPS } from '../data/pages/utility/process';
import { AREA_ROWS } from '../data/pages/utility/links';
import type { PageProps } from '../routes';
import '../styles/utility.css';

/**
 * /installation: the five steps as the main content, what the panels mount
 * to, the five metros, then the quote band. No timelines, crews or
 * guarantees (owner rules).
 */
export default function InstallationPage({ route }: PageProps) {
  const { process, mounting, areas } = INSTALLATION_PAGE;
  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout={INSTALLATION_PAGE.callout}
        title={INSTALLATION_PAGE.title}
        lede={INSTALLATION_PAGE.lede}
        actions
        media={
          <Picture
            name="install-austin-panels"
            alt={INSTALLATION_PAGE.heroAlt}
            sizes="(min-width: 1024px) 560px, calc(100vw - 32px)"
            priority
          />
        }
      />

      <Section id={process.id} callout={process.callout} title={process.title} intro={process.intro}>
        <PointList items={PROCESS_STEPS} />
      </Section>

      <Section id="mounting" callout={mounting.callout} title={mounting.title} intro={mounting.intro} tone="limestone">
        <OptionGrid items={mounting.items} columns={4} />
      </Section>

      <Section id="areas" callout={areas.callout} title={areas.title} intro={areas.intro}>
        <LinkRows items={AREA_ROWS} columns={2} />
      </Section>

      <QuoteBand />
    </Layout>
  );
}

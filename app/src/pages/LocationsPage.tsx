import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

import Callout from '../components/Callout';
import Layout from '../components/Layout';
import LinkRows from '../components/page/LinkRows';
import PageHero from '../components/page/PageHero';
import QuoteBand from '../components/page/QuoteBand';
import Section from '../components/page/Section';
import TexasMap from '../components/TexasMap';
import { SERVICE_AREA } from '../data/home-content';
import { METROS, SUBURBS } from '../data/pages/metros';
import type { PageProps } from '../routes';
import '../styles/metros.css';

const SYSTEM_COUNT = 5;

/** "5 systems / 4 guides / 2 local jobs": what a metro page holds, counted from its data. */
function metroMeta(guides: number, jobs: number): string {
  const parts = [`${SYSTEM_COUNT} systems`, `${guides} guides`];
  if (jobs > 0) parts.push(jobs === 1 ? '1 local job' : `${jobs} local jobs`);
  return parts.join(' / ');
}

/** How many of the three Texas case studies are in a city (Houston 2, Austin 1). */
const JOBS: Record<string, number> = { Houston: 2, Austin: 1 };

const suburbRows = (parentSlug: string) =>
  SUBURBS.filter((suburb) => suburb.parent?.slug === parentSlug).map((suburb) => ({
    title: suburb.name,
    href: `/${suburb.slug}`,
    text: `${suburb.parent?.name} area. ${suburb.places?.slice(0, 2).join(', ')}.`,
  }));

/**
 * The /locations hub: the Texas map in the hero, the five metros as rows (what
 * each page holds), then the suburb pages as chips on phones, then the quote
 * band. Hovering a row lights its pin on the hero map, as on the homepage.
 */
export default function LocationsPage({ route }: PageProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout="◦ SERVICE AREA"
        title="Service locations across Texas"
        lede="We install artificial hedges and living walls across Texas. Start with your metro for systems, guides and local work. Nearby cities have their own pages."
        actions
        media={
          <div className="mt-p-map">
            <TexasMap active={active} onActive={setActive} />
          </div>
        }
      />

      <Section id="metros" tone="limestone">
        <div className="mt-p-hub">
          <div className="mt-p-hub-head pk-section-head" data-reveal>
            <Callout text="◦ FIVE METROS" />
            <h2 className="t-h2 pk-section-title mt-5">Core metro pages</h2>
            <p className="t-lede pk-section-intro">
              {SERVICE_AREA.intro} If your project is in a nearby city, start with the closest metro for pricing, scope
              and local work.
            </p>
          </div>

          <ul className="mt-p-rows mt-p-hub-list" data-reveal>
            {METROS.map((metro, index) => (
              <li key={metro.slug}>
                <a
                  href={`/${metro.slug}`}
                  className="mt-p-row"
                  data-on={active === metro.name ? 'true' : undefined}
                  onPointerEnter={() => setActive(metro.name)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(metro.name)}
                  onBlur={() => setActive(null)}
                >
                  <span className="mt-p-row-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-p-row-name">{metro.name}</span>
                  <span className="mt-p-row-meta">{metroMeta(metro.guides?.length ?? 0, JOBS[metro.name] ?? 0)}</span>
                  <ArrowRight size={20} strokeWidth={2.2} className="mt-p-row-arrow" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        id="nearby"
        callout="◦ SERVICE-AREA DETAILS"
        title="Nearby cities and service-area details"
        intro="These pages stay live for service-area context. For pricing and local work, use the metro they sit in."
      >
        <h3 className="mt-p-group">Dallas-Fort Worth area</h3>
        <LinkRows items={[...suburbRows('dallas'), ...suburbRows('fort-worth')]} columns={2} chips />
        <h3 className="mt-p-group">Houston area</h3>
        <LinkRows items={suburbRows('houston')} columns={2} chips />
      </Section>

      <QuoteBand
        title="Not in a listed city?"
        text="Pick your metro, or send any Texas city with your quote. We email an assessment and a rough quote."
      />
    </Layout>
  );
}

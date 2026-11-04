import type { ReactNode } from 'react';

import Callout from '../components/Callout';
import Layout from '../components/Layout';
import CardGrid from '../components/page/CardGrid';
import FaqList from '../components/page/FaqList';
import LinkRows, { type LinkRow } from '../components/page/LinkRows';
import OptionGrid, { type Option } from '../components/page/OptionGrid';
import PageHero from '../components/page/PageHero';
import PointList from '../components/page/PointList';
import QuoteSection from '../components/page/QuoteSection';
import Section, { type Tone } from '../components/page/Section';
import Picture from '../components/Picture';
import { SystemThumb } from '../components/PlanDrawings';
import TexasMap from '../components/TexasMap';
import { CASE_CARDS } from '../data/case-studies';
import { METRO_REFS, SUBURB_REFS } from '../data/pages/metros/areas';
import type { MetroData, MetroGuide, SystemKey } from '../data/pages/metros/types';
import { SITE_URL } from '../data/site';
import {
  INSTALLATION_CAVEAT,
  STARTING_PRICES,
  formatStartingPriceProse,
  type StartingPriceId,
} from '../data/starting-prices';
import { POSTS } from '../generated/posts';
import { faqSchemaNode } from '../lib/faq-schema';
import type { PageProps } from '../routes';
import '../styles/metros.css';

const HERO_SIZES = '(min-width: 1024px) 560px, calc(100vw - 32px)';
const CELL_SIZES = '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 96px';

/** The map is a fixed survey sheet here: the lit pin is the page's, hovering a label changes nothing. */
const noop = () => {};

/** The five systems, in the order every metro lists them. */
const SYSTEMS: readonly {
  key: SystemKey;
  title: string;
  href: string;
  price?: StartingPriceId;
  media: ReactNode;
  drawing?: boolean;
}[] = [
  {
    key: 'hedge',
    title: 'Artificial hedge',
    href: '/artificial-hedge',
    price: 'hedge',
    media: <Picture name="system-hedge" alt="Artificial boxwood hedge panels on a fence line" sizes={CELL_SIZES} />,
  },
  {
    key: 'living-wall',
    title: 'Living wall',
    href: '/living-wall',
    price: 'living-wall',
    media: <Picture name="system-living-wall" alt="Artificial living wall on an outdoor wall" sizes={CELL_SIZES} />,
  },
  {
    key: 'fence-extension',
    title: 'Fence extension',
    href: '/fence-extensions',
    price: 'fence-extension',
    media: (
      <Picture name="system-fence-extension" alt="Artificial hedge panels added above a fence" sizes={CELL_SIZES} />
    ),
  },
  {
    key: 'privacy-wall',
    title: 'Privacy wall',
    href: '/privacy-wall',
    price: 'privacy-wall',
    drawing: true,
    media: <SystemThumb id="privacy-wall" />,
  },
  {
    key: 'commercial-wall',
    title: 'Commercial wall',
    href: '/commercial-wall',
    media: (
      <Picture name="system-commercial" alt="Artificial hedge panels on a commercial storefront" sizes={CELL_SIZES} />
    ),
  },
];

/** No-break space keeps the "+" with "installation" on a wrapped line. */
const CAVEAT = INSTALLATION_CAVEAT.replace('+ ', '+\u00a0');

/**
 * A short local note, then the released price in prose and the installation
 * caveat. The caveat sits in its own span: phones hide it per row and show it
 * once under the list (`SystemsCaveat`); desktop reads it in every row.
 */
function systemLine(note: string, price?: StartingPriceId): ReactNode {
  if (!price) return `${note} Quoted after a site review.`;
  const prose = formatStartingPriceProse(STARTING_PRICES[price]);
  return (
    <>
      {note} {prose.charAt(0).toUpperCase()}
      {prose.slice(1)}
      <span className="mt-p-caveat"> {CAVEAT}</span>.
    </>
  );
}

/** Phones only: the caveat every row carries on desktop, said once under the list. */
function SystemsCaveat() {
  return <p className="mt-p-caveat-once">All prices are starting prices, {CAVEAT}.</p>;
}

function guideRows(guides: readonly MetroGuide[]): LinkRow[] {
  return guides.map((guide) => {
    const post = POSTS.find((p) => p.slug === guide.slug);
    if (!post) throw new Error(`Metro guide not found: ${guide.slug}`);
    return { title: guide.title, href: post.path, text: guide.text };
  });
}

/** The hero's media: a documented local photo, or the Texas map with the pin lit. */
function HeroMedia({ metro }: { metro: MetroData }) {
  if (metro.photo === 'austin') {
    return (
      <Picture
        name="hero-austin-boxwood-wall"
        alt="Tall artificial boxwood privacy wall behind live oaks in an Austin backyard"
        sizes={HERO_SIZES}
        priority
      />
    );
  }
  if (metro.photo === 'houston') {
    return (
      <Picture
        name="commercial-houston-patio"
        alt="Artificial boxwood hedge barriers along a Houston restaurant patio"
        sizes={HERO_SIZES}
        priority
      />
    );
  }
  return (
    <div className="mt-p-map">
      <TexasMap active={metro.mapActive} onActive={noop} />
      {metro.parent ? (
        <p className="mt-p-map-note">
          {metro.name} is in the {metro.parent.name} area.
        </p>
      ) : null}
    </div>
  );
}

/**
 * A metro or suburb page. Metros (indexed) carry the full anatomy: needs,
 * systems with their released price lines, local work where it exists, guides
 * and setups, FAQ, nearby areas, the quote form. Suburbs (noindex) are the
 * same page shorter and link up to their metro. All copy is in
 * `src/data/pages/metros/<slug>.ts`.
 */
export default function MetroPage({ route, metro }: PageProps & { metro: MetroData }) {
  const isMetro = metro.kind === 'metro';
  const cases = CASE_CARDS.filter((card) => card.city === metro.name);
  const guides = metro.guides ? guideRows(metro.guides) : [];

  // Alternate the ground backwards from the FAQ (it sits flush under its section, so that one is caliche).
  const flow = ['needs', 'systems', ...(cases.length ? ['local'] : []), ...(guides.length ? ['guides'] : [])];
  const toneOf = (id: string): Tone => ((flow.length - 1 - flow.indexOf(id)) % 2 === 0 ? 'caliche' : 'limestone');

  const systemCells: Option[] = SYSTEMS.map((system) => ({
    title: system.title,
    href: system.href,
    text: systemLine(metro.systems[system.key], system.price),
    media: system.media,
    mediaKind: system.drawing ? 'drawing' : 'photo',
  }));
  systemCells.push({
    title: 'Not sure yet',
    text: 'Send your numbers and a photo. We suggest a system in the assessment.',
  });
  const systemRows: LinkRow[] = SYSTEMS.map((system) => ({
    title: system.title,
    href: system.href,
    text: systemLine(metro.systems[system.key], system.price),
  }));

  // Nearby: a metro lists its suburbs and the other metros; a suburb lists its metro and its sibling suburbs.
  const metroRows: LinkRow[] = METRO_REFS.filter((ref) => ref.slug !== metro.slug).map((ref) => ({
    title: ref.name,
    href: `/${ref.slug}`,
    group: 'Other metros',
  }));
  const suburbRows: LinkRow[] = SUBURB_REFS.filter((ref) =>
    isMetro ? ref.parent === metro.slug : ref.parent === metro.parent?.slug && ref.slug !== metro.slug,
  ).map((ref) => ({
    title: ref.name,
    href: `/${ref.slug}`,
    text: `Near ${isMetro ? metro.name : metro.parent?.name}`,
    group: 'Nearby cities',
  }));
  const parentRow: LinkRow[] = metro.parent
    ? [
        {
          title: `${metro.parent.name} artificial hedges and living walls`,
          href: `/${metro.parent.slug}`,
          text: `Systems, guides and local work for the ${metro.parent.name} metro.`,
          group: 'Your metro',
        },
      ]
    : [];
  const allRow: LinkRow = { title: 'All Texas locations', href: '/locations', group: isMetro ? 'Other metros' : 'All of Texas' };

  const faqSchema = {
    '@context': 'https://schema.org',
    ...faqSchemaNode(metro.faq, `${SITE_URL}${route.path}`),
  };

  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout={metro.callout}
        title={metro.title}
        lede={metro.lede}
        actions
        media={<HeroMedia metro={metro} />}
      />

      <Section
        id="needs"
        callout="◦ LOCAL NEEDS"
        title={metro.needsTitle}
        intro={metro.needsIntro}
        tone={toneOf('needs')}
      >
        <PointList items={metro.needs} />
        {metro.places ? (
          <div className="mt-p-places">
            <Callout text="◦ AREAS WE SERVE" />
            <p className="mt-p-places-list">{metro.places.join(' / ')}</p>
          </div>
        ) : null}
      </Section>

      <Section
        id="systems"
        callout="◦ SYSTEMS"
        title={`Systems for ${metro.name}`}
        intro="Every system we install, with its published starting price."
        tone={toneOf('systems')}
      >
        {isMetro ? (
          <div className="mt-p-systems">
            <OptionGrid items={systemCells} />
            <SystemsCaveat />
          </div>
        ) : (
          <div className="mt-p-systems">
            <LinkRows items={systemRows} columns={2} />
            <SystemsCaveat />
          </div>
        )}
      </Section>

      {cases.length > 0 ? (
        <Section
          id="local-work"
          callout="◦ LOCAL WORK"
          title={`Our ${metro.name} ${cases.length > 1 ? 'projects' : 'project'}`}
          tone={toneOf('local')}
        >
          <CardGrid
            items={cases.map((card) => ({
              title: card.title,
              href: card.path,
              callout: card.city,
              text: card.problemSolved,
              linkLabel: 'See the job',
              media: <Picture name={card.image as 'case-austin-privacy-wall'} alt={card.alt} sizes={CELL_SIZES} />,
            }))}
          />
        </Section>
      ) : null}

      {guides.length > 0 ? (
        <Section
          id="guides"
          callout="◦ GUIDES"
          title={`Guides for ${metro.name}`}
          intro="Read these before you ask for a quote."
          tone={toneOf('guides')}
        >
          <div className="mt-p-split">
            <LinkRows items={guides} terse />
            {metro.setups ? (
              <div>
                <h3 className="mt-p-split-title">Setups that fit {metro.name}</h3>
                <LinkRows items={metro.setups} chips />
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      <FaqList items={metro.faq} title={`Questions about ${metro.name} projects`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />

      {isMetro ? (
        <Section id="nearby" callout="◦ NEARBY" title="Nearby areas and other metros." tone="ink">
          <LinkRows items={[...suburbRows, ...metroRows, allRow]} columns={2} chips />
        </Section>
      ) : (
        <Section id="nearby" callout="◦ NEARBY" title={`${metro.name} is part of the ${metro.parent?.name} area.`} tone="limestone">
          <LinkRows items={[...parentRow, ...suburbRows, allRow]} columns={2} chips />
        </Section>
      )}

      <QuoteSection title={`Get a free ${metro.name} quote.`} />
    </Layout>
  );
}

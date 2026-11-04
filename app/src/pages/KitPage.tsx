import Layout from '../components/Layout';
import CardGrid from '../components/page/CardGrid';
import EstimatorSection from '../components/page/EstimatorSection';
import FactRows from '../components/page/FactRows';
import FaqList from '../components/page/FaqList';
import LinkRows from '../components/page/LinkRows';
import OptionGrid from '../components/page/OptionGrid';
import PageHero from '../components/page/PageHero';
import Picture from '../components/Picture';
import PointList from '../components/page/PointList';
import Prose from '../components/page/Prose';
import QuoteBand from '../components/page/QuoteBand';
import QuoteSection from '../components/page/QuoteSection';
import Section from '../components/page/Section';
import Toc, { type TocItem } from '../components/page/Toc';
import { SystemThumb } from '../components/PlanDrawings';
import { CASE_CARDS } from '../data/case-studies';
import { FAQ, HERO } from '../data/home-content';
import type { PageProps } from '../routes';

const FACTS = [
  { label: 'On a fence or wall', value: 'About 2 to 3 in deep' },
  { label: 'Panels', value: '20 in wide' },
  { label: 'Fire-rated', value: 'Upgrade (NFPA 701)' },
  { label: 'Installation', value: 'Quoted after a site review' },
] as const;

const POINTS = [
  { title: 'Measure the run', text: 'Walk the line you want green and note each corner and gate. Send us the lengths in feet.' },
  { title: 'We count the panels', text: 'The run in inches, divided by the 20 in panel, rounded up. The estimator shows the arithmetic.' },
  {
    title: 'A site review sets the invoice',
    text: 'Run length, mounting and site access drive installation, so the final invoice waits for the review.',
  },
] as const;

const OPTIONS = [
  {
    title: 'Artificial hedge',
    text: 'Panels on a fence line, a wall or a patio edge.',
    href: '/artificial-hedge',
    media: <Picture name="system-hedge" alt="Artificial boxwood hedge panels on a fence line" sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 96px" />,
  },
  {
    title: 'Living wall',
    text: 'Greenery for a blank wall, in 40 in panels.',
    href: '/living-wall',
    media: <Picture name="system-living-wall" alt="Artificial living wall on an outdoor wall" sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 96px" />,
  },
  {
    title: 'Fence extension',
    text: 'Add height to the fence you already have.',
    href: '/fence-extensions',
    media: <Picture name="system-fence-extension" alt="Artificial hedge rising above a low stucco wall beside a tiled terrace" sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 96px" />,
  },
  {
    title: 'Privacy wall',
    text: 'Freestanding units on a base, in 4 ft sections.',
    href: '/privacy-wall',
    mediaKind: 'drawing' as const,
    media: <SystemThumb id="privacy-wall" />,
  },
  {
    title: 'Commercial wall',
    text: 'Facades and storefronts, quoted after a site review.',
    href: '/commercial-wall',
    media: <Picture name="system-commercial" alt="Artificial hedge panels on a commercial storefront" sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 96px" />,
  },
  { title: 'Not sure yet', text: 'Send your numbers and a photo. We suggest a system in the assessment.' },
] as const;

const TOC: readonly TocItem[] = [
  { id: 'kit-measure', text: 'Measuring a run', level: 2 },
  { id: 'kit-corners', text: 'Corners and gates', level: 3 },
  { id: 'kit-count', text: 'Counting panels', level: 2 },
  { id: 'kit-fire', text: 'Fire documentation', level: 2 },
];

const RELATED = [
  { title: 'Living walls', href: '/living-wall', text: 'Greenery for a blank wall, no irrigation.' },
  { title: 'Fence extensions', href: '/fence-extensions', text: 'Add height to the fence you have.' },
  { title: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge', text: 'The fire-rated upgrade (NFPA 701).' },
  { title: 'Pool privacy', href: '/pool-privacy-hedge' },
  { title: 'Dallas', href: '/dallas', text: 'Installs in Dallas.' },
  { title: 'Houston', href: '/houston' },
] as const;

const CARDS = CASE_CARDS.map((card) => ({
  title: card.title,
  href: card.path,
  callout: card.city,
  text: card.problemSolved,
  linkLabel: 'See the job',
  media: (
    <Picture
      name={card.image as 'case-austin-privacy-wall'}
      alt={card.alt}
      sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 104px"
    />
  ),
}));

/**
 * Development only (`/__kit`, added to the manifest only when
 * `import.meta.env.DEV`): every component of the page kit with real Lone Star
 * content, for review at 390 and 1440. Not built, not prerendered.
 */
export default function KitPage({ route }: PageProps) {
  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout="◦ SYSTEMS / HEDGE"
        title="Artificial Hedge Installation in Texas"
        lede="Hedge panels on a fence line, a wall or a patio edge, built to your measurements. No watering, no trimming."
        price="hedge"
        actions
        media={
          <Picture
            name="hero-austin-boxwood-wall"
            alt={HERO.photoAlt}
            sizes="(min-width: 1024px) 560px, calc(100vw - 32px)"
            priority
          />
        }
        facts={FACTS}
      />

      <Section id="points" callout="◦ POINT LIST" title="Three steps from a tape measure to a quote." tone="limestone">
        <PointList items={POINTS} />
      </Section>

      <Section
        id="options"
        callout="◦ OPTION GRID"
        title="Pick the system that fits the job."
        intro="Cells in a hairline grid. Rows with a square picture on phones."
      >
        <OptionGrid items={OPTIONS} />
      </Section>

      <Section id="prose" callout="◦ PROSE AND TOC" title="Long-form content." tone="limestone">
        <div className="pk-with-toc">
          <Toc items={TOC} />
          <Prose>
            <h2 id="kit-measure">Measuring a run</h2>
            <p>
              Measure along the line where the hedge will stand, not along the house. Round each stretch up to the
              next foot and write the lengths down in order. If you are not sure, <a href="/contact">send us a photo</a>{' '}
              and the numbers you have.
            </p>
            <ul>
              <li>Start at a corner, a post or a gate.</li>
              <li>Note anything the panels must clear, such as a meter or a gas line.</li>
              <li>Take a photo of each stretch from the yard side.</li>
            </ul>
            <h3 id="kit-corners">Corners and gates</h3>
            <p>
              A corner is counted once. A gate is a break in the run, so measure each side of it as its own stretch.
            </p>
            <h2 id="kit-count">Counting panels</h2>
            <p>The panel is the unit a crew counts. The estimator uses the same module for each system.</p>
            <table>
              <thead>
                <tr>
                  <th>System</th>
                  <th>Panel module</th>
                  <th>Priced height</th>
                  <th>Counted by</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hedge on your fence or wall</td>
                  <td>20 in</td>
                  <td>Your height</td>
                  <td>Run in inches</td>
                </tr>
                <tr>
                  <td>Freestanding hedge</td>
                  <td>20 in</td>
                  <td>6 ft</td>
                  <td>Run in inches</td>
                </tr>
                <tr>
                  <td>Fence extension</td>
                  <td>20 in</td>
                  <td>3 ft</td>
                  <td>Run in inches</td>
                </tr>
                <tr>
                  <td>Living wall</td>
                  <td>40 in</td>
                  <td>Your height</td>
                  <td>Run and height</td>
                </tr>
                <tr>
                  <td>Privacy wall</td>
                  <td>4 ft units</td>
                  <td>4 ft</td>
                  <td>Run in feet</td>
                </tr>
              </tbody>
            </table>
            <figure>
              <Picture
                name="austin-after"
                alt={HERO.photoAlt}
                sizes="(min-width: 1024px) 68ch, calc(100vw - 32px)"
              />
              <figcaption>{HERO.photoCaption}</figcaption>
            </figure>
            <h2 id="kit-fire">Fire documentation</h2>
            <blockquote>
              <p>Fire-rated foliage (NFPA 701) is an upgrade at extra cost. Ask for the documentation for the exact system you choose.</p>
            </blockquote>
            <p>
              Panels are rated by system, so the <code>20 in</code> hedge and the <code>40 in</code> wall can carry
              different paperwork.
            </p>
            <hr />
            <p>
              See <a href="/pricing">pricing</a> for how a rough quote is built.
            </p>
          </Prose>
        </div>
        <div className="table-wrap" style={{ marginTop: 32 }}>
          <table>
            <thead>
              <tr>
                <th>A table in a table-wrap</th>
                <th>Column two is wide enough to scroll on a phone</th>
                <th>Column three</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hedge</td>
                <td>20 in panels, counted across the run</td>
                <td>6 ft</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="facts"
        callout="◦ FACT ROWS"
        title="Label and value, in rows."
        intro="Two columns on phones, four from 640 px, whatever the count."
      >
        <FactRows
          items={[
            ...FACTS,
            { label: 'Run', value: 'Send feet' },
            { label: 'Photos', value: 'Welcome' },
          ]}
        />
      </Section>

      <FaqList items={FAQ.items.slice(0, 4)} title="Questions, answered plainly." />

      <Section id="cards" callout="◦ CARD GRID" title="Three real Texas jobs." tone="limestone">
        <CardGrid items={CARDS} />
      </Section>

      <Section
        id="links"
        callout="◦ LINK ROWS (INK)"
        title="Related pages."
        intro="The dark chapter: used once a page."
        tone="ink"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <LinkRows items={RELATED} />
          <PointList items={POINTS} />
        </div>
      </Section>

      <Section id="links-light" callout="◦ LINK ROWS" title="Nearby areas, two columns.">
        <LinkRows items={RELATED} columns={2} />
      </Section>

      <QuoteBand />

      <EstimatorSection initialSystem="living-wall" />

      <QuoteSection />
    </Layout>
  );
}

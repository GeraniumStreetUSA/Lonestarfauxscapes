import '../styles/systems.css';

import Callout from '../components/Callout';
import Layout from '../components/Layout';
import CardGrid from '../components/page/CardGrid';
import EstimatorSection from '../components/page/EstimatorSection';
import FaqList, { faqSchemaNode } from '../components/page/FaqList';
import Fold from '../components/page/Fold';
import LinkRows from '../components/page/LinkRows';
import OptionGrid, { type Option } from '../components/page/OptionGrid';
import PageHero from '../components/page/PageHero';
import PointList from '../components/page/PointList';
import QuoteSection from '../components/page/QuoteSection';
import Section from '../components/page/Section';
import Picture from '../components/Picture';
import { CASE_CARDS } from '../data/case-studies';
import { PROCESS } from '../data/home-content';
import { METROS } from '../data/pages/systems/shared';
import type { Block, OptionItem, PageImage, SystemPageData } from '../data/pages/systems/types';
import { SITE_URL } from '../data/site';
import type { PageProps } from '../routes';

const OPTION_SIZES = '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 96px';
const FIGURE_SIZES = '(min-width: 1024px) 380px, calc(50vw - 24px)';

function photo(image: PageImage, sizes: string) {
  return <Picture name={image.name} alt={image.alt} sizes={sizes} />;
}

/** One option cell: a photo, a product sample shown whole on a plan frame, or text alone. */
function toOption(item: OptionItem): Option {
  const base = { title: item.title, text: item.text, href: item.href };
  if (item.sample) {
    return {
      ...base,
      mediaKind: 'drawing',
      media: <div className="sys-p-sample">{photo(item.sample, OPTION_SIZES)}</div>,
    };
  }
  if (item.image) return { ...base, media: photo(item.image, OPTION_SIZES) };
  return base;
}

/** Blocks render as Sections in the order the page's data lists them. */
function BlockView({ block, hasEstimator }: { block: Block; hasEstimator: boolean }) {
  if (block.kind === 'estimator') {
    return <EstimatorSection initialSystem={block.system} callout={block.callout} title={block.title} body={block.body} />;
  }

  const head = {
    id: block.id,
    callout: block.callout,
    title: block.title,
    intro: block.intro,
    tone: block.tone,
  };

  switch (block.kind) {
    case 'points':
      return (
        <Section {...head}>
          {/* "What it solves" is said again in the FAQ and the hero: phones keep the four titles. */}
          <PointList items={block.items} terse={block.id === 'solves'} />
        </Section>
      );

    case 'options':
      return (
        <Section {...head}>
          <OptionGrid items={block.items.map(toOption)} columns={block.columns} />
        </Section>
      );

    case 'text':
      return (
        <Section {...head}>
          <div className="sys-p-text" data-reveal>
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {block.list ? (
              <ul>
                {block.list.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            ) : null}
          </div>
          {block.links ? (
            <div className="sys-p-text-links">
              <LinkRows items={block.links} chips />
            </div>
          ) : null}
        </Section>
      );

    case 'process':
      return (
        <Section {...head}>
          <div className="sys-p-process">
            {/* Folded on phones: the five steps are the same on every page and on /installation. */}
            <Fold summary="How a job runs, in 5 steps">
              <PointList
                items={PROCESS.steps.map((step, index) => ({
                  title: step.title,
                  // The shared first step points at the homepage estimator; a page without one drops that line.
                  text: index === 0 && !hasEstimator ? 'Run, height, city, and photos if you have them.' : step.body,
                }))}
              />
            </Fold>
            {block.drivers ? (
              <Fold
                className="sys-p-drivers"
                showSummaryOnDesktop
                summary={<h3 className="sys-p-drivers-title">{block.driversTitle ?? 'What moves the quote'}</h3>}
              >
                <ul>
                  {block.drivers.map((driver) => (
                    <li key={driver}>{driver}</li>
                  ))}
                </ul>
              </Fold>
            ) : null}
          </div>
        </Section>
      );

    case 'projects': {
      const cards = CASE_CARDS.filter((card) => block.slugs.includes(card.slug)).map((card) => ({
        title: card.title,
        href: card.path,
        callout: card.city,
        text: card.problemSolved,
        linkLabel: 'See the job',
        media: (
          <Picture
            name={card.image as PageImage['name']}
            alt={card.alt}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 104px"
          />
        ),
      }));
      return (
        <Section {...head}>
          <CardGrid items={cards} compact />
        </Section>
      );
    }

    case 'pair':
      return (
        <Section {...head}>
          <div className="sys-p-pair" data-reveal>
            <figure>
              <div className="photo">{photo(block.first, FIGURE_SIZES)}</div>
              <Callout as="figcaption" text={block.firstLabel} className="sys-p-pair-label" />
            </figure>
            <figure>
              <div className="photo">{photo(block.second, FIGURE_SIZES)}</div>
              <Callout as="figcaption" text={block.secondLabel} className="sys-p-pair-label" />
            </figure>
          </div>
        </Section>
      );
  }
}

/**
 * One template for the five system pages and the six use-case pages. The copy
 * lives in src/data/pages/systems/<slug>.ts; the page is the hero, the data's
 * blocks in order, the FAQ (with its FAQPage schema from the same array), the
 * dark link band (siblings, guides, the five metros) and the quote form.
 */
export default function SystemPage({ route, data }: PageProps & { data: SystemPageData }) {
  const { hero, blocks, faq, links } = data;
  const hasEstimator = blocks.some((block) => block.kind === 'estimator');
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    ...faqSchemaNode(faq.items, `${SITE_URL}${route.path}`),
  }).replace(/</g, '\\u003c');

  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout={hero.callout}
        title={hero.title}
        lede={hero.lede}
        price={hero.price}
        actions
        media={<Picture name={hero.image.name} alt={hero.image.alt} sizes="(min-width: 1024px) 560px, calc(100vw - 32px)" priority />}
        facts={hero.facts}
      />

      {blocks.map((block) => (
        <BlockView key={block.kind === 'estimator' ? 'estimator' : block.id} block={block} hasEstimator={hasEstimator} />
      ))}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <FaqList items={faq.items} title={faq.title} />

      <Section id="related" callout="◦ KEEP LOOKING" title="Related pages, guides and cities." tone="ink">
        <div className="sys-p-links">
          <div>
            <h3 className="sys-p-group">Systems and uses</h3>
            <LinkRows items={links.related} chips />
          </div>
          <div>
            <h3 className="sys-p-group">Guides</h3>
            <LinkRows items={links.guides} chips />
          </div>
        </div>
        <h3 className="sys-p-group sys-p-group-metros">We install in</h3>
        <ul className="sys-p-metros" data-reveal>
          {METROS.map((metro) => (
            <li key={metro.href}>
              <a href={metro.href}>{metro.title}</a>
            </li>
          ))}
        </ul>
      </Section>

      <QuoteSection />
    </Layout>
  );
}

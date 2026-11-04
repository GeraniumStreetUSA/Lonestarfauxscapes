import { ArrowRight } from 'lucide-react';
import { Fragment, type ComponentProps, type ReactNode } from 'react';

import Callout from '../components/Callout';
import Layout from '../components/Layout';
import CardGrid from '../components/page/CardGrid';
import FaqList from '../components/page/FaqList';
import Fold from '../components/page/Fold';
import LinkRows from '../components/page/LinkRows';
import OptionGrid from '../components/page/OptionGrid';
import PageHero from '../components/page/PageHero';
import PointList from '../components/page/PointList';
import QuoteBand from '../components/page/QuoteBand';
import QuoteSection from '../components/page/QuoteSection';
import Section from '../components/page/Section';
import Picture from '../components/Picture';
import { SYSTEMS_SECTION, type SystemCard } from '../data/home-content';
import type { HubData, HubImage, HubLink, HubSection } from '../data/pages/hubs/types';
import { AREA_LINKS, SITE_URL } from '../data/site';
import {
  INSTALLATION_CAVEAT,
  formatStartingPrice,
  formatStartingPriceCaption,
  type StartingPrice,
} from '../data/starting-prices';
import { faqSchemaNode } from '../lib/faq-schema';
import type { PageProps } from '../routes';
import '../styles/hubs.css';

type ImageName = ComponentProps<typeof Picture>['name'];

const THUMB_SIZES = '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 104px';

/** The alt text for a system's photo; the cards carry the photo names. */
const SYSTEM_ALT: Record<SystemCard['id'], string> = {
  hedge: 'Artificial boxwood hedge panels on a fence line',
  'living-wall': 'Artificial living wall on an outdoor wall',
  'fence-extension': 'Artificial hedge panels added above a fence',
  commercial: 'Artificial hedge panels on a commercial storefront',
  'privacy-wall': 'Freestanding hedge boxes along a walkway',
};

function photo(image: HubImage, sizes: string): ReactNode {
  return <Picture name={image.name as ImageName} alt={image.alt} sizes={sizes} />;
}

/** Inline links under a sentence: the same arrow links the cards use. */
function InlineLinks({ links }: { links: readonly HubLink[] }) {
  return (
    <span className="hb-p-inline">
      {links.map((link) => (
        <a key={link.href} href={link.href} className="link-go">
          {link.label}
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </a>
      ))}
    </span>
  );
}

/**
 * The price caption as released (configuration, then the installation caveat).
 * The caveat is its own span: phones hide it per card and read it once under
 * the list (`SystemsCaveat`); desktop keeps it on every card.
 */
function Caption({ price }: { price: StartingPrice }) {
  const parts = formatStartingPriceCaption(price).split(/\s·\s/);
  const caveat = parts.pop();
  return (
    <>
      {parts.join(' · ')}
      <span className="hb-p-caveat"> · {caveat}</span>
    </>
  );
}

/** Phones only: the caveat every card carries on desktop, said once under the list. */
function SystemsCaveat() {
  return <p className="hb-p-caveat-once">All prices are starting prices, {INSTALLATION_CAVEAT.replace('+ ', '+\u00a0')}.</p>;
}

/**
 * The home page's five systems as cards: picture, module, title, released
 * price with its caption (configuration and the installation caveat), the
 * best-for line and one link. Phones: compact rows, like the kit's cards.
 */
function SystemCards({ ids, terse = false }: { ids: readonly SystemCard['id'][]; terse?: boolean }) {
  const cards = ids.map((id) => SYSTEMS_SECTION.cards.find((card) => card.id === id)).filter((card) => card !== undefined);
  return (
    <>
      <ul className="pk-cards" data-terse={terse ? 'yes' : undefined} data-reveal>
        {cards.map((card) => (
          <li key={card.id} id={`system-${card.id}`}>
            <article className="card-hover" data-media="yes">
              <div className="photo photo-settle pk-media-photo">
                <Picture name={card.image as ImageName} alt={SYSTEM_ALT[card.id]} sizes={THUMB_SIZES} />
              </div>
              <Callout text={card.module} className="pk-card-callout" />
              <h3 className="t-h3 pk-card-title">{card.title}</h3>
              <div className="hb-p-card-body">
                <p className="hb-p-price">{card.startingPrice ? formatStartingPrice(card.startingPrice) : SYSTEMS_SECTION.quoted}</p>
                {card.startingPrice ? (
                  <p className="t-small hb-p-caption">
                    <Caption price={card.startingPrice} />
                  </p>
                ) : null}
                <p className="t-small pk-card-text">{card.bestFor}</p>
              </div>
              <a href={card.link.href} className="link-go pk-card-link">
                {card.link.label}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </article>
          </li>
        ))}
      </ul>
      {cards.some((card) => card.startingPrice) ? <SystemsCaveat /> : null}
    </>
  );
}

function SectionView({ section }: { section: Exclude<HubSection, { kind: 'faq' }> }) {
  const head = { id: section.id, callout: section.callout, title: section.title, intro: section.intro, tone: section.tone };
  switch (section.kind) {
    case 'systems':
      return (
        <Section {...head}>
          <SystemCards ids={section.ids} terse={section.terse} />
        </Section>
      );
    case 'options':
      return (
        <Section {...head}>
          <OptionGrid
            columns={section.columns}
            items={section.items.map((item) => ({
              title: item.title,
              text: item.text,
              href: item.href,
              media: item.image ? photo(item.image, THUMB_SIZES) : undefined,
            }))}
          />
        </Section>
      );
    case 'points': {
      const rows = (
        <PointList
          terse={section.terse}
          items={section.items.map((item) => ({
            title: item.title,
            text: item.links ? (
              <>
                <p>{item.text}</p>
                <InlineLinks links={item.links} />
              </>
            ) : (
              item.text
            ),
          }))}
        />
      );
      const list = section.fold ? <Fold summary={section.fold}>{rows}</Fold> : rows;
      return (
        <Section {...head}>
          {section.links ? (
            <div className="hb-p-split">
              {list}
              <LinkRows items={section.links} chips />
            </div>
          ) : (
            list
          )}
        </Section>
      );
    }
    case 'cards':
      return (
        <Section {...head}>
          <CardGrid
            items={section.items.map((item) => ({
              title: item.title,
              href: item.href,
              callout: item.callout,
              text: item.text,
              linkLabel: item.linkLabel,
              media: item.image ? photo(item.image, THUMB_SIZES) : undefined,
            }))}
            compact={section.compact}
          />
          {section.more ? (
            <p className="hb-p-more">
              <a href={section.more.href} className="link-go">
                {section.more.label}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </p>
          ) : null}
        </Section>
      );
    case 'links':
      return (
        <Section {...head}>
          <LinkRows items={section.items} columns={section.columns} chips />
        </Section>
      );
    case 'prose':
      return (
        <Section {...head}>
          <div className="hb-p-copy" data-reveal>
            {section.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {section.links ? <InlineLinks links={section.links} /> : null}
          </div>
        </Section>
      );
    case 'pair':
      return (
        <Section {...head}>
          <div className="hb-p-pair" data-reveal>
            {section.items.map((item) => (
              <figure key={item.label}>
                <div className="photo hb-p-pair-photo">{photo(item.image, '(min-width: 1024px) 520px, 46vw')}</div>
                <figcaption>{item.label}</figcaption>
              </figure>
            ))}
          </div>
          {section.link ? (
            <p className="hb-p-more">
              <a href={section.link.href} className="link-go">
                {section.link.label}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </p>
          ) : null}
        </Section>
      );
    case 'areas':
      return (
        <Section {...head}>
          <ul className="hb-p-chips" data-reveal>
            {AREA_LINKS.map((area) => (
              <li key={area.href}>
                <a href={area.href}>{area.label}</a>
              </li>
            ))}
          </ul>
        </Section>
      );
  }
}

/**
 * The hub template: the hero, the sections the page's data lists in order,
 * then the close (the quote form on /residential and /commercial, the quote
 * band elsewhere). A `faq` section also emits the FAQPage markup from the
 * same array, so only visible questions are in the schema.
 */
export default function HubPage({ route, data }: PageProps & { data: HubData }) {
  const pageUrl = `${SITE_URL}${route.path}`;
  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout={data.callout}
        title={data.title}
        lede={data.lede}
        actions
        media={data.hero ? <Picture name={data.hero.name as ImageName} alt={data.hero.alt} sizes="(min-width: 1024px) 560px, calc(100vw - 32px)" priority /> : undefined}
      />
      {data.sections.map((section) =>
        section.kind === 'faq' ? (
          <Fragment key={section.id}>
            <FaqList id={section.id} items={section.items} title={section.title} />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({ '@context': 'https://schema.org', ...faqSchemaNode(section.items, pageUrl) }).replace(/</g, '\\u003c'),
              }}
            />
          </Fragment>
        ) : (
          <SectionView key={section.id} section={section} />
        ),
      )}
      {data.close.kind === 'form' ? <QuoteSection /> : <QuoteBand title={data.close.title} text={data.close.text} />}
    </Layout>
  );
}

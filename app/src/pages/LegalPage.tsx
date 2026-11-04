import { Fragment } from 'react';

import Layout from '../components/Layout';
import PageHero from '../components/page/PageHero';
import Prose from '../components/page/Prose';
import QuoteBand from '../components/page/QuoteBand';
import Section from '../components/page/Section';
import type { LegalBlock, LegalDoc, LegalText } from '../data/pages/utility/legal';
import type { PageProps } from '../routes';
import '../styles/utility.css';

function isList(block: LegalBlock): block is readonly LegalText[] {
  return Array.isArray(block);
}

function Text({ text }: { text: LegalText }) {
  if (typeof text === 'string') return <>{text}</>;
  if ('lead' in text) {
    return (
      <>
        <strong>{text.lead}</strong> {text.text}
      </>
    );
  }
  return (
    <>
      {text.before}
      <a href={text.link.href}>{text.link.text}</a>
    </>
  );
}

/**
 * /privacy and /terms: the old text as long-form prose, under a plain hero
 * (the title as the H1, the "last updated" line as the lede).
 */
export default function LegalPage({ route, doc }: PageProps & { doc: LegalDoc }) {
  return (
    <Layout route={route}>
      <PageHero route={route} title={doc.title} lede={doc.updated} />

      <Section className="pt-0">
        <Prose>
          {doc.intro.map((text, index) => (
            <p key={index}>
              <Text text={text} />
            </p>
          ))}
          {doc.sections.map((section) => (
            <Fragment key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((block, index) =>
                isList(block) ? (
                  <ul key={index}>
                    {block.map((item, i) => (
                      <li key={i}>
                        <Text text={item} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={index}>
                    <Text text={block} />
                  </p>
                ),
              )}
            </Fragment>
          ))}
        </Prose>
      </Section>

      <QuoteBand />
    </Layout>
  );
}

import type { ComponentProps } from 'react';

import Callout from '../components/Callout';
import Layout from '../components/Layout';
import LinkRows from '../components/page/LinkRows';
import PageHero from '../components/page/PageHero';
import QuoteSection from '../components/page/QuoteSection';
import Section from '../components/page/Section';
import Picture from '../components/Picture';
import type { Project } from '../data/projects';
import type { PageProps } from '../routes';
import '../styles/hubs.css';
import { PhotoGrid } from './GalleryPage';

type ImageName = ComponentProps<typeof Picture>['name'];

/**
 * A case study: the job's photo and facts, the story in four short chapters
 * (the problem, what was installed, how, the result), the scope and
 * materials as the owner's profile lists them, the photos, then related
 * pages. Ends in the quote form (the route sets `hasQuoteForm`).
 */
export default function ProjectPage({ route, project }: PageProps & { project: Project }) {
  return (
    <Layout route={route}>
      <PageHero
        route={route}
        callout={project.callout}
        title={project.title}
        lede={project.lede}
        actions
        media={
          <Picture
            name={project.hero.name as ImageName}
            alt={project.hero.alt}
            sizes="(min-width: 1024px) 560px, calc(100vw - 32px)"
            priority
          />
        }
        facts={project.facts}
      />

      <section aria-label="The job" className="section hb-p-story">
        <div className="wrap">
          {project.chapters.map((chapter, index) => (
            <article key={chapter.title} className="hb-p-chapter" data-reveal>
              <header>
                <Callout text={chapter.callout} />
                <h2 className="t-h3-lg hb-p-chapter-title">{chapter.title}</h2>
              </header>
              <div className="hb-p-copy">
                {chapter.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                {index === 1 ? (
                  <dl className="hb-p-spec">
                    <div>
                      <dt>Scope</dt>
                      <dd>
                        <ul>
                          {project.scope.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt>Materials</dt>
                      <dd>
                        <ul>
                          {project.materials.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                ) : null}
                {index === project.chapters.length - 1 ? (
                  <ul className="hb-p-notes" aria-label="Project notes">
                    {project.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <Section id="photos" callout="◦ PHOTOS" title="Photos from the job." tone="limestone">
        <PhotoGrid photos={project.photos} />
      </Section>

      <Section id="related" callout="◦ KEEP LOOKING" title="Related pages.">
        <LinkRows items={project.links} columns={2} chips />
      </Section>

      <QuoteSection />
    </Layout>
  );
}

import { ArrowRight } from 'lucide-react';

import Callout from '../components/Callout';
import Picture from '../components/Picture';
import { CASE_CARDS } from '../data/case-studies';
import { INSTALLS } from '../data/home-content';

/** Three real Texas jobs, from the site's case-study source. */
export default function HomeInstalls() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <div className="wrap">
        <h2 id="projects-title" className="t-h2" data-reveal>
          {INSTALLS.title}
        </h2>
        <ul className="installs-list m-0 mt-10 grid list-none gap-x-8 gap-y-14 p-0 md:grid-cols-3 lg:mt-14" data-reveal>
          {CASE_CARDS.map((card) => {
            const titleId = `case-${card.slug}`;
            return (
              <li key={card.slug}>
                <article className="card-hover relative flex h-full flex-col">
                  <div className="photo photo-settle aspect-[4/3]">
                    <Picture
                      name={card.image as 'case-austin-privacy-wall'}
                      alt={card.alt}
                      sizes="(min-width: 768px) 30vw, calc(100vw - 32px)"
                    />
                  </div>
                  <Callout text={card.city} className="mt-5" />
                  <h3 id={titleId} className="t-h3 mt-3">
                    {card.title}
                  </h3>
                  <p className="t-small mt-3 text-cedar">{card.problemSolved}</p>
                  <a href={card.path} className="link-go card-link mt-auto self-start pt-4" aria-describedby={titleId}>
                    {INSTALLS.linkLabel}
                    <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                  </a>
                </article>
              </li>
            );
          })}
        </ul>
        <div className="mt-12 border-t border-rule pt-5">
          <a href={INSTALLS.allHref} className="link-go">
            {INSTALLS.allLabel}
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

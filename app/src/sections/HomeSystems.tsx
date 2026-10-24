import { ArrowUpRight } from 'lucide-react';

import { SystemThumb } from '../components/PlanDrawings';
import Picture from '../components/Picture';
import { SYSTEMS_SECTION } from '../data/home-content';

/**
 * Four spec cards on a hairline grid: plan strip, photo, title, price line,
 * three specs, one link. Photos are real installs, uncaptioned, and imply no
 * place; prices are never shown (every quote follows a site review).
 */
export default function HomeSystems() {
  const { specLabels } = SYSTEMS_SECTION;
  return (
    <section id="systems" aria-labelledby="systems-title" className="section bg-limestone">
      <div className="wrap">
        <h2 id="systems-title" className="t-h2" data-reveal>
          {SYSTEMS_SECTION.titleLines.map((line, i) => (
            <span key={line} className="sm:block">
              {i > 0 ? ' ' : ''}
              {line}
            </span>
          ))}
        </h2>
        <ul className="rule-grid m-0 mt-10 list-none p-0 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4" data-reveal>
          {SYSTEMS_SECTION.cards.map((card) => (
            <li key={card.id} className="flex">
              <article className="card-hover relative flex w-full flex-col">
                <div className="relative border-b border-line px-5 pb-9 pt-4 lg:px-6">
                  <SystemThumb id={card.id} />
                  <p className="mono absolute bottom-2.5 right-5 text-[13px] uppercase tracking-[0.06em] text-cedar lg:right-6" aria-hidden="true">
                    {card.module}
                  </p>
                </div>
                <div className="photo photo-settle aspect-[4/3]">
                  <Picture
                    name={card.image as 'system-hedge'}
                    alt=""
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, calc(100vw - 34px)"
                  />
                </div>
                <div className="flex flex-1 flex-col px-5 pb-6 pt-5 lg:px-6">
                  <h3 className="t-h3">{card.title}</h3>
                  <p className="t-small mt-1.5 text-cedar">{SYSTEMS_SECTION.price}</p>
                  <dl className="spec-list mt-5">
                    <dt>{specLabels.module}</dt>
                    <dd>{card.module}</dd>
                    <dt>{specLabels.mount}</dt>
                    <dd>{card.mount}</dd>
                    <dt>{specLabels.bestFor}</dt>
                    <dd>{card.bestFor}</dd>
                  </dl>
                  <a href={card.link.href} className="link-go card-link mt-auto self-start pt-5">
                    {card.link.label}
                    <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

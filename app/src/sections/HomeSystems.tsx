import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';

import { SystemThumb } from '../components/PlanDrawings';
import Picture from '../components/Picture';
import { SYSTEMS_SECTION } from '../data/home-content';
import { formatStartingPrice, formatStartingPriceCaption } from '../data/starting-prices';

/**
 * Photo `sizes` per card, matching `.systems-grid` in index.css: three across
 * then two wider cards on desktop; two across with the last card spanning on
 * tablets; one column on phones.
 */
function photoSizes(index: number, count: number): string {
  if (index < 3) return '(min-width: 1024px) 430px, (min-width: 640px) 45vw, calc(100vw - 34px)';
  if (index < count - 1) return '(min-width: 1024px) 640px, (min-width: 640px) 45vw, calc(100vw - 34px)';
  return '(min-width: 1024px) 640px, calc(100vw - 34px)';
}

/**
 * Five spec cards on a hairline grid: plan strip, photo, title, price line,
 * three specs, one link. Photos are real installs, uncaptioned, and imply no
 * place. Prices come from the released starting prices with their caption
 * (configuration and the installation caveat); a system with no released
 * price says it is quoted after a site review.
 */
export default function HomeSystems() {
  const { cards, specLabels } = SYSTEMS_SECTION;
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
        <ul className="rule-grid systems-grid m-0 mt-10 list-none p-0 lg:mt-14" data-reveal>
          {cards.map((card, index) => (
            <li key={card.id} className="flex">
              <article className="card-hover relative flex w-full flex-col">
                <div className="relative border-b border-line px-5 pb-9 pt-4 lg:px-6">
                  <div className="max-w-[380px]">
                    <SystemThumb id={card.id} />
                  </div>
                  <p className="mono absolute bottom-2.5 right-5 text-[13px] uppercase tracking-[0.06em] text-cedar lg:right-6" aria-hidden="true">
                    {card.module}
                  </p>
                </div>
                <div className={clsx('photo photo-settle aspect-[4/3]', card.id === 'privacy-wall' && 'photo-low')}>
                  <Picture name={card.image as 'system-hedge'} alt="" sizes={photoSizes(index, cards.length)} />
                </div>
                <div className="flex flex-1 flex-col px-5 pb-6 pt-5 lg:px-6">
                  <h3 className="t-h3">{card.title}</h3>
                  {card.startingPrice ? (
                    <>
                      <p className="mt-2 text-[18px] font-[680] leading-snug tracking-[-0.01em] text-ink [font-stretch:106%]">
                        {formatStartingPrice(card.startingPrice)}
                      </p>
                      <p className="t-small mt-1 text-cedar">{formatStartingPriceCaption(card.startingPrice)}</p>
                    </>
                  ) : (
                    <p className="mt-2 text-[18px] font-[680] leading-snug tracking-[-0.01em] text-ink [font-stretch:106%]">
                      {SYSTEMS_SECTION.quoted}
                    </p>
                  )}
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

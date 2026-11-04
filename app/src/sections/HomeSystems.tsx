import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { SystemThumb } from '../components/PlanDrawings';
import Picture from '../components/Picture';
import { SYSTEMS_SECTION } from '../data/home-content';
import { FR_PRICE_NOTE, formatStartingPrice, formatStartingPriceCaption } from '../data/starting-prices';
import { motionAllowed } from '../lib/motion';

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
  const list = useRef<HTMLUListElement>(null);
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [picker, setPicker] = useState(false);

  /* Phones: one card at a time under a five-way picker. Without script (or
     on wider screens) every card shows, as the grid. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setPicker(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const choose = (index: number) => {
    if (index === active) return;
    setActive(index);
    if (!motionAllowed()) return;
    /* The card changes in place: photo wipes across, the text rises. */
    requestAnimationFrame(() => {
      const card = list.current?.children[index] as HTMLElement | undefined;
      if (!card) return;
      card.querySelector('.photo')?.animate(
        [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
        { duration: 650, easing: 'cubic-bezier(0.7, 0, 0.2, 1)' },
      );
      card.querySelectorAll('[data-rise]').forEach((el, i) =>
        el.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], {
          duration: 420,
          delay: 120 + i * 60,
          easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
          fill: 'backwards',
        }),
      );
      card.querySelectorAll<SVGGeometryElement>('svg path, svg line, svg polyline, svg rect').forEach((el) => {
        const len = typeof el.getTotalLength === 'function' ? el.getTotalLength() : 0;
        if (!len) return;
        el.animate([{ strokeDasharray: `${len}`, strokeDashoffset: len }, { strokeDasharray: `${len}`, strokeDashoffset: 0 }], {
          duration: 700,
          easing: 'cubic-bezier(0.5, 0, 0.2, 1)',
        });
      });
    });
  };

  return (
    <section ref={section} id="systems" aria-labelledby="systems-title" className="section bg-limestone" data-picker={picker ? 'on' : undefined}>
      <div className="wrap">
        <h2 id="systems-title" className="t-h2" data-reveal>
          {SYSTEMS_SECTION.titleLines.map((line, i) => (
            <span key={line} className="sm:block">
              {i > 0 ? ' ' : ''}
              {line}
            </span>
          ))}
        </h2>
        {/* Phones only (hidden by CSS elsewhere): the five-way picker. */}
        <div className="sys-picker" role="group" aria-label={SYSTEMS_SECTION.pickerLabel}>
          {SYSTEMS_SECTION.short.map((label, index) => (
            <button
              key={label}
              type="button"
              className="sys-pick"
              aria-pressed={active === index}
              aria-controls={`system-${cards[index].id}`}
              onClick={() => choose(index)}
            >
              <span className="sys-pick-num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {label}
            </button>
          ))}
          <span className="sys-pick-bar" style={{ ['--i' as string]: active }} aria-hidden="true" />
        </div>
        <ul ref={list} className="rule-grid systems-grid m-0 mt-10 list-none p-0 lg:mt-14" data-reveal>
          {cards.map((card, index) => (
            <li key={card.id} id={`system-${card.id}`} className="flex" data-on={active === index ? 'true' : undefined}>
              <article className="card-hover relative flex w-full flex-col">
                <div className="relative border-b border-line px-5 pb-5 pt-4 max-sm:hidden lg:px-6">
                  <div className="max-w-[380px]">
                    <SystemThumb id={card.id} />
                  </div>
                </div>
                <div className={clsx('photo photo-settle aspect-[4/3]', card.id === 'privacy-wall' && 'photo-low')}>
                  <Picture name={card.image as 'system-hedge'} alt="" sizes={photoSizes(index, cards.length)} />
                </div>
                <div className="flex flex-1 flex-col px-5 pb-6 pt-5 lg:px-6">
                  <h3 className="t-h3" data-rise>
                    {card.title}
                  </h3>
                  {card.startingPrice ? (
                    <>
                      <p className="mt-2 text-[18px] font-[680] leading-snug tracking-[-0.01em] text-ink [font-stretch:106%]">
                        {formatStartingPrice(card.startingPrice)}
                      </p>
                      <p className="t-small mt-1 text-cedar">{formatStartingPriceCaption(card.startingPrice)}</p>
                      {card.alsoPriced ? (
                        <>
                          <p className="mt-3 text-[18px] font-[680] leading-snug tracking-[-0.01em] text-ink [font-stretch:106%]">
                            {formatStartingPrice(card.alsoPriced)}
                          </p>
                          <p className="t-small mt-1 text-cedar">{formatStartingPriceCaption(card.alsoPriced)}</p>
                        </>
                      ) : null}
                      <p className="t-small mt-3 text-cedar">{FR_PRICE_NOTE}</p>
                    </>
                  ) : (
                    <p className="mt-2 text-[18px] font-[680] leading-snug tracking-[-0.01em] text-ink [font-stretch:106%]">
                      {SYSTEMS_SECTION.quoted}
                    </p>
                  )}
                  <dl className="spec-list mt-5" data-rise>
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

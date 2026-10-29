import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import Callout from '../components/Callout';
import Picture from '../components/Picture';
import SwipeDots from '../components/SwipeDots';
import { AUSTIN_STORY } from '../data/home-content';

const STEPS = AUSTIN_STORY.steps;
const LAST = STEPS.length - 1;

/**
 * Right after the hero, the promise meets a real job: one Austin backyard in
 * three steps (before, install, after).
 *
 * Desktop: the steps scroll on the left while the photo stage stays put on
 * the right; each step wipes its photo in from the bottom, and a line draws
 * down the steps as the visitor reads. Phones: each step carries its own
 * photo, stacked. No scroll-jacking: plain position: sticky.
 *
 * Fails open: the markup ships with every photo shown (the stage's top photo
 * is "after"); the script only narrows it to the step in view.
 */
export default function HomeAustin() {
  const [active, setActive] = useState<number>(LAST);
  const steps = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = steps.current;
    if (!list || typeof IntersectionObserver === 'undefined') return;
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-step]'));

    /* The step crossing the middle band of the viewport is the active one. */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.forEach((el) => io.observe(el));

    /* Before the first step reaches the middle, show step one. */
    const first = items[0]?.getBoundingClientRect();
    if (first && first.top > window.innerHeight / 2) setActive(0);

    /* The reading line: how far through the steps the middle of the screen is. */
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = list.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      const p = Math.min(1, Math.max(0, (mid - rect.top) / rect.height));
      list.style.setProperty('--read', p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      list.style.removeProperty('--read');
    };
  }, []);

  return (
    <section aria-labelledby="austin-title" className="story section">
      <div className="wrap">
        <header className="story-head" data-reveal>
          <Callout text={AUSTIN_STORY.callout} />
          <h2 id="austin-title" className="t-h2 mt-5 max-w-[18ch]">
            {AUSTIN_STORY.title}
          </h2>
          <p className="t-lede mt-5 max-w-[46ch] text-cedar">{AUSTIN_STORY.lede}</p>
        </header>

        <div className="story-body">
          <ol ref={steps} className="story-steps swipe-lg">
            {STEPS.map((step, index) => (
              <li key={step.label} className="story-step" data-step={index} data-on={active === index ? 'true' : undefined}>
                <figure className="story-step-photo m-0">
                  <Picture name={step.image} alt={step.alt} sizes="calc(100vw - 32px)" />
                </figure>
                <p className="story-step-label">
                  <span className="story-step-index">{String(index + 1).padStart(2, '0')}</span>
                  {step.label}
                </p>
                <h3 className="t-h3-lg story-step-title">{step.title}</h3>
                <p className="t-body story-step-text">{step.text}</p>
              </li>
            ))}
          </ol>
          <SwipeDots target={steps} count={STEPS.length} label="Step" className="swipe-lg-dots" />

          <div className="story-stage" aria-hidden="true">
            <div className="story-frame">
              {STEPS.map((step, index) => (
                <div key={step.label} className="story-shot" data-shown={index <= active ? 'true' : undefined}>
                  <Picture name={step.image} alt="" sizes="(min-width: 1280px) 720px, 56vw" eager />
                </div>
              ))}
              <span className="story-chip">
                <span className="story-step-index">{String(active + 1).padStart(2, '0')}</span>
                {STEPS[active].label}
              </span>
              <span className="story-count">
                {String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <div className="story-foot" data-reveal>
          <dl className="story-facts">
            {AUSTIN_STORY.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="story-links">
            <a href={AUSTIN_STORY.caseStudy.href} className="link-go">
              {AUSTIN_STORY.caseStudy.label}
              <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </a>
            <a href={AUSTIN_STORY.measure.href} className="btn btn-primary" data-cta="austin-measure">
              {AUSTIN_STORY.measure.label}
              <ArrowDown size={18} strokeWidth={2.2} className="nudge-down" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

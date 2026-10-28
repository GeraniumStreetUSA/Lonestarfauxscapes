import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import Callout from '../components/Callout';
import CostCard from '../components/questions/CostCard';
import HoaCard from '../components/questions/HoaCard';
import LoupeCard from '../components/questions/LoupeCard';
import SunCard from '../components/questions/SunCard';
import { QUESTIONS } from '../data/home-content';

/** The answer's first sentence is the answer: set it heavier, so a skim gets it. */
function answerFirst(answer: string): [string, string] {
  const at = answer.indexOf('. ');
  return at === -1 ? [answer, ''] : [answer.slice(0, at + 1), answer.slice(at + 1)];
}

/** Each question's hands-on card, in the same order as the copy. */
const CARDS: ReactNode[] = [<LoupeCard key="loupe" />, <SunCard key="sun" />, <HoaCard key="hoa" />, <CostCard key="cost" />];

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The four fears, in the order people have them. Desktop: a numbered index
 * stays pinned on the left (the question in view lit, a reading line drawn
 * down it) while the answers scroll on the right, each with something to try:
 * a loupe on real leaves, a sun to drag across a Texas day, the HOA checklist,
 * a live price. Phones: the answers stack as cards.
 *
 * Plain position: sticky, no scroll-jacking. Every card works without
 * motion; the index only adds emphasis.
 */
export default function HomeQuestions() {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-q]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.q));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.forEach((item) => io.observe(item));

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight / 2 - rect.top) / rect.height));
      el.closest('section')?.style.setProperty('--q-read', p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section aria-labelledby="questions-title" className="section q-section">
      <div className="wrap">
        <header className="q-head" data-reveal>
          <Callout text={QUESTIONS.callout} />
          <h2 id="questions-title" className="t-h2 mt-5 max-w-[17ch]">
            {QUESTIONS.title}
          </h2>
        </header>

        <div className="q-body">
          <nav className="q-index" aria-label="The four questions">
            <ol>
              {QUESTIONS.items.map((item, index) => (
                <li key={item.question}>
                  <a href={`#q-${index + 1}`} className="q-index-link" data-on={active === index ? 'true' : undefined}>
                    <span className="q-index-num">{pad(index + 1)}</span>
                    <span>{item.question}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <ol ref={list} className="q-list">
            {QUESTIONS.items.map((item, index) => {
              const [lead, rest] = answerFirst(item.answer);
              return (
                <li key={item.question} id={`q-${index + 1}`} className="q-item" data-q={index} data-on={active === index ? 'true' : undefined}>
                  <p className="q-count">
                    <span className="q-count-num">{pad(index + 1)}</span> / {pad(QUESTIONS.items.length)}
                  </p>
                  <h3 className="q-question">{item.question}</h3>
                  <p className="t-body q-answer">
                    <strong>{lead}</strong>
                    {rest}
                  </p>
                  <div className="q-card-slot">{CARDS[index]}</div>
                  <a href={item.link.href} className="link-go mt-6">
                    {item.link.label}
                    <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

import Callout from '../components/Callout';
import CostCard from '../components/questions/CostCard';
import HoaCard from '../components/questions/HoaCard';
import LoupeCard from '../components/questions/LoupeCard';
import SunCard from '../components/questions/SunCard';
import SwipeDots from '../components/SwipeDots';
import { QUESTIONS } from '../data/home-content';
import { motionAllowed } from '../lib/motion';

/** The answer's first sentence is the answer: set it heavier, so a skim gets it. */
function answerFirst(answer: string): [string, string] {
  const at = answer.indexOf('. ');
  return at === -1 ? [answer, ''] : [answer.slice(0, at + 1), answer.slice(at + 1)];
}

/** Each question's hands-on card, in the same order as the copy. */
const CARDS: ReactNode[] = [<LoupeCard key="loupe" />, <SunCard key="sun" />, <HoaCard key="hoa" />, <CostCard key="cost" />];

/**
 * Where each incoming card irises open from (percent of the card area), so
 * one card seems to become the next: the loupe's lens opens into the sky
 * where the sun sits, the sun into the HOA sheet's section mark, the sheet's
 * stamp corner into the price.
 */
const FOCI: Array<[number, number]> = [
  [50, 50],
  [50, 50],
  [12, 16],
  [82, 84],
];

/** A tint per question, mixed as the visitor moves between them. */
const TINTS: Array<[number, number, number]> = [
  [237, 236, 230],
  [243, 234, 218],
  [236, 236, 228],
  [228, 230, 222],
];

const N = QUESTIONS.items.length;
const pad = (n: number) => String(n).padStart(2, '0');
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * The four fears, in the order people have them.
 *
 * Desktop (motion allowed): the section pins and the page's scroll drives it
 * sideways through the four questions. Text slides in with a little parallax;
 * each card irises open over the last from a focal point, and each question
 * holds still long enough to use its card. Phones: a native swipe carousel.
 * Reduced motion, ?qa=1 or no script: the plain stacked list (the markup's
 * own layout), so nothing depends on the effect.
 */
export default function HomeQuestions() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);

  /* Desktop: pinned side scroll. */
  useEffect(() => {
    const sec = section.current;
    const tr = track.current;
    const ol = list.current;
    if (!sec || !tr || !ol || !motionAllowed()) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    if (!desktop.matches) return;

    sec.dataset.mode = 'pin';
    const items = Array.from(ol.querySelectorAll<HTMLElement>('[data-q]'));
    const steps = Array.from(sec.querySelectorAll<HTMLElement>('[data-step]'));
    let raf = 0;

    const progress = () => {
      const rect = tr.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      return travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) * (N - 1) : 0;
    };

    const update = () => {
      raf = 0;
      const raw = progress();
      /* Hold on each question for the middle of its stretch, move between. */
      const base = Math.min(N - 1, Math.floor(raw));
      const eased = base + smooth(Math.min(1, Math.max(0, (raw - base - 0.3) / 0.4)));

      items.forEach((item, i) => {
        const d = i - eased;
        const a = Math.min(1, Math.abs(d));
        const incoming = d > 0 ? Math.max(0, 1 - d) : 1;
        const outgoing = d < 0 ? Math.min(1, -d) : 0;
        item.style.setProperty('--d', d.toFixed(4));
        item.style.setProperty('--a', a.toFixed(4));
        item.style.setProperty('--in', incoming.toFixed(4));
        item.style.setProperty('--out', outgoing.toFixed(4));
        item.style.setProperty('--cx', `${FOCI[i][0]}%`);
        item.style.setProperty('--cy', `${FOCI[i][1]}%`);
        const on = Math.abs(d) < 0.5;
        item.toggleAttribute('data-on', on);
        item.toggleAttribute('inert', !on);
      });

      const lo = Math.min(N - 1, Math.floor(eased));
      const hi = Math.min(N - 1, lo + 1);
      const f = eased - lo;
      const mix = TINTS[lo].map((c, k) => Math.round(c + (TINTS[hi][k] - c) * f));
      sec.style.setProperty('--q-bg', `rgb(${mix.join(' ')})`);
      steps.forEach((step, i) => {
        step.style.setProperty('--fill', `${Math.min(1, Math.max(0, raw - i + 1)) * 100}%`);
        step.toggleAttribute('data-on', Math.round(eased) === i);
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onJump = (event: Event) => {
      const i = Number((event.currentTarget as HTMLElement).dataset.step);
      const rect = tr.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const top = window.scrollY + rect.top + (travel * i) / (N - 1);
      window.scrollTo({ top, behavior: 'smooth' });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    steps.forEach((s) => s.addEventListener('click', onJump));
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      steps.forEach((s) => s.removeEventListener('click', onJump));
      cancelAnimationFrame(raf);
      delete sec.dataset.mode;
      sec.style.removeProperty('--q-bg');
      items.forEach((item) => {
        ['--d', '--a', '--in', '--out', '--cx', '--cy'].forEach((v) => item.style.removeProperty(v));
        item.removeAttribute('inert');
        item.removeAttribute('data-on');
      });
    };
  }, []);

  /* Phones: swipe carousel; cards off-centre shrink and fade a touch. */
  useEffect(() => {
    const sec = section.current;
    const ol = list.current;
    if (!sec || !ol || window.matchMedia('(min-width: 1024px)').matches) return;
    sec.dataset.mode = 'swipe';
    if (!motionAllowed()) return () => delete sec.dataset.mode;
    const items = Array.from(ol.querySelectorAll<HTMLElement>('[data-q]'));
    let raf = 0;
    const update = () => {
      raf = 0;
      const box = ol.getBoundingClientRect();
      items.forEach((item) => {
        const r = item.getBoundingClientRect();
        const off = Math.min(1, Math.abs(r.left - box.left - 16) / box.width);
        item.style.setProperty('--m', off.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    ol.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      ol.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      delete sec.dataset.mode;
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="questions-title" className="section q-section">
      <div ref={track} className="q-track">
        <div className="q-stage">
          <div className="wrap q-frame">
            <header className="q-head">
              <div>
                <Callout text={QUESTIONS.callout} />
                <h2 id="questions-title" className="t-h2 mt-5 max-w-[17ch]">
                  {QUESTIONS.title}
                </h2>
              </div>
              <ol className="q-steps" aria-hidden="true">
                {QUESTIONS.steps.map((label, i) => (
                  <li key={label}>
                    <button type="button" className="q-step" data-step={i} tabIndex={-1}>
                      <span className="q-step-num">{pad(i + 1)}</span>
                      <span className="q-step-label">{label}</span>
                      <span className="q-step-bar" />
                    </button>
                  </li>
                ))}
              </ol>
            </header>

            <ol ref={list} className="q-list">
              {QUESTIONS.items.map((item, index) => {
                const [lead, rest] = answerFirst(item.answer);
                return (
                  <li key={item.question} id={`q-${index + 1}`} className="q-item" data-q={index}>
                    <p className="q-count">
                      <span className="q-count-num">{pad(index + 1)}</span> / {pad(N)}
                    </p>
                    <h3 className="q-question">{item.question}</h3>
                    <p className="t-body q-answer">
                      <strong>{lead}</strong>
                      {rest}
                    </p>
                    <div className="q-card-slot">{CARDS[index]}</div>
                    <a href={item.link.href} className="link-go q-link">
                      {item.link.label}
                      <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ol>
            <SwipeDots target={list} count={N} label="Question" className="q-swipe-dots" />
          </div>
        </div>
      </div>
    </section>
  );
}

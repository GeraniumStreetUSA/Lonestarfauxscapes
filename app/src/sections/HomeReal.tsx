import { useEffect, useRef } from 'react';

import Picture from '../components/Picture';
import { HERO, REAL } from '../data/home-content';
import { motionAllowed } from '../lib/motion';

/**
 * From the drawing to the real thing. As the visitor scrolls, a window shaped
 * like the drawn hedge face opens to a full-bleed photo of a real Austin job,
 * the boxwood texture fading off it as it opens.
 *
 * Native position: sticky over a tall track: no scroll-jacking, no pin from a
 * library. Without motion it is simply a full-bleed photo with its caption.
 */

/* The opening shape: a hedge face in the scene's 2:1 axonometric (top edge
   sloping down to the right), as polygon() percentages: TL, TR, BR, BL. */
const FROM = [
  [16, 30],
  [84, 47],
  [84, 66],
  [16, 49],
];
const TO = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
];

function clipAt(p: number): string {
  const pts = FROM.map(([x, y], i) => {
    const [tx, ty] = TO[i];
    return `${(x + (tx - x) * p).toFixed(2)}% ${(y + (ty - y) * p).toFixed(2)}%`;
  });
  return `polygon(${pts.join(', ')})`;
}

/** Smoothstep, so the opening starts and lands softly. */
const smooth = (t: number) => t * t * (3 - 2 * t);

export default function HomeReal() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = track.current;
    const s = stage.current;
    if (!t || !s || !motionAllowed()) return;

    t.dataset.motion = 'on';
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = t.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const raw = travel > 0 ? -rect.top / travel : 1;
      const p = Math.min(1, Math.max(0, raw));
      /* Open over the first 70% of the travel; the rest holds the photo. */
      const open = smooth(Math.min(1, p / 0.7));
      s.style.setProperty('--clip', clipAt(open));
      s.style.setProperty('--zoom', (1.14 - 0.14 * open).toFixed(4));
      s.style.setProperty('--tex', Math.max(0, 1 - open * 1.8).toFixed(3));
      s.style.setProperty('--words', Math.min(1, Math.max(0, (p - 0.62) / 0.22)).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      delete t.dataset.motion;
      ['--clip', '--zoom', '--tex', '--words'].forEach((v) => s.style.removeProperty(v));
    };
  }, []);

  return (
    <section aria-label={REAL.caption} className="real">
      <div ref={track} className="real-track">
        <div ref={stage} className="real-stage">
          <figure className="real-figure m-0">
            <div className="real-photo">
              <Picture name="hero-austin-boxwood-wall" alt={HERO.photoAlt} sizes="100vw" />
            </div>
            <div className="real-tex" aria-hidden="true" />
            <figcaption className="real-words">
              <span className="real-caption">{REAL.caption}</span>
              <span className="real-statement">{REAL.statement}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

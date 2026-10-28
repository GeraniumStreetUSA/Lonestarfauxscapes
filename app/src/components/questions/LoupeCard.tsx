import { useEffect, useRef } from 'react';

import { QUESTIONS } from '../../data/home-content';

const C = QUESTIONS.cards.loupe;
const SRC = '/images/q-leaf-560.webp';
const ZOOM = 2;

/**
 * "Will it look fake?": judge it yourself. A real boxwood panel close-up
 * with a loupe that follows the pointer (drag on touch, arrow keys when
 * focused) and shows the leaves at 2×. Without script the loupe sits in the
 * middle, already magnifying, so the card still makes its point.
 */
export default function LoupeCard() {
  const frame = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = frame.current;
    const l = lens.current;
    if (!el || !l) return;

    const place = () => {
      const rect = el.getBoundingClientRect();
      const { x, y } = pos.current;
      const size = l.offsetWidth;
      l.style.left = `${x * 100}%`;
      l.style.top = `${y * 100}%`;
      l.style.backgroundSize = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
      l.style.backgroundPosition = `${-(x * rect.width * ZOOM - size / 2)}px ${-(y * rect.height * ZOOM - size / 2)}px`;
    };

    const fromEvent = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pos.current = {
        x: Math.min(0.92, Math.max(0.08, (event.clientX - rect.left) / rect.width)),
        y: Math.min(0.9, Math.max(0.1, (event.clientY - rect.top) / rect.height)),
      };
      place();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || el.hasPointerCapture(event.pointerId)) fromEvent(event);
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        el.setPointerCapture(event.pointerId);
        fromEvent(event);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      const step = 0.05;
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      const m = moves[event.key];
      if (!m) return;
      event.preventDefault();
      pos.current = {
        x: Math.min(0.92, Math.max(0.08, pos.current.x + m[0])),
        y: Math.min(0.9, Math.max(0.1, pos.current.y + m[1])),
      };
      place();
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('keydown', onKey);
    return () => {
      ro.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <figure className="q-card m-0">
      <div ref={frame} className="q-loupe-frame" tabIndex={0} aria-label={C.caption}>
        <img src={SRC} width={560} height={420} alt={C.alt} loading="lazy" decoding="async" className="q-loupe-img" />
        <div ref={lens} className="q-loupe-lens" style={{ backgroundImage: `url(${SRC})` }} aria-hidden="true">
          <span className="q-loupe-zoom">{C.zoom}</span>
        </div>
      </div>
      <figcaption className="q-card-caption">{C.caption}</figcaption>
    </figure>
  );
}

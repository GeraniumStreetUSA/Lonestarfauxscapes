import { useId, useRef, useState } from 'react';

import { QUESTIONS } from '../../data/home-content';

const C = QUESTIONS.cards.sun;

/* Drawing, in a 560 x 360 box. */
const W = 560;
const GROUND = 272;
const ARC = { x0: 48, x1: 512, base: 252, rise: 196 };
const HEDGE = { x0: 176, x1: 384, top: 190, depth: 16 };
const HEDGE_H = GROUND - HEDGE.top;

/** 7 AM to 7 PM, as 0 to 1. */
function hourLabel(t: number): string {
  const minutes = Math.round((7 * 60 + t * 12 * 60) / 30) * 30;
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12}${m ? ':30' : ''} ${h24 < 12 ? 'AM' : 'PM'}`;
}

function sunAt(t: number) {
  const lift = Math.sin(Math.PI * t);
  return {
    x: ARC.x0 + t * (ARC.x1 - ARC.x0),
    y: ARC.base - lift * ARC.rise,
    /* A Texas summer sun tops out near 80 degrees. */
    elevation: Math.max(4, lift * 78),
  };
}

function shadow(t: number): string {
  const { elevation } = sunAt(t);
  const length = Math.min(250, HEDGE_H / Math.tan((elevation * Math.PI) / 180));
  const side = t < 0.5 ? 1 : -1;
  const dx = side * length * 0.62;
  const dy = Math.min(64, 10 + length * 0.22);
  const { x0, x1 } = HEDGE;
  return `${x0},${GROUND} ${x1},${GROUND} ${(x1 + dx).toFixed(1)},${(GROUND + dy).toFixed(1)} ${(x0 + dx).toFixed(1)},${(GROUND + dy).toFixed(1)}`;
}

const ARC_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i += 1) {
    const s = sunAt(i / 40);
    pts.push(`${s.x.toFixed(1)},${s.y.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
})();

/**
 * "Will Texas sun wear it out?": drag the sun across a Texas day and watch
 * the hedge's shadow swing and shrink at noon. The control is a real range
 * input (keyboard and screen readers get it for free); the sun itself can be
 * dragged too. No claims in the drawing: the answer text carries them.
 */
export default function SunCard() {
  const [t, setT] = useState(0.62);
  const svg = useRef<SVGSVGElement>(null);
  const id = useId();
  const sun = sunAt(t);
  const high = sun.elevation >= 50;

  const fromPointer = (event: React.PointerEvent) => {
    const rect = svg.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * W;
    setT(Math.min(1, Math.max(0, (x - ARC.x0) / (ARC.x1 - ARC.x0))));
  };

  return (
    <figure className="q-card m-0">
      <div className="q-sun-frame" style={{ ['--warm' as string]: (1 - Math.sin(Math.PI * t)).toFixed(3) }}>
        <svg
          ref={svg}
          viewBox={`0 0 ${W} 360`}
          className="q-sun-svg"
          aria-hidden="true"
          onPointerDown={(e) => {
            (e.currentTarget as Element).setPointerCapture(e.pointerId);
            fromPointer(e);
          }}
          onPointerMove={(e) => {
            if ((e.currentTarget as Element).hasPointerCapture(e.pointerId)) fromPointer(e);
          }}
        >
          <defs>
            <pattern id="q-sun-boxwood" patternUnits="userSpaceOnUse" width="140" height="103">
              <image href="/images/mat-boxwood-900.webp" width="140" height="103" preserveAspectRatio="none" />
            </pattern>
            <radialGradient id="q-sun-glow">
              <stop offset="0" stopColor="#F2B53A" stopOpacity="0.55" />
              <stop offset="1" stopColor="#F2B53A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d={ARC_PATH} className="q-sun-arc" />
          <rect x="0" y={GROUND} width={W} height={360 - GROUND} className="q-sun-ground" />
          <polygon points={shadow(t)} className="q-sun-shadow" />
          <polygon
            points={`${HEDGE.x0},${HEDGE.top} ${HEDGE.x1},${HEDGE.top} ${HEDGE.x1 + HEDGE.depth},${HEDGE.top - HEDGE.depth} ${HEDGE.x0 + HEDGE.depth},${HEDGE.top - HEDGE.depth}`}
            className="q-sun-hedge-top"
          />
          <polygon
            points={`${HEDGE.x1},${GROUND} ${HEDGE.x1 + HEDGE.depth},${GROUND - HEDGE.depth} ${HEDGE.x1 + HEDGE.depth},${HEDGE.top - HEDGE.depth} ${HEDGE.x1},${HEDGE.top}`}
            className="q-sun-hedge-side"
          />
          <rect x={HEDGE.x0} y={HEDGE.top} width={HEDGE.x1 - HEDGE.x0} height={HEDGE_H} className="q-sun-hedge-front" />
          <rect x={HEDGE.x0} y={HEDGE.top} width={HEDGE.x1 - HEDGE.x0} height={HEDGE_H} fill="url(#q-sun-boxwood)" />
          <line x1="0" y1={GROUND} x2={W} y2={GROUND} className="q-sun-edge" />
          <circle cx={sun.x} cy={sun.y} r="48" fill="url(#q-sun-glow)" />
          <circle cx={sun.x} cy={sun.y} r="17" className="q-sun-disc" />
        </svg>
        <span className="q-sun-readout" aria-hidden="true">
          <span className="tabular">{hourLabel(t)}</span>
          <span className="q-sun-tag" data-high={high ? 'true' : undefined}>
            {high ? C.high : C.low}
          </span>
        </span>
      </div>
      <div className="q-sun-control">
        <label htmlFor={id} className="sr-only">
          {C.slider}
        </label>
        <span className="q-sun-end" aria-hidden="true">
          7 AM
        </span>
        <input
          id={id}
          type="range"
          min={0}
          max={24}
          step={1}
          value={Math.round(t * 24)}
          aria-valuetext={`${hourLabel(t)}, ${high ? C.high : C.low}`}
          onChange={(e) => setT(Number(e.target.value) / 24)}
          className="range"
          style={{ ['--fill' as string]: `${(t * 100).toFixed(1)}%` }}
        />
        <span className="q-sun-end" aria-hidden="true">
          7 PM
        </span>
      </div>
      <figcaption className="q-card-caption">{C.caption}</figcaption>
    </figure>
  );
}

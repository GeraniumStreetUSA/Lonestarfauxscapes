import { useEffect, useRef } from 'react';

import { HERO } from '../data/home-content';
import { motionAllowed } from '../lib/motion';

/**
 * The footer's drawing: the back fence. One long boxwood hedge runs the full
 * width (in the same drawn-3D style as the hero, here an oblique view so it
 * can run edge to edge), neighbors' roofs peek over it, two live oaks stand
 * in front. One neighbor's window is lit, and its sightline follows the
 * visitor's cursor, but it always lands on the hedge top: out of sight.
 *
 * Decorative (aria-hidden). Deterministic geometry; every moving value is
 * written straight to attributes, so React never re-renders on pointer moves.
 * Fails open: the markup is the finished hedge with the sightline straight
 * down from the window.
 */

const W = 1440;
const H = 370;
const GROUND = 306;
const HEDGE_TOP = 202;
const DEPTH = 22; // oblique depth: back edges sit up and to the right
const EYE = { x: 925, y: 62 };
const TARGET_Y = 360;

/** Where the sightline to ground point x meets the hedge's back top edge, and its half-width there. */
function hit(targetX: number) {
  const backY = HEDGE_TOP - DEPTH;
  const t = (backY - EYE.y) / (TARGET_Y - EYE.y);
  const x = EYE.x + (targetX - EYE.x) * t;
  const half = 20 + Math.abs(targetX - EYE.x) * 0.016;
  return { x, y: backY, half, t };
}

function conePoints(targetX: number): string {
  const h = hit(targetX);
  return `${EYE.x},${EYE.y} ${(h.x - h.half).toFixed(1)},${h.y} ${(h.x + h.half).toFixed(1)},${h.y}`;
}

const DEFAULT_X = 760;

/* Neighbors' houses behind the hedge: front face, roof, side, windows. */
const HOUSES = [
  { x0: 140, x1: 400, top: 52, windows: [[184, 236], [300, 352]] as Array<[number, number]>, lit: -1 },
  { x0: 770, x1: 1070, top: 12, windows: [[806, 856], [900, 950], [1000, 1046]] as Array<[number, number]>, lit: 1 },
  { x0: 1210, x1: 1390, top: 86, windows: [[1252, 1296]] as Array<[number, number]>, lit: -1 },
];
const HOUSE_BASE = 260;

function oak(cx: number, scale: number) {
  const r = 52 * scale;
  const crowns: Array<[number, number, number]> = [
    [-0.62, 0.15, 0.6],
    [0.6, 0.1, 0.64],
    [-0.1, -0.45, 0.7],
    [0.36, -0.6, 0.5],
    [-0.52, -0.5, 0.46],
    [0.04, 0.2, 0.74],
  ];
  const cy = 248 - (scale - 1) * 40;
  return { cx, cy, r, crowns, base: 350, scale };
}

const OAKS = [oak(520, 1), oak(1312, 0.82)];

export default function FooterFence() {
  const root = useRef<HTMLDivElement>(null);
  const cone = useRef<SVGPolygonElement>(null);
  const glow = useRef<SVGEllipseElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const reveal = useRef<SVGRectElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const apply = (x: number) => {
      const h = hit(x);
      cone.current?.setAttribute('points', conePoints(x));
      glow.current?.setAttribute('cx', (h.x + DEPTH / 2).toFixed(1));
      if (tag.current) tag.current.style.left = `${((h.x / W) * 100).toFixed(2)}%`;
    };

    if (!motionAllowed()) return;

    let target = DEFAULT_X;
    let current = DEFAULT_X;
    let raf = 0;
    let visible = false;
    let autoT = 0;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const tick = (now: number) => {
      raf = 0;
      if (!fine && visible) {
        /* Touch: a slow sweep along the yard, as if someone keeps looking. */
        if (!autoT) autoT = now;
        target = W / 2 + Math.sin((now - autoT) / 2200) * W * 0.36;
      }
      current += (target - current) * 0.09;
      apply(current);
      if (Math.abs(target - current) > 0.3 || (!fine && visible)) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (!visible) return;
      const rect = el.querySelector('svg')?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      target = Math.min(W - 40, Math.max(40, ((event.clientX - rect.left) / rect.width) * W));
      kick();
    };

    /* The hedge grows across, left to right, when the footer first arrives. */
    let grown = false;
    const grow = () => {
      if (grown || !reveal.current) return;
      grown = true;
      const r = reveal.current;
      const start = performance.now();
      const dur = 1600;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        r.setAttribute('width', String(Math.round((W + 60) * ease(t))));
        if (t < 1) requestAnimationFrame(step);
      };
      r.setAttribute('width', '0');
      requestAnimationFrame(step);
    };
    const startsBelow = el.getBoundingClientRect().top > window.innerHeight;

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible) {
          if (startsBelow) grow();
          kick();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    if (startsBelow && reveal.current) reveal.current.setAttribute('width', '0');
    const deadline = window.setTimeout(() => reveal.current?.setAttribute('width', String(W + 60)), 12000);

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io.disconnect();
      window.clearTimeout(deadline);
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      reveal.current?.setAttribute('width', String(W + 60));
      apply(DEFAULT_X);
    };
  }, []);

  const h0 = hit(DEFAULT_X);
  const panels = Array.from({ length: Math.floor(W / 40) }, (_, i) => -10 + (i + 1) * 40);

  return (
    <div ref={root} className="fence" aria-hidden="true">
      <div className="fence-canvas">
        <svg viewBox={`0 0 ${W} ${H}`} className="fence-svg" focusable="false">
          <defs>
            <pattern id="ff-boxwood" patternUnits="userSpaceOnUse" width="200" height="147">
              <image href="/images/mat-boxwood-900.webp" width="200" height="147" preserveAspectRatio="none" />
            </pattern>
            <linearGradient id="ff-shade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6f3e6" stopOpacity="0.12" />
              <stop offset="0.6" stopColor="#15211b" stopOpacity="0" />
              <stop offset="1" stopColor="#15211b" stopOpacity="0.32" />
            </linearGradient>
            <radialGradient id="ff-glow">
              <stop offset="0" stopColor="#F2B53A" stopOpacity="0.9" />
              <stop offset="1" stopColor="#F2B53A" stopOpacity="0" />
            </radialGradient>
            <clipPath id="ff-reveal">
              <rect ref={reveal} x="-30" y="0" width={W + 60} height={H} />
            </clipPath>
          </defs>

          {/* Neighbors' houses, behind the hedge */}
          {HOUSES.map((house, i) => (
            <g key={i} className="ff-house">
              <polygon
                points={`${house.x1},${house.top} ${house.x1 + DEPTH},${house.top - DEPTH} ${house.x1 + DEPTH},${HOUSE_BASE - DEPTH} ${house.x1},${HOUSE_BASE}`}
                className="ff-house-side"
              />
              <rect x={house.x0} y={house.top} width={house.x1 - house.x0} height={HOUSE_BASE - house.top} className="ff-house-front" />
              <polygon
                points={`${house.x0},${house.top} ${house.x1},${house.top} ${house.x1 + DEPTH},${house.top - DEPTH} ${house.x0 + DEPTH},${house.top - DEPTH}`}
                className="ff-house-roof"
              />
              {house.windows.map(([wx0, wx1], j) => (
                <rect
                  key={j}
                  x={wx0}
                  y={house.top + 28}
                  width={wx1 - wx0}
                  height={44}
                  className={j === house.lit ? 'ff-window ff-window-lit' : 'ff-window'}
                />
              ))}
            </g>
          ))}
          <ellipse cx={EYE.x} cy={EYE.y} rx="70" ry="50" fill="url(#ff-glow)" className="ff-glow" />

          {/* The look: from the lit window down toward the yard */}
          <polygon ref={cone} points={conePoints(DEFAULT_X)} className="ff-cone" />

          {/* The hedge, the full width, grown in from the left */}
          <g clipPath="url(#ff-reveal)">
            <polygon
              points={`-10,${HEDGE_TOP} ${W + 10},${HEDGE_TOP} ${W + 10 + DEPTH},${HEDGE_TOP - DEPTH} ${-10 + DEPTH},${HEDGE_TOP - DEPTH}`}
              className="ff-hedge-top"
            />
            <rect x="-10" y={HEDGE_TOP} width={W + 20} height={GROUND - HEDGE_TOP} className="ff-hedge-front" />
            <rect x="-10" y={HEDGE_TOP} width={W + 20} height={GROUND - HEDGE_TOP} fill="url(#ff-boxwood)" className="ff-hedge-tex" />
            <rect x="-10" y={HEDGE_TOP} width={W + 20} height={GROUND - HEDGE_TOP} fill="url(#ff-shade)" />
            {panels.map((x) => (
              <line key={x} x1={x} y1={HEDGE_TOP + 4} x2={x} y2={GROUND - 2} className="ff-seam" />
            ))}
            <line x1="-10" y1={HEDGE_TOP} x2={W + 10} y2={HEDGE_TOP} className="ff-edge" />
          </g>

          <ellipse ref={glow} cx={h0.x + DEPTH / 2} cy={HEDGE_TOP - DEPTH / 2} rx="26" ry="7" className="ff-hit" />

          {/* Ground in front, and two live oaks */}
          <rect x="-10" y={GROUND} width={W + 20} height={H - GROUND} className="ff-ground" />
          <line x1="-10" y1={GROUND} x2={W + 10} y2={GROUND} className="ff-edge" />
          {OAKS.map((o) => (
            <g key={o.cx} className="ff-oak" style={{ transformOrigin: `${o.cx}px ${o.base}px` }}>
              <ellipse cx={o.cx + 14} cy={o.base + 2} rx={o.r * 1.15} ry={9} className="ff-shadow" />
              <path d={`M ${o.cx - 4} ${o.base} L ${o.cx - 3} ${o.cy + 10} M ${o.cx + 4} ${o.base} L ${o.cx + 3} ${o.cy + 10}`} className="ff-trunk" />
              {o.crowns.map(([dx, dy, rr], i) => (
                <circle key={i} cx={o.cx + dx * o.r} cy={o.cy + dy * o.r - o.r * 0.3} r={rr * o.r} className="ff-canopy" />
              ))}
            </g>
          ))}
        </svg>

        <span ref={tag} className="ff-tag" style={{ left: `${((h0.x / W) * 100).toFixed(2)}%`, top: `${(((HEDGE_TOP + 26) / H) * 100).toFixed(2)}%` }}>
          {HERO.scene.outOfSight}
        </span>
      </div>
    </div>
  );
}

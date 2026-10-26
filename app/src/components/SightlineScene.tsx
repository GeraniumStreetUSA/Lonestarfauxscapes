import { ChevronsUpDown } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

import { HERO } from '../data/home-content';
import { motionAllowed } from '../lib/motion';
import {
  CHAIR,
  clampHedge,
  DECK,
  EYE,
  FENCE,
  HEDGE,
  NEIGHBOR_HOUSE,
  NEIGHBOR_LOT,
  OAK,
  POOL,
  points,
  project,
  SCALE,
  sightlineFrame,
  toPercent,
  VIEWBOX,
  WINDOW,
  YARD,
  Z_SCALE,
  type Vec3,
} from '../lib/sightline-geometry';

const S = HERO.scene;

/* ---------------------------------------------------------------- static
   Everything that never moves is computed once at module load, so the
   prerendered markup and the hydrated markup are byte-identical. */

const quad = (x0: number, x1: number, y0: number, y1: number, z = 0): Vec3[] => [
  { x: x0, y: y0, z },
  { x: x1, y: y0, z },
  { x: x1, y: y1, z },
  { x: x0, y: y1, z },
];

const H = NEIGHBOR_HOUSE;
const house = {
  front: points([
    { x: H.x0, y: H.y1, z: 0 },
    { x: H.x1, y: H.y1, z: 0 },
    { x: H.x1, y: H.y1, z: H.height },
    { x: H.x0, y: H.y1, z: H.height },
  ]),
  side: points([
    { x: H.x1, y: H.y1, z: 0 },
    { x: H.x1, y: H.y0, z: 0 },
    { x: H.x1, y: H.y0, z: H.height },
    { x: H.x1, y: H.y1, z: H.height },
  ]),
  roof: points(quad(H.x0, H.x1, H.y0, H.y1, H.height)),
  /* A parapet lip, so the roof reads as a flat Texas modern roof. */
  parapet: points([
    { x: H.x0, y: H.y1, z: H.height + 1.2 },
    { x: H.x1, y: H.y1, z: H.height + 1.2 },
    { x: H.x1, y: H.y0, z: H.height + 1.2 },
  ]),
  floorLine: points([
    { x: H.x0, y: H.y1, z: 10 },
    { x: H.x1, y: H.y1, z: 10 },
    { x: H.x1, y: H.y0, z: 10 },
  ]),
  window: points([
    { x: WINDOW.x0, y: H.y1, z: WINDOW.z0 },
    { x: WINDOW.x1, y: H.y1, z: WINDOW.z0 },
    { x: WINDOW.x1, y: H.y1, z: WINDOW.z1 },
    { x: WINDOW.x0, y: H.y1, z: WINDOW.z1 },
  ]),
  mullion: points([
    { x: (WINDOW.x0 + WINDOW.x1) / 2, y: H.y1, z: WINDOW.z0 },
    { x: (WINDOW.x0 + WINDOW.x1) / 2, y: H.y1, z: WINDOW.z1 },
  ]),
  door: points([
    { x: 19, y: H.y1, z: 0 },
    { x: 22.5, y: H.y1, z: 0 },
    { x: 22.5, y: H.y1, z: 7.5 },
    { x: 19, y: H.y1, z: 7.5 },
  ]),
  lowWindow: points([
    { x: 30, y: H.y1, z: 3.2 },
    { x: 37, y: H.y1, z: 3.2 },
    { x: 37, y: H.y1, z: 7.4 },
    { x: 30, y: H.y1, z: 7.4 },
  ]),
  sideWindow: points([
    { x: H.x1, y: -15, z: 12 },
    { x: H.x1, y: -20, z: 12 },
    { x: H.x1, y: -20, z: 16 },
    { x: H.x1, y: -15, z: 16 },
  ]),
};

const fenceFront = points([
  { x: FENCE.x0, y: 0, z: 0 },
  { x: FENCE.x1, y: 0, z: 0 },
  { x: FENCE.x1, y: 0, z: FENCE.height },
  { x: FENCE.x0, y: 0, z: FENCE.height },
]);

/* Board-on-board: one seam per foot, a cap rail on top. */
const fenceBoards: string[] = Array.from({ length: FENCE.x1 - FENCE.x0 - 1 }, (_, i) =>
  points([
    { x: FENCE.x0 + i + 1, y: 0, z: 0.25 },
    { x: FENCE.x0 + i + 1, y: 0, z: FENCE.height - 0.35 },
  ]),
);
const fenceRail = points([
  { x: FENCE.x0, y: 0, z: FENCE.height - 0.35 },
  { x: FENCE.x1, y: 0, z: FENCE.height - 0.35 },
]);

const propertyLine = points([
  { x: YARD.x0, y: 0, z: 0 },
  { x: YARD.x1, y: 0, z: 0 },
]);

const yardGround = points(quad(YARD.x0, YARD.x1, YARD.y0, YARD.y1));
const neighborGround = points(quad(NEIGHBOR_LOT.x0, NEIGHBOR_LOT.x1, NEIGHBOR_LOT.y0, NEIGHBOR_LOT.y1));
const houseShadow = points([
  { x: H.x0, y: H.y1, z: 0 },
  { x: H.x1, y: H.y1, z: 0 },
  { x: H.x1 + 3, y: H.y1 + 5, z: 0 },
  { x: H.x0 + 3, y: H.y1 + 5, z: 0 },
]);

const deck = points(quad(DECK.x0, DECK.x1, DECK.y0, DECK.y1));
const poolRim = points(quad(POOL.x0, POOL.x1, POOL.y0, POOL.y1));
/* The pool's back and left inner walls, seen from above: a darker band. */
const poolInner = points([
  { x: POOL.x0, y: POOL.y0, z: 0 },
  { x: POOL.x1, y: POOL.y0, z: 0 },
  { x: POOL.x1 - 0.6, y: POOL.y0 + 1.2, z: 0 },
  { x: POOL.x0 + 0.6, y: POOL.y0 + 1.2, z: 0 },
  { x: POOL.x0 + 0.6, y: POOL.y1 - 0.6, z: 0 },
  { x: POOL.x0, y: POOL.y1, z: 0 },
]);
const shimmer = [8.2, 10.4, 12.4].map((y, i) =>
  points([
    { x: POOL.x0 + 2 + i, y, z: 0 },
    { x: POOL.x1 - 3 + i, y, z: 0 },
  ]),
);

const C = CHAIR;
const chair = {
  seat: points([
    { x: C.x0, y: C.y0 + 1.8, z: 1.2 },
    { x: C.x1, y: C.y0 + 1.8, z: 1.2 },
    { x: C.x1, y: C.y1, z: 1.2 },
    { x: C.x0, y: C.y1, z: 1.2 },
  ]),
  back: points([
    { x: C.x0, y: C.y0 + 1.8, z: 1.2 },
    { x: C.x1, y: C.y0 + 1.8, z: 1.2 },
    { x: C.x1, y: C.y0, z: 3.1 },
    { x: C.x0, y: C.y0, z: 3.1 },
  ]),
  legs: [
    [C.x0, C.y1],
    [C.x1, C.y1],
    [C.x0, C.y0 + 1.8],
    [C.x1, C.y0 + 1.8],
  ].map(([x, y]) =>
    points([
      { x, y, z: 0 },
      { x, y, z: 1.2 },
    ]),
  ),
};

const oakBase = project({ x: OAK.x, y: OAK.y, z: 0 });
const oakTop = project({ x: OAK.x, y: OAK.y, z: OAK.trunkHeight });
const oakShadow = project({ x: OAK.x + 2, y: OAK.y + 1.5, z: 0 });
const R = OAK.canopyRadius * SCALE;
/* Canopy as overlapping crowns, deterministic offsets in drawing units. */
const crowns: Array<[number, number, number]> = [
  [-0.62, 0.18, 0.62],
  [0.58, 0.12, 0.66],
  [-0.12, -0.42, 0.7],
  [0.32, -0.6, 0.52],
  [-0.5, -0.5, 0.48],
  [0.05, 0.22, 0.74],
];
const branches = [
  [0, 0, -0.38, -0.55],
  [0, -0.1, 0.42, -0.5],
  [0, -0.25, 0.05, -0.75],
].map(([x0, y0, x1, y1]) => ({
  x1: oakTop.x + x0 * R,
  y1: oakTop.y + y0 * R,
  x2: oakTop.x + x1 * R,
  y2: oakTop.y + y1 * R,
}));

const eye = project(EYE);
const windowLabel = toPercent(project({ x: WINDOW.x0 - 0.5, y: H.y1, z: WINDOW.z1 + 2.2 }));
const yourPoolLabel = toPercent(project({ x: (POOL.x0 + POOL.x1) / 2 - 2, y: POOL.y1 + 1.6, z: 0 }));
const fenceLabel = toPercent(project({ x: FENCE.x0 + 2.5, y: 0, z: FENCE.height + 1.6 }));

/* ---------------------------------------------------------------- dynamic */

function hedgeShadow(h: number): string {
  if (h <= 0) return '';
  const reach = h * 0.42;
  return points([
    { x: HEDGE.x0, y: HEDGE.depth, z: 0 },
    { x: HEDGE.x1, y: HEDGE.depth, z: 0 },
    { x: HEDGE.x1 + reach * 0.5, y: HEDGE.depth + reach, z: 0 },
    { x: HEDGE.x0 + reach * 0.5, y: HEDGE.depth + reach, z: 0 },
  ]);
}

/** Drawing units per foot of hedge height, on screen. */
const UNITS_PER_FT = SCALE * Z_SCALE;

function feetText(h: number): string {
  return `${Math.round(h)} ft`;
}

function valueText(h: number, out: boolean): string {
  return `${Math.round(h)} feet, ${out ? S.outOfSight.toLowerCase() : S.inView.toLowerCase()}`;
}

const INITIAL = sightlineFrame(HEDGE.default);

type Refs = {
  root: HTMLDivElement | null;
  svg: SVGSVGElement | null;
  front: SVGPolygonElement | null;
  frontTex: SVGPolygonElement | null;
  side: SVGPolygonElement | null;
  sideTex: SVGPolygonElement | null;
  top: SVGPolygonElement | null;
  shadow: SVGPolygonElement | null;
  backCone: SVGPolygonElement | null;
  frontCone: SVGPolygonElement | null;
  patch: SVGPolygonElement | null;
  handle: HTMLButtonElement | null;
  handleValue: HTMLSpanElement | null;
  poolLabel: HTMLDivElement | null;
};

/**
 * The hero's scene. Prerendered at the default 8 ft (out of sight); every
 * later frame is written straight to the SVG attributes, so dragging never
 * re-renders React.
 */
export default function SightlineScene({ onFirstDrag }: { onFirstDrag?: () => void }) {
  const refs = useRef<Refs>({
    root: null,
    svg: null,
    front: null,
    frontTex: null,
    side: null,
    sideTex: null,
    top: null,
    shadow: null,
    backCone: null,
    frontCone: null,
    patch: null,
    handle: null,
    handleValue: null,
    poolLabel: null,
  });
  const height = useRef<number>(HEDGE.default as number);
  const touched = useRef(false);

  const apply = useCallback((h: number) => {
    const r = refs.current;
    const f = sightlineFrame(h);
    height.current = h;
    r.front?.setAttribute('points', f.hedgeFront);
    r.frontTex?.setAttribute('points', f.hedgeFront);
    r.side?.setAttribute('points', f.hedgeSide);
    r.sideTex?.setAttribute('points', f.hedgeSide);
    r.top?.setAttribute('points', f.hedgeTop);
    r.shadow?.setAttribute('points', hedgeShadow(h));
    r.backCone?.setAttribute('points', f.backCone);
    r.frontCone?.setAttribute('points', f.frontCone);
    r.patch?.setAttribute('points', f.patch);
    if (r.root) {
      r.root.dataset.state = f.outOfSight ? 'hidden' : 'seen';
      r.root.dataset.fence = h < 0.5 ? 'shown' : 'covered';
    }
    if (r.handle) {
      r.handle.style.left = `${f.handle.left}%`;
      r.handle.style.top = `${f.handle.top}%`;
      const shown = Math.max(h, HEDGE.min);
      r.handle.setAttribute('aria-valuenow', String(Math.round(shown)));
      r.handle.setAttribute('aria-valuetext', valueText(shown, f.outOfSight));
    }
    if (r.handleValue) r.handleValue.textContent = feetText(Math.max(h, HEDGE.min));
    if (r.poolLabel) {
      r.poolLabel.style.left = `${f.poolLabel.left}%`;
      r.poolLabel.style.top = `${f.poolLabel.top}%`;
    }
  }, []);

  const markTouched = useCallback(() => {
    if (touched.current) return;
    touched.current = true;
    const root = refs.current.root;
    root?.setAttribute('data-touched', 'true');
    if (root?.dataset.intro === 'running') root.dataset.intro = 'done';
    onFirstDrag?.();
  }, [onFirstDrag]);

  /* Drag: anywhere on the hedge or the handle; vertical travel sets height. */
  useEffect(() => {
    const r = refs.current;
    const targets = [r.handle, r.front, r.frontTex, r.top].filter(Boolean) as Element[];
    let startY = 0;
    let startH: number = HEDGE.default;
    let frame = 0;
    let pending: number | null = null;
    let dragging = false;

    const pxPerFt = () => {
      const rect = r.svg?.getBoundingClientRect();
      if (!rect || rect.height === 0) return UNITS_PER_FT;
      return (rect.height / VIEWBOX.height) * UNITS_PER_FT;
    };

    const flush = () => {
      frame = 0;
      if (pending !== null) apply(pending);
      pending = null;
    };

    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const next = clampHedge(startH + (startY - event.clientY) / pxPerFt());
      pending = Math.round(next * 4) / 4;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      r.root?.removeAttribute('data-dragging');
      (event.target as Element).releasePointerCapture?.(event.pointerId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      /* Settle on a whole foot, so the readout and the value agree. */
      apply(Math.round(height.current));
    };

    const onDown = (event: Event) => {
      const e = event as PointerEvent;
      if (e.button !== 0) return;
      e.preventDefault();
      dragging = true;
      startY = e.clientY;
      startH = clampHedge(height.current);
      r.root?.setAttribute('data-dragging', 'true');
      r.handle?.focus({ preventScroll: true });
      markTouched();
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    targets.forEach((t) => t.addEventListener('pointerdown', onDown));
    return () => {
      targets.forEach((t) => t.removeEventListener('pointerdown', onDown));
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [apply, markTouched]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const steps: Record<string, number> = {
      ArrowUp: 1,
      ArrowRight: 1,
      ArrowDown: -1,
      ArrowLeft: -1,
      PageUp: 3,
      PageDown: -3,
    };
    let next: number | null = null;
    if (event.key in steps) next = Math.round(clampHedge(height.current)) + steps[event.key];
    if (event.key === 'Home') next = HEDGE.min;
    if (event.key === 'End') next = HEDGE.max;
    if (next === null) return;
    event.preventDefault();
    markTouched();
    apply(clampHedge(next));
  };

  /* The entrance: ink in, the window looks, the hedge rises. Skipped (and
     the finished state left alone) under reduced motion and ?qa=1. */
  useEffect(() => {
    const html = document.documentElement;
    const release = () => html.classList.remove('scene-intro');
    if (!motionAllowed()) {
      release();
      return;
    }
    const root = refs.current.root;
    if (!root) {
      release();
      return;
    }

    const animations: Animation[] = [];
    const run = (el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      animations.push(el.animate(keyframes, { fill: 'backwards', ...options }));
    };

    const ink = Array.from(root.querySelectorAll<SVGGeometryElement>('[data-ink]'));
    ink.forEach((el) => {
      const delay = Number(el.dataset.ink ?? 0);
      run(el, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: 700,
        delay,
        easing: 'cubic-bezier(0.5, 0, 0.2, 1)',
      });
    });
    root.querySelectorAll<SVGElement>('[data-fill]').forEach((el) => {
      run(el, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 500,
        delay: Number(el.dataset.fill ?? 0),
        easing: 'ease-out',
      });
    });
    const cone = root.querySelector('[data-cone]');
    if (cone) {
      run(cone, [{ opacity: 0, transform: 'scale(0.15)' }, { opacity: 1, transform: 'scale(1)' }], {
        duration: 620,
        delay: 950,
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      });
    }
    root.querySelectorAll<HTMLElement>('[data-intro-label]').forEach((el) => {
      run(el, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], {
        duration: 380,
        delay: Number(el.dataset.introLabel ?? 0),
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      });
    });

    /* Start from a bare fence, then release the CSS hold in the same frame
       the backwards-filled animations take over: no flash either way. */
    apply(0);
    root.dataset.intro = 'running';
    release();

    let raf = 0;
    const riseStart = performance.now() + 1550;
    const riseMs = 1050;
    /* A firm landing: fast out of the ground, a short settle, no bounce. */
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const step = (now: number) => {
      if (touched.current) return;
      const t = Math.min(1, Math.max(0, (now - riseStart) / riseMs));
      apply(HEDGE.default * ease(t));
      if (t < 1) raf = requestAnimationFrame(step);
      else root.dataset.intro = 'done';
    };
    raf = requestAnimationFrame(step);

    /* Fail open: whatever happens, the finished scene is there by 4 s. */
    const deadline = window.setTimeout(() => {
      animations.forEach((a) => a.finish());
      if (!touched.current) apply(HEDGE.default);
      root.dataset.intro = 'done';
    }, 4000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(deadline);
      animations.forEach((a) => a.cancel());
      release();
    };
  }, [apply]);

  /* Desktop polish: the scene leans a degree or two toward the cursor. */
  useEffect(() => {
    const root = refs.current.root;
    if (!root || !motionAllowed()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      root.style.setProperty('--tilt-x', `${(x * 2.2).toFixed(3)}deg`);
      root.style.setProperty('--tilt-y', `${(-y * 1.6).toFixed(3)}deg`);
      if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const onMove = (event: PointerEvent) => {
      if (root.dataset.dragging) return;
      const rect = root.getBoundingClientRect();
      tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const set = <K extends keyof Refs>(key: K) => (el: Refs[K]) => {
    refs.current[key] = el;
  };

  const initialShown = Math.max(INITIAL.hedgeFt, HEDGE.min);

  return (
    <div
      ref={set('root')}
      className="sightline"
      data-state={INITIAL.outOfSight ? 'hidden' : 'seen'}
      data-fence="covered"
    >
      <div className="sightline-canvas">
        <svg
          ref={set('svg')}
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          className="sightline-svg"
          role="img"
          aria-label={S.title}
        >
          <defs>
            <pattern id="sl-boxwood" patternUnits="userSpaceOnUse" width="64" height="64" patternTransform="skewY(26.565)">
              <image href="/images/tex-boxwood-256.webp" width="64" height="64" preserveAspectRatio="none" />
            </pattern>
            <pattern id="sl-boxwood-side" patternUnits="userSpaceOnUse" width="64" height="64" patternTransform="skewY(-26.565)">
              <image href="/images/tex-boxwood-256.webp" width="64" height="64" preserveAspectRatio="none" />
            </pattern>
            <linearGradient id="sl-hedge-shade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6f3e6" stopOpacity="0.16" />
              <stop offset="0.55" stopColor="#15211b" stopOpacity="0" />
              <stop offset="1" stopColor="#15211b" stopOpacity="0.28" />
            </linearGradient>
            <radialGradient id="sl-glow">
              <stop offset="0" stopColor="#F2B53A" stopOpacity="0.85" />
              <stop offset="1" stopColor="#F2B53A" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sl-fade-g" cx="0.5" cy="0.55" r="0.62">
              <stop offset="0.62" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </radialGradient>
            <mask id="sl-fade" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEWBOX.width} height={VIEWBOX.height}>
              <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="url(#sl-fade-g)" />
            </mask>
            <pattern id="sl-lot" patternUnits="userSpaceOnUse" width="14" height="7">
              <circle cx="3" cy="3" r="0.9" fill="#15211b" fillOpacity="0.16" />
            </pattern>
          </defs>

          {/* Ground */}
          <g data-fill="0" mask="url(#sl-fade)">
            <polygon points={neighborGround} className="sl-ground-lot" />
            <polygon points={neighborGround} fill="url(#sl-lot)" />
            <polygon points={yardGround} className="sl-ground-yard" />
            <polygon points={houseShadow} className="sl-shadow" />
          </g>
          <g mask="url(#sl-fade)">
            <polyline points={propertyLine} className="sl-property" pathLength={1} data-ink="0" />
          </g>

          {/* The neighbor's house */}
          <g data-fill="150">
            <polygon points={house.side} className="sl-house-side" />
            <polygon points={house.front} className="sl-house-front" />
            <polygon points={house.roof} className="sl-house-roof" />
          </g>
          <g className="sl-ink">
            <polygon points={house.side} pathLength={1} data-ink="120" />
            <polygon points={house.front} pathLength={1} data-ink="150" />
            <polygon points={house.roof} pathLength={1} data-ink="220" />
            <polyline points={house.parapet} pathLength={1} data-ink="260" className="sl-thin" />
            <polyline points={house.floorLine} pathLength={1} data-ink="300" className="sl-thin" />
            <polygon points={house.door} pathLength={1} data-ink="320" className="sl-thin" />
            <polygon points={house.lowWindow} pathLength={1} data-ink="340" className="sl-thin" />
            <polygon points={house.sideWindow} pathLength={1} data-ink="360" className="sl-thin" />
          </g>
          <ellipse cx={eye.x} cy={eye.y} rx="70" ry="52" fill="url(#sl-glow)" className="sl-glow" />
          <polygon points={house.window} className="sl-window" data-fill="500" />
          <polyline points={house.mullion} className="sl-thin sl-mullion" />

          {/* The look, behind the fence line */}
          <g data-cone style={{ transformOrigin: `${eye.x}px ${eye.y}px` }} className="sl-cone-group">
            <polygon ref={set('backCone')} points={INITIAL.backCone} className="sl-cone sl-cone-back" />
          </g>

          {/* Fence */}
          <g data-fill="300">
            <polygon points={fenceFront} className="sl-fence" />
          </g>
          <g className="sl-ink sl-fence-lines">
            <polygon points={fenceFront} pathLength={1} data-ink="300" />
            <polyline points={fenceRail} pathLength={1} data-ink="420" className="sl-thin" />
            {fenceBoards.map((b, i) => (
              <polyline key={i} points={b} className="sl-board" />
            ))}
          </g>

          {/* Hedge (dynamic) */}
          <polygon ref={set('shadow')} points={hedgeShadow(INITIAL.hedgeFt)} className="sl-shadow" />
          <g className="sl-hedge">
            <polygon ref={set('side')} points={INITIAL.hedgeSide} className="sl-hedge-side" />
            <polygon ref={set('sideTex')} points={INITIAL.hedgeSide} fill="url(#sl-boxwood-side)" className="sl-hedge-side-tex" />
            <polygon ref={set('front')} points={INITIAL.hedgeFront} className="sl-hedge-front" />
            <polygon ref={set('frontTex')} points={INITIAL.hedgeFront} fill="url(#sl-boxwood)" className="sl-hedge-front-tex" />
            <polygon ref={set('top')} points={INITIAL.hedgeTop} className="sl-hedge-top" />
          </g>

          {/* Deck, pool, chair */}
          <g data-fill="450">
            <polygon points={deck} className="sl-deck" />
            <polygon points={poolRim} className="sl-water" />
            <polygon points={poolInner} className="sl-water-wall" />
          </g>
          <g className="sl-ink">
            <polygon points={deck} pathLength={1} data-ink="450" className="sl-thin" />
            <polygon points={poolRim} pathLength={1} data-ink="500" />
          </g>
          <g className="sl-shimmer" aria-hidden="true">
            {shimmer.map((s, i) => (
              <polyline key={i} points={s} style={{ animationDelay: `${i * -1.3}s` }} />
            ))}
          </g>
          <polygon ref={set('patch')} points={INITIAL.patch} className="sl-patch" data-fill="1250" />
          <g className="sl-ink sl-chair" data-fill="560">
            <polygon points={chair.back} />
            <polygon points={chair.seat} />
            {chair.legs.map((l, i) => (
              <polyline key={i} points={l} className="sl-thin" />
            ))}
          </g>

          {/* The look, over the fence into the yard (only while in view) */}
          <polygon ref={set('frontCone')} points={INITIAL.frontCone} className="sl-cone sl-cone-front" data-fill="1150" />

          {/* Live oak */}
          <g data-fill="520">
            <ellipse cx={oakShadow.x} cy={oakShadow.y} rx={R * 1.1} ry={R * 0.5} className="sl-shadow" />
          </g>
          <g className="sl-oak" style={{ transformOrigin: `${oakBase.x}px ${oakBase.y}px` }}>
            <line x1={oakBase.x - 3} y1={oakBase.y} x2={oakTop.x - 2} y2={oakTop.y} className="sl-trunk" pathLength={1} data-ink="520" />
            <line x1={oakBase.x + 3} y1={oakBase.y} x2={oakTop.x + 2} y2={oakTop.y} className="sl-trunk" pathLength={1} data-ink="540" />
            {branches.map((b, i) => (
              <line key={i} {...b} className="sl-trunk" pathLength={1} data-ink={560 + i * 30} />
            ))}
            <g className="sl-canopy" data-fill="600">
              {crowns.map(([dx, dy, r], i) => (
                <circle key={i} cx={oakTop.x + dx * R} cy={oakTop.y + dy * R - R * 0.35} r={r * R} />
              ))}
            </g>
          </g>
        </svg>

        {/* Labels, as DOM text over the drawing */}
        <div className="sl-label sl-label-window" style={{ left: `${windowLabel.left}%`, top: `${windowLabel.top}%` }} data-intro-label="1050">
          <span className="sl-dot" aria-hidden="true" />
          {S.window}
        </div>
        <div className="sl-label sl-label-fence" style={{ left: `${fenceLabel.left}%`, top: `${fenceLabel.top}%` }} data-intro-label="700">
          {S.fence}
        </div>
        <div className="sl-label sl-label-quiet" style={{ left: `${yourPoolLabel.left}%`, top: `${yourPoolLabel.top}%` }} data-intro-label="800">
          {S.pool}
        </div>
        <div
          ref={set('poolLabel')}
          className="sl-status"
          style={{ left: `${INITIAL.poolLabel.left}%`, top: `${INITIAL.poolLabel.top}%` }}
          data-intro-label="1350"
          aria-live="polite"
        >
          <span className="sl-status-seen">{S.inView}</span>
          <span className="sl-status-hidden">{S.outOfSight}</span>
        </div>

        <button
          ref={set('handle')}
          type="button"
          role="slider"
          aria-label={S.sliderLabel}
          aria-valuemin={HEDGE.min}
          aria-valuemax={HEDGE.max}
          aria-valuenow={initialShown}
          aria-valuetext={valueText(initialShown, INITIAL.outOfSight)}
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="sl-handle"
          style={{ left: `${INITIAL.handle.left}%`, top: `${INITIAL.handle.top}%` }}
        >
          <ChevronsUpDown size={16} strokeWidth={2.2} aria-hidden="true" />
          <span>
            {S.hedge} <span ref={set('handleValue')}>{feetText(initialShown)}</span>
          </span>
        </button>
        <p className="sl-hint" aria-hidden="true">
          {S.hint}
        </p>
      </div>
    </div>
  );
}

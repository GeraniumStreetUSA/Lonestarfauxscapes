import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { formatNumber } from '../lib/estimator';
import { PLAN_DRAW_MS, PLAN_EASING, PLAN_TICKS_MS, motionAllowed, planEase } from '../lib/motion';
import {
  HOUSE_HATCH,
  HOUSE_OUTLINE,
  LOT,
  LOT_CORNERS,
  NORTH,
  OAK,
  POOL,
  TRACK_LENGTH,
  TRACK_PATH,
  VIEW_H,
  VIEW_W,
  buildRun,
  pointAt,
  pointsToPath,
  runLabelAnchor,
  segmentsToPath,
  type LabelAnchor,
} from '../lib/yard-plan-geometry';

const INK = '#15211B';
const BOXWOOD = '#2E5A2C';
const NOON = '#F2B53A';

interface YardPlanProps {
  runFt: number;
  panelsAcross: number;
  /** The system's module note, drawn in the start corner ("20 in panels"). */
  moduleNote: string;
}

/** Eight short limbs from the trunk: the plan symbol for a canopy tree. */
const OAK_BRANCHES = Array.from({ length: 8 }, (_, i) => {
  const a = (Math.PI / 4) * i + Math.PI / 8;
  const r0 = 8;
  const r1 = i % 2 === 0 ? 30 : 22;
  const x0 = Math.round((OAK.cx + Math.cos(a) * r0) * 100) / 100;
  const y0 = Math.round((OAK.cy + Math.sin(a) * r0) * 100) / 100;
  const x1 = Math.round((OAK.cx + Math.cos(a) * r1) * 100) / 100;
  const y1 = Math.round((OAK.cy + Math.sin(a) * r1) * 100) / 100;
  return `M ${x0} ${y0} L ${x1} ${y1}`;
}).join(' ');

function place(anchor: LabelAnchor) {
  return { left: `${anchor.leftPct}%`, top: `${anchor.topPct}%` };
}

/** Everything on the plan that never changes: lot, live oak, pool, house, north arrow. */
const StaticYard = memo(function StaticYard() {
  const lotW = LOT.x1 - LOT.x0;
  const lotH = LOT.y1 - LOT.y0;
  return (
    <g fill="none" stroke={INK}>
      <rect x={LOT.x0} y={LOT.y0} width={lotW} height={lotH} fill="#FFFFFF" fillOpacity={0.32} stroke="none" />
      <rect
        x={LOT.x0}
        y={LOT.y0}
        width={lotW}
        height={lotH}
        strokeOpacity={0.45}
        strokeWidth={1}
        strokeDasharray="12 4 3 4"
        vectorEffect="non-scaling-stroke"
      />
      {LOT_CORNERS.map((c) => (
        <circle key={`${c.x}-${c.y}`} cx={c.x} cy={c.y} r={3.2} fill="#EDECE6" strokeOpacity={0.7} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ))}
      <circle
        cx={OAK.cx}
        cy={OAK.cy}
        r={OAK.r}
        fill={INK}
        fillOpacity={0.045}
        strokeOpacity={0.45}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <path d={OAK_BRANCHES} strokeOpacity={0.3} strokeWidth={1} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={OAK.cx} cy={OAK.cy} r={3} fill="#EDECE6" strokeOpacity={0.7} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <rect
        x={POOL.x}
        y={POOL.y}
        width={POOL.w}
        height={POOL.h}
        rx={POOL.r}
        fill={INK}
        fillOpacity={0.03}
        strokeOpacity={0.62}
        strokeWidth={1.25}
        vectorEffect="non-scaling-stroke"
      />
      <path d={segmentsToPath(HOUSE_HATCH)} strokeOpacity={0.24} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <path
        d={pointsToPath(HOUSE_OUTLINE, true)}
        strokeOpacity={0.82}
        strokeWidth={1.5}
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={NORTH.shaft.x1}
        y1={NORTH.shaft.y1}
        x2={NORTH.shaft.x2}
        y2={NORTH.shaft.y2}
        strokeOpacity={0.8}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <polygon points={NORTH.headFilled.map((p) => `${p.x},${p.y}`).join(' ')} fill={INK} fillOpacity={0.85} stroke="none" />
      <polyline
        points={NORTH.headOpen.map((p) => `${p.x},${p.y}`).join(' ')}
        strokeOpacity={0.85}
        strokeWidth={1}
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
});

/**
 * The estimator's yard plan, and the site's signature: the visitor's run draws
 * itself along the back property line.
 *
 * Markup is always the finished drawing for the current numbers, so the
 * prerendered page and the first paint show the 40 ft default complete. Only a
 * change the visitor makes animates: the line draws (stroke-dashoffset over
 * 600 ms), then the panel ticks land left to right inside 300 ms while the
 * run-length callout counts to the new value. Reduced motion and `?qa=1` get
 * the finished drawing instantly.
 */
export default function YardPlan({ runFt, panelsAcross, moduleNote }: YardPlanProps) {
  const run = useMemo(() => buildRun(runFt, panelsAcross), [runFt, panelsAcross]);

  const pathRef = useRef<SVGPathElement>(null);
  const ticksRef = useRef<SVGGElement>(null);
  const bandRef = useRef<SVGPathElement>(null);

  /** Mid-draw position of the line's tip and the callout's count; null at rest. */
  const [live, setLive] = useState<{ px: number; ft: number } | null>(null);

  const motion = useRef({
    line: null as Animation | null,
    ticks: [] as Animation[],
    raf: 0,
    shownPx: run.length,
    shownFt: runFt,
    last: { runFt, panelsAcross },
  });

  useLayoutEffect(() => {
    const m = motion.current;
    const prev = m.last;
    if (prev.runFt === runFt && prev.panelsAcross === panelsAcross) return;
    m.last = { runFt, panelsAcross };

    const path = pathRef.current;
    const tickGroup = ticksRef.current;
    const band = bandRef.current;

    m.ticks.forEach((a) => a.cancel());
    m.ticks = [];

    const hideLanding = (hidden: boolean) => {
      const value = hidden ? '0' : '';
      if (tickGroup) tickGroup.style.opacity = value;
      if (band) band.style.opacity = value;
    };

    const landTicks = () => {
      if (!tickGroup) return;
      hideLanding(false);
      const els = Array.from(tickGroup.children) as SVGElement[];
      const duration = 140;
      const span = Math.max(0, PLAN_TICKS_MS - duration);
      m.ticks = els.map((el, i) =>
        el.animate(
          [
            { transform: el.dataset.axis === 'x' ? 'scaleX(0)' : 'scaleY(0)', opacity: 0 },
            { transform: 'none', opacity: 1 },
          ],
          {
            duration,
            delay: els.length > 1 ? (i / (els.length - 1)) * span : 0,
            easing: PLAN_EASING,
            fill: 'backwards',
          },
        ),
      );
      if (band) {
        m.ticks.push(band.animate([{ opacity: 0 }, { opacity: 1 }], { duration: PLAN_TICKS_MS, easing: PLAN_EASING }));
      }
    };

    if (!motionAllowed() || !path || !tickGroup) {
      m.line?.cancel();
      m.line = null;
      cancelAnimationFrame(m.raf);
      m.shownPx = run.length;
      m.shownFt = runFt;
      hideLanding(false);
      setLive(null);
      return;
    }

    // A system change with the same run: the line stays put, the panels re-land.
    if (prev.runFt === runFt && !m.line) {
      landTicks();
      return;
    }

    // Start from wherever the tip is now: at rest, or mid-draw if the visitor
    // is still dragging.
    let fromPx = m.shownPx;
    if (m.line) {
      const offset = parseFloat(getComputedStyle(path).strokeDashoffset);
      if (Number.isFinite(offset)) fromPx = TRACK_LENGTH - offset;
      m.line.cancel();
    }
    const fromFt = m.shownFt;
    const toPx = run.length;
    const toFt = runFt;

    hideLanding(true);

    const line = path.animate(
      [{ strokeDashoffset: `${TRACK_LENGTH - fromPx}px` }, { strokeDashoffset: `${TRACK_LENGTH - toPx}px` }],
      { duration: PLAN_DRAW_MS, easing: PLAN_EASING },
    );
    m.line = line;
    line.onfinish = () => {
      if (m.line !== line) return;
      m.line = null;
      landTicks();
    };

    cancelAnimationFrame(m.raf);
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / PLAN_DRAW_MS);
      const eased = planEase(t);
      m.shownPx = fromPx + (toPx - fromPx) * eased;
      m.shownFt = fromFt + (toFt - fromFt) * eased;
      if (t < 1) {
        setLive({ px: m.shownPx, ft: m.shownFt });
        m.raf = requestAnimationFrame(step);
      } else {
        m.shownPx = toPx;
        m.shownFt = toFt;
        setLive(null);
      }
    };
    setLive({ px: fromPx, ft: fromFt });
    m.raf = requestAnimationFrame(step);
  }, [run, runFt, panelsAcross]);

  useEffect(() => {
    const m = motion.current;
    return () => {
      m.line?.cancel();
      m.ticks.forEach((a) => a.cancel());
      cancelAnimationFrame(m.raf);
    };
  }, []);

  const tipPx = live ? live.px : run.length;
  const tip = pointAt(tipPx).point;
  const runLabel = runLabelAnchor(tipPx);
  const labelFt = live ? Math.round(live.ft) : runFt;

  const ticks = useMemo(
    () =>
      run.ticks.map((t, i) => (
        <line
          key={i}
          className="plan-tick"
          data-axis={t.x1 === t.x2 ? 'y' : 'x'}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          vectorEffect="non-scaling-stroke"
        />
      )),
    [run.ticks],
  );

  return (
    <div className="plan">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" focusable="false">
        <StaticYard />
        <path
          ref={bandRef}
          d={pointsToPath(run.band)}
          fill="none"
          stroke={BOXWOOD}
          strokeOpacity={0.13}
          strokeWidth={9}
          strokeLinejoin="miter"
          strokeLinecap="butt"
        />
        <g ref={ticksRef} stroke={BOXWOOD} strokeWidth={1.25} strokeLinecap="butt">
          {ticks}
        </g>
        <path
          ref={pathRef}
          className="plan-run"
          d={TRACK_PATH}
          fill="none"
          stroke={BOXWOOD}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${TRACK_LENGTH} ${TRACK_LENGTH}`}
          strokeDashoffset={TRACK_LENGTH - run.length}
        />
        <circle className="plan-pin" cx={run.start.x} cy={run.start.y} r={5.5} fill={NOON} stroke={INK} />
        <circle className="plan-pin" cx={tip.x} cy={tip.y} r={5.5} fill={NOON} stroke={INK} />
      </svg>

      <span className="plan-label plan-run-label" data-side={runLabel.side} style={place(runLabel)} aria-hidden="true">
        {formatNumber(labelFt)} FT
      </span>
      <span className="plan-label" data-side="below" style={place(run.labels.module)} aria-hidden="true">
        {moduleNote}
        {run.tickStep > 1 ? (
          <>
            <br />
            <span className="mt-1.5 inline-block text-cedar">1 tick = {run.tickStep} panels</span>
          </>
        ) : null}
      </span>
      <span className="plan-label" data-side="above" style={place(NORTH.label)} aria-hidden="true">
        N
      </span>
    </div>
  );
}

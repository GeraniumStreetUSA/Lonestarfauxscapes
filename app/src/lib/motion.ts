/**
 * Motion gates. Content never waits on motion: everything renders in its
 * finished state, and motion is laid over it from effects only when allowed.
 *
 * Off when: the visitor prefers reduced motion, the page is in QA mode
 * (`?qa=1` sets data-qa-mode on <html> in index.html), the Web Animations API
 * is missing, or there is no window (prerender, tests).
 */

export const PLAN_EASING = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
export const PLAN_DRAW_MS = 600;
/** The whole tick stagger, first tick start to last tick end. */
export const PLAN_TICKS_MS = 300;

export function isQaMode(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.qaMode === '1';
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function motionAllowed(): boolean {
  if (typeof window === 'undefined' || typeof Element === 'undefined') return false;
  if (typeof Element.prototype.animate !== 'function') return false;
  return !isQaMode() && !prefersReducedMotion();
}

/**
 * cubic-bezier(x1, y1, x2, y2) as a function of progress, matching the CSS
 * timing function, so values counted in JS (the run-length callout) move in
 * step with the WAAPI line that uses the same curve.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const error = sampleX(t) - x;
      if (Math.abs(error) < 1e-6) return sampleY(t);
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= error / slope;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 40 && hi - lo > 1e-6; i += 1) {
      if (sampleX(t) < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
}

export const planEase = cubicBezier(0.2, 0.7, 0.2, 1);

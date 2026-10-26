import { motionAllowed } from './motion';

/**
 * Lenis smooth scrolling, desktop only: a fine pointer with hover, 1024 px
 * and up, motion allowed. Phones and touch keep native scrolling. Lenis is
 * imported on demand so it never weighs on first paint. In-page anchors
 * (#quote) glide through Lenis too.
 *
 * Returns a cleanup for the effect that starts it.
 */
export function startSmoothScroll(): () => void {
  if (!motionAllowed()) return () => {};
  if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches) return () => {};

  let stopped = false;
  let destroy = () => {};

  void import('lenis').then(({ default: Lenis }) => {
    if (stopped) return;
    const lenis = new Lenis({ duration: 1.05, anchors: { offset: 0 }, autoRaf: true });
    destroy = () => lenis.destroy();
  });

  return () => {
    stopped = true;
    destroy();
  };
}

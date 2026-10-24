import { motionAllowed, PLAN_EASING } from './motion';

/**
 * Quiet entrance for blocks below the fold. Fails open by design:
 *   - markup is never hidden; JS hides only blocks that start below the fold;
 *   - nothing is armed under reduced motion, QA mode or without WAAPI;
 *   - a deadline forces the final state if an animation stalls;
 *   - printing shows everything.
 */
export function armReveals(root: ParentNode = document): () => void {
  if (!motionAllowed() || typeof IntersectionObserver === 'undefined') return () => {};

  const fold = window.innerHeight;
  const armed = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
    (el) => el.getBoundingClientRect().top > fold,
  );
  if (armed.length === 0) return () => {};

  const show = (el: HTMLElement) => {
    el.style.opacity = '';
    el.style.transform = '';
  };

  armed.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
  });

  const timers = new Set<number>();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        const animation = el.animate(
          [
            { opacity: 0, transform: 'translateY(14px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 600, easing: PLAN_EASING },
        );
        show(el);
        const timer = window.setTimeout(() => {
          animation.finish();
          show(el);
        }, 1500);
        timers.add(timer);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  );
  armed.forEach((el) => io.observe(el));

  const showAll = () => armed.forEach(show);
  window.addEventListener('beforeprint', showAll);

  return () => {
    io.disconnect();
    timers.forEach((t) => window.clearTimeout(t));
    window.removeEventListener('beforeprint', showAll);
    showAll();
  };
}

import { motionAllowed, PLAN_EASING } from './motion';

/**
 * Smooth open and close for every <details> on the page (FAQ, footer
 * columns, the estimator's working). Without motion the browser's own
 * instant toggle is left alone. A click during a running animation snaps
 * that animation to its end first, so state never drifts from intent.
 */
export function armAccordions(root: HTMLElement = document.body): () => void {
  if (!motionAllowed()) return () => {};

  const settle = new WeakMap<HTMLDetailsElement, () => void>();

  const onClick = (event: MouseEvent) => {
    const summary = (event.target as Element | null)?.closest('summary');
    const details = summary?.parentElement;
    if (!summary || !(details instanceof HTMLDetailsElement)) return;
    event.preventDefault();
    settle.get(details)?.();

    const from = details.offsetHeight;
    details.open = !details.open;
    const to = details.offsetHeight;
    const opening = details.open;
    /* Closing: keep the content in place while the height runs down. */
    if (!opening) details.open = true;

    details.style.overflow = 'hidden';
    const run = details.animate({ height: [`${from}px`, `${to}px`] }, { duration: 380, easing: PLAN_EASING });
    if (opening) {
      Array.from(details.children)
        .filter((el) => el !== summary)
        .forEach((el) =>
          el.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], {
            duration: 360,
            delay: 80,
            easing: PLAN_EASING,
            fill: 'backwards',
          }),
        );
    }

    const done = () => {
      settle.delete(details);
      run.cancel();
      details.style.overflow = '';
      if (!opening) details.open = false;
    };
    settle.set(details, done);
    run.onfinish = done;
  };

  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}

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

/**
 * Section entrances, laid over the block reveal above. For anything that
 * starts below the fold: section headings rise out of a mask, callout
 * leaders draw out from their ring, and photos settle from a slight zoom.
 * Same fail-open rules: armed only when motion is allowed, released on view,
 * on print, and on cleanup.
 */
export function armSectionMotion(root: ParentNode = document): () => void {
  if (!motionAllowed() || typeof IntersectionObserver === 'undefined') return () => {};

  const fold = window.innerHeight;
  const below = (el: Element) => el.getBoundingClientRect().top > fold;
  const heads = Array.from(root.querySelectorAll<HTMLElement>('main h2')).filter(below);
  const marks = Array.from(root.querySelectorAll<HTMLElement>('main .callout-mark')).filter(below);
  const photos = Array.from(root.querySelectorAll<HTMLImageElement>('main .photo img')).filter(
    (img) => below(img) && !img.closest('.story-shot'),
  );

  /* Where each photo ends up: its own resting transform from the stylesheet. */
  const rest = new Map(photos.map((img) => [img, getComputedStyle(img).transform]));

  /* Held by opacity, not by the mask: an observer never sees a fully
     clipped element intersect. */
  heads.forEach((el) => {
    el.style.opacity = '0';
  });
  marks.forEach((el) => {
    el.dataset.draw = 'armed';
  });
  photos.forEach((img) => {
    img.style.transform = 'scale(1.1)';
  });

  const release = (el: Element) => {
    if (el instanceof HTMLImageElement) el.style.transform = '';
    else if (el instanceof HTMLElement) {
      el.style.opacity = '';
      delete el.dataset.draw;
    }
  };

  const play = (el: Element) => {
    if (el.tagName === 'H2') {
      el.animate(
        [
          { clipPath: 'inset(0 0 100% 0)', transform: 'translateY(0.45em)', opacity: 1 },
          { clipPath: 'inset(0 0 -0.3em 0)', transform: 'none', opacity: 1 },
        ],
        { duration: 820, delay: 90, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'backwards' },
      );
    } else if (el instanceof HTMLImageElement) {
      el.animate([{ transform: 'scale(1.1)' }, { transform: rest.get(el) ?? 'none' }], {
        duration: 1400,
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      });
    } else {
      el.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], {
        duration: 360,
        easing: 'cubic-bezier(0.2, 0.9, 0.2, 1.3)',
        pseudoElement: '::before',
        fill: 'backwards',
      });
      el.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
        duration: 520,
        delay: 160,
        easing: PLAN_EASING,
        pseudoElement: '::after',
        fill: 'backwards',
      });
    }
    release(el);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        play(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  );
  const all: Element[] = [...heads, ...marks, ...photos];
  all.forEach((el) => io.observe(el));

  const releaseAll = () => all.forEach(release);
  window.addEventListener('beforeprint', releaseAll);

  return () => {
    io.disconnect();
    window.removeEventListener('beforeprint', releaseAll);
    releaseAll();
  };
}

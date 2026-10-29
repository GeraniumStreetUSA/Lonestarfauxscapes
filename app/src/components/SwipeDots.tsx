import { useEffect, useState, type RefObject } from 'react';

/**
 * Position dots for a phone swipe row (a scroll-snap list): shows which card
 * is in view and jumps to a card on tap. Hidden by CSS wherever the list is
 * a plain grid (the `.swipe-dots` rule shares the list's breakpoint).
 */
export default function SwipeDots({
  target,
  count,
  label,
  className,
}: {
  target: RefObject<HTMLElement | null>;
  count: number;
  label: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const items = Array.from(el.children) as HTMLElement[];
      const left = el.scrollLeft + parseFloat(getComputedStyle(el).paddingLeft || '0');
      let best = 0;
      let bestDist = Infinity;
      items.forEach((item, i) => {
        const d = Math.abs(item.offsetLeft - left);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [target]);

  const go = (i: number) => {
    const el = target.current;
    const item = el?.children[i] as HTMLElement | undefined;
    if (!el || !item) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft || '0');
    el.scrollTo({ left: item.offsetLeft - pad, behavior: 'smooth' });
  };

  return (
    <div className={`swipe-dots ${className ?? ''}`}>
      <span className="swipe-count" aria-hidden="true">
        {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </span>
      <span className="swipe-dot-row">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            className="swipe-dot"
            data-on={i === active ? 'true' : undefined}
            aria-label={`${label} ${i + 1} of ${count}`}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => go(i)}
          />
        ))}
      </span>
    </div>
  );
}

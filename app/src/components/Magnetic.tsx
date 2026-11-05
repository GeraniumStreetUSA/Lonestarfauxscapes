import { useEffect, useRef, type ReactNode } from 'react';

import { motionAllowed } from '../lib/motion';

/**
 * Desktop only (hover + fine pointer): the child leans toward the cursor
 * when it comes within reach, then springs back. A wrapper span, so the
 * child's own hover styles and focus ring are untouched.
 */
export default function Magnetic({ children, reach = 90, pull = 0.28 }: { children: ReactNode; reach?: number; pull?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05) raf = requestAnimationFrame(tick);
      else {
        raf = 0;
        if (tx === 0 && ty === 0) el.style.transform = '';
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const near = Math.hypot(dx, dy) < reach + Math.max(rect.width, rect.height) / 2;
      tx = near ? dx * pull : 0;
      ty = near ? dy * pull : 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [reach, pull]);

  return (
    <span ref={ref} className="inline-flex will-change-transform">
      {children}
    </span>
  );
}

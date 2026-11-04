import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

interface FoldProps {
  /** The tap target on phones. Pass a heading to keep one for the outline. */
  summary: ReactNode;
  /** Tablets and desktop keep the summary as a plain, non-interactive heading; without it they hide the summary and show the content only. */
  showSummaryOnDesktop?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Content that folds on phones (up to 639 px) and is simply there everywhere
 * else: a `<details>` that ships open (so crawlers and desktop read it all)
 * and is closed after load on phones, the same pattern as `FaqList`. Use it
 * for a block that repeats elsewhere on the page, such as the 5-step process
 * or the list of what to send.
 */
export default function Fold({ summary, showSummaryOnDesktop = false, className, children }: FoldProps) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const phone = window.matchMedia('(max-width: 639px)');
    if (phone.matches) ref.current?.removeAttribute('open');
    /* Widening the window past phone size (a rotated tablet) shows the content again. */
    const widen = (event: MediaQueryListEvent) => {
      if (!event.matches) ref.current?.setAttribute('open', '');
    };
    phone.addEventListener('change', widen);
    return () => phone.removeEventListener('change', widen);
  }, []);

  return (
    <details
      ref={ref}
      className={clsx('pk-fold', className)}
      data-desktop-summary={showSummaryOnDesktop ? 'yes' : undefined}
      data-reveal
      open
    >
      <summary className="pk-fold-summary">
        {summary}
        <Plus size={18} strokeWidth={2.2} className="pk-fold-icon" aria-hidden="true" />
      </summary>
      <div className="pk-fold-body">{children}</div>
    </details>
  );
}

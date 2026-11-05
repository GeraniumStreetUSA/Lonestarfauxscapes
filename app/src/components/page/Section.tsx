import clsx from 'clsx';
import { useId, type ReactNode } from 'react';

import Callout from '../Callout';

export type Tone = 'caliche' | 'limestone' | 'ink';

interface SectionProps {
  /** The anchor a table of contents links to. */
  id?: string;
  callout?: string;
  /** The H2. Without one, the section has no head. */
  title?: string;
  intro?: ReactNode;
  /** Caliche is the page ground; limestone is one step darker; ink is the dark chapter (use once a page). */
  tone?: Tone;
  className?: string;
  children?: ReactNode;
}

/**
 * One chapter of a page: callout, H2 and intro on top (revealed as the
 * homepage's heads are), then whatever the page puts in it. The ink tone sets
 * `on-ink`, so callouts, links and the focus ring switch to the dark palette.
 */
export default function Section({ id, callout, title, intro, tone = 'caliche', className, children }: SectionProps) {
  const titleId = useId();
  return (
    <section
      id={id}
      aria-labelledby={title ? titleId : undefined}
      className={clsx(
        'section',
        tone === 'limestone' && 'bg-limestone pk-limestone',
        tone === 'ink' && 'on-ink bg-ink text-caliche',
        className,
      )}
    >
      <div className="wrap">
        {title ? (
          <header className="pk-section-head" data-reveal>
            {callout ? <Callout text={callout} /> : null}
            <h2 id={titleId} className={clsx('t-h2 pk-section-title', callout && 'mt-5')}>
              {title}
            </h2>
            {intro ? <div className="t-lede pk-section-intro">{intro}</div> : null}
          </header>
        ) : null}
        {children}
      </div>
    </section>
  );
}

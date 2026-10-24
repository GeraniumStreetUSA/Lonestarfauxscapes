import clsx from 'clsx';

interface CalloutProps {
  /** Copy as written in the deck. A leading "◦ " is drawn as the callout's ring and leader. */
  text: string;
  as?: 'p' | 'span' | 'figcaption';
  className?: string;
  id?: string;
}

/**
 * The eyebrow system: a mono plan callout with its point and a short leader.
 * Every callout carries information (a step, a topic, a place); none are
 * decoration. The "◦" from the copy stays in the DOM but is drawn, because
 * neither webfont carries the glyph.
 */
export default function Callout({ text, as: Tag = 'p', className, id }: CalloutProps) {
  const hasGlyph = text.startsWith('◦');
  const body = hasGlyph ? text.replace(/^◦\s*/, '') : text;
  return (
    <Tag className={clsx('callout', className)} id={id}>
      <span className="callout-mark" aria-hidden="true">
        {hasGlyph ? '◦ ' : ''}
      </span>
      {body}
    </Tag>
  );
}

import clsx from 'clsx';

export interface Fact {
  label: string;
  value: string;
}

/**
 * Label and value pairs as a drafting-sheet strip: a heavy rule on top, mono
 * labels, a hairline under each cell. Two columns on phones, four from 640 px,
 * for any number of pairs.
 */
export default function FactRows({ items, className }: { items: readonly Fact[]; className?: string }) {
  return (
    <dl className={clsx('pk-facts', className)}>
      {items.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Names and parents only, so a metro page can link to the others without
 * loading their copy. `index.ts` holds the full data.
 */
export interface AreaRef {
  slug: string;
  name: string;
  /** Suburbs: the metro's slug. */
  parent?: string;
}

export const METRO_REFS: readonly AreaRef[] = [
  { slug: 'dallas', name: 'Dallas' },
  { slug: 'fort-worth', name: 'Fort Worth' },
  { slug: 'houston', name: 'Houston' },
  { slug: 'austin', name: 'Austin' },
  { slug: 'san-antonio', name: 'San Antonio' },
];

export const SUBURB_REFS: readonly AreaRef[] = [
  { slug: 'plano', name: 'Plano', parent: 'dallas' },
  { slug: 'frisco', name: 'Frisco', parent: 'dallas' },
  { slug: 'irving', name: 'Irving', parent: 'dallas' },
  { slug: 'arlington', name: 'Arlington', parent: 'fort-worth' },
  { slug: 'sugar-land', name: 'Sugar Land', parent: 'houston' },
  { slug: 'the-woodlands', name: 'The Woodlands', parent: 'houston' },
];

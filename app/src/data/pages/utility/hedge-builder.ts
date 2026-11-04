/**
 * /hedge-builder-residential and /hedge-builder-commercial. Both post the
 * same fields to /hedge-quote (functions/hedge-quote.js), so the option
 * values below are the live forms' own and must not change. No prices.
 */

export interface Choice {
  value: string;
  label: string;
}

export const HEIGHTS: readonly Choice[] = [
  { value: '4ft', label: '4 ft' },
  { value: '6ft', label: '6 ft' },
  { value: '8ft', label: '8 ft' },
  { value: 'custom', label: 'Custom' },
];

export const LENGTHS: readonly Choice[] = [
  { value: '4ft', label: '4 ft' },
  { value: '5ft', label: '5 ft' },
  { value: '6ft', label: '6 ft' },
  { value: 'custom', label: 'Custom' },
];

export const DEPTHS: readonly Choice[] = [
  { value: '19in', label: '19 in' },
  { value: '23in', label: '23 in' },
  { value: '27in', label: '27 in' },
  { value: 'custom', label: 'Custom' },
];

export const MATERIALS: readonly Choice[] = [
  { value: 'boxwood', label: 'Boxwood' },
  { value: 'ficus', label: 'Ficus' },
  { value: 'fern', label: 'Fern' },
  { value: 'living_wall', label: 'Living wall' },
];

export const INSTALL_TYPES: readonly Choice[] = [
  { value: 'free', label: 'Free standing' },
  { value: 'permanent', label: 'Permanent' },
];

export const YES_NO: readonly Choice[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const BASE_MATERIALS: readonly Choice[] = [
  { value: 'composite_wood', label: 'Composite wood' },
  { value: 'powder_coated', label: 'Powder coated metal' },
  { value: 'custom', label: 'Custom' },
];

export const COMPOSITE_HEIGHTS: readonly Choice[] = [
  { value: '5.5in', label: '5.5 in' },
  { value: '11in', label: '11 in' },
  { value: '16.5in', label: '16.5 in' },
];

export const COMPOSITE_COLORS: readonly Choice[] = [
  { value: 'brown', label: 'Brown' },
  { value: 'grey', label: 'Grey' },
  { value: 'tan', label: 'Tan' },
];

export const CASTERS: readonly Choice[] = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
];

/** The option the live form had selected first; the page starts there. */
export const DEFAULTS = {
  heightOption: '4ft',
  lengthOption: '4ft',
  depthOption: '19in',
  hedgeMaterial: 'boxwood',
  installType: 'free',
  basePresence: 'yes',
  baseMaterial: 'composite_wood',
  compositeBaseHeight: '5.5in',
  compositeBaseColor: 'brown',
  casters: 'no',
} as const;

export interface HedgeBuilderCopy {
  title: string;
  lede: string;
  formTitle: string;
  formIntro: string;
  /** The other builder, for the visitor who landed on the wrong one. */
  other: { text: string; label: string; href: string };
}

export const HEDGE_BUILDERS = {
  residential: {
    title: 'Build a residential hedge that fits your space.',
    lede: 'Pick the size, material and base. We reply with a quote, and a render when it helps.',
    formTitle: 'Tell us what to build.',
    formIntro: 'Heights, bases and materials, the details an HOA request usually needs. Skip anything you are unsure of.',
    other: { text: 'Planning for a business?', label: 'Use the commercial builder', href: '/hedge-builder-commercial' },
  },
  commercial: {
    title: 'Build a commercial hedge to your project specs.',
    lede: 'Pick the size, material and base. We reply with a quote, and a render when it helps.',
    formTitle: 'Tell us what to build.',
    formIntro: 'Capture the dimensions, materials and base your project calls for. Skip anything still open.',
    other: { text: 'Building for a home?', label: 'Use the residential builder', href: '/hedge-builder-residential' },
  },
} as const satisfies Record<'residential' | 'commercial', HedgeBuilderCopy>;

export type HedgeBuilderKind = keyof typeof HEDGE_BUILDERS;

/** What happens after the form posts: the owner's process. */
export const HEDGE_NEXT = [
  'We read your specs.',
  'You get an email assessment and a rough quote, with a 3D render when it helps.',
  'A site review sets the final invoice.',
] as const;

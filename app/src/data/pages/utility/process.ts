/**
 * The owner's five steps (2026-10-28), worded for the pricing and
 * installation pages. No timelines. The homepage keeps its own wording in
 * home-content.ts; the steps are the same.
 */
export const PROCESS_STEPS = [
  {
    title: 'Send your numbers',
    text: 'Run length, height, city and photos if you have them. Use the form on this site, or call.',
  },
  {
    title: 'Rough quote',
    text: 'We email an assessment and a rough quote, with a 3D render of your space when it helps you decide.',
  },
  {
    title: 'Site review',
    text: 'We confirm measurements, mounting and access on site. The review sets the final invoice.',
  },
  { title: 'Build', text: 'Panels are cut and staged to your layout.' },
  { title: 'Install', text: 'The run is mounted to your fence, frame or wall.' },
] as const;

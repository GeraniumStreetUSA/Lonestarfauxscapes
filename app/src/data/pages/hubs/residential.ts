import { PROCESS } from '../../home-content.ts';
import { PROJECTS } from '../../projects.ts';
import type { HubData } from './types.ts';

const austin = PROJECTS.find((p) => p.city === 'Austin');

/** /residential: homes. Ends in the quote form. */
export const RESIDENTIAL_HUB: HubData = {
  callout: '◦ FOR HOMES',
  title: 'Residential privacy hedges and living walls in Texas',
  lede: 'Hedges, fence extensions and living walls for backyards, pools and patios. Built to your measurements, with no watering and no trimming.',
  hero: {
    name: 'austin-after',
    alt: 'Tall artificial boxwood privacy wall behind live oaks in an Austin backyard',
  },
  sections: [
    {
      kind: 'points',
      id: 'fix',
      callout: '◦ WHAT WE FIX AT HOME',
      title: 'What we fix at home.',
      terse: true,
      items: [
        {
          title: 'Backyard privacy',
          text: 'A hedge screen is full the day it goes up. There is no grow time, no watering and no trimming.',
          links: [{ label: 'Artificial hedges', href: '/artificial-hedge' }],
        },
        {
          title: 'More fence height',
          text: 'A fence extension adds height above the fence you already have. Panels are built to your measurements, corners and returns included.',
          links: [{ label: 'Fence extensions', href: '/fence-extensions' }],
        },
        {
          title: 'Pool and patio edges',
          text: 'Screen the view from next door with a hedge along the fence or a freestanding privacy wall.',
          links: [
            { label: 'Pool privacy hedges', href: '/pool-privacy-hedge' },
            { label: 'Privacy walls', href: '/privacy-wall' },
          ],
        },
        {
          title: 'HOA rules',
          text: 'Many HOAs review fence and landscaping changes. We can supply specs and photos for your request, but we cannot promise approval.',
          links: [{ label: 'HOA-friendly hedges', href: '/hoa-approved-artificial-hedge' }],
        },
      ],
    },
    {
      kind: 'pair',
      id: 'difference',
      callout: '◦ BEFORE AND AFTER',
      title: 'See the difference.',
      tone: 'limestone',
      intro: 'A real Austin backyard: a 16 ft wire mesh screen with a failing live planting, then the same screen covered in boxwood panels.',
      items: [
        { image: { name: 'austin-before', alt: 'Bare 16 ft wire mesh privacy screen behind young trees in an Austin backyard, before the install' }, label: 'Before' },
        { image: { name: 'austin-after', alt: 'Tall artificial boxwood privacy wall behind live oaks in an Austin backyard' }, label: 'After' },
      ],
      link: austin ? { label: 'Read the Austin case study', href: austin.path } : undefined,
    },
    {
      kind: 'systems',
      id: 'systems',
      callout: '◦ RESIDENTIAL SYSTEMS',
      title: 'Residential systems we install.',
      intro: 'Mix them to fit your yard, your patio or your HOA rules. Installation is quoted after a site review.',
      ids: ['hedge', 'fence-extension', 'living-wall', 'privacy-wall'],
      terse: true,
    },
    {
      kind: 'prose',
      id: 'fire',
      callout: '◦ FIRE',
      title: 'Fire-safe options for homes and HOAs.',
      tone: 'limestone',
      paragraphs: [
        'Most homes do not need fire-rated foliage. Attached homes, shared walls and some HOAs ask for it.',
        'Fire-rated hedge options are built for NFPA 701. Ask for the NFPA 701 documentation for the exact system you choose.',
      ],
      links: [{ label: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge' }],
    },
    {
      kind: 'points',
      id: 'process',
      fold: 'How a job runs, in 5 steps',
      callout: '◦ HOW IT WORKS',
      title: 'How a residential project works.',
      tone: 'ink',
      items: PROCESS.steps.map((step) => ({ title: step.title, text: step.body })),
    },
    {
      kind: 'faq',
      id: 'faq',
      title: 'Residential questions.',
      items: [
        {
          question: 'Will this pass my HOA?',
          answer:
            'We cannot promise approval. Many Texas HOAs review fence and landscaping changes, so read your HOA rules and submit product specs and photos with your request. We can supply both.',
        },
        {
          question: 'Can you add height to my fence?',
          answer:
            'Yes. A fence extension puts hedge panels on a frame above the fence you have, built to your measurements. The site review confirms what your fence can carry.',
        },
        {
          question: 'Does a hedge need watering or trimming?',
          answer: 'No watering and no trimming. Rinse off dust and pollen now and then.',
        },
        {
          question: 'Is a residential hedge fire-rated?',
          answer:
            'Fire-rated options are built for NFPA 701. Ask for the NFPA 701 documentation for the exact system you choose. Most homes do not need it, but attached homes and some HOAs do.',
        },
        {
          question: 'Which system fits my yard?',
          answer:
            'A hedge screen covers a fence line or a patio edge. A fence extension adds height above the fence you have. A living wall covers a blank wall, and a privacy wall stands on its own base. Send your numbers and a photo, and we suggest one in the assessment.',
        },
        {
          question: 'How long does installation take?',
          answer:
            'It depends on run length, mounting and site access. Ask when you send your numbers. The site review confirms the plan and sets the final invoice.',
        },
      ],
    },
    {
      kind: 'links',
      id: 'guides',
      callout: '◦ KEEP READING',
      title: 'Guides for homeowners.',
      tone: 'limestone',
      columns: 2,
      items: [
        { title: 'HOA approval in Texas', href: '/blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas', text: 'What to submit, and what to expect.' },
        { title: 'Texas Property Code 202.007 and HOA rules', href: '/blog/texas-property-code-202-007-artificial-hedges-and-hoa-rules', text: 'How deed restrictions apply to a hedge.' },
        { title: 'Hedge care for Texas homeowners', href: '/blog/artificial-hedge-maintenance-and-care-for-texas-homeowners', text: 'Rinsing and routine care.' },
        { title: 'Pricing', href: '/pricing', text: 'Starting prices, and what changes the cost.' },
      ],
    },
  ],
  close: { kind: 'form' },
};

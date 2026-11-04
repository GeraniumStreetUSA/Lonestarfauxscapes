/**
 * /hoa-approved-artificial-hedge. Specs and photos for your request, Texas
 * Property Code Chapter 202 as on the homepage, and never a promise of
 * approval. Dropped: "95% HOA-safe", "most HOAs approve", the 5 to 10 year
 * lifespan, warranty information, the SB 1588 security-fencing paragraph, the
 * 30 to 60 day review time, "premium" and "indistinguishable from natural".
 */

import { GUIDES, PAGES } from './shared.ts';
import type { SystemPageData } from './types.ts';

export const HOA_APPROVED_ARTIFICIAL_HEDGE: SystemPageData = {
  variant: 'usecase',
  hero: {
    callout: '◦ HOA / TEXAS',
    title: 'HOA-Friendly Artificial Hedges in Texas',
    lede: 'Your HOA decides. We send the specs and photos your request needs, for a hedge that does not brown, overgrow or need watering.',
    price: 'hedge',
    image: {
      name: 'sys-hedge-path',
      alt: 'Artificial hedge panels along a residential walkway',
    },
    facts: [
      { label: 'Rules', value: "Your HOA's rules" },
      { label: 'Law', value: 'Property Code ch. 202' },
      { label: 'You send', value: 'Specs and photos' },
      { label: 'Approval', value: 'Your HOA decides' },
    ],
  },
  blocks: [
    {
      kind: 'text',
      id: 'problem',
      callout: '◦ THE PROBLEM',
      title: 'Many HOAs review changes to fences and landscaping.',
      paragraphs: [
        'Texas Property Code Chapter 202 governs how HOA deed restrictions are enforced, but it does not promise approval of any hedge. Your HOA still reviews the request under its own rules.',
        'Read those rules first. Then submit specs and photos with your request, and wait for a written answer before you order.',
      ],
      links: [GUIDES.hoaApproval, GUIDES.hoaLaw],
    },
    {
      kind: 'points',
      id: 'how-to',
      callout: '◦ THE REQUEST',
      title: 'How to get an artificial hedge approved by your HOA.',
      tone: 'limestone',
      items: [
        {
          title: "Read your HOA's rules",
          text: 'Look in the covenants for fence height, materials and landscaping. Note anything that mentions artificial plants.',
        },
        {
          title: 'Gather the specs and photos',
          text: 'Product specs, photos of where the hedge will stand and photos of finished jobs. We send specs and photos for your request, and a 3D render of your space when it helps.',
        },
        {
          title: 'Submit and wait for the answer',
          text: 'Send the request with the height, the placement and the specs. Wait for a written answer before you order.',
        },
        {
          title: 'If it is denied',
          text: "Ask for the reasons in writing. A different height, color or placement may fit the rules, and we can send what the HOA asks for. For legal questions, talk to a Texas real estate attorney.",
        },
      ],
    },
    {
      kind: 'text',
      id: 'worries',
      callout: '◦ WHAT BOARDS WORRY ABOUT',
      title: 'What a hedge answers, and what it does not.',
      paragraphs: ['A hedge answers several common objections to live landscaping. Whether it answers yours is the board\'s call.'],
      list: [
        'Brown patches: the foliage does not die back. It does need the right UV rating for the sun it gets.',
        'Overgrowth: panels do not grow past the line or over a neighbor\'s fence.',
        'Water: no irrigation, so no overspray or runoff.',
        'Uniform look: color and density are the same along the whole run.',
      ],
    },
  ],
  faq: {
    items: [
      {
        question: 'Will my HOA approve an artificial hedge?',
        answer:
          "We cannot promise approval. Check your HOA's rules and submit product specs and photos with your request.",
      },
      {
        question: 'What does Texas Property Code Chapter 202 do?',
        answer:
          "It governs how HOA deed restrictions are enforced. It does not promise approval of an artificial hedge, and your HOA's own rules and review still apply.",
      },
      {
        question: 'What should I send my HOA?',
        answer:
          'The request form, the height and placement, product specs and photos. We send specs and photos for your request, and a 3D render of your space when it helps.',
      },
      {
        question: 'How tall can the hedge be?',
        answer:
          "Your HOA's rules and your city set the limit. Tell us the limit and we plan to it. Our priced size is 6 ft tall, and other heights go in your rough quote.",
      },
      {
        question: 'How long does approval take?',
        answer:
          "That depends on your HOA's review schedule. Check the covenants, and apply before you plan to order.",
      },
    ],
  },
  links: {
    related: [PAGES.hedge, PAGES.fenceExtension, PAGES.boxwood, PAGES.poolPrivacy, PAGES.privacyWall],
    guides: [GUIDES.hoaApproval, GUIDES.hoaLaw, GUIDES.hedgeGuide],
  },
};

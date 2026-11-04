import { BUSINESS } from '../../site.ts';
import { PROCESS } from '../../home-content.ts';
import { FR_STATEMENT } from '../../starting-prices.ts';
import type { HubData } from './types.ts';

/** /commercial-resources: the buyer-type guidance, without the internal notes. */
export const COMMERCIAL_RESOURCES_HUB: HubData = {
  callout: '◦ COMMERCIAL RESOURCES',
  title: 'Resources for architects, designers, GCs and property teams',
  lede: 'Planning a Texas living wall, hedge screen, branded feature wall or privacy install? This page covers what to send, what each buyer usually asks, and how fire documentation works.',
  sections: [
    {
      kind: 'points',
      id: 'first-send',
      callout: '◦ BEST FIRST SEND',
      title: 'What to send first.',
      intro: 'Rough dimensions, drawings or photos are usually enough to point you to the right system.',
      tone: 'limestone',
      items: [
        { title: 'Dimensions or drawings', text: 'Rough dimensions, plans or elevation drawings.' },
        { title: 'City and project type', text: 'The city, and whether it is a hedge screen, a living wall, a branded wall or a privacy install.' },
        { title: 'Fire documentation', text: 'Whether fire documentation, an AHJ review or a GC portal is part of the job.' },
        {
          title: 'Photos',
          text: 'Photos of the wall, fence, facade or mounting surface, if you have them.',
          links: [{ label: 'Email plans and photos', href: BUSINESS.emailHref }],
        },
      ],
    },
    {
      kind: 'points',
      id: 'buyers',
      callout: '◦ WHO THIS HELPS',
      title: 'Different buyers need different answers.',
      items: [
        {
          title: 'Architects',
          text: 'Sort fire-rated options, indoor and exterior fit, and wall build-up questions before they turn into rework.',
          links: [
            { label: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge' },
            { label: 'Commercial walls', href: '/commercial-wall' },
          ],
        },
        {
          title: 'Designers',
          text: 'Tell us if the design has a branded wall, mixed foliage or a feature wall. We say what is realistic.',
          links: [
            { label: 'Living walls', href: '/living-wall' },
            { label: 'Vallum FRX', href: '/vallum-frx' },
          ],
        },
        {
          title: 'General contractors',
          text: 'Share the mounting surface, access, corners and service paths early, so panel breaks and sequencing are planned with the other trades.',
          links: [
            { label: 'Installation', href: '/installation' },
            { label: 'Ask for support', href: '/contact' },
          ],
        },
        {
          title: 'Property teams',
          text: 'Privacy, low maintenance, service access, and work planned around occupied spaces.',
          links: [
            { label: 'Commercial projects', href: '/commercial' },
            { label: 'Recent work', href: '/case-studies' },
          ],
        },
      ],
    },
    {
      kind: 'points',
      id: 'planning',
      callout: '◦ PLANNING NOTES',
      title: 'What to settle early.',
      tone: 'ink',
      items: [
        {
          title: 'Fire-rated options',
          text: FR_STATEMENT,
          links: [
            { label: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge' },
            { label: 'Vallum FRX', href: '/vallum-frx' },
          ],
        },
        {
          title: 'Documentation',
          text: 'Documentation is request-based, so you get the paperwork that matches the system being considered. Tell us what your AHJ or GC asks for.',
        },
        {
          title: 'Mounting and framing',
          text: 'Walls, facades and fences each mount differently. Raise substrates, corners, access and removable sections early.',
          links: [{ label: 'Commercial walls', href: '/commercial-wall' }],
        },
        {
          title: 'Sequencing',
          text: 'Occupied spaces, tenant traffic and service paths belong in the first request, so install planning matches the site.',
        },
        {
          title: 'Branding',
          text: 'If a logo or a mixed foliage layout is part of the wall, say so in the request. We say what is realistic.',
        },
      ],
    },
    {
      kind: 'points',
      id: 'request',
      fold: 'How a job runs, in 5 steps',
      callout: '◦ REQUEST WORKFLOW',
      title: 'How a request moves.',
      items: PROCESS.steps.map((step) => ({ title: step.title, text: step.body })),
    },
  ],
  close: {
    kind: 'band',
    title: 'Start with the clearest next step.',
    text: 'You do not need a perfect bid package. Send the basics and we say whether the next move is a rough quote, fire documentation or a coordination call.',
  },
};

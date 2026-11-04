/**
 * Copy for /pricing. Dollar figures never appear here: the page renders the
 * released starting prices through the helpers in src/data/starting-prices.ts.
 */

export const PRICING_PAGE = {
  callout: '◦ PRICING',
  title: 'Real starting prices for artificial hedges and living walls',
  lede: 'Four systems have a starting price. Installation is extra and is quoted after a site review.',
  prices: {
    id: 'starting-prices',
    callout: '◦ STARTING PRICES',
    title: 'What each system starts at.',
    intro: 'Each figure is the starting point for the configuration shown. Your final invoice is set at the site review.',
    /** The commercial wall has no released price. */
    commercial: {
      title: 'Commercial wall',
      href: '/commercial-wall',
      text: 'Code requirements, access, branding, framing and documentation matter more than a square-foot guess.',
    },
  },
  drivers: {
    callout: '◦ COST DRIVERS',
    title: 'What changes the number.',
    items: [
      {
        title: 'Size and height',
        text: 'Longer runs and taller panels use more material and often need more structure.',
      },
      {
        title: 'Mounting surface',
        text: 'A clean wall, an existing fence, masonry or a custom frame all install differently.',
      },
      {
        title: 'Custom fabrication',
        text: 'Corners, stepped lines, hidden seams, trims and logo work add shop time.',
      },
      {
        title: 'Fence condition and sightlines',
        text: 'For a fence extension or a pool screen, the state of the fence, the height you add and how the panels attach can change the scope fast.',
      },
      {
        title: 'Fire-rated and commercial requirements',
        text: 'Fire-rated options are built for NFPA 701. Ask for the NFPA 701 documentation for the exact system. Paperwork and coordination can change the scope.',
      },
    ],
  },
  process: {
    callout: '◦ HOW A QUOTE IS BUILT',
    title: 'Five steps from numbers to invoice.',
    intro: 'Every job runs the same way. The rough quote comes first. A site review sets the final invoice.',
  },
  send: {
    callout: '◦ WHAT TO SEND',
    title: 'Send what you have.',
    intro: 'Missing a number? Send what you have and a photo.',
    facts: [
      { label: 'Size', value: 'Run and height' },
      { label: 'Photos', value: 'Wide and close up' },
      { label: 'Surface', value: 'Fence, wall or mesh' },
      { label: 'City', value: 'Where it goes' },
    ],
  },
} as const;

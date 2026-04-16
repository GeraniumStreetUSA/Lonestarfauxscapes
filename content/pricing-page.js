export const pricingPageConfig = {
  meta: {
    title: 'Artificial Hedge & Living Wall Pricing Texas | Lone Star',
    description:
      'Starting prices for artificial hedges (10×6 ft) and living walls (10×10 ft) in Texas, plus what changes cost on custom projects. Free quote.',
    canonical: '/pricing',
    robots: 'index, follow',
    socialImage: '/images/hero/hero-main-1200w.jpg',
    updated: '2026-03-05',
  },
  hero: {
    eyebrow: 'Texas pricing',
    title: 'Real starting prices for artificial hedges and living walls',
    description:
      'This is the fast version. Start with two common project examples, see what moves the number, and send dimensions and photos for a tighter quote.',
    trustPoints: [
      'Artificial hedge example from $2,500+ installed',
      'Artificial living wall example from $2,500+ installed',
      'Residential, commercial, and fire-rated options',
      'Installed across Texas',
    ],
    steps: [
      'Match your project to the closest example below.',
      'Check the few things that move price the most.',
      'Send dimensions, photos, and your city for a tighter number.',
    ],
    primaryCta: { label: 'Get a Ballpark Quote', href: '/contact' },
    secondaryCta: { label: 'Call (760) 978-7335', href: 'tel:+17609787335' },
  },
  snapshots: {
    title: 'Two common starting points',
    description:
      'If your project is close to one of these, use it as your first planning number.',
    items: [
      {
        eyebrow: 'Privacy hedge example',
        title: 'Artificial hedge',
        dimensions: '10 ft long x 6 ft tall x about 1 ft deep',
        price: '$2,500+ installed',
        summary:
          'A strong starting point for backyard privacy, pool screening, fence-line cover, and equipment screens.',
        bullets: [
          'Good fit when you want privacy without watering or trimming.',
          'Price usually moves with height, mounting surface, and upgrades.',
        ],
        href: '/artificial-hedge',
        hrefLabel: 'View artificial hedge service',
      },
      {
        eyebrow: 'Feature wall example',
        title: 'Artificial living wall',
        dimensions: '10 ft x 10 ft wall',
        price: '$2,500+ installed',
        summary:
          'A clean starting point for lobbies, patios, amenity spaces, branded walls, and statement backdrops.',
        bullets: [
          'Good fit when you want a finished green-wall look without irrigation.',
          'Price usually moves with framing, hidden seams, logos, and fire-rated materials.',
        ],
        href: '/living-wall',
        hrefLabel: 'View living wall service',
      },
    ],
  },
  customProjects: {
    title: 'Projects we still custom-quote',
    description:
      'Some categories swing too much for a useful public number. We would rather give you a tighter quote than a fake range.',
    items: [
      {
        title: 'Fence extensions',
        text: 'Existing fence condition, added height, and attachment method can change the scope fast.',
        href: '/fence-extensions',
      },
      {
        title: 'Commercial feature walls',
        text: 'Code requirements, access, branding, framing, and documentation matter more than a simple square-foot guess.',
        href: '/commercial-wall',
      },
      {
        title: 'Pool privacy screens',
        text: 'Sightlines, final height, and how the screen attaches usually determine the real number.',
        href: '/pool-privacy-hedge',
      },
    ],
  },
  drivers: {
    title: 'What changes the number',
    items: [
      {
        title: 'Size and height',
        text: 'Longer runs and taller panels use more material and often need more structure.',
      },
      {
        title: 'Mounting surface',
        text: 'A clean wall, an existing fence, masonry, or a custom frame all install differently.',
      },
      {
        title: 'Custom fabrication',
        text: 'Corners, stepped lines, hidden seams, trims, and logo work add shop time.',
      },
      {
        title: 'Fire-rated and commercial requirements',
        text: 'NFPA options, submittals, and coordination can materially change the scope.',
      },
    ],
  },
  quoteKit: {
    title: 'How to get a useful ballpark fast',
    description:
      'Most people do not need a long call to get started. If you send the basics below, we can usually give you a much more useful next number.',
    includedTitle: 'What is usually included',
    includedItems: [
      'Consultation and scope review',
      'Measured proposal with materials and layout direction',
      'Fabrication and installation planning when needed',
      'On-site install and cleanup',
    ],
    sendTitle: 'What to send us',
    sendItems: [
      'Width or linear footage',
      'Target height',
      'A few wide and close-up photos',
      'Your city and target timeline',
    ],
  },
  links: {
    title: 'Popular next pages',
    items: [
      { label: 'Artificial Hedge', href: '/artificial-hedge' },
      { label: 'Living Wall', href: '/living-wall' },
      { label: 'Commercial Wall', href: '/commercial-wall' },
      { label: 'Dallas', href: '/dallas' },
      { label: 'Houston', href: '/houston' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  cta: {
    title: 'Need a tighter number for your project?',
    description:
      'Send the dimensions, height, photos, and city. We will tell you the clearest next step and a better planning number from there.',
    primary: { label: 'Request Pricing', href: '/contact' },
    secondary: { label: 'Call (760) 978-7335', href: 'tel:+17609787335' },
    asideTitle: 'Fastest way to get a useful reply',
    asideText:
      'Include dimensions, photos, the mounting surface, your city, and when you want the project done.',
  },
};

export default pricingPageConfig;

/**
 * Homepage copy, verbatim from the Phase 2 copy deck
 * (tasks/phase2-homepage-brief.md). Do not add facts, numbers, timelines,
 * ratings, warranties or prices here; ask the owner first (OWNER-NEEDS.md).
 * `tests/copy.test.ts` scans this file and every component for em-dashes,
 * dollar figures and banned words.
 */

export const SEO = {
  title: 'Artificial Hedges & Living Walls in Texas | Lone Star Faux Scapes',
  description:
    'Artificial hedges, living walls and fence extensions built to your run. Serving Dallas, Fort Worth, Houston, Austin and San Antonio. Free quote.',
  canonical: 'https://lonestarfauxscapes.com/',
} as const;

export const HERO = {
  /** The H1 in three phrases: three lines on phones and tablets, two on desktop. */
  titlePhrases: ['Artificial hedges', 'and living walls,', 'installed in Texas.'],
  sub: 'Privacy from the second-story window next door. Green on the bare fence. No watering, no trimming.',
  cta: 'Get a free quote',
  phoneLead: 'or call',
  trust: 'A Geranium Street USA brand. Serving Dallas, Fort Worth, Houston, Austin and San Antonio.',
  fork: [
    { label: 'For homes', href: '/residential' },
    { label: 'For businesses', href: '/commercial' },
  ],
  photoCaption: 'Boxwood privacy wall, Austin',
  photoAlt: 'Tall artificial boxwood privacy wall behind live oaks in an Austin backyard',
} as const;

export const ESTIMATOR = {
  callout: '◦ STEP 1 OF 2: MEASURE YOUR RUN',
  title: 'How long is the line you want green?',
  body: 'Pick a system and set the run. We draw it, count the panels and send the numbers with your quote. No prices here: every quote follows a site review.',
  /** Fieldset legend. Not in the deck: reuses the deck's quote-form field name. */
  systemLegend: 'System',
  runLabel: 'Run length (ft)',
  heightLabel: 'Height (ft)',
  locationLabel: 'City or ZIP',
  qualifier: 'Dimensions only, not a quote. Final panel layout is set at the site review.',
  send: 'Send these numbers to my quote',
} as const;

export const LINK_BAND = {
  systemsLabel: 'Systems',
  areasLabel: 'Areas',
} as const;

export interface Question {
  question: string;
  answer: string;
  link: { label: string; href: string };
}

export const QUESTIONS = {
  title: 'Four things everyone asks first.',
  items: [
    {
      question: 'Will it look fake?',
      answer:
        'Leaf density and seams are what give artificial greenery away. Look at both up close, on real Texas jobs, before you decide.',
      link: { label: 'See Texas jobs', href: '#projects' },
    },
    {
      question: 'Will Texas sun wear it out?',
      answer:
        "UV-rated hedge and wall options are made for outdoor sun. Indoor-grade foliage is not, and it can fade faster outside. Match the rating to your wall's exposure.",
      link: {
        label: 'How long hedges last in Texas heat',
        href: '/blog/how-long-do-artificial-hedges-last-in-texas-heat',
      },
    },
    {
      question: 'Will my HOA allow it?',
      answer:
        "Many Texas HOAs review fence and landscaping changes. Texas Property Code Chapter 202 governs how HOA deed restrictions are enforced, but it does not promise approval. Read your HOA's rules, then submit specs and photos with your request.",
      link: {
        label: 'HOA approval in Texas',
        href: '/blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas',
      },
    },
    {
      question: 'What will it cost?',
      answer:
        'It depends on run length, height, system, mounting and site access. That is why the estimator shows dimensions, not dollars. Your written quote follows a site review.',
      link: { label: 'How pricing works', href: '/pricing' },
    },
  ] satisfies Question[],
} as const;

export interface SystemCard {
  id: 'hedge' | 'living-wall' | 'fence-extension' | 'commercial';
  title: string;
  module: string;
  mount: string;
  bestFor: string;
  link: { label: string; href: string };
  image: string;
}

export const SYSTEMS_SECTION = {
  title: 'Four systems. Measured to your site.',
  titleLines: ['Four systems.', 'Measured to your site.'],
  price: 'Quoted after a site review',
  specLabels: { module: 'Module', mount: 'Mount', bestFor: 'Best for' },
  cards: [
    {
      id: 'hedge',
      title: 'Artificial hedge',
      module: '20 in panels',
      mount: 'Fence, frame or wall',
      bestFor: 'Backyard privacy, pool screens',
      link: { label: 'Artificial hedges', href: '/artificial-hedge' },
      image: 'system-hedge',
    },
    {
      id: 'living-wall',
      title: 'Living wall',
      module: '40 in panels',
      mount: 'Wall or frame',
      bestFor: 'Courtyards, patios, interiors',
      link: { label: 'Living walls', href: '/living-wall' },
      image: 'system-living-wall',
    },
    {
      id: 'fence-extension',
      title: 'Fence extension',
      module: '20 in panels',
      mount: 'Frame above an existing fence',
      bestFor: 'Second-story sightlines',
      link: { label: 'Fence extensions', href: '/fence-extensions' },
      image: 'system-fence-extension',
    },
    {
      id: 'commercial',
      title: 'Commercial wall',
      module: 'Per system spec',
      mount: 'Wall or freestanding frame',
      bestFor: 'Restaurants, retail, multifamily',
      link: { label: 'Commercial walls', href: '/commercial-wall' },
      image: 'system-commercial',
    },
  ] satisfies SystemCard[],
} as const;

export const FIRE_CHAPTER = {
  callout: '◦ FIRE CODE',
  title: 'Commercial jobs answer to the fire marshal.',
  body: 'Restaurants, retail and multifamily projects often need greenery with a documented fire rating. Two standards come up. NFPA 701 is a flame test for textiles and films. ASTM E84 measures surface burning of building materials. Which one your project needs depends on the code path and your fire marshal. Ask for the documentation that matches your system before you order.',
  links: [
    { label: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge' },
    { label: 'Vallum FRX walls', href: '/vallum-frx' },
    { label: 'NFPA 701 vs ASTM E84', href: '/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery' },
    { label: 'Commercial projects', href: '/commercial' },
  ],
  photoCaption: 'Patio hedge barriers, Houston',
  photoAlt: 'Artificial boxwood hedge barriers along a Houston restaurant patio',
} as const;

export const INSTALLS = {
  title: 'Recent Texas jobs.',
  linkLabel: 'Read the case study',
  allLabel: 'All case studies',
  allHref: '/case-studies',
} as const;

export const PROCESS = {
  title: 'How a job runs.',
  steps: [
    { title: 'Send your numbers', body: 'Run, height, city, and photos if you have them.' },
    {
      title: 'Site review',
      body: 'Measurements, mounting and access are confirmed. Then you get a written quote.',
    },
    { title: 'Build', body: 'Panels are cut and staged to your layout.' },
    { title: 'Install', body: 'The run is mounted to your fence, frame or wall.' },
  ],
  installAlt: 'Installer fixing hedge panels to a steel mesh fence',
} as const;

export const QUOTE = {
  callout: '◦ STEP 2 OF 2',
  title: 'Get a free quote.',
  body: 'Tell us where and what. We reply with next steps.',
  nextTitle: 'What happens next',
  next: ['We read your numbers and photos.', 'We set up a site review.', 'You get a written quote.'],
  fields: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone (optional)',
    location: 'City or ZIP',
    system: 'System',
    projectType: 'Project type',
    details: 'Details',
    detailsPlaceholder: 'What needs covering? Rough size, fence type, photos to share.',
  },
  systems: ['Artificial hedge', 'Living wall', 'Fence extension', 'Commercial wall', 'Not sure yet'],
  projectTypes: ['Residential', 'Commercial'],
  submit: 'Send my quote request',
  success: 'Got it. We will be in touch at the email you gave.',
  error: 'That did not send. Call (760) 978-7335 or email info@lonestarfauxscapes.com.',
  /**
   * Validation messages. Not in the deck (a form cannot ship without them);
   * listed in the Phase 2 report for the owner to approve.
   */
  errors: {
    name: 'Enter your name.',
    email: 'Enter an email address we can reply to.',
    location: 'Enter a city or ZIP.',
    system: 'Pick a system, or choose Not sure yet.',
    projectType: 'Pick Residential or Commercial.',
  },
} as const;

export interface Faq {
  question: string;
  answer: string;
}

export const FAQ = {
  title: 'Questions, answered plainly.',
  items: [
    {
      question: 'Do artificial hedges need watering or trimming?',
      answer: 'No watering and no trimming. Rinse off dust and pollen now and then.',
    },
    {
      question: 'Can it mount on my existing fence?',
      answer:
        'Often, yes. Panels can mount to many fences or to a freestanding frame. The site review confirms what your fence can carry.',
    },
    {
      question: 'Is it fire-rated?',
      answer:
        'Fire-rated options are available for hedges and walls. Ask for the documentation for the exact system you choose.',
    },
    {
      question: 'How is the price set?',
      answer:
        'By run length, height, system, mounting and site access. You get a written quote after a site review.',
    },
    {
      question: 'Will my HOA approve it?',
      answer:
        "We cannot promise approval. Check your HOA's rules and submit product specs and photos with your request.",
    },
    {
      question: 'What size are the panels?',
      answer:
        'Hedge panels are 20 in. Living wall panels are 40 in. The estimator above counts them for your run.',
    },
  ] satisfies Faq[],
} as const;

export const SERVICE_AREA = {
  title: 'Where we work.',
  elsewhere: 'Somewhere else in Texas? Ask.',
} as const;

export const CONTACT = {
  call: 'Call (760) 978-7335',
  email: 'Email info@lonestarfauxscapes.com',
  brand: 'A Geranium Street USA brand',
} as const;

export const FOOTER = {
  columns: { systems: 'Systems', areas: 'Areas', company: 'Company' },
  bottom: '© 2026 Lone Star Faux Scapes. A Geranium Street USA brand.',
} as const;

export const STICKY = {
  quote: 'Get a free quote',
  call: 'Call',
} as const;

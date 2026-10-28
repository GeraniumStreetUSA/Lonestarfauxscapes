/**
 * Homepage copy, verbatim from the Phase 2 copy deck
 * (tasks/phase2-homepage-brief.md) and the pricing release of 2026-10-25.
 * Do not add facts, numbers, timelines, ratings or warranties here; ask the
 * owner first (OWNER-NEEDS.md). Prices are never typed here: they are
 * formatted from `starting-prices.ts`. `tests/copy.test.ts` scans this file
 * and every component for em-dashes, dollar figures and banned words.
 */

import {
  STARTING_PRICES,
  formatStartingPriceProse,
  type StartingPrice,
} from './starting-prices.ts';

export const SEO = {
  title: 'Artificial Hedges & Living Walls in Texas | Lone Star Faux Scapes',
  /** ≤155 characters (tested). "DFW" keeps all five metros inside the limit. */
  description: `Artificial hedges ${formatStartingPriceProse(STARTING_PRICES.hedge)} plus install. Living walls, fence extensions and privacy walls in DFW, Houston, Austin, San Antonio.`,
  canonical: 'https://lonestarfauxscapes.com/',
} as const;

export const HERO = {
  /** The H1 is one element: the search phrase, then the display line. */
  kicker: 'Artificial hedges and living walls, installed in Texas',
  display: ['Out of sight.', 'Still green.'],
  sub: "Your neighbor's second story looks straight into your yard. A hedge built to the right height can take that view away. No watering, no trimming.",
  cta: 'Get a free quote',
  phoneLead: 'or call',
  trust: 'A Geranium Street USA brand. Serving Dallas, Fort Worth, Houston, Austin and San Antonio.',
  fork: [
    { label: 'For homes', href: '/residential' },
    { label: 'For businesses', href: '/commercial' },
  ],
  photoCaption: 'Boxwood privacy wall, Austin',
  photoAlt: 'Tall artificial boxwood privacy wall behind live oaks in an Austin backyard',
  scene: {
    title: "A backyard drawn in 3D: the neighbor's second-story window looks over a 6 ft fence onto the pool, and a hedge along the fence blocks that view.",
    window: "Neighbor's window",
    pool: 'Your pool',
    inView: 'In view',
    outOfSight: 'Out of sight',
    fence: '6 ft fence',
    hedge: 'Hedge',
    sliderLabel: 'Hedge height',
    hint: 'Drag to raise or lower the hedge',
  },
} as const;

/**
 * Right after the hero: the real Austin job, told in three steps. Facts come
 * only from content/case-studies.json (austin-high-end-residential-privacy).
 * Left out on purpose: the area figure (conflicts with 16 x 130 ft) and the
 * install timeline (not owner-confirmed).
 */
export const AUSTIN_STORY = {
  callout: '◦ A REAL TEXAS JOB: AUSTIN',
  title: 'Out of sight in Austin: 16 ft tall, 130 ft long.',
  lede: 'The neighbor was remodeling, and the live screen in between was failing. Here is how that 130 ft run went green.',
  steps: [
    {
      label: 'Before',
      title: 'A tall screen, thin cover.',
      text: 'A 16 ft wire mesh screen already stood between the two yards. The live planting on it could not keep up, and keeping it going took constant upkeep.',
      image: 'austin-before',
      alt: 'Bare 16 ft wire mesh privacy screen behind young trees in an Austin backyard, before the install',
    },
    {
      label: 'Install',
      title: 'Panels on the mesh. No new structure.',
      text: 'Boxwood panels went straight onto the existing mesh, with a screen backing behind them. The tall structure stayed; only the cover changed.',
      image: 'austin-install',
      alt: 'Installer on a ladder fixing boxwood panels to the wire mesh screen',
    },
    {
      label: 'After',
      title: 'Green on day one. Nothing to water.',
      text: '130 ft of boxwood, 16 ft tall, behind the live oaks. The materials were picked for UV resistance in full Austin sun.',
      image: 'austin-after',
      alt: 'Tall artificial boxwood privacy wall behind live oaks in an Austin backyard',
    },
  ],
  facts: [
    { label: 'Run', value: '130 ft' },
    { label: 'Height', value: '16 ft' },
    { label: 'Mount', value: 'Existing wire mesh' },
    { label: 'Foliage', value: 'Boxwood panels, UV-resistant' },
  ],
  caseStudy: { label: 'Read the Austin case study', href: '/case-studies/austin-high-end-residential-privacy' },
  measure: { label: 'Measure your run', href: '#estimate' },
} as const;

export const ESTIMATOR = {
  callout: '◦ STEP 1 OF 2: MEASURE YOUR RUN',
  title: 'How long is the line you want green?',
  body: 'Pick a system and set the run. We draw it, count the panels and do the arithmetic on our published starting prices. Installation is quoted after a site review.',
  /** Fieldset legend. Not in the deck: reuses the deck's quote-form field name. */
  systemLegend: 'System',
  runLabel: 'Run length (ft)',
  heightLabel: 'Height (ft)',
  /** Shown instead of the height slider where the price fixes the height: "Height: 6 ft (priced size)". */
  heightFixedLabel: 'Height',
  heightFixedNote: 'priced size',
  locationLabel: 'City or ZIP',
  qualifier:
    'Illustrations, not quotes: arithmetic from our published material starting prices. Installation is quoted separately after a site review.',
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
        `Starting prices are published: hedge ${formatStartingPriceProse(STARTING_PRICES.hedge)}, ` +
        `fence extension ${formatStartingPriceProse(STARTING_PRICES['fence-extension'])}, ` +
        `living wall ${formatStartingPriceProse(STARTING_PRICES['living-wall'])}, ` +
        `privacy wall ${formatStartingPriceProse(STARTING_PRICES['privacy-wall'])}. ` +
        'Installation is quoted after a site review, because access, mounting and run length drive it.',
      link: { label: 'How pricing works', href: '/pricing' },
    },
  ] satisfies Question[],
} as const;

export interface SystemCard {
  id: 'hedge' | 'living-wall' | 'fence-extension' | 'commercial' | 'privacy-wall';
  title: string;
  /** The released starting price, or null for a system quoted after a site review. */
  startingPrice: StartingPrice | null;
  module: string;
  mount: string;
  bestFor: string;
  link: { label: string; href: string };
  image: string;
}

export const SYSTEMS_SECTION = {
  title: 'Five systems. Measured to your site.',
  titleLines: ['Five systems.', 'Measured to your site.'],
  /** The price line of a card with no released price. */
  quoted: 'Quoted after a site review',
  specLabels: { module: 'Module', mount: 'Mount', bestFor: 'Best for' },
  cards: [
    {
      id: 'hedge',
      title: 'Artificial hedge',
      startingPrice: STARTING_PRICES.hedge,
      module: '20 in panels',
      mount: 'Fence, frame or wall',
      bestFor: 'Backyard privacy, pool screens',
      link: { label: 'Artificial hedges', href: '/artificial-hedge' },
      image: 'system-hedge',
    },
    {
      id: 'living-wall',
      title: 'Living wall',
      startingPrice: STARTING_PRICES['living-wall'],
      module: '40 in panels',
      mount: 'Wall or frame',
      bestFor: 'Courtyards, patios, interiors',
      link: { label: 'Living walls', href: '/living-wall' },
      image: 'system-living-wall',
    },
    {
      id: 'fence-extension',
      title: 'Fence extension',
      startingPrice: STARTING_PRICES['fence-extension'],
      module: '20 in panels',
      mount: 'Frame above an existing fence',
      bestFor: 'Second-story sightlines',
      link: { label: 'Fence extensions', href: '/fence-extensions' },
      image: 'system-fence-extension',
    },
    {
      id: 'commercial',
      title: 'Commercial wall',
      startingPrice: null,
      module: 'Per system spec',
      mount: 'Wall or freestanding frame',
      bestFor: 'Restaurants, retail, multifamily',
      link: { label: 'Commercial walls', href: '/commercial-wall' },
      image: 'system-commercial',
    },
    {
      id: 'privacy-wall',
      title: 'Privacy wall',
      startingPrice: STARTING_PRICES['privacy-wall'],
      module: '4 × 4 ft units',
      mount: 'Freestanding, standard base',
      bestFor: 'Patios, pool decks, quick screens',
      link: { label: 'Privacy walls', href: '/privacy-wall' },
      image: 'system-privacy-wall',
    },
  ] satisfies SystemCard[],
} as const;

export const FIRE_CHAPTER = {
  callout: '◦ FIRE CODE',
  title: 'Commercial jobs answer to the fire marshal.',
  body: 'Restaurants, retail and multifamily projects often need greenery with a documented fire rating. The test fire marshals ask for on decorative greenery is NFPA 701. Our fire-rated hedges and walls are built for it.',
  points: [
    {
      label: 'What it is',
      text: 'NFPA 701 is the flame propagation test for textiles, films and decorative materials: a sample is burned and judged on how far the flame spreads and whether flaming pieces drip.',
    },
    {
      label: 'Where it comes up',
      text: 'Many Texas cities adopt the International Fire Code, which points artificial decorative vegetation in many commercial buildings to NFPA 701, documented by the manufacturer.',
    },
    {
      label: 'What to ask for',
      text: 'The NFPA 701 documentation for your exact system, before you order. Then confirm the requirement with your fire marshal.',
    },
  ],
  links: [
    { label: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge' },
    { label: 'Vallum FRX walls', href: '/vallum-frx' },
    { label: 'NFPA 701, explained', href: '/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery' },
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

/** The owner's process, as described on 2026-10-28. No timelines. */
export const PROCESS = {
  title: 'How a job runs.',
  steps: [
    { title: 'Send your numbers', body: 'Run, height, city, and photos if you have them. The estimator above fills in most of it.' },
    {
      title: 'Rough quote',
      body: 'We email an assessment and a rough quote, with a 3D render of your space when it helps you decide.',
    },
    { title: 'Site review', body: 'Measurements, mounting and access are confirmed on site. That sets the final invoice.' },
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
  next: [
    'We read your numbers and photos.',
    'You get an email assessment and a rough quote, with a 3D render when it helps.',
    'A site review sets the final invoice.',
  ],
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
  systems: ['Artificial hedge', 'Living wall', 'Fence extension', 'Commercial wall', 'Privacy wall', 'Not sure yet'],
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
        'Fire-rated hedge and wall options are built for NFPA 701, the flame test fire marshals ask for on decorative greenery. Ask for the NFPA 701 documentation for the exact system you choose.',
    },
    {
      question: 'How is the price set?',
      answer:
        'From published starting prices for each system, plus installation. You get a rough quote by email first; the site review sets the final invoice, because run length, mounting and site access drive installation.',
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
  callout: '◦ SERVICE AREA',
  title: 'Where we work.',
  intro: 'Dallas, Fort Worth, Houston, Austin and San Antonio. Pick your metro, or send any Texas city with your quote.',
  elsewhere: 'Somewhere else in Texas?',
  elsewhereAction: 'Send your city',
  mapLabel: 'Map of Texas with the five metros we serve marked.',
  scale: '100 mi',
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

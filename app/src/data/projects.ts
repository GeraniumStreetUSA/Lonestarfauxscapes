/**
 * The three Texas installs as project pages (`/case-studies/<slug>`) and as
 * the photos on `/gallery`. Title, city and path match content/case-studies.json
 * (tests/case-studies.test.ts fails on drift); the story is the owner's
 * profile in content/case-studies/<slug>.md, shortened.
 *
 * Left out on purpose: the Austin area figure (OWNER-NEEDS #15: 1,800 sq ft
 * conflicts with 16 x 130 ft, so only the dimensions are shown), install
 * timelines, the fire-rating note, and "premium". Image names are manifest
 * names (app/src/data/image-manifest.json); photos are the real jobs only.
 */

export interface ProjectPhoto {
  /** A manifest name: the full frame. */
  name: string;
  alt: string;
  /** Names the documented job. */
  caption: string;
}

export interface ProjectChapter {
  title: string;
  /** The mono note beside the heading. */
  callout: string;
  paragraphs: readonly string[];
}

export interface Project {
  slug: string;
  path: string;
  title: string;
  /** The breadcrumb label. */
  shortTitle: string;
  city: string;
  /** "Houston / Commercial": the sheet label. */
  callout: string;
  lede: string;
  facts: readonly { label: string; value: string }[];
  /** The hero photo: a 4:3 crop of the job. */
  hero: { name: string; alt: string };
  chapters: readonly ProjectChapter[];
  scope: readonly string[];
  materials: readonly string[];
  notes: readonly string[];
  photos: readonly ProjectPhoto[];
  /** Related pages: the system, the city, pricing and the other jobs. */
  links: readonly { title: string; href: string; text: string }[];
}

export const PROJECTS: readonly Project[] = [
  {
    slug: 'austin-high-end-residential-privacy',
    path: '/case-studies/austin-high-end-residential-privacy',
    title: 'Austin Residential Privacy Wall on an Existing 16-Foot Screen',
    shortTitle: 'Austin privacy wall',
    city: 'Austin',
    callout: '◦ AUSTIN / PRIVACY WALL',
    lede: 'A failing live screen between two yards, replaced with boxwood panels on the wire mesh that was already there. Immediate privacy, nothing to water.',
    facts: [
      { label: 'City', value: 'Austin, TX' },
      { label: 'Size', value: '16 ft tall, 130 ft long' },
      { label: 'Mount', value: 'Existing wire mesh' },
      { label: 'Foliage', value: 'Boxwood, UV-resistant' },
    ],
    hero: {
      name: 'case-austin-privacy-wall',
      alt: 'Tall artificial boxwood privacy wall behind live oaks in an Austin backyard',
    },
    chapters: [
      {
        title: 'What the site needed',
        callout: '◦ THE PROBLEM',
        paragraphs: [
          'This Austin property already had a tall wire mesh structure for privacy, but the live planting on it was not holding up. The screen had to stay full through Texas heat, and the homeowner wanted privacy right away while a neighbor was remodeling.',
        ],
      },
      {
        title: 'What was installed',
        callout: '◦ THE SCOPE',
        paragraphs: [
          'A custom artificial greenery wall was built over the existing screen instead of tearing the structure out. Boxwood panels went on with a backing that fastens straight to the wire mesh, so the frame became a full-height privacy wall with no irrigation and no plant replacement.',
        ],
      },
      {
        title: 'How the install was handled',
        callout: '◦ THE INSTALL',
        paragraphs: [
          'Most of the panel prep happened before the crew arrived, so the work on site stayed short. On site, the backing went onto the existing framework and the panels were set in sequence and aligned, so the finished wall reads as one continuous surface.',
        ],
      },
      {
        title: 'Outcome',
        callout: '◦ THE RESULT',
        paragraphs: [
          'The homeowner got immediate screening across the full run, with a cleaner look and far less upkeep than the live planting. No watering, no plant failure, no rework.',
        ],
      },
    ],
    scope: [
      'Artificial greenery cladding across the existing wire mesh structure',
      'Full-screen coverage for a 16 ft tall by 130 ft long run',
    ],
    materials: ['Boxwood panels, UV-resistant for long-term sun exposure', 'Fence screen backing secured to the existing wire mesh'],
    notes: [
      'The existing wire mesh structure was reused, not rebuilt.',
      'No irrigation lines or soil work were needed for the finished wall.',
    ],
    photos: [
      {
        name: 'austin-after',
        alt: 'Tall artificial boxwood privacy wall behind live oaks in an Austin backyard',
        caption: 'Austin residential privacy wall: the finished wall',
      },
      {
        name: 'austin-before',
        alt: 'Bare 16 ft wire mesh privacy screen behind young trees in an Austin backyard, before the install',
        caption: 'Austin residential privacy wall: before, the wire mesh screen with its live planting',
      },
      {
        name: 'austin-install',
        alt: 'Installer on a ladder fixing boxwood panels to the wire mesh screen',
        caption: 'Austin residential privacy wall: fixing the panels to the mesh',
      },
      {
        name: 'install-austin-panels',
        alt: 'Installer working at the edge of the new boxwood wall, with a ladder against it',
        caption: 'Austin residential privacy wall: setting the panels',
      },
    ],
    links: [
      { title: 'Austin', href: '/austin', text: 'More about installs in Austin.' },
      { title: 'Living walls', href: '/living-wall', text: 'Greenery for a wall, with no irrigation.' },
      { title: 'Artificial hedges', href: '/artificial-hedge', text: 'Boxwood hedge panels for a fence or a screen.' },
      { title: 'Residential', href: '/residential', text: 'Hedges, fence extensions and living walls for homes.' },
      { title: 'Pricing', href: '/pricing', text: 'Starting prices, and what changes the cost.' },
      { title: 'The Houston jobs', href: '/case-studies', text: 'A restaurant patio and a storefront.' },
    ],
  },
  {
    slug: 'houston-restaurant-hedges',
    path: '/case-studies/houston-restaurant-hedges',
    title: 'Houston Restaurant Patio Hedge Barriers for Seating and Traffic Flow',
    shortTitle: 'Houston restaurant patio',
    city: 'Houston',
    callout: '◦ HOUSTON / COMMERCIAL',
    lede: 'Fixed boxwood hedge barriers that mark the patio edge, keep walk paths clear and need no watering or trimming.',
    facts: [
      { label: 'City', value: 'Houston, TX' },
      { label: 'System', value: 'Patio hedge barriers' },
      { label: 'Mount', value: 'Plates drilled into concrete' },
      { label: 'Foliage', value: 'Boxwood panels' },
    ],
    hero: {
      name: 'case-houston-restaurant',
      alt: 'Artificial boxwood hedge barriers along a Houston restaurant patio',
    },
    chapters: [
      {
        title: 'What the patio needed',
        callout: '◦ THE PROBLEM',
        paragraphs: [
          'This Houston restaurant wanted the patio to feel like part of the dining room, not extra tables on an open slab. The problem was circulation: with no clear edge, guests and passersby drifted through the seating area and broke up service.',
        ],
      },
      {
        title: 'What was installed',
        callout: '◦ THE SCOPE',
        paragraphs: [
          'Artificial boxwood hedge panels went in as fixed patio barriers, in place of loose planters or temporary dividers. Each section is mounted to custom plates drilled into the concrete, so the hedge line stays where it was set.',
        ],
      },
      {
        title: 'How the layout was planned',
        callout: '◦ THE LAYOUT',
        paragraphs: [
          'The hedge locations do two jobs: they define the dining area and they keep the main walk paths clear for guests and staff. Once the mounting points were set, the panels went in as one continuous run, so the patio reads as a single edge instead of a row of separate pieces.',
        ],
      },
      {
        title: 'Outcome',
        callout: '◦ THE RESULT',
        paragraphs: [
          'The patio feels more defined from the sidewalk, and fewer people cut through the seating. The restaurant gets the softness of greenery with no watering, trimming or plant replacement on a busy commercial site.',
        ],
      },
    ],
    scope: [
      'Artificial hedge barrier line around the patio seating zone',
      'Concrete-mounted sections at key circulation points',
    ],
    materials: ['Boxwood hedge panels', 'Custom mounting plates drilled into concrete'],
    notes: [
      'The barriers are anchored to concrete, not left freestanding.',
      'The layout followed seating boundaries and guest circulation.',
      'Run length and panel count were not published for this job.',
    ],
    photos: [
      {
        name: 'hub-houston-restaurant-wide',
        alt: 'Boxwood hedge barriers between the columns along the covered frontage of a Houston restaurant',
        caption: 'Houston restaurant patio hedge barriers: along the frontage',
      },
      {
        name: 'commercial-houston-patio',
        alt: 'Hedge barrier sections between columns, beside a restaurant entrance in Houston',
        caption: 'Houston restaurant patio hedge barriers: between the columns',
      },
      {
        name: 'system-privacy-wall',
        alt: 'Hedge barriers along a covered walkway at a Houston restaurant',
        caption: 'Houston restaurant patio hedge barriers: along the walkway',
      },
    ],
    links: [
      { title: 'Houston', href: '/houston', text: 'More about installs in Houston.' },
      { title: 'Artificial hedges', href: '/artificial-hedge', text: 'Boxwood hedge panels, built to your measurements.' },
      { title: 'Commercial walls', href: '/commercial-wall', text: 'Facades and storefronts, quoted after a site review.' },
      { title: 'Commercial', href: '/commercial', text: 'Hedges and living walls for businesses.' },
      {
        title: 'Living walls for restaurant patios',
        href: '/blog/artificial-living-walls-for-restaurant-patios-in-texas',
        text: 'A guide to greenery on a Texas patio.',
      },
      { title: 'The Houston storefront', href: '/case-studies/houston-storefront-hedges', text: 'Hedge panels over concrete barriers.' },
    ],
  },
  {
    slug: 'houston-storefront-hedges',
    path: '/case-studies/houston-storefront-hedges',
    title: 'Houston Storefront Hedge Screening Over Existing Concrete Barriers',
    shortTitle: 'Houston storefront',
    city: 'Houston',
    callout: '◦ HOUSTON / COMMERCIAL',
    lede: 'Hedge panels over the concrete barriers that were already there: a softer, more welcoming entry, and the barriers stay in place.',
    facts: [
      { label: 'City', value: 'Houston, TX' },
      { label: 'System', value: 'Hedge cladding on barriers' },
      { label: 'Mount', value: 'Plates drilled into concrete' },
      { label: 'Foliage', value: 'UV-stabilized boxwood' },
    ],
    hero: {
      name: 'case-houston-storefront',
      alt: 'Artificial hedge panels covering a concrete barrier outside a Houston storefront',
    },
    chapters: [
      {
        title: 'What the storefront needed',
        callout: '◦ THE PROBLEM',
        paragraphs: [
          'The business wanted a more polished frontage from the curb, but the concrete barriers already in place had to stay. The job was not to remove them. It was to make them look intentional and welcoming without creating a maintenance problem.',
        ],
      },
      {
        title: 'What was installed',
        callout: '◦ THE SCOPE',
        paragraphs: [
          'Boxwood hedge panels went on as a permanent exterior facing over the existing barrier line. They are mounted to custom plates drilled into the concrete, so the surface stays aligned and secure instead of reading like temporary decor.',
        ],
      },
      {
        title: 'How the install was handled',
        callout: '◦ THE INSTALL',
        paragraphs: [
          'The barrier layout was reviewed first, so the finished hedge line would read straight from the street and still work with the site. After the plates were fixed, the panels were set and aligned to keep the seams tight and the surface even along the run.',
        ],
      },
      {
        title: 'Outcome',
        callout: '◦ THE RESULT',
        paragraphs: [
          'The entry looks softer and more intentional, and the concrete barriers keep doing their job. The storefront gets a cleaner first impression, with no watering, trimming or seasonal decline to manage.',
        ],
      },
    ],
    scope: [
      'Artificial hedge cladding over the existing storefront barriers',
      'Street-facing entry definition with permanent mounted panels',
    ],
    materials: ['UV-stabilized boxwood hedge panels', 'Custom mounting plates drilled into the concrete barriers'],
    notes: [
      'The original concrete barriers stayed in place.',
      'UV-stabilized panels were chosen for exterior sun exposure.',
      'Square footage and install duration were not published for this job.',
    ],
    photos: [
      {
        name: 'hub-houston-storefront-front',
        alt: 'Hedge panels in front of the windows of a Houston storefront',
        caption: 'Houston storefront hedge screening: the frontage',
      },
      {
        name: 'hub-houston-storefront-side',
        alt: 'A hedge panel along the side of a Houston storefront, beside a parking space',
        caption: 'Houston storefront hedge screening: along the side',
      },
      {
        name: 'hub-houston-storefront-mount',
        alt: 'A hedge panel standing on its mounting plates at a Houston storefront',
        caption: 'Houston storefront hedge screening: a panel on its mounting plates',
      },
    ],
    links: [
      { title: 'Houston', href: '/houston', text: 'More about installs in Houston.' },
      { title: 'Artificial hedges', href: '/artificial-hedge', text: 'Boxwood hedge panels, built to your measurements.' },
      { title: 'Commercial walls', href: '/commercial-wall', text: 'Facades and storefronts, quoted after a site review.' },
      { title: 'Commercial', href: '/commercial', text: 'Hedges and living walls for businesses.' },
      { title: 'Pricing', href: '/pricing', text: 'Starting prices, and what changes the cost.' },
      { title: 'The Houston restaurant patio', href: '/case-studies/houston-restaurant-hedges', text: 'Hedge barriers mounted to concrete.' },
    ],
  },
];

/** The projects by slug, for the per-page route modules. */
export function projectBySlug(slug: string): Project {
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) throw new Error(`Unknown project: ${slug}`);
  return project;
}

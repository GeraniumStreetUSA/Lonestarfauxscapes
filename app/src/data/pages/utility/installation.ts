/** Copy for /installation. */

export const INSTALLATION_PAGE = {
  callout: '◦ INSTALLATION',
  title: 'Custom Artificial Hedge Installation Across Texas',
  lede: 'Panels are built to your measurements and mounted to a fence, a wall, wire mesh or a freestanding frame. Here is how a job runs.',
  heroAlt: 'Installer fixing hedge panels to a steel mesh fence',
  process: {
    id: 'process',
    callout: '◦ THE PROCESS',
    title: 'Our installation process.',
    intro: 'Five steps, the same on every job. A site review sets the final invoice.',
  },
  mounting: {
    callout: '◦ MOUNTING',
    title: 'What we mount to.',
    intro: 'The site review confirms the surface and how the panels attach.',
    items: [
      {
        title: 'Fence',
        text: 'Panels on the face of an existing fence. A fence extension is fixed to the face too, generally with steel square tube. Extending a vinyl fence is much harder and generally not recommended.',
        href: '/fence-extensions',
      },
      {
        title: 'Wall',
        text: 'Hedge or living wall panels on a clean wall, masonry included.',
        href: '/living-wall',
      },
      {
        title: 'Wire mesh',
        text: 'Panels on an existing steel mesh screen, as on our Austin job.',
        href: '/case-studies/austin-high-end-residential-privacy',
      },
      {
        title: 'Freestanding frame',
        text: 'Freestanding units on a standard base, in 4 ft sections.',
        href: '/privacy-wall',
      },
    ],
  },
  areas: {
    callout: '◦ SERVICE AREA',
    title: 'Where we install.',
    intro: 'Dallas, Fort Worth, Houston, Austin and San Antonio. Outside those five, send your city with your quote.',
  },
} as const;

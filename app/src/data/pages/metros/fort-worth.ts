import type { MetroData } from './types';
import { FIRE_ANSWER, HOA_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const FORT_WORTH: MetroData = {
  slug: 'fort-worth',
  name: 'Fort Worth',
  kind: 'metro',
  mapActive: 'Fort Worth',
  callout: '◦ FORT WORTH, TX',
  title: 'Fort Worth artificial hedge installation and faux living walls',
  lede: 'Feature walls, backyard privacy hedges and faux living walls for Fort Worth homes and commercial spaces. Built to your measurements, with nothing to water.',
  needsTitle: 'What Fort Worth projects usually need',
  needsIntro:
    'Fort Worth mixes commercial districts, hospitality and large residential lots. The same panels can serve all three; the mounting and the paperwork differ.',
  needs: [
    {
      title: 'Feature walls for guest-facing spaces',
      text: 'Restaurants, hotels and retail in places like Sundance Square and the Cultural District often want a green wall that holds up without a care schedule. Living wall panels do that.',
    },
    {
      title: 'Estate and backyard privacy',
      text: 'Hedge runs and fence extensions screen a property line or a pool area at once. Westside lots and other large yards are a typical fit.',
    },
    {
      title: 'Hospitality frontage',
      text: 'Hotels, breweries and venues in areas like the Stockyards often need greenery on a facade or patio edge. Fire-rated foliage is an upgrade at extra cost (built for NFPA 701); ask for the documentation for the exact system.',
    },
  ],
  systems: {
    hedge: 'Privacy runs and patio edges.',
    'living-wall': 'Feature walls for lobbies.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Decks and amenity edges.',
    'commercial-wall': 'Facades and storefronts.',
  },
  guides: [
    {
      slug: 'green-wall-maintenance-in-texas-what-it-actually-takes',
      title: 'What green wall maintenance takes in Texas',
      text: 'Living walls against artificial ones, for projects that want the look without the upkeep.',
    },
    {
      slug: 'the-complete-guide-to-artificial-living-walls-in-texas',
      title: 'The complete guide to artificial living walls in Texas',
      text: 'Materials, outdoor performance and install planning.',
    },
    {
      slug: 'nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery',
      title: 'NFPA 701 vs ASTM E84, explained',
      text: 'How the two fire standards differ, before a commercial project goes to approval.',
    },
    {
      slug: 'how-to-get-hoa-approval-for-artificial-hedges-in-texas',
      title: 'How to get HOA approval for artificial hedges',
      text: 'For backyard privacy that needs an association to say yes.',
    },
  ],
  setups: [
    { title: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge', text: 'For commercial and hospitality scopes.' },
    { title: 'Pool privacy', href: '/pool-privacy-hedge', text: 'Deck and backyard screening.' },
    { title: 'HOA-friendly hedges', href: '/hoa-approved-artificial-hedge', text: 'Planning around an association.' },
  ],
  faq: [
    { question: 'Are the hedges fire-rated?', answer: FIRE_ANSWER },
    {
      question: 'Do you serve the rest of the DFW area?',
      answer:
        'Send your city with the quote request. Arlington has its own page here, and Dallas is the neighboring metro.',
    },
    {
      question: 'Can you match existing landscaping?',
      answer:
        'Hedge panels come in boxwood, ficus and oasis styles, so you can pick the one that sits best beside what you have. Send a photo of the stretch with your numbers.',
    },
    { question: 'What does a Fort Worth project cost?', answer: PRICE_ANSWER },
    { question: 'I am in an HOA. Where do I start?', answer: HOA_ANSWER },
    { question: 'What do I send for a Fort Worth quote?', answer: SEND_ANSWER },
  ],
  suburbs: ['arlington'],
};

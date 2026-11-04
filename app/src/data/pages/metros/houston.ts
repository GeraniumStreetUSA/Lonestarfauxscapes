import type { MetroData } from './types';
import { FIRE_ANSWER, HOA_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const HOUSTON: MetroData = {
  slug: 'houston',
  name: 'Houston',
  kind: 'metro',
  mapActive: 'Houston',
  photo: 'houston',
  callout: '◦ HOUSTON, TX',
  title: 'Artificial hedge and living wall installation in Houston, TX',
  lede: 'Hedges and living walls for Houston patios, storefronts and amenity decks. No irrigation, no live plants to lose to heat and humidity.',
  needsTitle: 'What Houston projects usually need',
  needsIntro:
    'Houston projects often turn on practical questions first: foot traffic, weather, upkeep and who coordinates the work.',
  needs: [
    {
      title: 'Patio edges that steer people',
      text: 'A hedge barrier can define a patio and keep people from cutting through seating, without looking like a temporary divider. One Houston restaurant did exactly that, below.',
    },
    {
      title: 'Cleaner frontage over rough conditions',
      text: 'Existing concrete barriers and hardscape can often stay where they are while panels cover them. A Houston storefront did this, below. Areas like Downtown and the Galleria are a typical fit for frontage work.',
    },
    {
      title: 'Greenery that does not need soil or water',
      text: 'Pool decks, terraces and shared lounges in places like River Oaks and the Heights want screening that stays full in wet, humid weather. UV-rated options exist for outdoor sun; rinse off dust and pollen now and then.',
    },
  ],
  systems: {
    hedge: 'Patio barriers and frontage.',
    'living-wall': 'Lobbies and feature walls.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Decks and amenity edges.',
    'commercial-wall': 'Facades and storefronts.',
  },
  guides: [
    {
      slug: 'houston-no-water-greenery-fix-choosing-artificial-hedges',
      title: 'Houston no-water greenery fix',
      text: 'Choosing screens and living walls that still look right in August.',
    },
    {
      slug: 'artificial-living-walls-and-hedges-in-houston',
      title: 'Artificial living walls and hedges in Houston',
      text: 'A local guide for patios, offices and restaurants.',
    },
    {
      slug: 'nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery',
      title: 'NFPA 701 vs ASTM E84, explained',
      text: 'How the two fire standards differ, before a commercial project goes to approval.',
    },
    {
      slug: 'green-wall-maintenance-in-texas-what-it-actually-takes',
      title: 'What green wall maintenance takes in Texas',
      text: 'Living walls against artificial ones.',
    },
  ],
  setups: [
    { title: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge', text: 'For hospitality and multifamily scopes.' },
    { title: 'Pool privacy', href: '/pool-privacy-hedge', text: 'Deck and amenity screening.' },
    { title: 'HOA-friendly hedges', href: '/hoa-approved-artificial-hedge', text: 'Planning around an association.' },
  ],
  faq: [
    {
      question: 'How do the hedges handle Houston humidity?',
      answer:
        'There is no soil, irrigation or live growth to manage in wet weather. UV-rated options exist for outdoor sun, so ask which product suits direct sun and which a covered area. Rinse off dust and pollen now and then.',
    },
    { question: 'Are the hedges fire-rated?', answer: FIRE_ANSWER },
    {
      question: 'Have you done work in Houston?',
      answer:
        'Yes, two projects we can show: a restaurant patio hedge barrier and a storefront hedge over existing concrete barriers. Both are on this page.',
    },
    { question: 'What does a Houston project cost?', answer: PRICE_ANSWER },
    { question: 'I am in an HOA. Where do I start?', answer: HOA_ANSWER },
    { question: 'What do I send for a Houston quote?', answer: SEND_ANSWER },
  ],
  suburbs: ['sugar-land', 'the-woodlands'],
};

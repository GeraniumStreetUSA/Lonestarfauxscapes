import type { MetroData } from './types';
import { FIRE_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const ARLINGTON: MetroData = {
  slug: 'arlington',
  name: 'Arlington',
  kind: 'suburb',
  parent: { slug: 'fort-worth', name: 'Fort Worth' },
  mapActive: 'Fort Worth',
  callout: '◦ ARLINGTON, TX',
  title: 'Artificial hedge installation in Arlington, TX',
  lede: 'Hedges and living walls for Arlington homes, businesses and venues, built to your measurements. Nothing to water, nothing to trim.',
  needsTitle: 'What Arlington projects usually need',
  needs: [
    {
      title: 'Backyard and pool privacy',
      text: 'Hedge runs and fence extensions screen a yard, a pool or a property line at once. Choose the panel style and height that suit the house.',
    },
    {
      title: 'Restaurant and retail frontage',
      text: 'Patio edges, storefronts and lobbies in areas like the Entertainment District can take hedge panels and living walls. Fire-rated foliage is an upgrade at extra cost (built for NFPA 701); ask for the documentation.',
    },
    {
      title: 'Venues and busy spaces',
      text: 'Event and hospitality spaces see heavy foot traffic. Tell us how the space is used and where the panels will be touched or bumped.',
    },
  ],
  places: ['Downtown Arlington', 'Entertainment District', 'UTA area', 'Mid-Cities'],
  systems: {
    hedge: 'Privacy runs and frontage.',
    'living-wall': 'Lobbies and feature walls.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Decks and amenity edges.',
    'commercial-wall': 'Facades and storefronts.',
  },
  faq: [
    { question: 'Are the hedges fire-rated?', answer: FIRE_ANSWER },
    { question: 'What does an Arlington project cost?', answer: PRICE_ANSWER },
    { question: 'What do I send for an Arlington quote?', answer: SEND_ANSWER },
  ],
};

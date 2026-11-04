import type { MetroData } from './types';
import { HOA_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const PLANO: MetroData = {
  slug: 'plano',
  name: 'Plano',
  kind: 'suburb',
  parent: { slug: 'dallas', name: 'Dallas' },
  mapActive: 'Dallas',
  callout: '◦ PLANO, TX',
  title: 'Artificial hedge installation in Plano, TX',
  lede: 'Hedges and living walls for Plano homes, office campuses and retail frontage. Built to your measurements, with nothing to water.',
  needsTitle: 'What Plano projects usually need',
  needs: [
    {
      title: 'Backyard and pool privacy',
      text: 'Hedge runs and fence extensions give a patio, a pool or a property line screening at once. Pick the panel style and height that suit the house.',
    },
    {
      title: 'Campus and lobby greenery',
      text: 'Offices along the Tollway and the Legacy area can use living walls for lobbies and outdoor meeting spaces. Fire-rated options are built for NFPA 701; ask for the documentation for the exact system.',
    },
    {
      title: 'Retail frontage and patios',
      text: 'Storefronts and patio edges in centers like Legacy West and The Shops at Willow Bend can take hedge panels over existing walls and barriers.',
    },
  ],
  places: ['West Plano', 'Willow Bend', 'Legacy', 'Downtown Plano', 'East Plano'],
  systems: {
    hedge: 'Privacy runs and frontage.',
    'living-wall': 'Lobbies and feature walls.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Decks and amenity edges.',
    'commercial-wall': 'Facades and storefronts.',
  },
  faq: [
    { question: 'Do you work with Plano HOAs?', answer: HOA_ANSWER },
    {
      question: 'Do I need a permit?',
      answer:
        'It depends on the city, the fence height, the mounting method and whether any structural work is involved. HOA approval, where it applies, is separate from the city. Check with Plano and your association before you order.',
    },
    { question: 'What does a Plano project cost?', answer: PRICE_ANSWER },
    { question: 'What do I send for a Plano quote?', answer: SEND_ANSWER },
  ],
};

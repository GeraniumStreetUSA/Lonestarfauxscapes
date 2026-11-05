import type { MetroData } from './types';
import { FIRE_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const IRVING: MetroData = {
  slug: 'irving',
  name: 'Irving',
  kind: 'suburb',
  parent: { slug: 'dallas', name: 'Dallas' },
  mapActive: 'Dallas',
  callout: '◦ IRVING, TX',
  title: 'Artificial hedge installation in Irving, TX',
  lede: 'Hedges and living walls for Irving offices, mixed-use properties and homes. Designed around your site, access and privacy goals.',
  needsTitle: 'What Irving projects usually need',
  needs: [
    {
      title: 'Office and lobby greenery',
      text: 'Business complexes in areas like Las Colinas can use living walls for lobbies, outdoor break areas and facades. Send the wall size and a photo of the surface.',
    },
    {
      title: 'Venues and mixed-use frontage',
      text: 'Entertainment and mixed-use spaces near the Toyota Music Factory need hedge panels and green walls that hold up to foot traffic. Upper-level work depends on access, so tell us how the wall will be reached.',
    },
    {
      title: 'Residential privacy',
      text: 'Pool screens, patio edges and fence extensions for homes in places like Valley Ranch give screening at once with nothing to water.',
    },
  ],
  places: ['Las Colinas', 'Valley Ranch', 'Toyota Music Factory', 'Heritage District', 'DFW Airport area'],
  systems: {
    hedge: 'Privacy runs and pool screens.',
    'living-wall': 'Lobbies and feature walls.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Decks and amenity edges.',
    'commercial-wall': 'Facades and storefronts.',
  },
  faq: [
    { question: 'Do you provide fire documentation?', answer: FIRE_ANSWER },
    { question: 'What does an Irving project cost?', answer: PRICE_ANSWER },
    { question: 'What do I send for an Irving quote?', answer: SEND_ANSWER },
  ],
};

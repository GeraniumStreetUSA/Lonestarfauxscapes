import type { MetroData } from './types';
import { HOA_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const THE_WOODLANDS: MetroData = {
  slug: 'the-woodlands',
  name: 'The Woodlands',
  kind: 'suburb',
  parent: { slug: 'houston', name: 'Houston' },
  mapActive: 'Houston',
  callout: '◦ THE WOODLANDS, TX',
  title: 'Artificial hedge installation in The Woodlands, TX',
  lede: 'Hedges and living walls for Woodlands homes, restaurants and offices. Built to your measurements, with nothing to water.',
  needsTitle: 'What Woodlands projects usually need',
  needs: [
    {
      title: 'Privacy under the trees',
      text: 'Shade and roots limit what grows well under pines and oaks. A hedge run or fence extension gives screening that does not need light or water. Send photos of the stretch and the way in.',
    },
    {
      title: 'Covenant approval first',
      text: 'The Woodlands has village associations and covenants. Read yours and ask for approval before you order; an emailed assessment and render give the review something to look at.',
    },
    {
      title: 'Waterway and Market Street frontage',
      text: 'Restaurants, shops and offices in areas like the Waterway, Market Street and Hughes Landing can use hedge panels and living walls on patios and facades.',
    },
  ],
  places: ['Market Street', 'Hughes Landing', 'The Waterway', 'Carlton Woods', 'Alden Bridge', 'Creekside Park'],
  systems: {
    hedge: 'Privacy runs and patio edges.',
    'living-wall': 'Lobbies and feature walls.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Decks and amenity edges.',
    'commercial-wall': 'Facades and storefronts.',
  },
  faq: [
    { question: 'Do you work with Woodlands covenants?', answer: HOA_ANSWER },
    { question: 'What does a Woodlands project cost?', answer: PRICE_ANSWER },
    { question: 'What do I send for a Woodlands quote?', answer: SEND_ANSWER },
  ],
};

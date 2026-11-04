import type { MetroData } from './types';
import { HOA_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const SUGAR_LAND: MetroData = {
  slug: 'sugar-land',
  name: 'Sugar Land',
  kind: 'suburb',
  parent: { slug: 'houston', name: 'Houston' },
  mapActive: 'Houston',
  callout: '◦ SUGAR LAND, TX',
  title: 'Artificial hedge installation in Sugar Land, TX',
  lede: 'Hedges and living walls for Sugar Land homes, master-planned communities and businesses. HOA-friendly planning, with no watering.',
  needsTitle: 'What Sugar Land projects usually need',
  needs: [
    {
      title: 'Privacy in master-planned communities',
      text: 'Hedge runs and fence extensions screen a pool, a patio or a property line. Read your covenants first and ask your association for approval before you order.',
    },
    {
      title: 'Greenery for Gulf Coast weather',
      text: 'Hot, humid and wet weather is hard on live hedges. Panels have no soil or irrigation to manage; Standard foliage is UV-stabilized for outdoor sun, and a rinse now and then clears dust and pollen.',
    },
    {
      title: 'Town Square and business frontage',
      text: 'Restaurants, shops and offices around Sugar Land Town Square can use hedge panels and living walls on patio edges and facades.',
    },
  ],
  places: ['Sugar Land Town Square', 'First Colony', 'Sweetwater', 'Riverstone', 'Telfair', 'New Territory'],
  systems: {
    hedge: 'Privacy runs and patio edges.',
    'living-wall': 'Lobbies and feature walls.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Decks and amenity edges.',
    'commercial-wall': 'Facades and storefronts.',
  },
  faq: [
    { question: 'Do you work with Sugar Land HOAs?', answer: HOA_ANSWER },
    { question: 'What does a Sugar Land project cost?', answer: PRICE_ANSWER },
    { question: 'What do I send for a Sugar Land quote?', answer: SEND_ANSWER },
  ],
};

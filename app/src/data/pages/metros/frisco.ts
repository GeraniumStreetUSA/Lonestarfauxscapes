import type { MetroData } from './types';
import { HOA_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const FRISCO: MetroData = {
  slug: 'frisco',
  name: 'Frisco',
  kind: 'suburb',
  parent: { slug: 'dallas', name: 'Dallas' },
  mapActive: 'Dallas',
  callout: '◦ FRISCO, TX',
  title: 'Artificial hedge installation in Frisco, TX',
  lede: 'Hedges and living walls for Frisco homes, offices and entertainment venues. Fire-rated options and HOA-friendly planning, built to your measurements.',
  needsTitle: 'What Frisco projects usually need',
  needs: [
    {
      title: 'Privacy in planned communities',
      text: 'Hedge runs and fence extensions screen a pool, a patio or a property line. In a master-planned neighborhood, read your covenants first.',
    },
    {
      title: 'Pool equipment out of sight',
      text: 'A hedge run can screen a pool pad or equipment. Tell us what has to stay reachable so the quote can account for it.',
    },
    {
      title: 'Venues and business corridors',
      text: 'Offices, restaurants and entertainment spaces around The Star and Frisco Square can use living walls and hedge panels. Fire-rated options are built for NFPA 701; ask for the documentation.',
    },
  ],
  places: ['Starwood', 'Phillips Creek Ranch', 'The Star', 'Stonebriar', 'Frisco Square', 'Panther Creek'],
  systems: {
    hedge: 'Privacy runs and pool screens.',
    'living-wall': 'Offices and venue walls.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Decks and amenity edges.',
    'commercial-wall': 'Facades and storefronts.',
  },
  faq: [
    { question: 'Do you work with Frisco HOAs?', answer: HOA_ANSWER },
    { question: 'What does a Frisco project cost?', answer: PRICE_ANSWER },
    { question: 'What do I send for a Frisco quote?', answer: SEND_ANSWER },
  ],
};

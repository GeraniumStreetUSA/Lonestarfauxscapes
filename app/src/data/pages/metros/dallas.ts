import type { MetroData } from './types';
import { FIRE_ANSWER, HOA_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const DALLAS: MetroData = {
  slug: 'dallas',
  name: 'Dallas',
  kind: 'metro',
  mapActive: 'Dallas',
  callout: '◦ DALLAS, TX',
  title: 'Dallas artificial hedge installation and faux living walls',
  lede: 'Hedges and living walls for Dallas patios, storefronts, pool decks and backyard privacy, built to your measurements. No watering, no trimming.',
  needsTitle: 'What Dallas projects usually need',
  needsIntro:
    'In Dallas the work is often seen from the street, the pool deck and the dining room at once. It has to look built for the site.',
  needs: [
    {
      title: 'Frontage that looks finished',
      text: 'Mounted hedge panels can cover a concrete barrier or an entry line without replacing what is underneath. Retail and restaurant edges in places like Uptown and Deep Ellum are a typical fit.',
    },
    {
      title: 'Privacy that does not read as temporary',
      text: 'For homes in areas like Highland Park and Preston Hollow, a hedge run or a fence extension adds screening at once, with no waiting for plants to fill in and nothing to water through a Texas summer.',
    },
    {
      title: 'Paperwork for commercial scopes',
      text: 'Hospitality and retail buyers often ask for fire documentation before anything else. Fire-rated options are built for NFPA 701; ask for the NFPA 701 documentation for the exact system.',
    },
  ],
  systems: {
    hedge: 'Frontage and privacy runs.',
    'living-wall': 'Feature walls and lobbies.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Decks and amenity edges.',
    'commercial-wall': 'Facades and storefronts.',
  },
  guides: [
    {
      slug: 'dallas-privacy-without-the-watering-a-real-guide',
      title: 'Dallas privacy without the watering',
      text: 'Local planning notes for privacy, living walls and fire documentation.',
    },
    {
      slug: 'green-wall-maintenance-in-texas-what-it-actually-takes',
      title: 'What green wall maintenance takes in Dallas',
      text: 'Living walls against artificial ones, for projects that want the look without the upkeep.',
    },
    {
      slug: 'artificial-green-walls-for-texas-restaurants-and-bars',
      title: 'Artificial green walls for Texas restaurants and bars',
      text: 'For patios and dining rooms that need greenery without a care schedule.',
    },
    {
      slug: 'how-to-get-hoa-approval-for-artificial-hedges-in-texas',
      title: 'How to get HOA approval for artificial hedges',
      text: 'For backyard privacy and fence toppers that need an association to say yes.',
    },
  ],
  setups: [
    { title: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge', text: 'For hospitality and retail scopes.' },
    { title: 'Pool privacy', href: '/pool-privacy-hedge', text: 'Deck and backyard screening.' },
    { title: 'HOA-friendly hedges', href: '/hoa-approved-artificial-hedge', text: 'Planning around an association.' },
  ],
  faq: [
    { question: 'Are the hedges fire-rated?', answer: FIRE_ANSWER },
    {
      question: 'Can I see how it will look before I commit?',
      answer:
        'When it helps, the assessment we email with your rough quote includes a 3D render of the wall or hedge on your site.',
    },
    { question: 'What does a Dallas project cost?', answer: PRICE_ANSWER },
    { question: 'I am in an HOA. Where do I start?', answer: HOA_ANSWER },
    { question: 'What do I send for a Dallas quote?', answer: SEND_ANSWER },
  ],
  suburbs: ['plano', 'frisco', 'irving'],
};

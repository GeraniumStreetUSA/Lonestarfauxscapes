import type { MetroData } from './types';
import { FIRE_ANSWER, HOA_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const SAN_ANTONIO: MetroData = {
  slug: 'san-antonio',
  name: 'San Antonio',
  kind: 'metro',
  mapActive: 'San Antonio',
  callout: '◦ SAN ANTONIO, TX',
  title: 'Artificial hedge and living wall installation in San Antonio, TX',
  lede: 'Privacy hedges, living walls and pool-side screening for San Antonio patios and backyards. No irrigation, no shedding, no live plants to lose to the heat.',
  needsTitle: 'What San Antonio projects usually need',
  needsIntro:
    'In San Antonio, privacy and outdoor living usually drive the decision. The screen has to stay full, ask little of you and look intentional where people spend their time.',
  needs: [
    {
      title: 'Privacy around pools and decks',
      text: 'Pool-edge screening works best when it stays dense and clean, with no clippings and no irrigation. Backyards in areas like Stone Oak and Alamo Heights are a typical fit.',
    },
    {
      title: 'Patios that feel finished',
      text: 'A hedge barrier or a green wall can define a patio without looking temporary. Hospitality spaces near the Pearl and Southtown are a typical fit.',
    },
    {
      title: 'Immediate coverage on a property line',
      text: 'A hedge run or a fence extension screens a perimeter at once, without waiting for plants to grow. UV-rated options exist for hot, exposed walls; ask which product suits direct sun.',
    },
  ],
  systems: {
    hedge: 'Patio barriers and privacy.',
    'living-wall': 'Patio and lobby walls.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Pool decks and patios.',
    'commercial-wall': 'Facades and storefronts.',
  },
  guides: [
    {
      slug: 'artificial-living-walls-and-hedges-in-san-antonio',
      title: 'Artificial living walls and hedges in San Antonio',
      text: 'A local guide for pools, patios and restaurants.',
    },
    {
      slug: 'pool-privacy-solutions-artificial-hedges-for-texas-backyards',
      title: 'Pool privacy for Texas backyards',
      text: 'Screening a pool deck without irrigation or live-hedge upkeep.',
    },
    {
      slug: 'texas-backyard-privacy-solutions-compared-fences-hedges-walls',
      title: 'Backyard privacy compared: fences, hedges, walls',
      text: 'What each option asks of you.',
    },
    {
      slug: 'the-complete-guide-to-artificial-living-walls-in-texas',
      title: 'The complete guide to artificial living walls in Texas',
      text: 'Materials, outdoor performance and install planning.',
    },
  ],
  setups: [
    { title: 'Pool privacy hedges', href: '/pool-privacy-hedge', text: 'Deck and pool-edge screening.' },
    { title: 'Pool living walls', href: '/pool-living-wall', text: 'Greenery for a pool wall.' },
    { title: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge', text: 'For hospitality and multifamily scopes.' },
    { title: 'HOA-friendly hedges', href: '/hoa-approved-artificial-hedge', text: 'Planning around an association.' },
  ],
  faq: [
    {
      question: 'Do you do pool areas?',
      answer:
        'Pool privacy is one of the setups we quote, with hedge panels or a fence extension around a deck. The pool privacy page shows how it goes together.',
    },
    { question: 'Are the hedges fire-rated?', answer: FIRE_ANSWER },
    { question: 'What does a San Antonio project cost?', answer: PRICE_ANSWER },
    { question: 'I am in an HOA. Where do I start?', answer: HOA_ANSWER },
    { question: 'What do I send for a San Antonio quote?', answer: SEND_ANSWER },
  ],
};

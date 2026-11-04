import type { MetroData } from './types';
import { FIRE_ANSWER, HOA_ANSWER, PRICE_ANSWER, SEND_ANSWER } from './shared';

export const AUSTIN: MetroData = {
  slug: 'austin',
  name: 'Austin',
  kind: 'metro',
  mapActive: 'Austin',
  photo: 'austin',
  callout: '◦ AUSTIN, TX',
  title: 'Artificial hedge and living wall installation in Austin, TX',
  lede: 'Hedges and living walls for Austin patios, amenity spaces and backyard privacy. Green on day one, with nothing to water through the summer.',
  needsTitle: 'What Austin projects usually need',
  needsIntro:
    'Austin heat and sun are hard on live screens. Most requests come down to privacy that stays full and a finish that looks designed.',
  needs: [
    {
      title: 'Privacy when live planting fails',
      text: 'A homeowner with an exposed lot, or a remodel next door, gets screening at once instead of waiting on growth. Our Austin project, below, replaced a live screen that was not holding up.',
    },
    {
      title: 'Walls that read as one surface',
      text: 'Amenity, lobby and restaurant walls in places like Downtown, the Domain and South Congress look best when the panels read as one composed surface, not a row of separate pieces.',
    },
    {
      title: 'Mounting that suits the structure',
      text: 'Decks, terraces and existing fences each take a different mount. Send a photo of what the panels will go on. Fire-rated options are built for NFPA 701; ask for the documentation for the exact system.',
    },
  ],
  systems: {
    hedge: 'Privacy runs and patio edges.',
    'living-wall': 'Amenity and lobby walls.',
    'fence-extension': 'More height, same fence.',
    'privacy-wall': 'Decks and amenity edges.',
    'commercial-wall': 'Facades and storefronts.',
  },
  guides: [
    {
      slug: 'artificial-living-walls-for-the-texas-summers',
      title: 'Artificial living walls for Texas summers',
      text: 'What holds up when it is 105°F.',
    },
    {
      slug: 'how-long-do-artificial-hedges-last-in-texas-heat',
      title: 'Artificial hedges in Texas heat',
      text: 'What heat and sun do to hedge panels, and what to look for.',
    },
    {
      slug: 'how-to-get-hoa-approval-for-artificial-hedges-in-texas',
      title: 'How to get HOA approval for artificial hedges',
      text: 'For backyard privacy that needs an association to say yes.',
    },
    {
      slug: 'artificial-hedge-maintenance-and-care-for-texas-homeowners',
      title: 'Artificial hedge care for Texas homeowners',
      text: 'What upkeep is left once the watering is gone.',
    },
  ],
  setups: [
    { title: 'Boxwood hedges', href: '/artificial-boxwood-hedge', text: 'The panel style on our Austin job.' },
    { title: 'Fire-rated hedges', href: '/fire-rated-artificial-hedge', text: 'For hospitality and multifamily scopes.' },
    { title: 'Pool privacy', href: '/pool-privacy-hedge', text: 'Deck and backyard screening.' },
    { title: 'HOA-friendly hedges', href: '/hoa-approved-artificial-hedge', text: 'Planning around an association.' },
  ],
  faq: [
    { question: 'Are the hedges fire-rated?', answer: FIRE_ANSWER },
    {
      question: 'Have you done work in Austin?',
      answer:
        'Yes, one project we can show: artificial boxwood over an existing 16 ft wire mesh screen, about 130 ft long, replacing a live screen. The case study is on this page.',
    },
    {
      question: 'Do I work with you or with my contractor?',
      answer:
        'Send the numbers either way. If a general contractor, designer or property manager is involved, put their contact in the quote request and say who should get the assessment.',
    },
    { question: 'What does an Austin project cost?', answer: PRICE_ANSWER },
    { question: 'I am in an HOA. Where do I start?', answer: HOA_ANSWER },
    { question: 'What do I send for an Austin quote?', answer: SEND_ANSWER },
  ],
};

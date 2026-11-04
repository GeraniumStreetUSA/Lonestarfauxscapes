import { STARTING_PRICES, formatStartingPriceProse } from '../../starting-prices';

/** Answers every metro and suburb FAQ shares, so the wording stays checked in one place. */

export const FIRE_ANSWER =
  'Fire-rated options are built for NFPA 701. Ask for the NFPA 701 documentation for the exact system you choose.';

export const SEND_ANSWER =
  'The length of each run in feet, the height you want, what it will mount to, and a photo of each stretch. We email an assessment and a rough quote, with a 3D render when it helps. A site review sets the final invoice.';

export const PRICE_ANSWER = `Starting prices are published: hedge ${formatStartingPriceProse(STARTING_PRICES.hedge)}, fence extension ${formatStartingPriceProse(STARTING_PRICES['fence-extension'])}, living wall ${formatStartingPriceProse(STARTING_PRICES['living-wall'])}, privacy wall ${formatStartingPriceProse(STARTING_PRICES['privacy-wall'])}. Installation is quoted after a site review, because access, mounting and run length drive it.`;

export const HOA_ANSWER =
  'Texas Property Code Chapter 202 covers how HOAs enforce their deed restrictions. Read your covenants and ask your association for approval before you order. An emailed assessment and, when it helps, a 3D render give the review something concrete to look at. We cannot promise approval.';

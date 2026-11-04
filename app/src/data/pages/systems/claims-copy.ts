/**
 * The owner's corrected statements of 2026-11-04 (Califauxscapes handoff,
 * confirmed for Texas), written once so every page that says them says the
 * same thing: how a fence extension attaches (to the face of the fence or
 * wall, never over its top), the vinyl caveat, the two hedge kinds and their
 * sizes, and fire rating as an upgrade. Prices are never typed here: they
 * come from `starting-prices.ts`. `tests/claims.test.ts` fails if the old
 * claims come back.
 */

import {
  FR_PRICE_NOTE,
  FR_STATEMENT,
  HEDGE_TIERS,
  INSTALLATION_CAVEAT,
  STARTING_PRICES,
  formatHedgePriceProse,
  formatStartingPriceProse,
} from '../../starting-prices.ts';

export const EXTENSION_ATTACHMENT =
  'It attaches to the face of your fence or wall, generally with steel square tube, and comes down 1 ft for every 2 ft of extension height, so a 3 ft extension overlaps the fence by 1.5 ft; the foliage covers the tube at the bottom.';

export const VINYL_CAVEAT = 'Extending a vinyl fence is much harder and generally not recommended.';

/** How a hedge stands and what size it is priced at. */
export const HEDGE_SIZE_NOTE = `A hedge on your fence or wall is priced per linear foot (${HEDGE_TIERS.hedge.build}), and a taller run may be priced to your site. A freestanding hedge is priced at ${HEDGE_TIERS['hedge-freestanding'].build}. Other sizes go in your rough quote.`;

/** "Can it mount on my existing fence?" */
export const HEDGE_MOUNT_ANSWER =
  'Often, yes. A hedge mounts on the face of many fences and walls, about 2 to 3 in deep. A freestanding hedge stands on its own posts, set in concrete. The site review confirms what your fence can carry.';

/** "How is the price set?" on a hedge page: both kinds, each with its tier. */
export const HEDGE_PRICE_ANSWER = `Hedges start ${formatHedgePriceProse('hedge')} (${HEDGE_TIERS.hedge.build}), and a freestanding hedge starts ${formatStartingPriceProse(STARTING_PRICES['hedge-freestanding'])} (${HEDGE_TIERS['hedge-freestanding'].build}) ${INSTALLATION_CAVEAT}. ${FR_PRICE_NOTE} You get a rough quote by email first; the site review sets the final invoice.`;

/** "Is it fire-rated?": not as standard; the upgrade, and who decides. */
export const FIRE_FAQ_ANSWER = `Not as standard. ${FR_STATEMENT} NFPA 701 is the flame test fire marshals ask for on decorative greenery, and your local fire authority (the AHJ) makes the final call on whether a project needs it.`;

/** "Will Texas sun wear it out?" */
export const UV_FAQ_ANSWER =
  "Standard foliage is UV-stabilized for outdoor sun. Indoor-grade foliage is not, and it can fade faster outside. Match the rating to the exposure of your run.";

import { createContext, useContext } from 'react';

/**
 * Where the "Get a free quote" buttons point: the quote page, `/quote`
 * (`#quote` on that page itself). Layout provides it from the route, so
 * nothing reads the address bar during render.
 */
export const QuoteHrefContext = createContext('/quote');

export function useQuoteHref(): string {
  return useContext(QuoteHrefContext);
}

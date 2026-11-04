import { createContext, useContext } from 'react';

/**
 * Where the "Get a free quote" buttons in the shared chrome point: `#quote`
 * on a page that carries the quote form, `/contact#quote` on one that does
 * not. Layout provides it from the route, so nothing reads the address bar
 * during render.
 */
export const QuoteHrefContext = createContext('#quote');

export function useQuoteHref(): string {
  return useContext(QuoteHrefContext);
}

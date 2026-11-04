import { useEffect, type ComponentType } from 'react';

import { installClickTracking } from './lib/analytics';
import type { PageProps, Route } from './routes';

/**
 * The page for one route. There is no client router: every internal link is a
 * plain <a href> to a prerendered page, so the route is fixed for the life of
 * the page and the entry points hand it in with its loaded component.
 */
export default function App({ route, Page }: { route: Route; Page: ComponentType<PageProps> }) {
  useEffect(() => installClickTracking(), []);

  /* The prerender writes the head; in dev there is no prerender, so tabs get their title here. */
  useEffect(() => {
    document.title = route.title;
  }, [route.title]);

  return <Page route={route} />;
}

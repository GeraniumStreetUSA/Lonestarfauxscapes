import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

import App from './App';
import { resolveRoute } from './routes';

/** The prerender's entry (scripts/prerender.mjs): one route's page as an HTML string. */
export async function render(path: string): Promise<{ html: string }> {
  const route = resolveRoute(path);
  const { default: Page } = await route.load();
  const html = renderToString(
    <StrictMode>
      <App route={route} Page={Page} />
    </StrictMode>,
  );
  return { html };
}

export { allRoutes } from './routes';
export { buildHead, buildLlmsTxt, buildRobotsTxt, buildSitemap } from './lib/seo';

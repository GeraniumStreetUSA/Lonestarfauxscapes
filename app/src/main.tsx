import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import App from './App';
import './index.css';
import './styles/page-kit.css';
import { IS_SHARE } from './lib/asset';
import { installSharePreview } from './lib/share-preview';
import { resolveRoute } from './routes';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root');

/* The share build is a preview link served at an arbitrary path, so it always
   shows the homepage. Everywhere else the path picks the page; an unknown
   path gets the 404 page. */
const route = resolveRoute(IS_SHARE ? '/' : window.location.pathname);
// Load the page before hydrating, so the first client render matches the prerendered HTML.
const { default: Page } = await route.load();

const app = (
  <StrictMode>
    <App route={route} Page={Page} />
  </StrictMode>
);

if (IS_SHARE) installSharePreview();

// Hydrate prerendered markup when there is some, render otherwise (dev, share).
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

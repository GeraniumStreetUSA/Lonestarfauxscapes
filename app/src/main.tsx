import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import App from './App';
import './index.css';
import { IS_SHARE } from './lib/asset';
import { installSharePreview } from './lib/share-preview';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root');

const app = (
  <StrictMode>
    <HelmetProvider>
      {/* The share build is a preview link served at an arbitrary path, so it
          routes in memory and never rewrites the address bar. */}
      {IS_SHARE ? (
        <MemoryRouter>
          <App />
        </MemoryRouter>
      ) : (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )}
    </HelmetProvider>
  </StrictMode>
);

if (IS_SHARE) installSharePreview();

// Hydrate prerendered markup when there is some (Phase 4), render otherwise.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

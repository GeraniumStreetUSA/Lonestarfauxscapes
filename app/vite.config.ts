import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The homepage sections are static imports and nothing reads `window` during
// render, so a prerender step can be added later without changing this file's
// shape (see tasks/phase2-homepage-brief.md).
// `--mode share` builds a private preview link: relative paths, so it runs
// from whatever path it is served at (npm run build:share).
export default defineConfig(({ mode }) => ({
  base: mode === 'share' ? './' : '/',
  plugins: [react()],
  server: { port: 5180, strictPort: true },
  preview: { port: 5180, strictPort: true },
  build: { target: 'es2022' },
}));

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Nothing reads `window` during render, so the prerender (scripts/prerender.mjs)
// renders every route through the server build (src/entry-server.tsx). The
// client build writes a manifest so each page can preload its own chunk.
// `--mode share` builds a private preview link: relative paths, one bundle (no
// lazy chunks), so it runs from whatever path it is served at
// (npm run build:share).
export default defineConfig(({ mode, isSsrBuild }) => ({
  base: mode === 'share' ? './' : '/',
  plugins: [react()],
  server: { port: 5180, strictPort: true },
  preview: { port: 5180, strictPort: true },
  build: {
    target: 'es2022',
    manifest: true,
    rollupOptions: {
      output: {
        // Unhashed server chunk names: the prerender matches them to the client manifest by name.
        ...(isSsrBuild ? { chunkFileNames: 'chunks/[name].js' } : {}),
        ...(mode === 'share' ? { inlineDynamicImports: true } : {}),
      },
    },
  },
}));

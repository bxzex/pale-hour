import { defineConfig } from 'vite';

// GitHub Pages serves the project at /<repo>/ — override with BASE_PATH if you fork
// under a different name, or set it to '/' for a custom domain.
const base = process.env.BASE_PATH ?? '/pale-hour/';

export default defineConfig({
  base,
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
  },
  server: {
    open: true,
  },
});

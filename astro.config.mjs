import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), solidJs()],
  site: 'https://www.baip.ai',
  base: '/aggregator',
  cacheDir: './cache', // Use custom cache directory for GitHub Actions caching
  build: {
    assets: '_astro'
  },
  vite: {
    build: {
      assetsInlineLimit: 0 // Ensure assets are always externalized for proper path handling
    }
  }
});

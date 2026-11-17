import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  // Statyczny build = maksymalna szybkość + Cloudflare Pages bez serwera
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});

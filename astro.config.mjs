// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config.js';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [sitemap({
    i18n: { defaultLocale: 'it', locales: { it: 'it-IT' } },
    // La privacy resta indicizzabile ma fuori dalla sitemap: non è una pagina
    // per cui vogliamo competere. /stile è la guida di stile: serve a me
    // durante la costruzione, non ha niente da dire a chi cerca su Google.
    filter: (pagina) => !pagina.includes('/privacy') && !pagina.includes('/stile'),
  }), react()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
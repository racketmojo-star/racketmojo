import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import mdx from '@astrojs/mdx';

const LOCALES = ['en', 'ar', 'es'];
const DEFAULT_LOCALE = 'en';

export default defineConfig({
  site: 'https://racketmojo.com',
  integrations: [mdx()],

  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: LOCALES,
    routing: { prefixDefaultLocale: true },
  },

  output: 'static',
  adapter: netlify(),

  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },

  vite: {
    resolve: { alias: { '@': '/src' } },
  },
});

import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// Supported languages
const LOCALES = ['en', 'ar', 'es'];
const DEFAULT_LOCALE = 'en';

export default defineConfig({
  site: 'https://racketmojo.com',

  // i18n routing: /en/blog/post, /ar/blog/post, /es/blog/post
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: LOCALES,
    routing: {
      prefixDefaultLocale: true,  // /en/ prefix even for default
    },
  },

  // Netlify adapter — static output
  output: 'static',
  adapter: netlify(),

  // Markdown with Content Collections
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },

  // Vite aliases
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});

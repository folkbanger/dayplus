// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://dayplus.app',
  output: 'static',
  integrations: [mdx()],
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  vite: {
    // Browsers we support. With these targets the CSS minifier keeps the -webkit- prefixes
    // older iPhones need (e.g. -webkit-backdrop-filter) next to the standard property.
    build: { assetsInlineLimit: 0, cssTarget: ['safari15', 'ios15', 'chrome100', 'firefox100', 'edge100'] },
  },
  server: { host: true },
});

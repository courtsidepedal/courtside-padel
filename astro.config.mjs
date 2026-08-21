// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { unified } from '@astrojs/markdown-remark';
import remarkProductCallout from './src/lib/remark-product-callout.mjs';

// https://astro.build/config
export default defineConfig({
  // TODO: swap in the real domain once it's purchased/connected.
  site: 'https://courtsidepadel.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  markdown: {
    // Powers the {{callout: racket-slug}} inline product callout syntax
    // available inside guide articles — see src/lib/remark-product-callout.mjs.
    processor: unified({ remarkPlugins: [remarkProductCallout] }),
  },
});

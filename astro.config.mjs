// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // TODO: swap in the real domain once it's purchased/connected.
  site: 'https://courtsidepadel.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
});

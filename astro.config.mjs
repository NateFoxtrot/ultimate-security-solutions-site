import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://usstech.net',
  base: '/ultimate-security-solutions-site/',
  trailingSlash: 'never',
  integrations: [sitemap()],
});

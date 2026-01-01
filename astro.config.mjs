// @ts-check

import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.nahian.xyz',
	integrations: [
		expressiveCode({
			themes: ['github-dark'],
			styleOverrides: {
				borderRadius: '8px',
				codeFontFamily: 'JetBrains Mono, monospace',
			},
		}),
		mdx(),
		sitemap(),
	],
});

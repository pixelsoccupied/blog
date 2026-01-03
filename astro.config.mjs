// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import remarkToc from 'remark-toc';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.nahian.xyz',
	markdown: {
		remarkPlugins: [[remarkToc, { heading: 'contents|toc|table of contents' }]],
	},
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

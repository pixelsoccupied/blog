export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// Track views when serving blog post pages (server-side, non-blocking)
		if (url.pathname.startsWith('/blog/') && url.pathname !== '/blog/') {
			const slug = url.pathname.split('/').filter(Boolean).pop();

			if (slug) {
				// Increment view count in background (non-blocking)
				ctx.waitUntil(
					env.VIEWS.get(slug).then((val) => {
						const count = (parseInt(val, 10) || 0) + 1;
						return env.VIEWS.put(slug, count.toString());
					})
				);
			}
		}

		// Read-only API to get view counts (for displaying on page)
		if (url.pathname.startsWith('/api/views/')) {
			const slug = url.pathname.replace('/api/views/', '');

			if (!slug) {
				return new Response(JSON.stringify({ error: 'Missing slug' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				});
			}

			const count = parseInt(await env.VIEWS.get(slug), 10) || 0;

			return new Response(JSON.stringify({ slug, count }), {
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache',
				},
			});
		}

		// For everything else, let the assets binding handle it
		return env.ASSETS.fetch(request);
	},
};

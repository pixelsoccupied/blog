const ALLOWED_ORIGINS = ['https://blog.nahian.xyz', 'http://localhost:4321'];

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// Handle view counter API
		if (url.pathname.startsWith('/api/views/')) {
			// Check origin/referer - only allow requests from our site
			const origin = request.headers.get('origin');
			const referer = request.headers.get('referer');
			const isAllowed =
				ALLOWED_ORIGINS.some((o) => origin === o) ||
				ALLOWED_ORIGINS.some((o) => referer?.startsWith(o));

			if (!isAllowed) {
				return new Response(JSON.stringify({ error: 'Forbidden' }), {
					status: 403,
					headers: { 'Content-Type': 'application/json' },
				});
			}

			const slug = url.pathname.replace('/api/views/', '');

			if (!slug) {
				return new Response(JSON.stringify({ error: 'Missing slug' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				});
			}

			let count = parseInt(await env.VIEWS.get(slug), 10) || 0;

			if (request.method === 'POST') {
				count++;
				await env.VIEWS.put(slug, count.toString());
			}

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

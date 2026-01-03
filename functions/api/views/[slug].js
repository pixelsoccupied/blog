export async function onRequest(context) {
	const { params, env, request } = context;
	const slug = params.slug;

	if (!slug) {
		return new Response(JSON.stringify({ error: 'Missing slug' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Get current count
	let count = parseInt(await env.VIEWS.get(slug), 10) || 0;

	// Increment on POST (actual page view)
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

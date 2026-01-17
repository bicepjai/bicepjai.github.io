import { error } from '@sveltejs/kit';
import { getPosts } from '$lib/utils/posts.js';

export async function load({ params }) {
	try {
		const post = await import(`../../../../my-blog-posts/posts/${params.slug}.md`);

		return {
			content: post.default,
			metadata: post.metadata,
			slug: params.slug
		};
	} catch {
		throw error(404, `Post not found: ${params.slug}`);
	}
}

// Generate entries for prerendering
export async function entries() {
	const posts = await getPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

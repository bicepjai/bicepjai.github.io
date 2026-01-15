/**
 * Load all blog posts from the posts directory
 * @returns {Promise<Array<{slug: string, title: string, date: string, description: string, categories: string[]}>>}
 */
export async function getPosts() {
	const modules = import.meta.glob('/src/posts/*.md', { eager: true });

	const posts = [];

	for (const path in modules) {
		const module = modules[path];
		const slug = path.split('/').pop().replace('.md', '');

		if (module.metadata) {
			posts.push({
				slug,
				...module.metadata
			});
		}
	}

	// Sort by date descending
	posts.sort((a, b) => new Date(b.date) - new Date(a.date));

	return posts;
}

/**
 * Calculate reading time for content
 * @param {string} content
 * @returns {number} Minutes to read
 */
export function getReadingTime(content) {
	const wordsPerMinute = 200;
	const words = content.trim().split(/\s+/).length;
	return Math.ceil(words / wordsPerMinute);
}

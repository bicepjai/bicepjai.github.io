<script>
	import { resolveRoute } from '$app/paths';

	let { posts = [] } = $props();

	// Group posts by year
	function groupByYear(posts) {
		const grouped = {};
		for (const post of posts) {
			const year = new Date(post.date).getFullYear();
			if (!grouped[year]) {
				grouped[year] = [];
			}
			grouped[year].push(post);
		}
		// Sort years descending
		return Object.entries(grouped).sort(([a], [b]) => Number(b) - Number(a));
	}

	function formatDate(dateStr) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	const groupedPosts = $derived(groupByYear(posts));
</script>

<div class="font-mono">
	<p class="text-matrix-green-dim mb-4">$ ls -la ./blog</p>

	{#each groupedPosts as [year, yearPosts] (year)}
		<div class="mb-4">
			<p class="text-matrix-green-dim">drwxr-xr-x {year}/</p>
			{#each yearPosts as post (post.slug)}
				<a
					href={resolveRoute('/blog/[slug]', { slug: post.slug })}
					class="group hover:text-matrix-green-bright ml-4 flex items-center justify-between gap-4 py-1 transition-colors"
				>
					<span class="flex items-center gap-2">
						<span class="file-permissions">-rw-r--r--</span>
						<span class="text-matrix-green group-hover:text-matrix-green-bright"
							>{post.slug}.md</span
						>
					</span>
					<span class="text-matrix-green-dim">{formatDate(post.date)}</span>
				</a>
			{/each}
		</div>
	{/each}

	<p class="text-matrix-green-dim mt-4">&gt; {posts.length} files</p>
</div>

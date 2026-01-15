<script>
	import TerminalWindow from '$lib/components/TerminalWindow.svelte';
	import ProseContent from '$lib/components/ProseContent.svelte';
	import { resolveRoute } from '$app/paths';
	import { matrixEnabled } from '$lib/stores/matrix.js';

	let { data } = $props();

	function formatDate(dateStr) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{data.metadata.title} | bicepjai</title>
	<meta name="description" content={data.metadata.description || data.metadata.title} />
</svelte:head>

<TerminalWindow path="~/blog" matrixEnabled={$matrixEnabled}>
	<div class="font-mono">
		<p class="text-matrix-green-dim mb-4">$ cat ./blog/{data.slug}.md</p>
	</div>

	<div class="border-matrix-green/30 my-4 border-t"></div>

	<article>
		<header class="mb-8">
			<h1 class="text-matrix-green mb-2 font-mono text-2xl font-semibold md:text-3xl">
				{data.metadata.title}
			</h1>
			<p class="text-matrix-green-dim font-mono text-sm">
				&gt; date: {formatDate(data.metadata.date)}
				{#if data.metadata.categories?.length}
					| tags: {data.metadata.categories.join(', ')}
				{/if}
			</p>
		</header>

		<ProseContent>
			<data.content />
		</ProseContent>
	</article>

	<div class="border-matrix-green/30 my-8 border-t"></div>

	<a
		href={resolveRoute('/', {})}
		class="text-matrix-green hover:text-matrix-green-bright inline-block font-mono text-sm transition-colors"
	>
		$ cd ..
	</a>
</TerminalWindow>

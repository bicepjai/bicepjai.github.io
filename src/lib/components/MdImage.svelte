<script>
	let { src, alt = '' } = $props();
	let dimmed = $state(true);

	function getFilename(path) {
		return path.split('/').pop();
	}
</script>

<figure class="my-6 max-w-full">
	<div class="mb-2 flex items-center justify-between">
		<p class="text-matrix-green-dim font-mono text-sm">$ feh {getFilename(src)}</p>
		<button
			onclick={() => (dimmed = !dimmed)}
			class="font-mono text-xs transition-colors {dimmed
				? 'text-matrix-green-bright'
				: 'text-matrix-green-dim hover:text-matrix-green'}"
			title={dimmed ? 'Brighten image' : 'Dim image for night reading'}
		>
			[{dimmed ? 'brighten' : 'dim'}]
		</button>
	</div>
	<div class="border-matrix-green/20 shadow-matrix-glow-sm relative rounded-lg border p-2">
		<img {src} {alt} class="h-auto max-w-full rounded transition-all" class:dimmed loading="lazy" />
	</div>
	{#if alt}
		<figcaption class="text-matrix-green-dim mt-2 font-mono text-sm">
			&gt; {alt}
		</figcaption>
	{/if}
</figure>

<style>
	.dimmed {
		filter: brightness(0.4);
	}
</style>

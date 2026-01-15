<script>
	let { src, alt = '', caption = '' } = $props();
	let dimmed = $state(true);

	function getFilename(path) {
		return path.split('/').pop();
	}
</script>

<figure class="my-6">
	<div class="mb-2 flex items-center justify-between">
		<p class="text-matrix-green-dim font-mono text-sm">$ feh {getFilename(src)}</p>
		<button
			onclick={() => (dimmed = !dimmed)}
			class="text-matrix-green-dim hover:text-matrix-green font-mono text-xs transition-colors"
			title={dimmed ? 'Brighten image' : 'Dim image for night reading'}
		>
			[{dimmed ? 'brighten' : 'dim'}]
		</button>
	</div>
	<div class="border-matrix-green/20 shadow-matrix-glow-sm relative rounded-lg border p-2">
		<img {src} {alt} class="w-full rounded" loading="lazy" />
		{#if dimmed}
			<div
				class="pointer-events-none absolute inset-2 rounded bg-black/50 transition-opacity"
			></div>
		{/if}
	</div>
	{#if caption || getFilename(src)}
		<figcaption class="text-matrix-green-dim mt-2 font-mono text-sm">
			&gt; {getFilename(src)}{caption ? ` - ${caption}` : ''}
		</figcaption>
	{/if}
</figure>

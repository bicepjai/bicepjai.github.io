<script>
	let { path = '~', children, matrixEnabled = false } = $props();
	let minimized = $state(false);

	function handleButtonClick() {
		if (matrixEnabled) {
			minimized = !minimized;
		}
	}
</script>

<div
	class="border-matrix-green/30 bg-matrix-bg-secondary shadow-matrix-glow mx-auto max-w-4xl rounded-lg border"
>
	<!-- Terminal chrome (title bar) -->
	<div class="bg-terminal-chrome flex items-center gap-2 rounded-t-lg px-4 py-2">
		<!-- Traffic light buttons -->
		<button
			onclick={handleButtonClick}
			class="h-3 w-3 rounded-full bg-red-500 transition-transform hover:scale-110"
			class:cursor-pointer={matrixEnabled}
			class:cursor-default={!matrixEnabled}
			title={matrixEnabled ? (minimized ? 'Show content' : 'Hide content') : ''}
		></button>
		<button
			onclick={handleButtonClick}
			class="h-3 w-3 rounded-full bg-yellow-500 transition-transform hover:scale-110"
			class:cursor-pointer={matrixEnabled}
			class:cursor-default={!matrixEnabled}
			title={matrixEnabled ? (minimized ? 'Show content' : 'Hide content') : ''}
		></button>
		<button
			onclick={handleButtonClick}
			class="h-3 w-3 rounded-full bg-green-500 transition-transform hover:scale-110"
			class:cursor-pointer={matrixEnabled}
			class:cursor-default={!matrixEnabled}
			title={matrixEnabled ? (minimized ? 'Show content' : 'Hide content') : ''}
		></button>
		<!-- Terminal path -->
		<span class="text-matrix-green ml-4 font-mono text-sm">bicepjai@web:{path}</span>
	</div>
	<!-- Terminal content -->
	{#if !minimized}
		<div class="p-6">
			{@render children()}
		</div>
	{:else}
		<div class="text-matrix-green-dim p-6 text-center font-mono text-sm">
			[minimized - click buttons to restore]
		</div>
	{/if}
</div>

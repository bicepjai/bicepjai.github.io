<script>
	import '../lib/styles/app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import MatrixRain from '$lib/components/MatrixRain.svelte';
	import { matrixEnabled } from '$lib/stores/matrix.js';

	let { children } = $props();

	function toggleMatrix() {
		matrixEnabled.update((v) => !v);
	}
</script>

<svelte:head>
	<title>bicepjai</title>
</svelte:head>

<MatrixRain enabled={$matrixEnabled} />

<div class="flex min-h-screen flex-col py-8">
	<Navigation onMatrixToggle={toggleMatrix} matrixEnabled={$matrixEnabled} />

	<main class="flex-1 px-4">
		{@render children()}
	</main>

	<footer class="mx-auto mt-auto w-full max-w-4xl px-4 pt-16 font-mono text-sm">
		<div class="border-matrix-green/20 bg-matrix-bg-secondary rounded-lg border px-6 py-3">
			<div class="flex items-center justify-between">
				<div class="text-matrix-green-dim">
					<span>:Scribbles With Intent</span>
				</div>
				<div class="text-matrix-green-dim">
					<span>bicepjai</span>
				</div>
			</div>
		</div>
	</footer>
</div>

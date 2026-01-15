<script>
	import TerminalWindow from '$lib/components/TerminalWindow.svelte';
	import { resolveRoute } from '$app/paths';
	import { matrixEnabled } from '$lib/stores/matrix.js';
</script>

<svelte:head>
	<title>About | bicepjai</title>
	<meta name="description" content="About bicepjai" />
</svelte:head>

<TerminalWindow path="~/about" matrixEnabled={$matrixEnabled}>
	<div class="font-mono">
		<p class="text-matrix-green-dim mb-4">$ cat ./about/README.md</p>
	</div>

	<div class="border-matrix-green/30 my-4 border-t"></div>

	<article class="prose-matrix font-mono">
		<h1>About</h1>

		<p>
			Software engineer. Statistician. Struggling writer. Quintessential dilettante dipping my toes
			into mathematics, physics, astronomy, economics, and philosophy.
		</p>
		<p>Passionate about exploring them all without claiming mastery in any.</p>
		<p>
			At my core, I'm a firm believer that knowledge is the ultimate virtue, empowering curiosity
			and growth in every pursuit.
		</p>

		<h2>Connect</h2>
		<p>
			Find me on <a href="https://github.com/bicepjai" target="_blank" rel="noopener">GitHub</a> and
			<a href="https://news.ycombinator.com/user?id=bicepjai" target="_blank" rel="noopener">HN</a>.
		</p>
	</article>

	<div class="border-matrix-green/30 my-8 border-t"></div>

	<a
		href={resolveRoute('/', {})}
		class="text-matrix-green hover:text-matrix-green-bright inline-block font-mono text-sm transition-colors"
	>
		$ cd ..
	</a>
</TerminalWindow>

<script>
	import TerminalWindow from '$lib/components/TerminalWindow.svelte';
	import { resolveRoute } from '$app/paths';
	import { matrixEnabled } from '$lib/stores/matrix.js';

	const projects = [
		{
			name: 'ohgodmodels.xyz',
			url: 'https://ohgodmodels.xyz/',
			description:
				'Philosophy meets machine learning. Exploring the deeper questions behind AI and the models we build.'
		},
		{
			name: 'debugarguments.app',
			url: 'https://debugarguments.app/',
			description:
				'Tools for debugging reasoning and arguments. Sharpen your thinking through structured analysis.'
		},
		{
			name: 'tokenizing-lab',
			url: 'https://tokenizing-lab.debugarguments.app/',
			description:
				'Explore how text becomes tokens. Visualize BPE, WordPiece, and other tokenization algorithms in action.'
		},
		{
			name: 'positional-encoding-lab',
			url: 'https://positional-encoding-lab.debugarguments.app/',
			description:
				'Interactive visualizations for understanding positional encodings. See how transformers know where tokens are.'
		}
	];
</script>

<svelte:head>
	<title>Tinker | bicepjai</title>
	<meta name="description" content="Projects and experiments by bicepjai" />
</svelte:head>

<TerminalWindow path="~/tinker" matrixEnabled={$matrixEnabled}>
	<div class="font-mono">
		<p class="text-matrix-green-dim mb-4">$ for f in ./tinker/*; do cat "$f" | head -2; done</p>
	</div>

	<div class="border-matrix-green/30 my-4 border-t"></div>

	<div class="space-y-6 font-mono">
		{#each projects as project (project.name)}
			<div>
				<p class="text-matrix-green-dim text-sm">==&gt; {project.name} &lt;==</p>
				<a
					href={project.url}
					target="_blank"
					rel="noopener"
					class="text-matrix-green hover:text-matrix-green-bright mt-1 block transition-colors"
				>
					{project.url}
				</a>
				<p class="text-matrix-green-dim mt-1 text-sm leading-relaxed">
					{project.description}
				</p>
			</div>
		{/each}
	</div>

	<div class="border-matrix-green/30 my-8 border-t"></div>

	<a
		href={resolveRoute('/', {})}
		class="text-matrix-green hover:text-matrix-green-bright inline-block font-mono text-sm transition-colors"
	>
		$ cd ..
	</a>
</TerminalWindow>

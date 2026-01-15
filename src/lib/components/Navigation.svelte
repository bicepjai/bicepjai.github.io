<script>
	import { page } from '$app/state';
	import { resolveRoute } from '$app/paths';

	let { onMatrixToggle = () => {}, matrixEnabled = false } = $props();

	const navItems = [
		{ path: '/', label: '~/blog' },
		{ path: '/tinker', label: '~/tinker' },
		{ path: '/about', label: '~/about' }
	];

	function isActive(path) {
		if (path === '/') {
			return page.url.pathname === '/' || page.url.pathname.startsWith('/blog');
		}
		return page.url.pathname.startsWith(path);
	}
</script>

<nav class="mx-auto mb-8 w-full max-w-4xl px-4">
	<div
		class="border-matrix-green/20 bg-matrix-bg-secondary flex flex-wrap items-center justify-between gap-4 rounded-lg border px-6 py-3"
	>
		<div class="flex flex-wrap gap-6">
			{#each navItems as item (item.path)}
				<a
					href={resolveRoute(item.path, {})}
					class="font-mono text-sm transition-colors {isActive(item.path)
						? 'text-matrix-green-bright'
						: 'text-matrix-green hover:text-matrix-green-bright'}"
				>
					{item.label}
				</a>
			{/each}
		</div>
		<button
			onclick={onMatrixToggle}
			class="font-mono text-sm transition-colors {matrixEnabled
				? 'text-matrix-green-bright'
				: 'text-matrix-green-dim hover:text-matrix-green'}"
		>
			[{matrixEnabled ? 'exit' : 'enter'} the matrix]
		</button>
	</div>
</nav>

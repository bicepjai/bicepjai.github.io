<script>
	import { onMount } from 'svelte';

	let { children } = $props();
	let container = $state(null);

	onMount(() => {
		if (!container) return;

		const images = container.querySelectorAll('img');
		images.forEach((img) => {
			// Skip if already wrapped
			if (img.parentElement?.classList.contains('image-wrapper')) return;

			// Create wrapper structure
			const figure = document.createElement('figure');
			figure.className = 'my-6';

			// Header with filename and dim button
			const header = document.createElement('div');
			header.className = 'mb-2 flex items-center justify-between gap-2';

			const filename = img.src.split('/').pop();
			const label = document.createElement('span');
			label.className = 'text-matrix-green-dim font-mono text-sm truncate min-w-0 flex-1';
			label.textContent = `$ feh ${filename}`;

			const button = document.createElement('button');
			button.className =
				'font-mono text-xs transition-colors text-matrix-green-bright flex-shrink-0';
			button.title = 'Brighten image';
			button.textContent = '[brighten]';

			let dimmed = true;
			img.style.filter = 'brightness(0.4)';
			img.style.transition = 'filter 0.3s ease';
			button.addEventListener('click', () => {
				dimmed = !dimmed;
				img.style.filter = dimmed ? 'brightness(0.4)' : '';
				img.style.transition = 'filter 0.3s ease';
				button.textContent = dimmed ? '[brighten]' : '[dim]';
				button.title = dimmed ? 'Brighten image' : 'Dim image for night reading';
				button.className = dimmed
					? 'font-mono text-xs transition-colors text-matrix-green-bright flex-shrink-0'
					: 'font-mono text-xs transition-colors text-matrix-green-dim hover:text-matrix-green flex-shrink-0';
			});

			header.appendChild(label);
			header.appendChild(button);

			// Image container
			const wrapper = document.createElement('div');
			wrapper.className =
				'image-wrapper border-matrix-green/20 shadow-matrix-glow-sm rounded-lg border p-2 overflow-hidden';
			img.style.maxWidth = '100%';
			img.style.height = 'auto';
			img.style.display = 'block';

			// Move image into wrapper with header inside
			img.parentNode.insertBefore(figure, img);
			wrapper.appendChild(header);
			wrapper.appendChild(img);
			figure.appendChild(wrapper);

			// Add caption if alt text exists
			if (img.alt) {
				const caption = document.createElement('figcaption');
				caption.className = 'text-matrix-green-dim mt-2 font-mono text-sm';
				caption.innerHTML = `&gt; ${img.alt}`;
				figure.appendChild(caption);
			}
		});
	});
</script>

<div bind:this={container} class="prose-matrix w-full">
	{@render children()}
</div>

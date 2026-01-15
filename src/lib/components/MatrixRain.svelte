<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { enabled = false } = $props();
	let canvas;
	let ctx;
	let animationId;
	let drops = [];
	let lastTime = 0;
	let stopping = false;
	const frameInterval = 1000 / 25;

	const quotes = [
		'அறிவேசக்தியறிவேவெற்றிஅறிவேவிடுதலை',
		'கற்றதுகைமண்ணளவுகல்லாததுஉலகளவு',
		'யாதும்ஊரேயாவரும்கேளிர்',
		'அன்பும்அறிவும்இணைந்ததேவாழ்க்கை',
		'கல்விகரையிலகடலேபோன்றது',
		'வெற்றிக்குமுயற்சியேவழி',
		'நேர்மையேசிறந்தகொள்கை',
		'பொறுமையேபேரறிவு',
		'தன்னம்பிக்கையேவெற்றியின்முதல்படி',
		'உழைப்பேஉயர்வின்அடிப்படை'
	];

	function initCanvas(startFromTop = true) {
		if (!canvas || !browser) return;

		ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const fontSize = 14;
		const columns = Math.floor(canvas.width / fontSize);

		drops = [];
		for (let i = 0; i < columns; i++) {
			const quote = quotes[Math.floor(Math.random() * quotes.length)];
			drops.push({
				x: i * fontSize,
				y: startFromTop ? -Math.random() * canvas.height : Math.random() * canvas.height,
				speed: 0.5 + Math.random() * 0.5,
				fontSize,
				active: true,
				quote: quote,
				charIndex: Math.floor(Math.random() * quote.length)
			});
		}
		stopping = false;
	}

	function draw(timestamp) {
		if (!ctx) return;

		if (stopping) {
			const allDone = drops.every((d) => !d.active);
			if (allDone) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				cancelAnimationFrame(animationId);
				return;
			}
		}

		if (timestamp - lastTime < frameInterval) {
			animationId = requestAnimationFrame(draw);
			return;
		}
		lastTime = timestamp;

		// Semi-transparent black - creates the trail fade
		ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.font = '14px monospace';

		for (const drop of drops) {
			if (!drop.active) continue;

			const char = drop.quote[drop.charIndex];
			drop.charIndex = (drop.charIndex + 1) % drop.quote.length;

			// Green character with subtle glow
			ctx.shadowColor = '#0f0';
			ctx.shadowBlur = 2;
			ctx.fillStyle = '#0f0';
			ctx.fillText(char, drop.x, drop.y);

			// Reset shadow
			ctx.shadowBlur = 0;

			// Move down
			drop.y += drop.fontSize * drop.speed;

			// Reset when off screen
			if (drop.y > canvas.height + 50) {
				if (stopping) {
					drop.active = false;
				} else {
					drop.y = -Math.random() * 100;
					drop.speed = 0.5 + Math.random() * 0.5;
					drop.quote = quotes[Math.floor(Math.random() * quotes.length)];
					drop.charIndex = 0;
				}
			}
		}

		animationId = requestAnimationFrame(draw);
	}

	function handleResize() {
		if (canvas && browser) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		if (enabled) initCanvas(true);
	}

	function handleVisibilityChange() {
		if (document.hidden) {
			cancelAnimationFrame(animationId);
		} else if (enabled) {
			animationId = requestAnimationFrame(draw);
		}
	}

	onMount(() => {
		if (canvas && browser) {
			ctx = canvas.getContext('2d');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		window.addEventListener('resize', handleResize);
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', handleResize);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});

	$effect(() => {
		if (enabled) {
			stopping = false;
			initCanvas(true);
			animationId = requestAnimationFrame(draw);
		} else if (drops.length > 0) {
			stopping = true;
			if (drops.some((d) => d.active)) {
				animationId = requestAnimationFrame(draw);
			}
		}
	});
</script>

<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 -z-10"></canvas>

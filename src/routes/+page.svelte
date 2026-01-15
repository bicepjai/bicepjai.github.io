<script>
	import TerminalWindow from '$lib/components/TerminalWindow.svelte';
	import BlogList from '$lib/components/BlogList.svelte';
	import { matrixEnabled } from '$lib/stores/matrix.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>bicepjai | Blog</title>
	<meta name="description" content="bicepjai's terminal portfolio and blog" />
</svelte:head>

<TerminalWindow path="~/blog" matrixEnabled={$matrixEnabled}>
	<BlogList posts={data.posts} />
</TerminalWindow>

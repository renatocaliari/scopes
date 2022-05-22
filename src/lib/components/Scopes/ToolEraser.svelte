<script>
	import { v4 as uuidv4 } from 'uuid';
	import { onMount } from 'svelte';

	export let content = '';
	let iframe;

	onMount(async () => {
		console.log('iframe:', iframe);
		console.log('content:', content);
		console.log('iframe.contentWindow:', iframe.contentWindow);
		if (iframe && iframe.contentWindow) {
			iframe.contentWindow.postMessage(content, '*');
		}
	});
</script>

<iframe
	bind:this={iframe}
	rows="100%,*"
	frameborder="0"
	marginheight="0"
	marginwidth="0"
	width="100%"
	height="100%"
	scrolling="auto"
	src={'https://app.tryeraser.com/integration/scopefully/' + uuidv4()}
	title="preview"
/>

<style>
	iframe {
		display: block;
		width: 100%;
		border: none;
		overflow-y: auto;
		overflow-x: hidden;
	}

	html,
	body,
	div,
	iframe {
		margin: 0px;
		padding: 0px;
		height: 100%;
		border: none;
	}
</style>

<script context="module">
	import '../app.css';
	import { fly } from 'svelte/transition';
	import { page, session, navigating } from '$app/stores';

	import LoadingPageProgressBar from '$lib/components/LoadingPageProgressBar.svelte';
	import Header from '$lib/components/Header.svelte';
	import { notificationData } from '$lib/stores/notificationStore';
</script>

<LoadingPageProgressBar />

<Header />

<main class="prose p-2 mx-auto max-w-screen-2xl items-center">
	{#if $navigating}
		Loading...
	{:else}
		<slot />
	{/if}
</main>

<footer>
	<p />
</footer>

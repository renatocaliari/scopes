<script context="module">
	import '../app.css';
	import { fly } from 'svelte/transition';
	import { page, session, navigating } from '$app/stores';

	import LoadingPageProgressBar from '$lib/components/LoadingPageProgressBar.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { notificationData } from '$lib/stores/notificationStore';
	import { dev } from '$app/env';

	import mixpanel from 'mixpanel-browser';

	// Enabling the debug mode flag is useful during implementation,
	// but it's recommended you remove it for production
	mixpanel.init('17ecea84c6ac6d69cd43193b7d046e9b', { debug: dev });
</script>

<LoadingPageProgressBar />
<div
	class="sm:flex sm:flex-col md:flex md:flex-col w-full content-center items-center justify-center"
>
	<div class="flex flex-col lg:w-4/5 ">
		<div>
			<Header />
			<main class="prose p-2 mx-auto max-w-screen-2xl items-center">
				{#if $navigating}
					Loading...
				{:else}
					<slot />
				{/if}
			</main>
		</div>
	</div>
</div>
<Footer />

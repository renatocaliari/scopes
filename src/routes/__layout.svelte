<script context="module">
	import '../app.css';
	import { fly } from 'svelte/transition';
	import { page, session, navigating } from '$app/stores';

	import LoadingPageProgressBar from '$lib/components/LoadingPageProgressBar.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { prefetchRoutes } from '$app/navigation';
	import { notificationData } from '$lib/stores/notificationStore';
	import { dev } from '$app/env';
	import { onMount } from 'svelte';

	// import mixpanel from 'mixpanel-browser';

	// Enabling the debug mode flag is useful during implementation,
	// but it's recommended you remove it for prod	uction
	// mixpanel.init('17ecea84c6ac6d69cd43193b7d046e9b', { debug: dev });
</script>

<script>
	onMount(prefetchRoutes);
</script>

<svelte:head>
	<!--Start of Tawk.to Script-->
	<script type="text/javascript">
		var Tawk_API = Tawk_API || {},
			Tawk_LoadStart = new Date();
		(function () {
			var s1 = document.createElement('script'),
				s0 = document.getElementsByTagName('script')[0];
			s1.async = true;
			s1.src = 'https://embed.tawk.to/627a95d57b967b11798eaff2/1g2ndiiqk';
			s1.charset = 'UTF-8';
			s1.setAttribute('crossorigin', '*');
			s0.parentNode.insertBefore(s1, s0);
		})();
	</script>
	<!--End of Tawk.to Script--></svelte:head
>

<!--End of Tawk.to Script-->
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

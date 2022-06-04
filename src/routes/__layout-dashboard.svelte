<script>
	import moment from 'moment';
	import Header from '$lib/components/Header.svelte';
	import { page, session, navigating } from '$app/stores';
	import { prefetchRoutes } from '$app/navigation';
	import LoadingPageProgressBar from '$lib/components/LoadingPageProgressBar.svelte';
	import { projectStore } from '$lib/stores/projectStore';

	import { steps } from '$lib/stores/stepsStore';
	import { onMount } from 'svelte';

	onMount(prefetchRoutes);
	let scopes;

	$: $projectStore, (scopes = projectStore.filterScopesWithItemsExcludingBucket());
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

<LoadingPageProgressBar />

<div class="drawer drawer-mobile">
	<input id="drawer-menu" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content w-full">
		<Header showDrawer={true} />

		<div class="w-full p-4">
			{#if $navigating}Loading...
			{:else}<div class=" prose max-w-full"><slot /></div>
			{/if}
		</div>
	</div>
	<div class="drawer-side flex">
		<label for="drawer-menu" class="drawer-overlay " />
		<div class="overflow-y-auto w-80 bg-base-100 justify-between flex flex-col text-white">
			<div>
				<div
					class="flex flex-row menu p-8 text-base-content align-middle content-center items-center "
				>
					<a href="/">Scopefully</a><span class="text-sm ml-2 badge">beta v0.0.5</span>
				</div>

				<div class="divider" />

				<ul class="p-4 text-base-content gap-2">
					<!-- Sidebar content here -->
					{#each $steps as step, idx}
						<div class="w-full">
							<a href={step.link}>
								<div
									class="p-3 rounded-md  "
									class:bg-primary={step.link === $page.url.pathname}
									class:text-white={step.link === $page.url.pathname}
								>
									{step.linkText}
									{#if step.id === 'deadline' && $projectStore.deadline}
										<span class="badge">{moment($projectStore.deadline).fromNow()}</span>
									{/if}
								</div></a
							>
						</div>
					{/each}
				</ul>
			</div>
			<div class="menu p-8 text-base-content">
				<a href="/about" sveltekit:prefetch>About</a>
			</div>
		</div>
	</div>
</div>

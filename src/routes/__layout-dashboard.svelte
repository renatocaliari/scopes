<script>
	import moment from 'moment';
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
		<div class="w-full navbar lg:hidden">
			<div class="flex-none lg:hidden">
				<label for="drawer-menu" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-6 h-6 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</label>
			</div>
			<div class="flex-1 px-2 mx-2 lg:hidden"><a href="/">Scopefully</a></div>
			<div class="flex-none block lg:hidden">
				<ul class="menu menu-horizontal">
					<li><a class="btn btn-outline" href="/about" sveltekit:prefetch>About</a></li>
				</ul>
			</div>
		</div>
		<div class="w-full p-4">
			{#if $navigating}Loading...
			{:else}<div class=" prose max-w-full"><slot /></div>
			{/if}
		</div>
	</div>
	<div class="drawer-side flex">
		<label for="drawer-menu" class="drawer-overlay " />
		<div class="overflow-y-auto w-80 bg-primary justify-between flex flex-col text-white">
			<div>
				<span class="menu p-8 text-base-content"><a href="/">Scopefully</a></span>
				<div class="divider" />

				<ul class="p-4 text-base-content gap-2">
					<!-- Sidebar content here -->
					{#each $steps as step, idx}
						<div class="w-full">
							<a class="link link-hover" href={step.link}>
								<div class="p-3 rounded-md" class:bg-primary={step.active}>
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

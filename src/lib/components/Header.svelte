<script>
	import { onMount } from 'svelte';
	// import { themeToggle } from '$lib/utils/themeChange';
	import { page, session } from '$app/stores';

	export let showDrawer = false;
</script>

<div class="navbar navbar-center bg-base-100" class:lg:hidden={showDrawer}>
	{#if showDrawer}
		<div class="flex-none" class:lg:hidden={showDrawer}>
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
	{/if}
	<div class="flex-1" class:lg:hidden={showDrawer}>
		<a class="btn btn-ghost normal-case text-xl" href="/"
			>{import.meta.env.VITE_APP_NAME}<span class="text-sm ml-2 badge"
				>{import.meta.env.VITE_APP_VERSION}</span
			></a
		>
	</div>
	<div class="flex-none block" class:hidden={showDrawer}>
		<ul class="menu menu-horizontal p-0 gap-2">
			<li><a class="btn btn-outline " href="/about" sveltekit:prefetch>About</a></li>
		</ul>
	</div>
</div>

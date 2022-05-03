<script>
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { page, session } from '$app/stores';

	let toggleTheme;
	let toogleThemeChecked = false;
	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte

		var themesList = toggleTheme.getAttribute('data-toggle-theme');
		if (themesList) {
			var themesArray = themesList.split(',');
			toogleThemeChecked = document.documentElement.getAttribute('data-theme') == themesArray[0];
		}
	});
</script>

<div class="navbar navbar-center bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-xl" href="/">Home</a>
	</div>
	<div class="flex-none" />
	<div class="navbar-end space-x-2 mr-8">
		<!-- sun - heroicon.dev -->
		<svg
			class="w-6 h-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			/>
		</svg>
		<!-- https://github.com/saadeghi/theme-change -->
		<input
			type="checkbox"
			class="toggle"
			bind:this={toggleTheme}
			checked={toogleThemeChecked}
			id="theme-toggle"
			data-toggle-theme="dark,light"
			data-act-class="ACTIVECLASS"
		/>
		<!-- moon - heroicon.dev -->
		<svg
			class="w-6 h-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			/>
		</svg>
	</div>
	<ul class="menu menu-horizontal p-0">
		<li><a class="btn btn-outline" href="/about" sveltekit:prefetch>About</a></li>
		<!-- <li><a href="/test/alopage1">Alo Page 1 (fetch manually)</a></li>
			<li><a sveltekit:prefetch href="/test/alopage2">Alo Page 2 (load auto)</a></li>
			<li><a href="/test/aloendpoint">Alo endpoint</a></li>
			<li><a href="/app">App Restricted</a></li>
			<li><a href="/app/externalPage">App External Page</a></li> -->
	</ul>

	<!-- {#if !$session || !$session.authenticated}
				<ul class="menu menu-horizontal p-0">
					<li
						class="bg-base-300 mr-2 ml-2 rounded-md"
						class:active={$page.url.pathname === '/accounts/login'}
					>
						<a sveltekit:prefetch href="/account/login">Login</a>
					</li>
					<li
						class="bg-base-300 rounded-md"
						class:active={$page.url.pathname === '/accounts/register'}
					>
						<a sveltekit:prefetch href="/account/register">Register</a>
					</li>
				</ul>
			{:else}
				<div class="dropdown dropdown-end">
					<label tabindex="0" class="btn btn-ghost btn-circle avatar">
						<div class="w-10 rounded-full">
							<img
								alt="avatar"
								class="tooltip tooltip-bottom"
								src="https://api.lorem.space/image/face?hash=33791"
							/>
						</div>
					</label>

					<ul
						tabindex="0"
						class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li>
							<a class="justify-between" sveltekit:prefetch href="/account/profile/"
								>Profile
								<span class="badge">New</span>
							</a>
						</li>
						<li><a>Settings</a></li>
						<li><a href="/account/logout">Logout</a></li>
					</ul>
				</div>
			{/if} -->
</div>

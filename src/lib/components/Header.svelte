<script lang="ts">
	import { page, session } from '$app/stores';
</script>

<header>
	<div class="navbar bg-base-100">
		<div class="flex-1">
			<a class="btn btn-ghost normal-case text-xl" sveltekit:prefetch href="/">Home</a>
		</div>
		<div class="flex-none" />
		<ul class="menu menu-horizontal p-0">
			<li><a href="/scopes/dump">Scopes</a></li>
			<li><a href="/about">About</a></li>
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
</header>

<script>
	import { session } from '$app/stores';
	import { auth } from '$lib/auth';
	import { browser } from '$app/env';
	import { Mount } from 'svelte-mount';
	import { fade } from 'svelte/transition';
	//console.log('>>> $session:', JSON.stringify($session));

	if (browser) {
		goto('/scopes/dump	');
	}
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Scope Funnel | {import.meta.env.VITE_APP_TITLE}</title>
</svelte:head>

This template uses and has:
<ul>
	<li>DaisyUI & TailwindCSS</li>
	<li>Authentication with Supabase</li>
	<li>
		Felte - Form for Svelte:
		https://dev.to/pabloabc/announcing-felte-10-a-form-library-for-svelte-solid-and-react-5ble
	</li>
	<li>svelte-actions: https://github.com/sw-yx/svelte-actions</li>
	<li>svelte-mount: https://github.com/ghostdevv/svelte-mount</li>
	<li>uuid v4: to generate id</li>
	<li>argon2: hash password</li>
	<li>
		fractils: <a
			href="https://github.com/FractalHQ/fractils/blob/2221ee1be49c8ab98f8f661741659e2c5a64ba49/src/lib/utils/localStorageStore.ts"
			>localStorageStore</a
		>
	</li>
</ul>

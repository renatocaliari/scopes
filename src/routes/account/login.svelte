<script context="module">
	export const load = async ({ url }) => {
		return {
			props: { redirectedFrom: url.searchParams.get('redirectedFrom') }
		};
	};
</script>

<script>
	import SocialLogin from '$lib/components/SocialLogin.svelte';
	import { notificationData } from '$lib/stores/notificationStore';
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { browser } from '$app/env';
	import Input from '$lib/components/Form/Input.svelte';

	let email;
	let password;
	export let redirectedFrom;

	let loading = false;

	if (browser && $session && $session.authenticated) {
		goto('/');
	}

	async function loginUser(data) {
		const formData = new FormData(data.currentTarget);
		console.log('formdata:', formData);
		console.log('>>> login.handleLogin');
		loading = true;
		const res = await fetch('/api/account/login.json', {
			method: 'POST',
			body: formData
		});

		console.log('>>> fez login. status:', res.status);
		const { user, profile, message, errors } = await res.json();
		if (res.status === 200) {
			$notificationData = 'Login successful.';

			session.set({ user: { email: user.email }, profile: profile, authenticated: !!user.email });

			//console.log('>>> $session:', JSON.stringify($session));
			console.log('setting session on login.loginUser');

			// if (!password) {
			//   redirectedFrom = `${redirectedFrom}?magic_link=true`;
			// }

			if (redirectedFrom) {
				goto(redirectedFrom);
			} else {
				goto('/');
			}
		}

		if (message) {
			console.log('Error message:', message);
			alert(message);
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Login | {import.meta.env.VITE_APP_TITLE}</title>
</svelte:head>

<h1>Login</h1>

<div class="content flex flex-col justify-center items-center text-center">
	<div>
		<SocialLogin />
	</div>

	<form on:submit|preventDefault={loginUser} class="form-control w-full max-w-xs space-y-2">
		<Input
			label="Email"
			name="email"
			type="email"
			autocomplete="email"
			placeholder="Email"
			required
			bind:value={email}
		/>
		<Input
			label="Password"
			name="password"
			type="password"
			placeholder="Password (optional)"
			bind:value={password}
		/>

		<div>
			<button type="submit" class="btn submit" disabled={loading}>
				{loading ? 'Logging in ...' : 'Log In'}
			</button>
		</div>

		<div>
			<a sveltekit:prefetch href="/account/register">No account? Register here</a>
		</div>
	</form>
</div>

<script lang="ts">
	import SocialLogin from '$lib/components/SocialLogin.svelte';
	import { goto } from '$app/navigation';
	import { notificationData } from '$lib/stores/notificationStore';
	import Input from '$lib/components/Form/Input.svelte';

	let email;
	let password;
	let confirmPassword;

	let loading = false;
	let validationErrors;

	async function registerUser(event) {
		const formData = new FormData(event.target);

		loading = true;
		const res = await fetch('/api/account/register.json', {
			method: 'POST',
			body: formData
		});

		if (res.status === 200) {
			$notificationData = 'Registration successful. Login now.';
			goto('/account/login');
		}

		const { message, errors } = await res.json();
		validationErrors = errors;

		if (message) {
			console.log('Error:', message);
			alert(message);
		}
		loading = false;
	}
</script>

<svelte:head>
	<title>Register | {import.meta.env.VITE_APP_TITLE}</title>
</svelte:head>

<h1>Register</h1>
<div class="content flex flex-col items-center">
	<div>
		<SocialLogin />
	</div>

	<form class="form form-control w-full max-w-xs space-y-2" on:submit|preventDefault={registerUser}>
		<Input
			label="Email"
			name="email"
			type="email"
			aria-label="Email address"
			placeholder="Email"
			required
			bind:value={email}
		/>
		<Input
			bind:value={password}
			label="Password"
			type="password"
			name="password"
			aria-label="password"
			placeholder="password"
			required
		/>
		<Input
			label="Confirm password"
			bind:value={confirmPassword}
			type="password"
			name="confirmPassword"
			aria-label="Confirm password"
			placeholder="Confirm password"
			required
		/>

		{#if validationErrors && validationErrors.password}
			<div>{validationErrors.password}</div>
		{/if}
		{#if confirmPassword}
			<button type="submit" class="btn submit" disabled={loading}>
				{loading ? 'Registering ...' : 'Register'}
			</button>
		{:else}
			<button class="btn" type="submit" disabled>Register</button>
		{/if}
	</form>
</div>

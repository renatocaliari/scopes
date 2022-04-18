<script context="module">
	import Input from '$lib/components/Form/Input.svelte';
	import Select from '$lib/components/Form/Select.svelte';

	import { getProfile } from '$lib/data/profile';
	export async function load({ url, props, params, fetch, session, stuff }) {
		const profile = await getProfile(session);
		return {
			props: { profile }
		};
	}
</script>

<script lang="ts">
	import { notificationData } from '$lib/stores/notificationStore';
	import { session } from '$app/stores';

	let loading = false;

	export let profile;

	if (!profile) {
		profile = {
			email: '',
			username: '',
			birthdate: null,
			avatar_url: ''
		};
	}

	let user = $session.user;
	let email = profile.email;
	let password;

	let username = profile.username;
	let fullname = profile.fullname;
	let birthdate = profile.birthdate;
	let avatar_url = profile.avatar_url;

	async function updateProfileUser(data) {
		const formData = new FormData(data.currentTarget);
		console.log('formdata:', formData);
		console.log('>>> profile.updateProfileUser');
		loading = true;
		console.log('updateProfileUser:', JSON.stringify(user));

		formData.append('user', JSON.stringify(user));

		const res = await fetch('/api/account/profile.json', {
			method: 'POST',
			body: formData
		});
		const { message } = await res.json();
		if (res.status === 200) {
			$notificationData = 'Update successful.';
			console.log(JSON.stringify($session));
		}
		if (message) {
			console.log('Error message:', message);
			alert(message);
		}
		loading = false;
	}
</script>

<svelte:head>
	<title>Profile | {import.meta.env.VITE_APP_TITLE}</title>
</svelte:head>

<h1>Profile</h1>

<div class="content flex flex-col justify-center items-center text-center">
	<form on:submit|preventDefault={updateProfileUser} class="form-control w-full max-w-xs space-y-2">
		<Input
			label="Email"
			name="email"
			type="text"
			autocomplete="email"
			placeholder="Email"
			required
			bind:value={email}
		/>
		<Input
			label="Password"
			name="password"
			type="password"
			placeholder="Password"
			bind:value={password}
		/>
		<Input
			label="Username"
			bind:value={username}
			name="username"
			type="text"
			aria-label="Username"
			placeholder="Username"
		/>
		<Input
			label="Fullname"
			bind:value={fullname}
			name="fullname"
			type="text"
			aria-label="Full name"
			placeholder="Full name"
		/>
		<Input
			label="Birthdate"
			bind:value={birthdate}
			name="birthdate"
			type="date"
			aria-label="Birthdate"
			placeholder="Birthdate"
		/>

		<div>
			<button type="submit" class="btn submit" disabled={loading}>
				{loading ? 'Updating ...' : 'Update'}
			</button>
		</div>

		<div>
			<a sveltekit:prefetch href="/account/register">No account? Register here</a>
		</div>
	</form>
</div>

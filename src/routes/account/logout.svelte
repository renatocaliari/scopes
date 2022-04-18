<script context="module">
	import { auth, unsetAuthCookie } from '$lib/auth';
	import { notificationData } from '$lib/stores/notificationStore';
	import { session } from '$app/stores';

	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
		console.log('>>> logout');
		await auth.signOut();
		await unsetAuthCookie();
		session.set({ user: undefined, authenticated: false });

		console.log('todo notification logout');
		notificationData.set('You have successfully logged out...');

		return {
			status: 302,
			redirect: '/?loggedOut=true'
		};
	}
</script>

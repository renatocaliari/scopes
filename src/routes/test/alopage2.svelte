<script context="module">
	export async function load({ params, fetch, session, stuff }) {
		const response = await fetch('/test/aloendpoint.json');
		let user = (await response.json()).user;

		return {
			props: {
				user
			}
		};
	}
</script>

<script>
	export let user;
</script>

Page2 loaded from server: {user.name}

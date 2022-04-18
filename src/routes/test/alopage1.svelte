<script>
	import { onMount } from 'svelte';
	let promise;
	export async function fetchData() {
		const response = await fetch('/test/aloendpoint.json');
		return await response.json();
	}

	onMount(() => {
		promise = fetchData();
	});
</script>

{#await promise}
	Loading client-side...
{:then result}
	{#if result}
		Page1 loaded from client: {result.user.name}
	{:else}
		<!-- carregando... -->
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

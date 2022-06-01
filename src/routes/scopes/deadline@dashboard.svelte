<script>
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
</script>

<NavigationScopes stepId="deadline" optional={true} />

<label for="deadline">Deadline</label>
<input
	id="deadline"
	type="date"
	bind:value={$projectStore['deadline']}
	class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
/>

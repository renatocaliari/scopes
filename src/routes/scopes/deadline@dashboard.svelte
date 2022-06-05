<script>
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';

	let checklist;
	$: checkList = {
		title: '',
		items: [
			{
				name: 'deadline',
				optional: true,
				text: 'Set a deadline to help make tradeoffs while thinking about scopes and tasks',
				checked: $projectStore.deadline
			}
		]
	};
</script>

<NavigationScopes stepId="deadline" optional={true} {checkList} />

<div class="shadow-md flex flex-col gap-2 mb-8 p-4 leading-relaxed bg-gray-100 rounded-md">
	<div>
		Different from the estimated time, the intent here is to determine how much time you are willing
		to invest in completing the project.
	</div>
	<div>
		This will give you enough constraint to make tradeoffs, adapt scopes and renegotiate as needed.
	</div>
</div>

<div>
	<label for="deadline" class="text-xl font-bold">Deadline:</label>
	<input
		id="deadline"
		type="date"
		bind:value={$projectStore['deadline']}
		class="form-control block  px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
	/>
</div>

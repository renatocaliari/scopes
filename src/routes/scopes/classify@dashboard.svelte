<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import ToggleClassificationOnOff from '$lib/components/Scopes/ToggleClassificationOnOff.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';

	let sortedScopes = $projectStore['scopes'].filter(
		(scope) => scope.id !== 'bucket' && scope.items.length > 0
	);

	$: {
		$projectStore,
			(sortedScopes = $projectStore['scopes'].filter(
				(scope) => scope.id !== 'bucket' && scope.items.length > 0
			));
	}

	let checklist;
	$: checkList = {
		title: 'Tasks to proceed',
		items: [
			{
				name: 'scope-nicetohave',
				optional: true,
				text: 'Set which scopes are nice-to-have',
				checked: sortedScopes.some((scope) => !scope.indispensable)
			},
			{
				name: 'item-nicetohave',
				optional: true,
				text: 'Set which tasks are nice-to-have',
				checked: sortedScopes.some((scope) => scope.items.some((item) => !item.indispensable))
			},
			{
				name: 'risky',
				optional: true,
				text: 'Set which tasks are risky. Its scopes automatically will become risky too.',
				checked: sortedScopes.some((scope) => scope.items.some((item) => item.risky))
			},
			{
				name: 'automate',
				optional: true,
				text: 'Set which tasks could be automated',
				checked: sortedScopes.some((scope) => scope.items.some((item) => item.automatable))
			}
			// {
			// 	name: 'delegate',
			// 	optional: true,
			// 	text: 'Set which tasks could be delegated',
			// 	checked: sortedScopes.some((scope) => scope.items.some((item) => item.delegable))
			// }
		]
	};

	function addItem(scope, value, indispensable) {
		projectStore.scopeAddItem(scope, value, indispensable);
		$projectStore = $projectStore;
	}

	function checkClassification(scope, classification, toggle) {
		projectStore.setClassificationToObject(scope, null, classification.toLowerCase(), toggle);
	}
</script>

<NavigationScopes stepId="classify" optional={true} {checkList} />

<div
	class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 grid-flow-row gap-4 place-content-around"
>
	{#each $projectStore['scopes'].filter((scope) => scope.id !== 'bucket' && scope.items.length > 0) as scope, idx}
		<Scope bind:scope itemsScopeModal={scope.items} editTitle>
			<div slot="header" class="flex flex-col mb-2">
				<div class="justify-start content-start align-bottom items-start">
					<input
						type="checkbox"
						class="checkbox"
						id="chkNiceToHave"
						checked={!scope.indispensable}
						on:change={(e) => checkClassification(scope, 'indispensable', !e.currentTarget.checked)}
					/><label for="chkNiceToHave" class="items-start content-start justify-start pl-2"
						>Nice-to-have</label
					>
					<label for="modal-about-classification-indispensable" class="cursor-pointer ml-2"
						>[?]</label
					>
				</div>
			</div>
			<div slot="badge">
				<div class="badge " class:hidden={!scope.risky}>Risky</div>
			</div>
			<div slot="body">
				<!-- <h4 class="my-0">Indispensable items:</h4>
						{#if !projectStore.scopeFilterItems(scope, true).length}
							<div class="w-full text-center items-center justify-center text-8xl opacity-20 mt-8">
								🤷‍♀️
							</div>
						{/if} -->

				<Items
					bind:scope
					bind:items={scope.items}
					maxHeight=""
					allowEditItem
					allowAddItem
					allowRemoveItem
					showOptions
					dragAndDrop={true}
					classesCSSItem="text-lg"
					on:addItem={(e) => {
						addItem(scope, e.detail.value, true);
					}}
				/>
			</div>
		</Scope>
	{/each}
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

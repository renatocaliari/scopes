<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';

	let sortedScopes;
	$: {
		$projectStore,
			console.log('projectStore', $projectStore),
			(sortedScopes = $projectStore
				.filter((scope) => scope.id !== 'bucket')
				.filter((scope) => scope.items.length > 0));
	}
	let checkList;

	$: checkList = [
		{
			name: 'dependencies',
			text: 'Optionally, set which scopes depends on other',
			checked: sortedScopes.some((scope) => scope.dependsOn.length > 0)
		}
	];

	function confirmClearDependencies() {
		$projectStore.map((scope) => {
			scope.dependsOn = [];
		});
		$projectStore = $projectStore;
	}
</script>

<NavigationScopes currentStep={1} let:currentStep>
	<NavigationCheckList
		{checkList}
		{currentStep}
		optional={true}
		linkNextStep="/scopes/unknowns"
		linkPreviousStep="/scopes/dump"
	>
		<div slot="buttons">
			<label
				for="modal-clear-dependencies"
				class="btn btn-warning modal-button"
				class:btn-disabled={$projectStore.every((scope) => scope.dependsOn === 0)}
				>Clear all dependencies</label
			>
		</div>
	</NavigationCheckList>
</NavigationScopes>

<div class={'grid grid-rows-2 grid-cols-3 grid-flow-row gap-4 place-content-around'}>
	{#each sortedScopes as scope}
		<div>
			<Scope bind:scope itemsScopeModal={scope.items}>
				<div slot="badge">
					<BadgeDependencies project={projectStore} bind:scope />
				</div>
				<div slot="subTitle">Depends on scopes:</div>
				<div slot="body">
					<Items
						emptyState="No Scope"
						bind:scope
						items={projectStore.filterScopesWithItemsExcludingThisAndBucket(scope)}
						checkbox
						fnSetChecked={(s) => {
							return scope.dependsOn.includes(s.id);
						}}
						fnOnCheckItem={(e, s, item, checked) => {
							if (checked && item.dependsOn.includes(s.id)) {
								alert(
									'You are creating a circular dependency. [' +
										item.name +
										'] already depends on [' +
										(s.name || s.placeholder) +
										']'
								);
							}
							projectStore.updateDependencies(s, item, checked);
							$projectStore = $projectStore;
						}}
						fnItemsModal={(scope) => {
							return scope.items;
						}}
					/>
				</div>
				<div slot="headerScopeModal">Items of {scope.name}</div>
			</Scope>
		</div>
	{/each}
</div>

<input type="checkbox" id="modal-clear-dependencies" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Are you sure you want to clear all dependencies?</h3>
		<div class="modal-action">
			<label for="modal-clear-dependencies" class="btn">Cancel</label>
			<label
				for="modal-clear-dependencies"
				class="btn btn-warning"
				on:click={confirmClearDependencies}>Confirm</label
			>
		</div>
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

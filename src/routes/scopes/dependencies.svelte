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
			// console.log('projectStore', $projectStore),
			(sortedScopes = $projectStore
				.filter((scope) => scope.id !== 'bucket')
				.filter((scope) => scope.items.length > 0));
	}
	let checkList;

	$: checkList = {
		items: [
			{
				name: 'dependencies',
				optional: true,
				text: 'Set which scopes depends on other',
				checked: sortedScopes.some((scope) => scope.dependsOn.length > 0)
			}
		]
	};

	function confirmClearDependencies() {
		$projectStore.map((scope) => {
			scope.dependsOn = [];
		});
		$projectStore = $projectStore;
	}
</script>

<NavigationScopes currentStep={3} let:currentStep>
	<NavigationCheckList
		{checkList}
		{currentStep}
		optional={true}
		linkNextStep="/scopes/sequence"
		linkPreviousStep="/scopes/unknowns"
	>
		<div slot="buttons">
			<label
				for="modal-clear-dependencies"
				class="btn btn-outline modal-button"
				class:btn-disabled={$projectStore.every((scope) => scope.dependsOn === 0)}
				><svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
					><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
						d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"
					/></svg
				>Clear all dependencies</label
			>
		</div>
	</NavigationCheckList>
</NavigationScopes>

<div
	class={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-flow-row gap-4 place-content-around'}
>
	{#each sortedScopes as scope}
		<div>
			<Scope bind:scope itemsScopeModal={scope.items} headerHighlighted={true}>
				<div slot="badge">
					<BadgeDependencies project={projectStore} bind:scope />
				</div>
				<div slot="header">
					<div class="badge badge-accent text-white" class:hidden={!scope.risky}>Risky</div>
					<div class="badge badge-success text-white" class:hidden={!scope.indispensable}>
						Indispensable
					</div>
				</div>

				<div slot="subTitle">
					{#if scope.indispensable}
						<ul
							class="text-sm
						"
						>
							<li>it cannot depends on nice-to-have scopes</li>
							<li>it cannot depends on scopes that already depends on this scope</li>
						</ul>
					{:else}
						<ul
							class="text-sm
						"
						>
							<li>it cannot depends on scopes that already depends on this scope</li>
						</ul>
					{/if}
				</div>
				<div slot="body">
					<span class="font-bold">Depends on scopes:</span>
					<Items
						emptyState="No Scope"
						badgeNiceToHave
						bind:scope
						items={projectStore.filterScopesWithItemsExcludingThisAndBucket(scope)}
						checkbox
						fnDisableCheckbox={(s) => {
							return s.dependsOn.includes(scope.id) || (scope.indispensable && !s.indispensable);
						}}
						fnSetChecked={(s) => {
							return scope.dependsOn.includes(s.id);
						}}
						fnOnCheckItem={(e, s, item, checked) => {
							if (checked && item.dependsOn.includes(s.id)) {
								alert(
									"It's not possible to create a circular dependency. [" +
										item.name +
										'] already depends on [' +
										(s.name || s.placeholder) +
										']'
								);
								projectStore.updateDependencies(s, item, false);
								e.target.checked = false;
							} else {
								projectStore.updateDependencies(s, item, checked);
							}
							$projectStore = $projectStore;
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
				class="btn btn-primary"
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

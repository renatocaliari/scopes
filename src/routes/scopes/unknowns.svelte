<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import ToggleScope from '$lib/components/Scopes/ToggleScope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';

	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';

	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

	let sortedScopes;
	$: {
		$projectStore,
			(sortedScopes = $projectStore
				.filter((scope) => scope.id !== 'bucket')
				.filter((scope) => scope.items.length > 0));
	}
	$: checkList = [
		{
			name: 'dependencies',
			text: 'Optionally, set which scopes have risky unknowns (vs routine work)',
			checked: sortedScopes.some((scope) => scope.risky)
		}
	];
</script>

<NavigationScopes currentStep={2} let:currentStep>
	<NavigationCheckList
		optional={true}
		{currentStep}
		{checkList}
		linkNextStep="/scopes/sequence"
		linkPreviousStep="/scopes/dependencies"
	/>
</NavigationScopes>

<div class={'grid grid-rows-2 grid-cols-3 grid-flow-row gap-4 place-content-around'}>
	{#each sortedScopes as scope}
		{@const itemsNiceToHave = projectStore.scopeFilterItemsNiceToHave(scope)}

		<div>
			<Scope
				bind:scope
				icon={scope.risky ? faCircleExclamation : undefined}
				classColor={scope.risky ? 'bg-red-50' : undefined}
			>
				<div slot="badge">
					<BadgeDependencies project={projectStore} {scope} />
				</div>

				<div
					slot="header"
					class="inline-flex w-full justify-end rounded-md p-[0.1rem] border-b-2 border-slate-200"
				>
					<!-- <ToggleScope
						bind:scope
						bind:checked={scope.indispensable}
						checkText="Indispensable"
						on:checkItem={(e) => {
							projectStore.scopeUpdateIndispensable(e.detail.item, e.detail.checked);
						}}
					/> -->
					<ToggleScope
						bind:scope
						bind:checked={scope.risky}
						checkText="Risky unknowns"
						on:checkItem={(e) => {
							projectStore.scopeUpdateRisky(e.detail.item, e.detail.checked);
							$projectStore = $projectStore;
						}}
					/>
				</div>
				<div slot="body">
					<h4>Indispensable (hiding Nice To Have):</h4>
					<Items bind:scope items={projectStore.scopeFilterItemsIndispensable(scope)} />
				</div>
			</Scope>
		</div>
	{/each}
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

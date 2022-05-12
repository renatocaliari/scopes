<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import ToggleScope from '$lib/components/Scopes/ToggleScope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';

	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';

	// import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

	let sortedScopes;
	$: {
		$projectStore,
			(sortedScopes = $projectStore
				.filter((scope) => scope.id !== 'bucket')
				.filter((scope) => scope.items.length > 0));
	}
	$: checkList = {
		items: [
			{
				name: 'unknowns',
				optional: true,
				text: '🚨 Check which scopes have risky unknowns. The remaining ones will be considered known or routine work',
				checked: sortedScopes.some((scope) => scope.risky)
			}
		]
	};
</script>

<NavigationScopes currentStep={2} let:currentStep>
	<NavigationCheckList
		optional={true}
		{currentStep}
		{checkList}
		linkNextStep="/scopes/dependencies"
		linkPreviousStep="/scopes/indispensable"
	/>
</NavigationScopes>

<div
	class={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-flow-row gap-4 place-content-around'}
>
	{#each sortedScopes as scope}
		{@const itemsNiceToHave = projectStore.scopeFilterItemsNiceToHave(scope)}

		<div>
			<!-- 				bind:scope
				icon={scope.risky ? '' : undefined}
				classColor={scope.risky ? 'bg-red-50' : undefined}
 -->
			<Scope
				bind:scope
				headerHighlighted={true}
				classColor={scope.risky ? 'border-accent border-4' : undefined}
				itemsScopeModal={scope.items}
			>
				<!-- <div slot="badge">
					<BadgeDependencies project={projectStore} {scope} />
				</div> -->

				<div slot="header" class="flex flex-col p-[0.1rem]">
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
						cssClass="toggle-accent"
						checkText="Scope with risky unknowns based on the indispensable items below"
						on:checkItem={(e) => {
							projectStore.scopeUpdateRisky(e.detail.item, e.detail.checked);
							$projectStore = $projectStore;
						}}
					/>
					{#if scope.indispensable}
						<div class="pb-2">
							<div class="flex badge badge-primary  text-white">Indispensable</div>
						</div>
					{/if}
				</div>
				<div slot="body">
					<Items bind:scope items={scope.items.filter((i) => i.indispensable)} />
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

<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import ToggleScope from '$lib/components/Scopes/ToggleScope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';

	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';
	import { prevent_default } from 'svelte/internal';

	let toggle;

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
				name: 'indispensable',
				optional: false,
				text: 'Check which scopes or items are indispensable. The remaining ones will be considered nice-to-have for this cycle.',
				checked: sortedScopes.some(
					(scope) => scope.indispensable || scope.items.some((item) => (item) => item.indispensable)
				)
			}
		]
	};
</script>

<NavigationScopes currentStep={1} let:currentStep>
	<NavigationCheckList
		{currentStep}
		{checkList}
		linkNextStep="/scopes/unknowns"
		linkPreviousStep="/scopes/dump"
	/>
</NavigationScopes>

<div
	class={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-flow-row gap-4 place-content-around'}
>
	{#each sortedScopes as scope}
		{@const itemsIndispensable = projectStore.scopeFilterItems(scope, true)}
		{@const itemsNiceToHave = projectStore.scopeFilterItems(scope, false)}

		<div>
			<Scope
				bind:scope
				headerHighlighted={true}
				itemsScopeModal={scope.items}
				classColor={scope.indispensable ? 'border-success border-4' : undefined}
			>
				<div slot="header" class="flex flex-col p-[0.1rem] ">
					<div class="w-full justify-end ">
						<ToggleScope
							bind:this={toggle}
							bind:scope
							bind:checked={scope.indispensable}
							checkText="Indispensable Scope"
							on:checkItem={(e) => {
								if (!e.detail.checked) {
									let scopesDependsOnThat = $projectStore.filter(
										(s) => s.dependsOn.includes(e.detail.item.id) && s.indispensable
									);
									if (scopesDependsOnThat.length) {
										console.log('scope.indispensable1:', scope.indispensable);
										scope.indispensable = true;
										scope = scope;
										console.log('scope.indispensable2:', scope.indispensable);
										alert(
											'There are ' +
												scopesDependsOnThat.length +
												' indispensable scopes that depends on ' +
												scope.name +
												'. Because of ths, you cannot set this as nice-to-have.'
										);
										e.detail.element.checked = true;
									} else {
										projectStore.scopeUpdateIndispensable(e.detail.item, e.detail.checked);
										$projectStore = $projectStore;
									}
								} else {
									projectStore.scopeUpdateIndispensable(e.detail.item, e.detail.checked);
									$projectStore = $projectStore;
								}
							}}
						/>
					</div>
					<div class="pb-2 gap-2 flex flex-row">
						{#if scope.indispensable}
							<div class="badge badge-primary text-white" class:hidden={!scope.indispensable}>
								Indispensable
							</div>
						{:else}
							<div class="badge badge-outline" class:hidden={scope.indispensable}>Nice-to-have</div>
						{/if}
						{#if scope.risky}
							<div class="flex badge badge-accent text-white">Risky</div>
						{/if}
					</div>
				</div>
				<div slot="body">
					<h4 class="my-0">Indispensable items:</h4>
					{#if !itemsIndispensable.length}
						<div
							class="h-40 w-full text-center items-center justify-center text-8xl opacity-20 mt-8"
						>
							🤷‍♀️
						</div>
					{:else}
						<Items
							bind:scope
							items={itemsIndispensable}
							checkbox
							fnSetChecked={(item) => {
								return item.indispensable;
							}}
							fnOnCheckItem={(e, scope, i, checked) => {
								projectStore.itemUpdateIndispensable(scope, i, checked);
								$projectStore = $projectStore;
							}}
						/>
					{/if}
					<h4 class="my-0">Nice-to-have items:</h4>
					<Items
						bind:scope
						items={itemsNiceToHave}
						checkbox
						fnSetChecked={(item) => {
							return item.indispensable;
						}}
						fnOnCheckItem={(e, scope, i, checked) => {
							projectStore.itemUpdateIndispensable(scope, i, checked);
							$projectStore = $projectStore;
						}}
					/>
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

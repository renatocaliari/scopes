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
				checked: sortedScopes.some((scope) => scope.indispensable)
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
		{@const itemsNiceToHave = projectStore.scopeFilterItemsNiceToHave(scope)}

		<div>
			<!-- 				bind:scope
				icon={scope.risky ? '' : undefined}
				classColor={scope.risky ? 'bg-red-50' : undefined}
 -->
			<Scope
				bind:scope
				headerHighlighted={true}
				itemsScopeModal={scope.items}
				classColor={scope.indispensable ? 'border-success border-4' : undefined}
			>
				<!-- <div slot="badge">
					<BadgeDependencies project={projectStore} {scope} />
				</div> -->

				<div slot="header" class="flex flex-row p-[0.1rem] ">
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
						{#if scope.risky}
							<div class="flex badge badge-accent m-1 text-white">Risky</div>
						{/if}
					</div>
				</div>
				<div slot="body">
					<h4 class="my-0">Indispensable items:</h4>

					<Items
						bind:scope
						items={scope.items.filter((i) => i.indispensable)}
						checkbox
						fnSetChecked={(item) => {
							return item.indispensable;
						}}
						fnOnCheckItem={(e, scope, i, checked) => {
							projectStore.itemUpdateIndispensable(scope, i, checked);
							$projectStore = $projectStore;
						}}
					/>
					<h4 class="my-0">Nice-to-have items:</h4>
					<Items
						bind:scope
						items={scope.items.filter((i) => !i.indispensable)}
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

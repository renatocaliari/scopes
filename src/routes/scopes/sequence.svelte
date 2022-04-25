<script>
	import { projectStore } from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import SvgArrow from './svgArrow.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import ItemDragDrop from '$lib/components/Scopes/ItemDragDrop.svelte';
	import ItemsList from '$lib/components/Scopes/ItemsList.svelte';

	$: scopesForkedPriorized = projectStore.sortScopesByPriority().scopesForkedPriorized;

	let maxDependents = $projectStore.reduce((prev, curr) => {
		return Math.max(prev, curr.dependsOn?.length);
	}, 0);

	// function calculateColor(scope, maxDependents) {
	// 	return percentageToHsl(
	// 		isNaN(scope.dependsOn?.length / maxDependents) ? 0 : scope.dependsOn?.length / maxDependents,
	// 		35,
	// 		0
	// 	);
	// }
	// function percentageToHsl(percentage, hue0, hue1) {
	// 	var hue = percentage * (hue1 - hue0) + hue0;
	// 	return 'hsl(' + hue + ', 100%, ' + (100 - percentage * 10) + '%)';
	// }
</script>

<NavigationScopes currentBtn={4} />

<div class="w-full">
	{#each scopesForkedPriorized as scope, idx (scope.id)}
		<!-- {@const calculatedColor = calculateColor(scope, maxDependents)} -->
		{@const nextOne = scopesForkedPriorized[idx + 1]
			? scopesForkedPriorized[idx + 1]
			: { name: '' }}
		<div class="m-2 flex justify-center">
			<Scope {scope} editTitle={false} itemsScopeModal={scope.items} width="w-96">
				<div slot="badge">
					<BadgeDependencies project={projectStore} {scope} />
				</div>
				<div slot="header">
					<div class="badge" class:hidden={!scope.indispensable}>Indispensable</div>
					<div class="badge" class:hidden={!scope.risky}>Risky</div>
				</div>
				<div slot="headerScopeModal">Items of {scope.name}</div>
				<div slot="body">
					{#if scope.id.includes('forked')}
						<div class="border-2 border-dotted border-red-500 p-2">
							<p>
								Do ONLY what is necessary to do the next scope <span
									class="font-bold bg-yellow-300"
								>
									{nextOne.name || nextOne.placeholder}</span
								>. Decide if you can and should do simulated tasks of this scope that mimic the
								behavior of real tasks in controlled ways with the sole intention of allowing the
								execution of the next scope.
							</p>
							<p>
								Relax, <span class="font-bold bg-yellow-300">{scope.name || scope.placeholder}</span
								> will appear later on again, so you'll can execute fully.
							</p>
						</div>
					{/if}
					<h4>Indispensable:</h4>
					<Items
						bind:scope
						items={scope.items.filter((item) => item.indispensable == true)}
						forceMinHeight={false}
					/>
					<h4>Nice to have:</h4>
					<Items
						bind:scope
						items={scope.items.filter((item) => item.indispensable == false)}
						forceMinHeight={false}
					/>
				</div>
			</Scope>
		</div>
		{#if idx + 1 < scopesForkedPriorized.length}
			<div class="flex justify-center">
				<SvgArrow />
			</div>
		{/if}
	{/each}
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

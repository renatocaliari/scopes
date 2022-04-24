<script>
	import { projectStore, compare } from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import SvgArrow from './svgArrow.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';

	export let scopesForkedPriorized = []; // fetch from server because store has a weird behavior in client using sort, specially on Firefox where it gets data correctly and blinks showing unexpected order from store

	let maxDependents = $projectStore.reduce((prev, curr) => {
		return Math.max(prev, curr.dependsOn?.length);
	}, 0);

	function calculateColor(scope, maxDependents) {
		return percentageToHsl(
			isNaN(scope.dependsOn?.length / maxDependents) ? 0 : scope.dependsOn?.length / maxDependents,
			35,
			0
		);
	}
	function percentageToHsl(percentage, hue0, hue1) {
		var hue = percentage * (hue1 - hue0) + hue0;
		return 'hsl(' + hue + ', 100%, ' + (100 - percentage * 10) + '%)';
	}

	// const lastIndexOf = (array, key, value) => {
	// 	for (let i = array?.length - 1; i >= 0; i--) {
	// 		if (array[i][key] === value) return i;
	// 	}
	// 	return -1;
	// };

	//  let sortedScopesIndispensable = [];
	// let scopesPriorized = [];
	// let forkedScopes = new Set();
	// let indexLastRisky = 0;

	// forkedScopes = new Set();
	// const projectStore = ProjectStore(true, 6, true);

	// sortedScopesIndispensable = getStore(projectStore).filter((scope) => scope.id !== 'bucket').sort(compare);

	// indexLastRisky = lastIndexOf(sortedScopesIndispensable, 'risky', true);

	// $: if ($mounted) {

	// scopesPriorized = [...sortedScopesIndispensable].map((scope, index) => {
	//     scope.order = index;
	//     if (!scope.risky && index <= indexLastRisky) {
	//         let previousId = scope.id;
	//         scope.id = scope.id + '-forked';
	//         let forkedScope = JSON.parse(JSON.stringify(scope));
	//         forkedScope.id = previousId;
	//         forkedScopes = [...forkedScopes, forkedScope];
	//     }
	//     return scope;
	// });
	// let scopesBeforeLastRisky = scopesPriorized.slice(0, indexLastRisky + 1);
	// let scopesAfterLastRisky = scopesPriorized.slice(indexLastRisky + 1);
	// scopesAfterLastRisky = scopesAfterLastRisky.concat(forkedScopes);
	// scopesAfterLastRisky.sort(compare);
	// scopesPriorized.splice(indexLastRisky + 1, 0, scopesAfterLastRisky);
	// if (scopesPriorized) {
	//     return {
	//         body: { scopesPriorized: scopesBeforeLastRisky.concat(scopesAfterLastRisky) }
	//     };
	// }

	// }
</script>

<h1>Sequence scopes</h1>

<NavigationScopes currentBtn={4} />

<div class="w-full">
	{#each scopesForkedPriorized as scope, idx (scope.id)}
		{@const calculatedColor = calculateColor(scope, maxDependents)}
		{@const nextOne = scopesForkedPriorized[idx + 1]
			? scopesForkedPriorized[idx + 1]
			: { name: '' }}
		<div class="m-2 flex justify-center">
			<Scope {scope} editTitle={false} color={calculatedColor} itemsScopeModal={scope.items}>
				<div slot="badge">
					<BadgeDependencies project={projectStore} bind:scope />
				</div>
				<div slot="header">
					<div class="badge" class:hidden={!scope.indispensable}>Indispensable</div>
					<div class="badge" class:hidden={!scope.risky}>Risky</div>
				</div>
				<div slot="headerScopeModal">Items of {scope.name}</div>
				<div slot="body">
					{#if scope.id.includes('forked')}
						<div class="border-2 border-dotted border-red-500 p-2">
							Do only what is necessary to do the <span class="font-bold"> {nextOne.name}.</span> If
							you can, mock it.
						</div>
					{/if}
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

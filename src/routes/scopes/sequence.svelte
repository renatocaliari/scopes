<script>
	import { projectStore } from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import SvgArrow from './svgArrow.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';
	import Fa from 'svelte-fa';
	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

	let scopesForkedPriorized;
	$: {
		scopesForkedPriorized = projectStore.sortScopesByPriority().scopesForkedPriorized;
	}

	// let maxDependents = $projectStore.reduce((prev, curr) => {
	// 	return Math.max(prev, curr.dependsOn?.length);
	// }, 0);

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

<NavigationScopes currentStep={4}>
	<NavigationCheckList linkNextStep="/scopes/patternLanguage" linkPreviousStep="/scopes/unknowns" />
</NavigationScopes>

<div class="w-full">
	{#each scopesForkedPriorized as scope, idx (scope.id)}
		<!-- {@const calculatedColor = calculateColor(scope, maxDependents)} -->
		{@const nextOne = scopesForkedPriorized[idx + 1]
			? scopesForkedPriorized[idx + 1]
			: { name: '' }}
		<div class="m-2 justify-center flex">
			<div class="justify-start content-start items-start">
				<Scope {scope} editTitle={false} itemsScopeModal={scope.items} width="w-96" collapsable>
					<div slot="badge">
						<BadgeDependencies project={projectStore} {scope} />
					</div>
					<div slot="header">
						<div class="badge" class:hidden={!scope.indispensable}>Indispensable</div>
						<div class="badge" class:hidden={!scope.forkedScopeId}>
							<Fa icon={faCircleExclamation} class="mr-2" /> Do only the essential
						</div>
						<div class="badge" class:hidden={!scope.risky}>Risky</div>
					</div>
					<div slot="body">
						{#if scope.forkedScopeId}
							<div class="border-2 bg-yellow-50 p-2 text-left">
								<p>
									The sole intention at this step is allowing the execution of the next scope,
									<span class="font-bold bg-yellow-300 p-2">
										{nextOne.name || nextOne.placeholder}</span
									>. Think about simulated ways to mimic the real tasks here.
								</p>
								<p>
									In the world of development of software you can think about dummy objects, fake
									objects, stubs and mocks.
								</p>
								<p>
									<span class="font-bold bg-yellow-300 p-2">{scope.name || scope.placeholder}</span>
									will appear later on again, so you'll be able to execute fully.
								</p>
							</div>
						{/if}
						<h4>Indispensable:</h4>
						<Items bind:scope items={scope.items.filter((item) => item.indispensable == true)} />
						<h4>Nice to have:</h4>
						<Items bind:scope items={scope.items.filter((item) => item.indispensable == false)} />
					</div>
					<div slot="headerScopeModal">Items of {scope.name}</div>
				</Scope>
			</div>
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

<script>
	import { projectStore } from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import SvgArrow from './svgArrow.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';
	import Icon from 'svelte-awesome';
	// import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

	function scopesToText(scopes) {
		let text = '';
		scopes.forEach((scope, idx) => {
			text = text.concat('\n- Step ' + (idx + 1) + ': Scope [' + scope.name + ']');
			text = text.concat(
				scope.forkedScopeId
					? '\n\t- WARNING: Do only the essential at this step to do the next scope [' +
							scopes[idx + 1].name +
							']'
					: ''
			);
			text = text.concat(
				scope.risky ? '\n\t- WARNING: This scope is RISKY because has UNKNOWNS' : ''
			);
			if (scope.dependsOn.length > 0) {
				text = text.concat('\n\t- Depends on:');
				scope.dependsOn.forEach((dependsOnId) => {
					let sDepend = scopes.find((s) => s.id === dependsOnId);
					text = text.concat('\n\t\t- ' + sDepend.name);
				});
			}

			let unlocksScopes = scopes.filter((s) => s.dependsOn.includes(scope.id));
			if (unlocksScopes.length > 0) {
				text = text.concat('\n\t- Unlock scopes:');
				unlocksScopes.forEach((s) => {
					text = text.concat('\n\t\t- ' + s.name);
				});
			}

			let indispensableItems = scope.items.filter((item) => item.indispensable);
			let niceToHave = scope.items.filter((item) => !item.indispensable);
			if (indispensableItems.length > 0) {
				text = text.concat('\n\t- Indispensable items:');
				indispensableItems.forEach((item) => {
					text = text.concat('\n\t\t- ' + item.name);
				});
			}
			if (niceToHave.length > 0) {
				text = text.concat('\n\t- Nice to have items:');
				niceToHave.forEach((item) => {
					text = text.concat('\n\t\t- ' + item.name);
				});
			}
		});
		console.log('text:', text);
		return text;
	}

	let scopesForkedPriorized;
	$: {
		$projectStore,
			(scopesForkedPriorized = projectStore.sortScopesByPriority().scopesForkedPriorized);
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

<NavigationScopes currentStep={3} let:currentStep>
	<NavigationCheckList
		{currentStep}
		exportText={scopesToText(scopesForkedPriorized)}
		linkNextStep="/scopes/patternLanguage"
		linkPreviousStep="/scopes/unknowns"
	/>
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
							<!-- <Icon data={faCircleExclamation} class="mr-2" />  -->
							Do only the essential
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

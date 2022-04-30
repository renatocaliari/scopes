<script>
	import { projectStore, sortedScopesDocumentation } from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import SvgArrow from './svgArrow.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';

	projectStore.sortScopesByPriority();

	let maxDependents = $projectStore.reduce((prev, curr) => {
		return Math.max(prev, curr.dependsOn?.length);
	}, 0);
</script>

<NavigationScopes currentStep={4} let:currentStep>
	<NavigationCheckList {currentStep} linkPreviousStep="/scopes/sequence" />
</NavigationScopes>

<div class="w-full ">
	{#each $sortedScopesDocumentation as scope, idx (scope.id)}
		<div class="m-2 flex justify-center ">
			<Scope bind:scope itemsScopeModal={scope.items} width="w-full">
				<div slot="badge" class="w-full ">
					<BadgeDependencies project={projectStore} bind:scope />
				</div>
				<div slot="header" class="w-full">
					<div class="badge" class:hidden={!scope.indispensable}>Indispensable</div>
					<div class="badge" class:hidden={!scope.risky}>Risky</div>
					<h2
						class="mt-2 border-dashed border-2 border-gray-300"
						contenteditable
						bind:textContent={scope.title}
						placeholder="Write here the name of this group..."
					/>
				</div>
				<div slot="body">
					<div class="grid grid-cols-3">
						<div
							class="col-span-2 border-dashed border-2 border-gray-300"
							contenteditable
							bind:innerHTML={scope.description}
							placeholder="Write here the sections related to this group..."
						/>
						<div class="p-2">
							<div>
								<h4 class="mt-0">Indispensable:</h4>
								<ul>
									{#each scope.items.filter((item) => item.indispensable) as item}
										<li><div class="min-h-8">{item.name}</div></li>
									{/each}
								</ul>
							</div>
							<div>
								<h4>Nice to have:</h4>
								<ul>
									{#each scope.items.filter((item) => !item.indispensable) as item}
										<li><div class="min-h-8">{item.name}</div></li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div slot="headerScopeModal">Items of {scope.name}</div>
			</Scope>
		</div>
		{#if idx + 1 < $sortedScopesDocumentation.length}
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
	[contenteditable]:empty:before {
		content: attr(placeholder);
		display: block;
		opacity: 0.5;
	}
</style>

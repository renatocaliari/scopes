<script>
	import { projectStore, compare } from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import SvgArrow from './svgArrow.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';

	export let sortedScopesIndispensable = []; // fetch from server because store has a weird behavior in client using sort, specially on Firefox where it gets data correctly and blinks showing unexpected order from store

	let maxDependents = $projectStore.reduce((prev, curr) => {
		return Math.max(prev, curr.dependsOn?.length);
	}, 0);
</script>

<h1>Pattern Language</h1>

<NavigationScopes currentBtn={5} />

<div class="w-full ">
	{#each sortedScopesIndispensable as scope, idx (scope.id)}
		<div class="m-2 flex justify-center ">
			<Scope {scope} editTitle={true} itemsScopeModal={scope.items} width="w-full">
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
							bind:textContent={scope.description}
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
		{#if idx + 1 < sortedScopesIndispensable.length}
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
	}
</style>

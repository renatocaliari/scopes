<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import ToggleScope from '$lib/components/Scopes/ToggleScope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';

	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';

	$: sortedScopes = $projectStore.filter(
		(scope) => scope.id !== 'bucket' && scope.items.length > 0
	);
</script>

<NavigationScopes currentBtn={3} />

<ul class="list-inside border-2 p-2 shadow-xl mb-6">
	<!-- <li>Set which scopes are indispensable</li> -->
	<li>Set which scopes are riskiers</li>
</ul>

<div class={'grid grid-rows-2 grid-cols-3 grid-flow-row gap-4 place-content-around'}>
	{#each sortedScopes as scope}
		<div class:row-span-3={scope.id === 'bucket'}>
			<Scope editTitle={scope.id !== 'bucket'} bind:scope>
				<div slot="badge">
					<BadgeDependencies project={projectStore} bind:scope />
				</div>

				<div slot="header">
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
						checkText="Risky"
						on:checkItem={(e) => {
							projectStore.scopeUpdateRisky(e.detail.item, e.detail.checked);
						}}
					/>
				</div>

				<div slot="body">
					<div>Indispensable items:</div>
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

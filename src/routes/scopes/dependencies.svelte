<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';

	$: sortedScopes = $projectStore.filter(
		(scope) => scope.id !== 'bucket' && scope.items.length > 0
	);
</script>

<NavigationScopes currentBtn={2} />

<ul class="list-inside border-2 p-2 shadow-xl mb-6">
	<li>Set which scopes depends on other</li>
</ul>

<div class={'grid grid-rows-2 grid-cols-3 grid-flow-row gap-4 place-content-around'}>
	{#each sortedScopes as scope}
		<div>
			<Scope {scope} itemsScopeModal={scope.items} checked={scope.indispensable}>
				<div slot="badge">
					<BadgeDependencies project={projectStore} bind:scope />
				</div>
				<div slot="subTitle">Depends on:</div>
				<div slot="body">
					<Items
						bind:scope
						items={projectStore.getScopesExcludingThis(scope)}
						checkbox
						fnSetChecked={(s) => {
							return scope.dependsOn.includes(s.id);
						}}
						fnOnCheckItem={(s, item, checked) => {
							projectStore.updateDependencies(s, item, checked);
						}}
						fnItemsModal={(scope) => {
							return scope.items;
						}}
					/>
				</div>
				<div slot="headerScopeModal">Items of {scope.name}</div>
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

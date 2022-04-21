<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import { projectStore } from '$lib/stores/projectStore';

	$: sortedScopes = $projectStore.filter(
		(scope) => scope.id !== 'bucket' && scope.items.length > 0
	);
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/scopes">Scopes</a></li>
		<li>Dependencies</li>
	</ul>
</div>
<h1>Set dependencies</h1>
<div class="flex flex-row mb-4 justify-between">
	<div>
		<a href="/scopes" class="link-hover btn btn-sm md:btn-md btn-ghost gap-2 normal-case lg:gap-3"
			><svg
				class="h-6 w-6 fill-current md:h-8 md:w-8"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg
			>
			<div class="flex flex-col items-start">
				<span class="text-base-content/50 hidden text-xs font-normal md:block">Prev</span>
				<span>Scopes</span>
			</div></a
		>
	</div>
	<div>
		<a
			sveltekit:prefetch
			href="/scopes/sequence"
			class="link-hover btn btn-sm md:btn-md gap-2 normal-case lg:gap-3"
			><div class="flex flex-col items-end">
				<span class="text-neutral-content/50 hidden text-xs font-normal md:block">Next</span>
				<span>Sequence</span>
			</div>
			<svg
				class="h-6 w-6 fill-current md:h-8 md:w-8"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg
			></a
		>
	</div>
</div>

<!-- <pre>{JSON.stringify($projectStore)}</pre> -->

<div class={'grid grid-rows-2 grid-cols-3 grid-flow-row gap-4 place-content-around'}>
	{#each sortedScopes as scope}
		<div>
			<Scope {scope} itemsScopeModal={scope.items}>
				<div slot="header">
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

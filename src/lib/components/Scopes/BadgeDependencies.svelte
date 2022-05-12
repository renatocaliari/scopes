<script>
	import ItemDragDrop from '$lib/components/Scopes/ItemDragDrop.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import { fly } from 'svelte/transition';

	import { v4 as uuidv4 } from 'uuid';
	let randomId = uuidv4();

	export let project;
	export let scopes = [];
	export let scope;

	console.log('badge dep scopes', scopes);
	if (!scopes.length) {
		scopes = $project;
	}

	let unlockDependencies = [];
	let dependsOn;

	({ unlockDependencies, dependsOn } = refreshDependenciesCount());

	$: {
		$projectStore, refreshDependenciesCount();
	}

	let dataTip =
		(scope.name || scope.placeholder) + ' unlocks ' + unlockDependencies?.length + ' scope(s)';

	function refreshDependenciesCount() {
		// console.log('BADGE scopes:', scopes);
		let unlockDependencies = project
			.scopeUnlocksDependencies(scope, scopes)
			.filter((item) => item != null);

		// console.log('scope.dependsOn:', scope.dependsOn);
		console.log('scope:', scope);
		let dependsOn = scopes.filter(
			// (s) => scope.dependsOn.includes(s.id) || scope.dependsOn.includes(s.forkedScopeId)
			(s) => scope.dependsOn.includes(s.id)
		);

		return {
			unlockDependencies,
			dependsOn
		};
	}
</script>

<div class="inline-flex flex-wrap: nowrap;">
	<label for="scope-unlocks-{scope.id}-{randomId}" class="link link-hover">
		<div data-tip={dataTip} class="tooltip badge bg-green-500 border-green-500 text-white mr-2">
			{#key unlockDependencies.length}
				<span class="display: inline-block" in:fly={{ y: -20 }}>
					{unlockDependencies.length}
				</span>
			{/key}
		</div>
	</label>

	<label for="scope-depends-{scope.id}-{randomId}" class="link link-hover">
		<div
			data-tip="{scope.name || scope.placeholder} depend(s) on {dependsOn.length} scope(s)"
			class="tooltip badge bg-red-500 border-red-500 text-white"
		>
			{#key dependsOn.length}
				<span class="display: inline-block" in:fly={{ y: -20 }}> {dependsOn.length} </span>
			{/key}
		</div>
	</label>
</div>

<input type="checkbox" id="scope-unlocks-{scope.id}-{randomId}" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label
			for="scope-unlocks-{scope.id}-{randomId}"
			class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
		>
		<h3 class="text-lg font-bold">{scope.name} unlocks:</h3>
		{#each unlockDependencies as scope (scope.id)}
			<div class="m-2 p-2 w-auto border-gray-400 input input-bordered">
				<ItemDragDrop item={scope} readOnly={true} />
			</div>
		{/each}
	</div>
</div>
<input type="checkbox" id="scope-depends-{scope.id}-{randomId}" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label
			for="scope-depends-{scope.id}-{randomId}"
			class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
		>
		<h3 class="text-lg font-bold">{scope.name} depends on:</h3>
		{#each dependsOn as scope (scope.id)}
			<div class="m-2 p-2 w-auto border-gray-400 input input-bordered">
				<ItemDragDrop item={scope} readOnly={true} />
			</div>
		{/each}
	</div>
</div>

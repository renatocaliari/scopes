<script>
	import ItemDragDrop from '$lib/components/Scopes/ItemDragDrop.svelte';

	export let project;
	export let scope;
</script>

<label for="scope-dependents-{scope.id}" class="link link-hover">
	<div data-tip="# scopes this one depends on" class="tooltip badge badge-error mr-2">
		{scope.dependsOn.filter((item) => item != null).length}
	</div>
</label>

<label for="scope-dependencies-{scope.id}" class="link link-hover">
	<div data-tip="# scopes this one unlocks" class="tooltip badge badge-info">
		{project.scopeUnlocksDependencies(scope).filter((item) => item != null).length}
	</div>
</label>

<input type="checkbox" id="scope-dependencies-{scope.id}" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label for="scope-dependencies-{scope.id}" class="btn btn-sm btn-circle absolute right-2 top-2"
			>✕</label
		>
		<h3 class="text-lg font-bold">Dependencies of {scope.name}</h3>
		{#each $project.filter((s) => s.dependsOn.includes(scope.id)) as scope (scope.id)}
			<div class="m-2 p-2 w-auto border-gray-400 input input-bordered">
				<ItemDragDrop bind:item={scope} readOnly={true} />
			</div>
		{/each}
	</div>
</div>
<input type="checkbox" id="scope-dependents-{scope.id}" class="modal-toggle" />

<div class="modal">
	<div class="modal-box relative">
		<label for="scope-dependents-{scope.id}" class="btn btn-sm btn-circle absolute right-2 top-2"
			>✕</label
		>
		<h3 class="text-lg font-bold">Dependents on {scope.name}</h3>
		{#each $project.filter((s) => project
				.scopeUnlocksDependencies(scope)
				.includes(scope.id)) as scope (scope.id)}
			<div class="m-2 p-2 w-auto border-gray-400 input input-bordered">
				<ItemDragDrop bind:item={scope} readOnly={true} />
			</div>
		{/each}
	</div>
</div>

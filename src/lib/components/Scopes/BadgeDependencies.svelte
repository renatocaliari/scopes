<script>
	import { scopesStore } from '$lib/stores/scopesStore';
	import ItemDragDrop from '$lib/components/Scopes/ItemDragDrop.svelte';

	export let scope;
</script>

<label for="scope-dependents-{scope.id}" class="link link-hover">
	<div data-tip="# scopes dependents from this one" class="tooltip badge badge-info mr-2">
		{scope.dependents.length}
	</div>
</label>

<label for="scope-dependencies-{scope.id}" class="link link-hover">
	<div data-tip="# dependencies on other scopes" class="tooltip badge badge-error">
		{scope.dependencies.length}
	</div>
</label>

<input type="checkbox" id="scope-dependencies-{scope.id}" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label for="scope-dependencies-{scope.id}" class="btn btn-sm btn-circle absolute right-2 top-2"
			>✕</label
		>
		<h3 class="text-lg font-bold">Dependencies of {scope.name}</h3>
		{#each $scopesStore.filter((s) => s.dependents.includes(scope.id)) as scope (scope.id)}
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
		{#each $scopesStore.filter((s) => s.dependencies.includes(scope.id)) as scope (scope.id)}
			<div class="m-2 p-2 w-auto border-gray-400 input input-bordered">
				<ItemDragDrop bind:item={scope} readOnly={true} />
			</div>
		{/each}
	</div>
</div>

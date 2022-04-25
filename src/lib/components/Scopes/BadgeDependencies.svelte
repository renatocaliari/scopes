<script>
	import ItemDragDrop from '$lib/components/Scopes/ItemDragDrop.svelte';
	import { v4 as uuidv4 } from 'uuid';
	export let project;
	export let scope;

	let randomId = uuidv4();
</script>

<div class="inline-flex  flex-wrap: nowrap;">
	<label for="scope-unlocks-{scope.id}-{randomId}" class="link link-hover">
		<div
			data-tip="This scope unlocks {project
				.scopeUnlocksDependencies(scope)
				.filter((item) => item != null).length} scope(s)"
			class="tooltip badge badge-success mr-2"
		>
			{project.scopeUnlocksDependencies(scope).filter((item) => item != null).length}
		</div>
	</label>

	<label for="scope-depends-{scope.id}-{randomId}" class="link link-hover">
		<div
			data-tip="{scope.dependsOn.filter((item) => item != null)
				.length} scope(s) depend(s) on [{scope.name || scope.placeholder}]"
			class="tooltip badge badge-error"
		>
			{scope.dependsOn.filter((item) => item != null).length}
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
		{#each $project.filter((s) => s.dependsOn.includes(scope.id)) as scope (scope.id)}
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
		<h3 class="text-lg font-bold">Scopes depends on {scope.name}</h3>
		{#each $project.filter((s) => scope.dependsOn.includes(s.id)) as scope (scope.id)}
			<div class="m-2 p-2 w-auto border-gray-400 input input-bordered">
				<ItemDragDrop item={scope} readOnly={true} />
			</div>
		{/each}
	</div>
</div>

<script>
	import { scopesStore } from '$lib/stores/scopesStore';
	import ItemDragDrop from '$lib/components/Scopes/ItemDragDrop.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';

	export let scope;

	function updateRisky(e) {
		scope.risky = e.target.checked;
	}
</script>

<!--  class:bg-red-300={scope.risky} -->
<div name="scope" id={scope.id} class="p-2 border-2">
	<div name="title" class="mb-2">
		<div class="inline-flex items-center w-full">
			<input
				type="checkbox"
				class="checkbox mr-2"
				id="check-{scope.id}"
				checked={scope.risky}
				on:change={(e) => {
					updateRisky(e);
				}}
			/>

			<div class="mr-2 w-full prose">
				<h3>
					{#if scope.risky}🚨 {/if}{scope.name}
				</h3>
			</div>

			<BadgeDependencies {scope} />
		</div>
	</div>

	<section class="p-2 border-2 overflow-scroll h-52 bg-slate-100">
		{#each scope.items as item (item.id)}
			<div class="m-2 p-2 w-auto border-gray-400 bg-slate-100 border-b-2">
				<ItemDragDrop bind:item readOnly={true} />
			</div>
		{/each}
	</section>
</div>

<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';

	// let project;
	// $: {
	// 	console.log('atualizou o projeto - antes:', project);
	// 	project = Project.fromObject($projectStore);
	// 	console.log('atualizou o projeto - depois:', project);
	// }

	function addItem(scope, value, indispensable) {
		projectStore.scopeAddItem(scope, value, indispensable);
	}

	$: scopeBucket = $projectStore.find((scope) => scope.id === 'bucket');
</script>

<h1>Scopes</h1>

<NavigationScopes currentBtn={1} />

<div
	class="flex md:flex-nowrap flex-wrap 
	place-content-center"
>
	<div class="mb-4">
		<div class="sticky top-0 left-0 mb-4">
			<Scope editTitle bind:scope={scopeBucket}>
				<div slot="body">
					<div>Brain drump:</div>
					<Items
						bind:scope={scopeBucket}
						on:addItem={(e) => {
							addItem(scopeBucket, e.detail.value, true);
						}}
						focusAdd
						dragAndDrop
						allowAddItem
						allowEditItem
						allowRemoveItem
					/>
				</div></Scope
			>
		</div>
	</div>
	<div
		class="flex
		flex-row
		flex-wrap 
		justify-center 
		"
	>
		{#each $projectStore.filter((scope) => scope.id !== 'bucket') as scope}
			<div class="flex mx-4 mb-4 h-80">
				<Scope editTitle bind:scope>
					<div slot="body">
						<Items
							bind:scope
							bind:items={scope.items}
							on:addItem={(e) => {
								addItem(scope, e.detail.value, true);
							}}
							allowAddItem
							allowEditItem
							dragAndDrop
							checkbox
							fnSetChecked={(item) => {
								return item.indispensable;
							}}
							fnOnCheckItem={(scope, i, checked) => {
								projectStore.itemUpdateIndispensable(scope, i, checked);
							}}
						/>
					</div></Scope
				>
			</div>
		{/each}
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';

	// let project;
	// $: {
	// 	console.log('atualizou o projeto - antes:', project);
	// 	project = Project.fromObject($projectStore);
	// 	console.log('atualizou o projeto - depois:', project);
	// }

	function addItem(scope, value) {
		projectStore.scopeAddItem(scope, value);
	}
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><a href="/">Home</a></li>
		<li>Scopes</li>
	</ul>
</div>
<h1>Scopes</h1>
<div class="flex flex-row mb-4 justify-between">
	<div />
	<div>
		<a
			sveltekit:prefetch
			href="/scopes/dependencies"
			class="link-hover btn btn-sm md:btn-md gap-2 normal-case lg:gap-3"
			><div class="flex flex-col items-end">
				<span class="text-neutral-content/50 hidden text-xs font-normal md:block">Next</span>
				<span>Dependencies</span>
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

<div class={'grid grid-rows-3 grid-cols-4 grid-flow-row gap-4 place-content-around'}>
	<!-- {#each project.sortScopes() as scope} -->
	{#each $projectStore as scope}
		<div class:row-span-3={scope.id === 'bucket'}>
			<Scope editTitle={scope.id !== 'bucket'} bind:scope>
				<div slot="body">
					{#if scope.id === 'bucket'}
						<div>Brain drump:</div>
						<Items
							{scope}
							items={projectStore.scopeFilterItemsNiceToHave(scope)}
							on:addItem={(e) => {
								addItem(scope, e.detail.value);
							}}
							focusAdd
							allowAddItem
							allowEditItem
							allowRemoveItem
							checkbox
							fnSetChecked={(item) => {
								return item.indispensable;
							}}
							fnOnCheckItem={(scope, i, checked) => {
								projectStore.itemUpdateIndispensable(scope, i, checked);

								// i.indispensable = checked;
								// project.scopes = project.scopes; // force reactivity

								// $projectStore = $projectStore; // force reactivity
							}}
						/>
					{:else}
						<div>Nice to have:</div>
						<Items
							{scope}
							items={projectStore.scopeFilterItemsNiceToHave(scope)}
							on:addItem={(e) => {
								addItem(scope, e.detail.value);
							}}
							allowAddItem
							allowEditItem
							allowRemoveItem
							checkbox
							fnSetChecked={(item) => {
								return item.indispensable;
							}}
							fnOnCheckItem={(scope, i, checked) => {
								projectStore.itemUpdateIndispensable(scope, i, checked);
							}}
						/>
					{/if}

					{#if scope.id !== 'bucket'}
						<div>Indispensable:</div>
						<Items
							bind:scope
							items={projectStore.scopeFilterItemsIndispensable(scope)}
							allowRemoveItem
							dragAndDrop
							checkbox
							fnSetChecked={(item) => {
								return item.indispensable;
							}}
							fnOnCheckItem={(scope, i, checked) => {
								projectStore.itemUpdateIndispensable(scope, i, checked);
							}}
						/>
					{/if}
				</div></Scope
			>
		</div>
	{/each}
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

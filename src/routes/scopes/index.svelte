<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import { scopesStore } from '$lib/stores/scopesStore';
	import ItemDragDrop from '$lib/components/Scopes/ItemDragDrop.svelte';
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
	{#each $scopesStore as scope}
		<div class:row-span-3={scope.id === 'bucket'}>
			<Scope editTitle={scope.id !== 'bucket'} bind:parent={scope}>
				<div slot="body">
					<Items
						allowAddItem
						bind:items={scope.items}
						dragAndDrop
						allowRemoveItem
						checkbox={true}
						fnCheckSet={(item) => {
							return item.niceToHave;
						}}
						fnCheckItem={(i, checked) => {
							i.niceToHave = checked;
							$scopesStore = $scopesStore;
							$scopesStore = $scopesStore; // force reactivity
						}}
					/>
					<div>Nice to have:</div>
					<Items
						bind:items={scope.items}
						dragAndDrop
						allowRemoveItem
						allowEditItem
						checkbox={true}
						fnCheckSet={(item) => {
							return item.niceToHave;
						}}
						fnCheckItem={(i, checked) => {
							i.niceToHave = checked;
							$scopesStore = $scopesStore; // force reactivity
						}}
					/>
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

<script context="module">
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';

	function addItem(scope, value, indispensable) {
		projectStore.scopeAddItem(scope, value, indispensable);
	}
</script>

<script>
	let importText;
	let scopeBucket;
	let checkList;

	$: {
		$projectStore, console.log('$projectStore:', $projectStore);
		scopeBucket = $projectStore.find((scope) => scope.id === 'bucket');
		checkList = [
			{
				name: 'dump',
				text: 'In Bucket, dump all you think is needed to do or solve',
				checked: $projectStore.some((scope) => scope.items?.length > 0)
			},
			{
				name: 'group',
				text: 'Group those items in the scopes on the side asking: what items can be completed together in isolation of the other items?',
				checked: $projectStore.some((scope) => scope.id !== 'bucket' && scope.items?.length > 0)
			},
			{
				name: 'more',
				text: 'Group in more than 1 scope',
				checked:
					$projectStore
						.filter((scope) => scope.id !== 'bucket')
						.filter((scope) => scope.items?.length > 0).length > 1
			},
			{
				name: 'name',
				text: 'Name the scopes with items based on affinity and relationship of items grouped together',
				checked:
					$projectStore
						.filter((scope) => scope.id !== 'bucket')
						.filter((scope) => scope.items?.length > 0 && scope.name.length > 0).length > 0 &&
					$projectStore
						.filter((scope) => scope.id !== 'bucket')
						.filter((scope) => scope.items?.length > 0 && scope.name.length === 0).length === 0
			},
			{
				name: 'indispensable',
				text: 'Check the indispensable items in each scope used. The ones unchecked are considered nice-to-have',
				checked:
					$projectStore.filter((scope) => scope.id !== 'bucket' && scope.items?.length > 0).length >
						0 &&
					$projectStore
						.filter((scope) => scope.id !== 'bucket' && scope.items?.length > 0)
						.every((scope) => scope.items?.some((item) => item.indispensable))
			}
		];
	}

	function confirmClear() {
		projectStore.reset();
	}

	function importToBucket(text, bucket) {
		var lines = text.split('\n');
		for (let i = lines.length - 1; i >= 0; i--) {
			projectStore.scopeAddItem(bucket, lines[i], false);
		}
		$projectStore = $projectStore;
	}

	function confirmClearBucket(bucket) {
		bucket.items = [];
		$projectStore = $projectStore;
	}
</script>

<NavigationScopes currentStep={0} let:currentStep>
	<div slot="checkList">
		<NavigationCheckList {currentStep} {checkList} linkNextStep="/scopes/dependencies">
			<div slot="buttons">
				<label
					for="modal-clear"
					class="btn btn-warning modal-button"
					class:btn-disabled={$projectStore.every((scope) => scope.items?.length === 0)}
					>Clear all</label
				>
			</div>
		</NavigationCheckList>
	</div>
</NavigationScopes>

<div
	class="flex md:flex-nowrap flex-wrap 
	place-content-center"
>
	<div class="mb-4">
		<div class="sticky top-0 left-0 mb-4">
			<Scope bind:scope={scopeBucket} width="w-80">
				<div slot="header">
					<label for="modal-clear-bucket" class="btn btn-warning modal-button">Clear</label>
					<label for="modal-import" class="btn btn-primary modal-button">Bulk Insert</label>
				</div>
				<div slot="body">
					<div>Brain drump:</div>
					<Items
						bind:scope={scopeBucket}
						bind:items={scopeBucket.items}
						on:addItem={(e) => {
							addItem(scopeBucket, e.detail.value, false);
						}}
						maxHeight="max-h-screen"
						minHeight="h-screen"
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
		place-content-around
		"
	>
		{#each $projectStore.filter((scope) => scope.id !== 'bucket') as scope}
			<div class="flex mx-4 mb-4 h-80">
				<!-- on:addItem={(e) => {
								addItem(scope, e.detail.value, true);
							}}
							allowAddItem -->

				<Scope editTitle bind:scope width="w-80">
					<div slot="body">
						<Items
							bind:scope
							bind:items={scope.items}
							allowEditItem
							dragAndDrop
							checkbox
							fnSetChecked={(item) => {
								return item.indispensable;
							}}
							fnOnCheckItem={(e, scope, i, checked) => {
								projectStore.itemUpdateIndispensable(scope, i, checked);
								$projectStore = $projectStore;
							}}
						/>
					</div></Scope
				>
			</div>
		{/each}
	</div>
</div>

<input type="checkbox" id="modal-clear-bucket" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Are you sure you want to clear the Bucket?</h3>
		<div class="modal-action">
			<label for="modal-clear-bucket" class="btn">Cancel</label>
			<label
				for="modal-clear-bucket"
				class="btn btn-warning"
				on:click={() => confirmClearBucket(scopeBucket)}>Confirm</label
			>
		</div>
	</div>
</div>

<input type="checkbox" id="modal-import" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Bulk insert of items into Bucket</h3>
		<div style="white-space: pre-wrap;" class="w-full overflow-auto">
			<textarea
				placeholder="type here your items, one per line."
				class="w-full textarea textarea-bordered
			"
				bind:value={importText}
			/>
		</div>

		<div class="modal-action">
			<label for="modal-import" class="btn">Cancel</label>
			<label
				for="modal-import"
				class="btn btn-warning"
				on:click={() => importToBucket(importText, scopeBucket)}>Confirm</label
			>
		</div>
	</div>
</div>

<input type="checkbox" id="modal-clear" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Are you sure you want to clear all data?</h3>
		<p class="py-4">It includes all information you have set in any screen.</p>
		<div class="modal-action">
			<label for="modal-clear" class="btn">Cancel</label>
			<label for="modal-clear" class="btn btn-warning" on:click={confirmClear}>Confirm</label>
		</div>
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

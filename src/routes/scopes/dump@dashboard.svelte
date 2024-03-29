<script context="module">
	import WhatAreScopes from '$lib/components/Scopes/WhatAreScopes.svelte';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';

	function addItem(scope, value, indispensable) {
		projectStore.scopeAddItem(scope, value, indispensable);
	}
</script>

<script>
	let importText;
	let scopeBucket;
	let checkList;
	let fieldImportText;

	$: {
		$projectStore, (scopeBucket = $projectStore['scopes'].find((scope) => scope.id === 'bucket'));
		checkList = {
			title: 'Tasks to proceed',
			items: [
				{
					name: 'dump',
					text: 'In the Bucket below, dump all you think is needed to do or solve in the next cycle',
					checked: $projectStore['scopes'].some((scope) => scope.items?.length > 0)
				},
				{
					name: 'group',
					text: 'Group those items into <label for="modal-about-scopes" class="cursor-pointer bg-yellow-200 hover:underline p-1">scopes [?]</label>&nbsp;on the right side asking: what items can be completed together in isolation of the other items?',
					checked: $projectStore['scopes'].some(
						(scope) => scope.id !== 'bucket' && scope.items?.length > 0
					)
				},
				{
					name: 'more',
					text: 'Group items in more than 1 scope',
					checked:
						$projectStore['scopes']
							.filter((scope) => scope.id !== 'bucket')
							.filter((scope) => scope.items?.length > 0).length > 1
				},
				{
					name: 'name',
					text: 'Give a name to each scope with items based on affinity and relationship of items grouped together',
					checked:
						$projectStore['scopes']
							.filter((scope) => scope.id !== 'bucket')
							.filter((scope) => scope.items?.length > 0 && scope.name.length > 0).length > 0 &&
						$projectStore['scopes']
							.filter((scope) => scope.id !== 'bucket')
							.filter((scope) => scope.items?.length > 0 && scope.name.length === 0).length === 0
				}
			]
		};
	}

	function confirmClear() {
		projectStore.reset();
	}

	function importToBucket(text, bucket) {
		var lines = text.split('\n');
		for (let i = lines.length - 1; i >= 0; i--) {
			projectStore.scopeAddItem(bucket, lines[i], true);
		}
		fieldImportText.value = '';

		$projectStore = $projectStore;
	}

	function confirmClearBucket(bucket) {
		bucket.items = [];
		$projectStore = $projectStore;
	}
</script>

<NavigationScopes stepId="dump" {checkList}>
	<div slot="buttons">
		<label for="modal-clear" class="btn btn-outline modal-button"
			><svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
				><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
					d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"
				/></svg
			>Clear all scopes and items</label
		>
	</div>
</NavigationScopes>

<div
	class="flex md:flex-nowrap flex-wrap 
	place-content-center w-full"
>
	<div class="mb-4">
		<div class="sticky top-0 left-0 mb-4">
			<Scope bind:scope={scopeBucket} width="w-80">
				<div slot="header" class="flex flex-row align-middle p-2 justify-between w-full">
					<label for="modal-clear-bucket" class="btn btn-outline modal-button"
						><svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
							><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
								d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"
							/></svg
						>Clear</label
					><label for="modal-import" class="btn btn-outline modal-button m-0">Bulk Insert</label>
				</div>
				<div slot="body">
					<div>Brain dump:</div>
					<Items
						bind:scope={scopeBucket}
						bind:items={scopeBucket.items}
						on:addItem={(e) => {
							addItem(scopeBucket, e.detail.value, e.detail.indispensable);
						}}
						maxHeight="max-h-96"
						minHeight="h-screen"
						dragAndDrop={true}
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
		place-content-between ml-4
		"
	>
		{#each $projectStore['scopes'].filter((scope) => scope.id !== 'bucket') as scope}
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
							allowAddItem
							on:addItem={(e) => {
								addItem(scope, e.detail.value, e.detail.indispensable);
							}}
							allowEditItem
							dragAndDrop={true}
						/>
					</div></Scope
				>
			</div>
		{/each}
	</div>
</div>

<input type="checkbox" id="modal-about-scopes" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">What does scope mean and how to break down tasks in scopes?</h3>
		<div class="max-h-96 overflow-y-auto">
			<WhatAreScopes />
		</div>
		<div class="modal-action">
			<label for="modal-about-scopes" class="btn btn-primary">ok</label>
		</div>
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
				class="btn btn-primary"
				on:click={() => confirmClearBucket(scopeBucket)}>Confirm</label
			>
		</div>
	</div>
</div>

<input type="checkbox" id="modal-import" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Write or paste some text:</h3>
		<div style="white-space: pre-wrap;" class="w-full overflow-auto">
			<div class="form-control">
				<label class="label">
					<span class="label-text">Each line will be converted to an item</span>
				</label>
				<textarea
					bind:this={fieldImportText}
					class="w-full textarea textarea-bordered
			"
					bind:value={importText}
				/>
			</div>
		</div>

		<div class="modal-action">
			<label for="modal-import" class="btn">Cancel</label>
			<label
				for="modal-import"
				class="btn btn-primary"
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
			<label for="modal-clear" class="btn btn-primary" on:click={confirmClear}>Confirm</label>
		</div>
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

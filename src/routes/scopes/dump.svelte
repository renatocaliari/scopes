<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';

	function addItem(scope, value, indispensable) {
		projectStore.scopeAddItem(scope, value, indispensable);
	}

	let scopeBucket;
	let checkList;

	$: {
		scopeBucket = $projectStore.find((scope) => scope.id === 'bucket');

		checkList = [
			{
				name: 'dump',
				text: 'In Bucket, dump all you think is needed to do or solve',
				checked: $projectStore.some((scope) => scope.items.length > 0)
			},
			{
				name: 'group',
				text: 'Group those items in the scopes on the side asking: what items can be completed together in isolation of the other items?',
				checked: $projectStore.some((scope) => scope.id !== 'bucket' && scope.items.length > 0)
			},
			{
				name: 'more',
				text: 'Group in more than 1 scope',
				checked:
					$projectStore
						.filter((scope) => scope.id !== 'bucket')
						.filter((scope) => scope.items.length > 0).length > 1
			},
			{
				name: 'name',
				text: 'Name the scopes with items based on affinity and relationship of items grouped together',
				checked:
					$projectStore
						.filter((scope) => scope.id !== 'bucket')
						.filter((scope) => scope.items.length > 0 && scope.name.length > 0).length > 0 &&
					$projectStore
						.filter((scope) => scope.id !== 'bucket')
						.filter((scope) => scope.items.length > 0 && scope.name.length === 0).length === 0
			},
			{
				name: 'indispensable',
				text: 'Check the indispensable items in each scope used. The ones unchecked are considered nice-to-have',
				checked:
					$projectStore.filter((scope) => scope.id !== 'bucket' && scope.items.length > 0).length >
						0 &&
					$projectStore
						.filter((scope) => scope.id !== 'bucket' && scope.items.length > 0)
						.every((scope) => scope.items.some((item) => item.indispensable))
			}
		];
	}
</script>

<NavigationScopes currentStep={0} let:currentStep>
	<div slot="checkList">
		<NavigationCheckList
			{currentStep}
			{checkList}
			allowClearAll={true}
			linkNextStep="/scopes/dependencies"
		/>
	</div>
</NavigationScopes>
<div
	class="flex md:flex-nowrap flex-wrap 
	place-content-center"
>
	<div class="mb-4">
		<div class="sticky top-0 left-0 mb-4">
			<Scope bind:scope={scopeBucket} width="w-80">
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
							fnOnCheckItem={(scope, i, checked) => {
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

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

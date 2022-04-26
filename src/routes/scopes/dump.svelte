<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';

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

	let checkList;

	$: checkList = [
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
				$projectStore.filter((scope) => scope.id !== 'bucket' && scope.items.length > 0).length > 1
		},
		{
			name: 'name',
			text: 'Name the scopes with items based on affinity and relationship of items grouped together',
			checked:
				$projectStore.filter(
					(scope) => scope.id !== 'bucket' && scope.items.length > 0 && scope.name.length > 0
				).length > 0 &&
				$projectStore.filter(
					(scope) => scope.id !== 'bucket' && scope.items.length > 0 && scope.name.length === 0
				).length === 0
		},
		{
			name: 'indispensable',
			text: 'Check the indispensable items. The ones unchecked consider as nice-to-have',
			checked: $projectStore.some((scope) => scope.items.some((item) => item.indispensable))
		}
	];
</script>

<NavigationScopes currentStep={1}>
	<div slot="checkList">
		<NavigationCheckList bind:checkList linkNextStep="/scopes/dependencies" />
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
		justify-center 
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

<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { createEventDispatcher } from 'svelte';
	import ItemDragDrop from '$lib/components/Scopes/ItemDragDrop.svelte';

	export let scope;
	export let items;
	export let minHeight = 'min-h-0';
	export let maxHeight = 'h-48';
	export let dragAndDrop = false;
	export let allowRemoveItem = false;
	export let allowAddItem = false;
	export let focusAdd = false;
	export let allowEditItem = false;
	export let checkbox = false;
	export let emptyState = 'No items';
	export let fnItemsModal = (item) => {
		return [];
	};
	export let fnSetChecked = (item) => {
		return true;
	};
	export let fnOnCheckItem = (event, scope, item, checked) => {};

	let submit = false;
	let value;

	const dispatch = createEventDispatcher();

	const flipDurationMs = 300;

	function handleDndConsider(e) {
		scope.items = e.detail.items;
	}
	function handleDndFinalize(e) {
		scope.items = e.detail.items;
	}

	function checkItem(e, scope, item, checked) {
		fnOnCheckItem(e, scope, item, checked);
	}

	function removeItem(itemId) {
		scope.items = scope.items.filter((node) => node.id !== itemId);
	}

	const handleSubmit = (event) => {
		submit = true;
	};

	function addItem(event) {
		if (event.target.value.trim() !== '') {
			dispatch('addItem', {
				value: event.target.value
			});
		}

		event.target.value = '';
		event.target.focus();
	}

	const handleKeyPress = (event) => {
		submit = false;

		if (event.code == 'Enter') {
			event.preventDefault();
			addItem(event);
			return false;
		}
	};

	function autoFocus(node, focus) {
		if (focus) {
			node.focus();
		}
	}

	function proxyDndzone() {
		if (dragAndDrop) {
			return dndzone.apply(null, arguments);
		}
	}
</script>

{#if allowAddItem}
	<form class="flex-none form form-control" on:submit|preventDefault={handleSubmit}>
		<input
			class="input input-bordered mb-2 rounded-none"
			use:autoFocus={focusAdd}
			id="task"
			name="task"
			placeholder="type new task here and press ENTER"
			on:keypress={handleKeyPress}
		/>
	</form>
{/if}
<!-- 
{#if items?.length == 0}
	<section
		class:h-52={forceMinHeight}
		class:overflow-scroll={forceMinHeight}
		use:proxyDndzone={{
			items: items,
			flipDurationMs,
			type: 'items',
			dropTargetClasses: ['bg-green-50']
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		<div class="m-2 p-2 w-auto min-h-8 border-2 text-xs h-40">
			{emptyState}
		</div>
	</section> -->
<!-- {:else} -->
<section
	class="overflow-auto {minHeight} {maxHeight}"
	use:proxyDndzone={{
		items: items,
		flipDurationMs,
		type: 'items',
		dropTargetClasses: ['bg-green-50']
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each items.filter((i) => i.name || i.placeholder) as item (item.id)}
		<div
			class="w-auto text-xs min-h-8 p-2 my-2"
			class:border-b-2={item.name || item.placeholder}
			animate:flip={{ duration: flipDurationMs }}
		>
			<ItemDragDrop
				bind:item
				{dragAndDrop}
				{checkbox}
				checked={fnSetChecked(item)}
				{allowEditItem}
				{allowRemoveItem}
				itemsModal={fnItemsModal(item)}
				on:checkItem={(event) => {
					checkItem(event.detail.event, scope, event.detail.item, event.detail.checked);
				}}
				on:removeItem={(event) => removeItem(event.detail.item.id)}
			>
				<div slot="headerModal">Items of {item.name}</div>
			</ItemDragDrop>
		</div>
	{/each}
</section>

<!-- {/if} -->
<style>
	:is([contenteditable], [placeholder]) {
		cursor: text;
	}
</style>

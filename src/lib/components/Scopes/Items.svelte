<script>
	import ItemDragDrop from '$lib/components/Scopes/ItemDragDrop.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { v4 as uuidv4 } from 'uuid';
	import { createEventDispatcher } from 'svelte';

	export let items;
	export let dragAndDrop = false;

	export let fnItemsModal = (item) => {
		return [];
	};
	export let allowRemoveItem = false;
	export let allowAddItem = false;
	export let allowEditItem = false;
	export let checkbox = false;
	export let fnCheckSet = (item) => {
		return true;
	};

	export let fnCheckItem = (item, checked) => {};
	export let fnFilter = (items) => {
		return items;
	};

	let submit = false;
	let value;

	const dispatch = createEventDispatcher();

	function callFilter(items) {
		return fnFilter(items);
	}

	const flipDurationMs = 300;

	function handleDndConsider(e) {
		items = e.detail.items;
	}
	function handleDndFinalize(e) {
		items = e.detail.items;
	}

	function checkItem(itemId, checked) {
		fnCheckItem(
			items.find((node) => node.id == itemId),
			checked
		);
	}

	function removeItem(itemId) {
		items = items.filter((node) => node.id != itemId);
	}

	const handleSubmit = (event) => {
		submit = true;
	};

	function addItem(event) {
		if (event.target.value.trim() !== '') {
			let item = { id: uuidv4(), name: event.target.value, niceToHave: false };
			items = [item, ...items];

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

	function autoFocus(node) {
		node.focus();
	}
</script>

{#if allowAddItem}
	<form class="flex-none form form-control" on:submit|preventDefault={handleSubmit}>
		<input
			class="input input-bordered mb-2 rounded-none"
			use:autoFocus
			id="task"
			name="task"
			placeholder="type new task here and press ENTER"
			on:keypress={handleKeyPress}
		/>
	</form>
{/if}

{#if dragAndDrop}
	<section
		class="p-2 border-2 overflow-scroll h-52"
		use:dndzone={{
			items: items,
			flipDurationMs,
			type: 'Scope',
			dropTargetClasses: ['bg-green-50']
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each callFilter(items) as item (item.id)}
			<div
				class="m-2 p-2 w-auto border-gray-400  input input-bordered "
				animate:flip={{ duration: flipDurationMs }}
			>
				<ItemDragDrop
					bind:item
					{dragAndDrop}
					{checkbox}
					checked={fnCheckSet(item)}
					{allowRemoveItem}
					itemsModal={fnItemsModal(item)}
					on:checkItem={(event) => {
						checkItem(event.detail.item.id, event.detail.checked);
					}}
					on:removeItem={(event) => removeItem(event.detail.item.id)}
				>
					<div slot="headerModal">Items of {item.name}</div>
				</ItemDragDrop>
			</div>
		{/each}
	</section>
{:else}
	<section class="p-2 border-2 overflow-scroll h-52">
		{#each callFilter(items) as item (item.id)}
			<div class="m-2 p-2 w-auto border-gray-400 input input-bordered ">
				<ItemDragDrop
					bind:item
					{dragAndDrop}
					{checkbox}
					checked={fnCheckSet(item)}
					{allowRemoveItem}
					{allowEditItem}
					itemsModal={fnItemsModal(item)}
					on:checkItem={(event) => checkItem(event.detail.item.id, event.detail.checked)}
					on:removeItem={(event) => removeItem(event.detail.item.id)}
				>
					<div slot="headerModal">Items of {item.name}</div>
				</ItemDragDrop>
			</div>
		{/each}
	</section>
{/if}

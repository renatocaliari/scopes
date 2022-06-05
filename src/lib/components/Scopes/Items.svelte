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
	export let placeholderAddItem = 'type new task here and press ENTER';
	export let classesCSSItem = '';
	export let showOptions = false;
	export let allowEditItem = false;
	export let checkbox = false;
	export let badgeNiceToHave = false;
	export let fnDisableCheckbox = undefined;
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

	let fieldAddText;
	// $: items.length === 0 && fieldAddText ? fieldAddText.focus() : null;

	const dispatch = createEventDispatcher();

	const flipDurationMs = 300;

	function handleDndConsider(e) {
		items = e.detail.items;
	}
	function handleDndFinalize(e) {
		items = e.detail.items;
	}

	function checkItem(e, scope, item, checked) {
		fnOnCheckItem(e, scope, item, checked);
	}

	function removeItem(itemId) {
		items = items.filter((node) => node.id !== itemId);
	}

	const handleSubmit = (event) => {
		submit = true;
		addItem(event);
		return false;
	};

	function addItem(event) {
		if (event.target.value.trim() !== '') {
			dispatch('addItem', {
				value: event.target.value,
				indispensable: false
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

	function proxyDndzone() {
		if (dragAndDrop) {
			return dndzone(...arguments); // dndzone.apply(null, arguments);
		}
	}
</script>

{#if allowAddItem}
	<form class="flex-none form form-control" on:submit|preventDefault={handleSubmit}>
		<input
			class="input input-bordered mb-2 rounded-none"
			bind:this={fieldAddText}
			id="task"
			name="task"
			placeholder={placeholderAddItem}
			on:keypress={handleKeyPress}
		/>
	</form>
{/if}

<section
	class="overflow-y-scroll {minHeight} {maxHeight}"
	use:proxyDndzone={{
		items: items, //.filter((i) => i.name || i.placeholder),
		flipDurationMs,
		type: 'items',
		dropTargetClasses: ['bg-green-50']
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	<!-- .filter((i) => i.name || i.placeholder) -->
	{#each items as item (item.id)}
		<div class="w-auto text-xs min-h-8 p-2 my-2 " animate:flip={{ duration: flipDurationMs }}>
			<ItemDragDrop
				bind:item
				{scope}
				{dragAndDrop}
				{checkbox}
				{fnDisableCheckbox}
				checked={fnSetChecked(item)}
				classesCSS={classesCSSItem}
				{allowEditItem}
				{allowRemoveItem}
				{showOptions}
				itemsModal={fnItemsModal(item)}
				on:checkItem={(event) => {
					checkItem(event.detail.event, scope, event.detail.item, event.detail.checked);
				}}
				on:removeItem={(event) => removeItem(event.detail.item.id)}
			>
				<div slot="headerModal">Items of {item.name}</div>

				<div slot="badges" class="inline-flex flex-wrap">
					{#if !item.indispensable && badgeNiceToHave}
						<div class="badge badge-ghost m-1">Nice to have</div>
					{/if}
				</div>
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

<script>
	import { createEventDispatcher } from 'svelte';
	import { add_classes } from 'svelte/internal';
	const dispatch = createEventDispatcher();

	export let item;
	export let itemsModal = [];
	export let readOnly = false;
	export let dragAndDrop = false;
	export let checkbox = false;
	export let checked = false;
	export let allowRemoveItem = false;
	export let allowEditItem = false;

	function checkItem(e, checked) {
		dispatch('checkItem', {
			event: e,
			item: item,
			checked: checked
		});
	}

	function removeItem(item) {
		dispatch('removeItem', {
			item: item
		});
	}

	let mouseIsOver = false;
	function mouseOver(e) {
		mouseIsOver = true;
	}

	function mouseOut(e) {
		mouseIsOver = false;
		e.target.blur();
	}
</script>

<div class="task inline-flex items-center w-full min-h-8 align-middle break-words">
	{#if readOnly}
		<div
			class="w-full"
			class:line-clamp-2={!mouseIsOver}
			on:mouseenter={mouseOver}
			on:mouseout={mouseOut}
		>
			{item.name || item.placeholder}
		</div>
	{:else}
		{#if dragAndDrop}
			<div>
				<svg viewBox="0 0 100 80" width="20" height="20">
					<rect width="70" height="12" />
					<rect y="20" width="70" height="12" />
					<rect y="40" width="70" height="12" />
				</svg>
			</div>
		{/if}

		{#if checkbox}
			<input
				on:change={(e) => checkItem(e, e.target.checked)}
				type="checkbox"
				class="checkbox mr-2"
				{checked}
			/>
		{/if}
		{#if allowEditItem}
			<span
				class="w-full items-center m-1 break-words"
				class:border-2={mouseIsOver}
				class:border-dashed={mouseIsOver}
				class:line-clamp-2={!mouseIsOver}
				on:mouseenter={mouseOver}
				on:mouseout={mouseOut}
				contenteditable
				bind:textContent={item.name}
			>
				<label for="modal-item-{item.id}" class="mr-2 w-full link link-hover prose"
					>{item.name}</label
				>
			</span>
		{:else if itemsModal.length > 0}
			<div
				class="items-center break-words"
				class:line-clamp-2={!mouseIsOver}
				on:mouseenter={mouseOver}
				on:mouseout={mouseOut}
			>
				<label for="modal-item-{item.id}" class="w-full link link-hover prose"
					>{item.name || item.placeholder}</label
				>
			</div>
		{:else}
			<div
				class="items-center"
				class:line-clamp-2={!mouseIsOver}
				on:mouseenter={mouseOver}
				on:mouseout={mouseOut}
			>
				{item.name || item.placeholder}
			</div>
		{/if}
		{#if allowRemoveItem}
			<button class="remove" on:click={() => removeItem(item)}>
				<svg xmlns="http://www.w3.org/2000/svg" width="15" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		{/if}
	{/if}

	<input type="checkbox" id="modal-item-{item.id}" class="modal-toggle" />
	<div class="modal">
		<div class="modal-box relative">
			<label for="modal-item-{item.id}" class="btn btn-sm btn-circle absolute right-2 top-2"
				>✕</label
			>
			{#if $$slots.headerModal}
				<h3 class="text-lg font-bold"><slot name="headerModal" /></h3>
			{/if}
			{#if $$slots.bodyModal}
				<slot name="bodyModal" />
			{/if}
			{#if itemsModal}
				{#each itemsModal as itemModal}
					{#if itemModal['name']}
						<ul>
							<li>{itemModal.name}</li>
						</ul>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	.task button.remove {
		margin: 0;
		padding: 0;
		grid-row: 1 / 2;
		grid-column: 3 / 4;
		border-radius: 100%;
		color: red;
		aspect-ratio: 1 / 1;
		display: grid;
		width: 32px;
		height: 32px;
		display: grid;
		place-content: center;
		justify-self: end;
		align-self: center;
		opacity: 0.1;
		transition: opacity 250ms;
		background-color: #eee;
		border: 1px solid #ccc;
	}

	.task:hover button.remove {
		opacity: 1;
	}

	:is([contenteditable], [placeholder]) {
		cursor: text;
	}

	[contenteditable='true']:active,
	[contenteditable='true']:focus {
	}
</style>

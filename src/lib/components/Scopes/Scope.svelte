<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import ItemDragDrop from '$lib/components/Scopes/ItemDragDrop.svelte';
	import { v4 as uuidv4 } from 'uuid';

	export let scope = {};

	export let allowAdd = false;
	export let editTitle = true;

	let submit = false;
	let value;

	const flipDurationMs = 300;
	function handleDndConsider(e) {
		scope.items = e.detail.items;
	}
	function handleDndFinalize(e) {
		scope.items = e.detail.items;
	}

	function removeItem(event) {
		scope.items = scope.items.filter((node) => node.id != event.detail.item.id);
	}

	const handleSubmit = (event) => {
		submit = true;
	};

	function addItem(event) {
		if (event.target.value.trim() !== '') {
			value = { id: uuidv4(), name: event.target.value };
			scope.items = [value, ...scope.items];
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

<div name="scope" id={scope.id} class="p-2 border-2">
	<div name="title" class="mb-2">
		<div class="inline-flex items-center w-full">
			{#if editTitle}
				<svelte:element
						this="h3"
						contenteditable
						bind:innerHTML={scope.name}
						class="mr-2 mt-0 mb-0"
					/>
			{:else}
				<div class="mr-2 w-full prose m-2"><h3>{scope.name}</h3></div>
			{/if}
		</div>
	</div>
	{#if allowAdd}
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
	<section
		class="p-2 border-2 overflow-scroll h-52"
		use:dndzone={{
			items: scope.items,
			flipDurationMs,
			type: 'Scope',
			dropTargetClasses: ['bg-green-50']
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each scope.items as item (item.id)}
			<div
				class="m-2 p-2 w-auto border-gray-400 input input-bordered "
				animate:flip={{ duration: flipDurationMs }}
			>
				<ItemDragDrop bind:item on:removeItem={removeItem} />
			</div>
		{/each}
	</section>
</div>

<style>
	[contenteditable] {
		grid-row: 1 / 2;
		grid-column: 1 / 2;
		z-index: 2;
		justify-self: start;
		display: block;
		min-height: 32px;
		width: 100%;
		-webkit-user-select: text;
		user-select: text;
		padding: 8px;
		line-height: 1.5;
		outline: none;
		cursor: text;
		transition: border-color 250ms;
		border: 1px dashed;
		border-color: white;
	}

	[contenteditable]:hover {
		border-color: gray;
		background-color: white;
	}

	[contenteditable]:focus {
		border-color: gray;
		background-color: white;
	}

	.move-handle {
		grid-row: 1 / 2;
		grid-column: 2 / 3;
		align-self: center;
		width: 32px;
		min-width: 32px;
		height: 32px;
		min-height: 32px;
		font-size: 8px;
		border: 1px solid #ccc;
		border-radius: 16px;
		background-color: #eee;
		transition: opacity 250ms;
		opacity: 1;
		display: grid;
		grid-template-rows: repeat(2, 8px);
		grid-template-columns: repeat(2, 8px);
		grid-auto-flow: row-dense;
		place-content: center;
	}
	.dot {
		background-color: #aaa;
		width: 4px;
		height: 4px;
		border-radius: 2px;
		place-self: center;
	}
</style>

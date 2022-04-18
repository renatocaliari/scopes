<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let item;
	export let readOnly = false;

	function remove(item) {
		dispatch('removeItem', {
			item: item
		});
	}
</script>

<div class="task inline-flex items-center w-full">
	{#if readOnly}
		<div class="w-full">{item.name}</div>
	{:else}
		<div class="w-full" contenteditable bind:textContent={item.name}>{item.name}</div>
		<div class="move-handle">
			<div class="dot" />
			<div class="dot" />
			<div class="dot" />
			<div class="dot" />
		</div>
		<button class="remove" on:click={() => remove(item)}>
			<svg xmlns="http://www.w3.org/2000/svg" width="15" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	{/if}
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

	.task:hover .move-handle {
		opacity: 1;
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
		opacity: 0.1;
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

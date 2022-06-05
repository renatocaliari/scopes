<script>
	import { createEventDispatcher } from 'svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import configClassification from '$lib/data/classification';
	const dispatch = createEventDispatcher();

	export let scope = undefined;
	export let item;
	export let itemsModal = [];
	export let classesCSS = '';
	export let readOnly = false;
	export let dragAndDrop = false;
	export let checkbox = false;
	export let fnDisableCheckbox = undefined;
	export let checked = false;
	export let allowRemoveItem = false;
	export let allowEditItem = false;
	export let showOptions = false;

	function checkItem(e, checked) {
		dispatch('checkItem', {
			event: e,
			item: item,
			checked: checked
		});
	}

	function checkClassification(scope, item, classification, toggle) {
		projectStore.setClassificationToObject(scope, item, classification.toLowerCase(), toggle);
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

<div class="task inline-flex w-full min-h-8 break-words ">
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
			<div class="mt-2">
				<svg viewBox="0 0 100 80" width="20" height="20">
					<rect width="70" height="12" />
					<rect y="20" width="70" height="12" />
					<rect y="40" width="70" height="12" />
				</svg>
			</div>
		{/if}
		{#if checkbox}
			{#if fnDisableCheckbox && fnDisableCheckbox(item)}
				<input
					on:change={(e) => checkItem(e, e.currentTarget.checked)}
					type="checkbox"
					disabled={true}
					class="checkbox mr-2"
					{checked}
				/>
			{:else}
				<input
					on:change={(e) => checkItem(e, e.currentTarget.checked)}
					type="checkbox"
					class="checkbox mr-2"
					{checked}
				/>
			{/if}
		{/if}
		{#if allowEditItem}<div class="w-full flex align-middle items-center content-center">
				<div
					class="w-full break-words border-2 {classesCSS} p-1"
					class:border-slate-400={mouseIsOver}
					class:border-white={!mouseIsOver}
					class:border-dashed={mouseIsOver}
					class:line-clamp-2={!mouseIsOver}
					on:mouseenter={mouseOver}
					on:mouseout={mouseOut}
					contenteditable
					bind:textContent={item.name}
				/>
			</div>
		{:else if itemsModal.length > 0}
			<div
				class="items-center break-words {classesCSS}"
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
				class="items-center {classesCSS}"
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
	<slot name="badges" />
</div>
{#if showOptions}
	<div
		class="grid grid-cols-1 xl	:grid-cols-2 grid-rows-4 xl:grid-rows-2 gap-2 ml-2  border-l-4 p-4 border-slate-300 text-sm"
	>
		<div class="flex align-middle items-center">
			<input
				type="checkbox"
				class="checkbox"
				id="chkNiceToHave"
				checked={!item.indispensable}
				on:change={(e) =>
					checkClassification(scope, item, 'indispensable', !e.currentTarget.checked)}
			/><label for="chkNiceToHave" class="items-start content-start justify-start pl-2"
				>Nice-to-have</label
			>
			<label for="modal-about-classification-indispensable" class="cursor-pointer ml-2">[?]</label>
		</div>
		<div class="flex align-middle items-center">
			<input
				type="checkbox"
				class="checkbox"
				id="chkRisky"
				checked={item.risky}
				on:change={(e) => checkClassification(scope, item, 'risky', e.currentTarget.checked)}
			/><label for="chkRisky" class="items-start content-start justify-start pl-2">Risky</label>
			<label for="modal-about-classification-risky" class="cursor-pointer ml-2">[?]</label>
		</div>
		<div class="flex align-middle items-center">
			<input
				type="checkbox"
				class="checkbox"
				id="chkAutomatable"
				checked={item.automatable}
				on:change={(e) => checkClassification(scope, item, 'automatable', e.currentTarget.checked)}
			/><label for="chkAutomatable" class="items-start content-start justify-start pl-2"
				>Automatable</label
			>
			<label for="modal-about-classification-automatable" class="cursor-pointer ml-2">[?]</label>
		</div>
		<!-- <div class="flex align-middle items-center">
			<input
				type="checkbox"
				class="checkbox"
				id="chkDelegable"
				checked={item.delegable}
				on:change={(e) => checkClassification(scope, item, 'delegable', e.currentTarget.checked)}
			/><label for="chkDelegable" class="items-start content-start justify-start pl-2"
				>Delegable</label
			>
			<label for="modal-about-classification-delegable" class="cursor-pointer ml-2">[?]</label>
		</div> -->
	</div>
{/if}

<input type="checkbox" id="modal-item-{item.id}" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label for="modal-item-{item.id}" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
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

<input type="checkbox" id="modal-about-classification-risky" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">What does "{configClassification['risky'].text}" mean?</h3>
		<div class="max-h-96 overflow-y-auto">
			{configClassification['risky'].description}<br />
		</div>
		<div class="modal-action">
			<label for="modal-about-classification-risky" class="btn btn-primary">ok</label>
		</div>
	</div>
</div>
<input type="checkbox" id="modal-about-classification-automatable" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">What does "{configClassification['automatable'].text}" mean?</h3>
		<div class="max-h-96 overflow-y-auto">
			{configClassification['automatable'].description}<br />
		</div>
		<div class="modal-action">
			<label for="modal-about-classification-automatable" class="btn btn-primary">ok</label>
		</div>
	</div>
</div>
<input type="checkbox" id="modal-about-classification-delegable" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">What does "{configClassification['delegable'].text}" mean?</h3>
		<div class="max-h-96 overflow-y-auto">
			{configClassification['delegable'].description}<br />
		</div>
		<div class="modal-action">
			<label for="modal-about-classification-delegable" class="btn btn-primary">ok</label>
		</div>
	</div>
</div>
<input type="checkbox" id="modal-about-classification-indispensable" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">
			What does "{configClassification['indispensable'].text}" mean?
		</h3>
		<div class="max-h-96 overflow-y-auto">
			{configClassification['indispensable'].description}<br />
		</div>
		<div class="modal-action">
			<label for="modal-about-classification-indispensable" class="btn btn-primary">ok</label>
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

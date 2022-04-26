<script>
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faCircleCheck as check } from '@fortawesome/free-solid-svg-icons';
	import { faCircleCheck as uncheck } from '@fortawesome/free-regular-svg-icons';
	import { projectStore } from '$lib/stores/projectStore';

	export let linkPreviousStep = undefined;
	export let linkNextStep = undefined;
	export let checkList = [];
	export let optional = false;
	export let allowClearAll = false;

	let confirmClear = false;

	$: {
		console.log('confirmClear:', confirmClear);
		if (confirmClear) {
			console.log('vai resetar');
			projectStore.reset();
			confirmClear = false;
		}
	}
</script>

<input type="checkbox" id="modal-clear" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Are you sure you want to clear all data?</h3>
		<p class="py-4">It includes all information you have set in any screen.</p>
		<div class="modal-action">
			<label for="modal-clear" class="btn">Cancel</label>
			<label for="modal-clear" class="btn btn-warning" on:click={() => (confirmClear = true)}
				>Confirm</label
			>
		</div>
	</div>
</div>

<div class="border-2 p-2 shadow-xl mb-6">
	{#if checkList.length > 0}
		<ul class="list-inside list-none text-lg align-middle content-center items-center">
			{#each checkList as item, idx (item.name)}
				<li>
					<div class="inline-flex items-center">
						<Fa icon={item.checked ? check : uncheck} class="mr-2" />{item.text}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
	<!-- <input
						type="checkbox"
						class="checkbox mr-2"
						name="dump"
						id="dump"
						checked={item.checked}
						disabled={!manualCheck}
					/> -->
	<div class="w-full m-4">
		{#if allowClearAll}
			<label
				for="modal-clear"
				class="btn btn-warning modal-button"
				class:btn-disabled={$projectStore.every((scope) => scope.items.length === 0)}
				>Clear all</label
			>
		{/if}
		{#if linkPreviousStep}
			<a href={linkPreviousStep} class="btn btn-outline">Previous step</a>
		{/if}
		{#if linkNextStep}
			<a
				href={linkNextStep}
				class="btn"
				class:btn-disabled={!optional && !checkList.every((item) => item.checked)}>Next step</a
			>
		{/if}
	</div>
</div>

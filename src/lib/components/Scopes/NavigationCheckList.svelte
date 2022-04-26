<script>
	import CopyToClipboard from '$lib/components/CopyToClipboard.svelte';
	// import Fa from 'svelte-fa/src/fa.svelte';

	import Icon from 'svelte-awesome';
	// import { faCircleCheck as check } from '@fortawesome/free-solid-svg-icons';
	// import { faCircleCheck as uncheck } from '@fortawesome/free-regular-svg-icons';
	import { projectStore } from '$lib/stores/projectStore';
	import { stepsStore } from '$lib/stores/stepsStore';

	export let linkPreviousStep = undefined;
	export let linkNextStep = undefined;
	export let checkList = [];
	export let optional = false;
	export let allowClearAll = false;
	export let exportText = '';

	let confirmClear = false;
	export let currentStep;

	let completed;
	$: {
		completed = !optional && checkList.every((item) => item.checked);
		$stepsStore[currentStep].completed = completed;

		if (confirmClear) {
			console.log('confirmed clear');
			projectStore.reset();
			confirmClear = false;
		}
	}

	let successfullyCopied = undefined;
	const handleSuccessfullyCopied = (e) => {
		successfullyCopied = true;
	};

	const handleFailedCopy = () => {
		successfullyCopied = false;
	};
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

<input type="checkbox" id="modal-export" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		{#if successfullyCopied}
			<div class="alert alert-success shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>Successfully copied to clipboard!</span>
				</div>
			</div>
		{/if}
		{#if successfullyCopied === false}
			<div class="alert alert-error shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>Failed to copy to clipboard!</span>
				</div>
			</div>
		{/if}
		<div style="white-space: pre-wrap;" class="w-fit h-96 overflow-auto">
			{exportText}
		</div>
		<div class="modal-action">
			<label for="modal-export" class="btn">Close</label>
			<CopyToClipboard
				text={exportText}
				let:copy
				on:copy={handleSuccessfullyCopied}
				on:fail={handleFailedCopy}
			>
				<label class="btn btn-warning" on:click={copy}>Copy to clipboard</label>
			</CopyToClipboard>
		</div>
	</div>
</div>

<div class="border-2 p-2 shadow-xl mb-6">
	{#if checkList.length > 0}
		<ul class="list-inside list-none text-lg align-middle content-center items-center">
			{#each checkList as item, idx (item.name)}
				<li>
					<div class="inline-flex items-center">
						<!-- <Icon data={item.checked ? check : uncheck} class="mr-2" />{item.text} -->
						{item.checked ? '✅' : '⭕'}{item.text}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
	<div class="w-full m-4">
		{#if allowClearAll}
			<label
				for="modal-clear"
				class="btn btn-warning modal-button"
				class:btn-disabled={$projectStore.every((scope) => scope.items.length === 0)}
				>Clear all</label
			>
		{/if}
		{#if exportText && exportText.trim().length > 0}
			<label for="modal-export" class="btn btn-warning modal-button">Export To Text</label>
		{/if}
		{#if linkPreviousStep}
			<a href={linkPreviousStep} class="btn btn-outline">Previous step</a>
		{/if}
		{#if linkNextStep}
			<a href={linkNextStep} class="btn" class:btn-disabled={!completed}>Next step</a>
		{/if}
	</div>
</div>

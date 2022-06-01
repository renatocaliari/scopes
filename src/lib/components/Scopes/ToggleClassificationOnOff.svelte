<svelte:options accessors={true} />

<script>
	import { projectStore } from '$lib/stores/projectStore';
	import configClassification from '$lib/data/classification';
	export let text = undefined;
	export let classification = 'toggle';
	let checkbox;
	export let item = null;
	export let scope;

	text = text ? text : configClassification[classification].text;

	function getStatusToggle(scope, item, classification) {
		if (classification === 'indispensable') {
			return !(item || scope)[classification];
		} else {
			return (item || scope)[classification];
		}
	}
</script>

<div class="flex flex-row gap-2 items-center align-middle">
	<span class="flex text-sm items-center align-middle"
		>{text}
		<label for="modal-about-classification-{classification}" class="cursor-pointer ml-2"
			>[?]
		</label></span
	>
	<label class="swap items-start content-start align-middle">
		<input
			id="toggle-check-{classification.toLowerCase()}"
			bind:this={checkbox}
			type="checkbox"
			checked={getStatusToggle(scope, item, classification)}
			on:change={(e) => {
				projectStore.setClassificationToObject(
					scope,
					item,
					classification.toLowerCase(),
					!e.currentTarget.checked
				);
				// $projectStore = $projectStore;
			}}
		/>
		<span
			class="swap-on badge badge-lg outline-none border-0 text-base
		 bg-green-600 w-12 text-white">Yes</span
		>
		<span class="swap-off badge badge-lg outline-none border-0 text-base bg-red-600 w-12 text-white"
			>No</span
		>
	</label>
</div>

<input type="checkbox" id="modal-about-classification-{classification}" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">What does "{configClassification[classification].text}" mean?</h3>
		<div class="max-h-96 overflow-y-auto">
			{configClassification[classification].description}<br />
		</div>
		<div class="modal-action">
			<label for="modal-about-classification-{classification}" class="btn btn-primary">ok</label>
		</div>
	</div>
</div>

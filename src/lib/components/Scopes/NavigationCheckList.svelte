<script>
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

	export let currentStep;

	let completed;
	$: {
		completed = optional || checkList.every((item) => item.checked);
		$stepsStore[currentStep].completed = completed;
	}
</script>

<div class="border-2 p-2 flex flex-col  shadow-xl mb-6">
	{#if checkList.length > 0}
		<div>
			<ul class="list-inside list-none text-lg align-middle content-center items-center">
				{#each checkList as item, idx (item.name)}
					<li>
						<div class="inline-flex items-center">
							<!-- <Icon data={item.checked ? check : uncheck} class="mr-2" />{item.text} -->
							{item.checked ? '✅ ' : '⭕ '}{item.text}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	<div class="w-full flex flex-row justify-between p-4">
		<div class="m-0 ">
			{#if linkPreviousStep}
				<a href={linkPreviousStep} class="btn btn-outline">Previous step</a>
			{/if}
			{#if linkNextStep}
				<a href={linkNextStep} class="btn" class:btn-disabled={!completed}>Next step</a>
			{/if}
		</div>
		<div class="m-0">
			<slot name="buttons" />
		</div>
	</div>
</div>

<script>
	import { steps, getStepById, setStepCompleted } from '$lib/stores/stepsStore';

	export let linkPreviousStep = undefined;
	export let linkNextStep = undefined;
	export let checkList = { name: 'Tasks', items: [] };
	export let optional = false;

	export let stepId;
	let currentStep;

	let lastLinkBreadcrumb;
	// onMount(async () => {
	// 	lastLinkBreadcrumb.scrollIntoView();
	// });

	let completed;
	$: {
		completed = optional || checkList.items?.every((item) => item.checked || item.optional);
		setStepCompleted(stepId, true);
	}

	currentStep = getStepById(stepId);

	if (currentStep.step > 0) {
		// if (!getStepById('dump').completed) {
		// 	goto(getStepById('dump').link);
		// }
		linkPreviousStep = $steps[currentStep.step - 1].link;
	}
	if (currentStep.step + 1 < $steps.length) {
		linkNextStep = $steps[currentStep.step + 1].link;
	}
</script>

<svelte:head>
	<title>{currentStep.h1} | {import.meta.env.VITE_APP_NAME}</title>
</svelte:head>

<div class="w-full">
	<div class="text-lg sm:text-xl font-bold">{currentStep.h1}</div>

	<slot currentStep={currentStep.step} />

	<div class="flex flex-col mt-6">
		{#if checkList.items?.length > 0}
			<div>
				{#if checkList.title}
					<span class="text-sm sm:text-base">{checkList.title}</span>
				{/if}
				<ul class="list-inside list-none align-middle content-center items-center">
					{#each checkList.items as item, idx (item.name)}
						<li>
							<div class="inline-flex items-center text-sm sm:text-base my-1">
								<div>
									{#if item.checked}
										<svg
											class="w-5 h-5 mr-2"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 512 512"
											preserveAspectRatio="xMidYMin meet"
											><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
												d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"
											/></svg
										>
									{:else}
										<svg
											class="w-5 h-5 mr-1"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 512 512"
											preserveAspectRatio="xMidYMin meet"
											><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
												d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"
											/></svg
										>{/if}
								</div>
								<!-- <Icon data={item.checked ? check : uncheck} class="mr-2" />{item.text} -->

								<div>{item.optional ? '(Optional) ' : ''} {@html item.text}</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		{#if $$slots.buttons}
			<div class="w-full p-2 mb-4">
				<slot name="buttons" />
			</div>
		{/if}
	</div>

	<div class="w-full">
		<div class="flex flex-col sm:flex-row w-full justify-between">
			<div>
				{#if linkPreviousStep}
					<a href={linkPreviousStep} sveltekit:prefetch class="btn btn-primary w-full sm:w-auto"
						><svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"
							><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
								d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z"
							/></svg
						>{$steps[currentStep.step - 1]?.h1}</a
					>
				{/if}
			</div>
			{#if linkNextStep}
				<div class="w-full sm:w-auto">
					<div class="form-control w-full sm:max-w-xs mt-2 sm:m-0">
						<!-- class:btn-disabled={!completed} -->
						<a href={linkNextStep} sveltekit:prefetch class="btn btn-primary"
							>{$steps[currentStep.step + 1]?.h1}<svg
								class="w-4 h-4 ml-2"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 256 512"
								><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
									d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z"
								/></svg
							></a
						>
					</div>
				</div>
			{/if}
		</div>
		<div class="divider" />
	</div>

	{#if currentStep.h2}
		<h2 class="text-center items-center">{currentStep.h2}</h2>
	{/if}
</div>

<script>
	import { stepsStore } from '$lib/stores/stepsStore';
	import { onMount } from 'svelte';

	export let currentStep = 0;

	let lastLinkBreadcrumb;
	onMount(async () => {
		lastLinkBreadcrumb.scrollIntoView();
	});
</script>

<svelte:head>
	<title>{$stepsStore[currentStep].h1} | Scopefully</title>
</svelte:head>

<div class="text-sm flex sm:hidden breadcrumbs">
	{#each $stepsStore as btn, idx}
		{#if currentStep > 1 && idx === currentStep - 1}
			&#60;<a class="ml-2" href={btn.link}>{btn.linkText}</a>
		{/if}
	{/each}
</div>
<div class="text-sm hidden sm:flex breadcrumbs">
	<ul>
		{#each $stepsStore as btn, idx}
			{#if idx <= currentStep}
				{#if idx === currentStep}
					<li bind:this={lastLinkBreadcrumb} class="active">
						<a href={btn.link}>{btn.linkText}</a>
					</li>
				{:else}
					<li><a href={btn.link}>{btn.linkText}</a></li>
				{/if}
			{/if}
		{/each}
	</ul>
</div>

<h1>{$stepsStore[currentStep].h1}</h1>

<!-- <div class="hidden lg:flex btn-group justify-center my-4">
	{#each $stepsStore as btn, idx} -->
<!-- class:btn-disabled={!$stepsStore[0].completed} -->
<!-- <a class="btn" class:btn-active={currentStep == idx} href={btn.link} sveltekit:prefetch
			>{btn.linkText}
		</a>
	{/each}
</div> -->

<slot {currentStep} />
<slot {currentStep} name="checkList" />

{#if $stepsStore[currentStep].h2}
	<h2>{$stepsStore[currentStep].h2}</h2>
{/if}

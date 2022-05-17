<script>
	import { goto } from '$app/navigation';
	import { stepsStore } from '$lib/stores/stepsStore';
	import { onMount } from 'svelte';
	export let currentStep = 0;

	let lastLinkBreadcrumb;
	onMount(async () => {
		lastLinkBreadcrumb.scrollIntoView();
	});

	if (currentStep > 0 && !$stepsStore[0].completed) {
		goto('/scopes/dump');
	}
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
			{#if idx === currentStep}
				<li bind:this={lastLinkBreadcrumb}>
					<span class="font-bold underline underline-offset-8 decoration-4">{btn.linkText}</span>
				</li>
			{:else if !$stepsStore[0].completed}
				<li><span>{btn.linkText}</span></li>
			{:else}
				<li>
					<a class="link link-hover font-normal" href={btn.link}>{btn.linkText}</a>
				</li>
			{/if}
		{/each}
	</ul>
</div>

<h1 class="sm:mt-10">{$stepsStore[currentStep].h1}</h1>

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

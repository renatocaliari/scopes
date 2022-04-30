<script>
	import { stepsStore } from '$lib/stores/stepsStore';

	export let currentStep = 0;
</script>

<svelte:head>
	<title>{$stepsStore[currentStep].h1} | Scopefully</title>
</svelte:head>

<h1>{$stepsStore[currentStep].h1}</h1>

<div class="btn-group justify-center my-4">
	{#each $stepsStore as btn, idx}
		<a
			class="btn"
			class:btn-active={currentStep == idx}
			class:btn-disabled={!$stepsStore[0].completed}
			href={btn.link}
			sveltekit:prefetch
			>{btn.linkText}
		</a>
	{/each}
</div>

<slot {currentStep} />
<slot {currentStep} name="checkList" />

{#if $stepsStore[currentStep].h2}
	<h2>{$stepsStore[currentStep].h2}</h2>
{/if}

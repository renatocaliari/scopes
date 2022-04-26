<script>
	import { stepsStore } from '$lib/stores/stepsStore';

	export let currentStep = 0;
</script>

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
<h1>{$stepsStore[currentStep].h1}</h1>
{#if $stepsStore[currentStep].h2}
	<h2>{$stepsStore[currentStep].h2}</h2>
{/if}

<slot {currentStep} />
<slot {currentStep} name="checkList" />

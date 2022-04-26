<script>
	import Fa from 'svelte-fa';
	import { faCircleCheck as check } from '@fortawesome/free-solid-svg-icons';
	import { faCircleCheck as uncheck } from '@fortawesome/free-regular-svg-icons';

	export let linkPreviousStep = undefined;
	export let linkNextStep = undefined;
	export let checkList = [];
	export let optional = false;
</script>

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

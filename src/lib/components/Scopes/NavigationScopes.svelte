<script>
	export let currentStep = 1;
	export let activeBtns = [1, 2, 3, 4, 5];
	let btns = [
		{
			linkText: 'Dump & Cluster',
			h1: 'Dump & Cluster',
			link: '/scopes/dump'
		},
		{
			linkText: 'Set Dependencies',
			h1: 'Set Dependencies',
			link: '/scopes/dependencies'
		},
		{
			linkText: 'Set Risky Unknowns',
			h1: 'Set Risky Unknowns',
			link: '/scopes/unknowns'
		},
		{
			linkText: 'Generate Sequence',
			h1: 'Automatic sequence to execute the scopes',
			link: '/scopes/sequence'
		},
		{
			linkText: 'Create Documentation',
			h1: 'Documentation',
			h2: 'Create documentation to other people that will execute it',
			link: '/scopes/patternLanguage'
		}
	];
</script>

<div class="btn-group justify-center my-4">
	{#each btns as btn, idx}
		<a
			class="btn"
			class:btn-active={currentStep - 1 == idx}
			class:btn-disabled={!activeBtns.includes(idx + 1)}
			href={btn.link}
			sveltekit:prefetch
			>{btn.linkText}
		</a>
	{/each}
</div>
<h1>{btns[currentStep - 1].h1}</h1>
{#if btns[currentStep - 1].h2}
	<h2>{btns[currentStep - 1].h2}</h2>
{/if}

<slot />
<slot name="checkList" />

<script>
	export let currentBtn = 1;
	export let activeBtns = [1, 2, 3, 4, 5];
	let btns = [
		{
			linkText: 'Dump & Cluster',
			h1: 'Dump & Cluster',
			link: '/scopes/dump'
		},
		{
			linkText: 'Dependencies',
			h1: 'Dependencies',
			link: '/scopes/dependencies'
		},
		{
			linkText: 'Unknowns',
			h1: 'Unknowns',
			h2: 'Which scopes have risky unknowns (vs routine work)?',
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
			class:btn-active={currentBtn - 1 == idx}
			class:btn-disabled={!activeBtns.includes(idx + 1)}
			href={btn.link}>{btn.linkText}</a
		>
	{/each}
</div>
<h1>{btns[currentBtn - 1].h1}</h1>
{#if btns[currentBtn - 1].h2}
	<h2>{btns[currentBtn - 1].h2}</h2>
{/if}

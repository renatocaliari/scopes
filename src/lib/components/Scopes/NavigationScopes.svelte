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
			h1: 'Unknowns: Riskies Scopes',
			link: '/scopes/unknowns'
		},
		{
			linkText: 'Sequence',
			h1: 'Automatic sequence Scopes',
			h2: 'This sequence is to execution',
			link: '/scopes/sequence'
		},
		{
			linkText: 'Pattern Language',
			h1: 'Pattern Language',
			h2: 'This information is to create documentation to other people that will execute it',
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

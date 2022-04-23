<script>
	import { projectStore, compare } from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import { mounted } from 'svelte-mount';
	import Id from '../account/user/[id].svelte';

	export let scopesPriorized = []; // fetch from server because store has a weird behavior in client using sort, specially on Firefox where it gets data correctly and blinks showing unexpected order from store

	// let sortedScopesIndispensable = [];
	// let forkedScopes = new Set();
	// let indexLastRisky = 0;

	// const lastIndexOf = (array, key, value) => {
	// 	for (let i = array?.length - 1; i >= 0; i--) {
	// 		if (array[i][key] === value) return i;
	// 	}
	// 	return -1;
	// };
	// //if ($mounted)
	// $: if ($mounted){
	// 	forkedScopes = new Set();
	// 	sortedScopesIndispensable = $projectStore
	// 		.filter((scope) => scope.id !== 'bucket')
	// 		.sort(compare);

	// 	indexLastRisky = lastIndexOf(sortedScopesIndispensable, 'risky', true);

	// 	scopesPriorized = [...sortedScopesIndispensable].map((scope, index) => {
	// 		scope.order = index;
	// 		if (!scope.risky && index <= indexLastRisky) {
	// 			let forkedScope = JSON.parse(JSON.stringify(scope));
	// 			forkedScope.id = scope.id + '-forked';
	// 			forkedScopes = new Set([...forkedScopes, forkedScope]);
	// 		}
	// 		return scope;
	// 	});

	// 	scopesPriorized.splice(indexLastRisky + 1, 0, ...forkedScopes);

	// 	console.log('forkedScopes:', forkedScopes);
	// 	console.log('scopesPriorized:', scopesPriorized);
	// }

	let maxDependents = $projectStore.reduce((prev, curr) => {
		return Math.max(prev, curr.dependsOn?.length);
	}, 0);

	function calculateColor(scope, maxDependents) {
		return percentageToHsl(
			isNaN(scope.dependsOn?.length / maxDependents) ? 0 : scope.dependsOn?.length / maxDependents,
			35,
			0
		);
	}
	function percentageToHsl(percentage, hue0, hue1) {
		var hue = percentage * (hue1 - hue0) + hue0;
		return 'hsl(' + hue + ', 100%, ' + (100 - percentage * 10) + '%)';
	}
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/scopes">Scopes</a></li>
		<li><a href="/scopes/dependencies">Dependencies</a></li>
		<li>Sequence</li>
	</ul>
</div>
<h1>Sequence scopes</h1>

<div class="flex flex-row mb-4 justify-between">
	<div>
		<a
			href="/scopes/dependencies"
			class="link-hover btn btn-sm md:btn-md btn-ghost gap-2 normal-case lg:gap-3"
			><svg
				class="h-6 w-6 fill-current md:h-8 md:w-8"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg
			>
			<div class="flex flex-col items-start">
				<span class="text-base-content/50 hidden text-xs font-normal md:block">Prev</span>
				<span>Dependencies</span>
			</div></a
		>
	</div>
	<div />
</div>

<div class="w-full">
	{#each scopesPriorized as scope, idx (scope.id)}
		{@const calculatedColor = calculateColor(scope, maxDependents)}
		<div class="m-2 flex justify-center">
			<Scope {scope} editTitle={false} color={calculatedColor} itemsScopeModal={scope.items}>
				<div slot="badge">
					<BadgeDependencies project={projectStore} bind:scope />
				</div>
				<div slot="header">
					{#if scope.id.includes('forked')}
						<div class="badge badge-accent">Do only what is necessary to the next one</div>
						<br />
					{/if}
					<div class="badge" class:badge-outline={!scope.indispensable}>Indispensable</div>
					<div class="badge" class:badge-outline={!scope.risky}>Risky</div>
				</div>
				<div slot="headerScopeModal">Items of {scope.name}</div>
			</Scope>
		</div>
		{#if idx + 1 < scopesPriorized.length}
			<div class="flex justify-center">
				<svg height="75" width="30">
					<line x1="14" y1="1" x2="14" y2="50" style="stroke:rgb(0,0,0);stroke-width:10" />
					<polygon points="5,50 25,50 15,70" style="fill:black;stroke:black;stroke-width:4" />
				</svg>
			</div>
		{/if}
	{/each}
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

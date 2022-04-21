<script>
	import { dndzone } from 'svelte-dnd-action';
	import { projectStore, compare } from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';

	const flipDurationMs = 300;

	const novo = JSON.parse(JSON.stringify(projectStore.sortScopesByPriority()));
	$projectStore = projectStore.sortScopesByPriority();

	// let sortedScopes = $projectStore.filter((scope) => scope.id !== 'bucket').sort(compare);
	// $: sortedScopes = $projectStore.filter((scope) => scope.id !== 'bucket').sort(compare);
	// $: {
	// 	sortedScopes = $projectStore.filter((scope) => scope.id !== 'bucket').sort(compare);
	// }

	// let cols = [
	// 	{
	// 		title: "Do only the essential to develop Risky and Unknowns (mock if it's necessary)",
	// 		filter: function (s) {
	// 			return (
	// 				s.id !== 'bucket' &&
	// 				s.items.length > 0 &&
	// 				!s.risky &&
	// 				s.dependsOn.length > 0 &&
	// 				s.dependsOn.some((idDependent) =>
	// 					project.getScopes().find((element) => element.risky && element.id === idDependent)
	// 				)
	// 			);
	// 		},
	// 		sort: compare
	// 	},
	// 	{
	// 		title: 'Risky & Unknowns',
	// 		filter: function (s) {
	// 			return s.id !== 'bucket' && s.items.length > 0 && s.risky;
	// 		},
	// 		sort: compare
	// 	},
	// 	{
	// 		title: 'Develop ones with dependencies',
	// 		filter: function (s) {
	// 			return s.id !== 'bucket' && s.items.length > 0 && !s.risky && s.dependsOn.length > 0;
	// 		},
	// 		sort: compare
	// 	},
	// 	{
	// 		title: 'Develope remaining scopes',
	// 		filter: function (s) {
	// 			return s.id !== 'bucket' && s.items.length > 0 && !s.risky && s.dependsOn.length === 0;
	// 		},
	// 		sort: compare
	// 	}
	// ];

	// function handleDndConsider(e) {
	// 	project.scopesStore = e.detail.items;
	// }
	// function handleDndFinalize(e) {
	// 	project.scopesStore = e.detail.items;
	// }

	let maxDependents = $projectStore.reduce((prev, curr) => {
		return Math.max(prev, curr.dependsOn.length);
	}, 0);

	function calculateColor(scope, maxDependents) {
		console.log('max:', maxDependents);
		return percentageToHsl(
			isNaN(scope.dependsOn.length / maxDependents) ? 0 : scope.dependsOn.length / maxDependents,
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

<ol class="list-inside border-2 p-2 shadow-xl mb-6">
	<li>Check scopes with more unknowns and risks</li>
	<li>Order based on dependencies, unknowns and risks</li>
</ol>

<button class="btn mb-4">Reset order</button>

<pre>{JSON.stringify(novo)}</pre>
<pre>{JSON.stringify($projectStore)}</pre>
<pre>{JSON.stringify(projectStore.sortScopesByPriority())}</pre>
<!-- {#each [...$projectStore].filter((scope) => scope.id !== 'bucket').sort(compare) as scope} -->

{#each projectStore.sortScopesByPriority() as scope (scope.id)}
	<!-- {#each sortedScopes as scope} -->
	<div class="m-2 text-red-400" style:background-color={calculateColor(scope, maxDependents)}>
		{scope.id}
		<Scope
			{scope}
			editTitle={false}
			itemsScopeModal={scope.items}
			checkbox
			checked={scope.risky}
			on:checkItem={(e) => {
				projectStore.scopeUpdateRisky(e.detail.item, e.detail.checked);
			}}
		>
			<div slot="header">
				<BadgeDependencies project={projectStore} bind:scope />
			</div>
			<div slot="headerScopeModal">Items of {scope.name}</div>
		</Scope>
	</div>
{/each}

<!-- 
<div class={'grid grid-cols-4 grid-flow-col gap-2 place-content-around divide-x-2 divide-dashed'}>
	{#each cols as col, i}
		<div>
			<div class="inline-flex justify-between w-full  p-2">
				<h1>{i + 1}</h1>
				<div class="w-full text-center">
					{#if i + 1 < cols.length}
						<h1>></h1>
					{/if}
				</div>
			</div>

			<div class="m-h-24 p-2"><h3>{col.title}</h3></div>
			<section class={'p-2 grid grid-rows-6 grid-cols-1 grid-flow-col gap-4 place-content-around'}>
				{#each project.getScopes().filter(col.filter) as scope}
					<div>
						<Scope
							{scope}
							editTitle={false}
							itemsScopeModal={scope.items}
							checkbox
							checked={scope.risky}
							on:checkItem={(e) => {
								updateRisky(e.detail.item, e.detail.checked);
							}}
						>
							<div slot="header">
								<BadgeDependencies {project} {scope} />
							</div>
							<div slot="body">
								<div>Depends on:</div>
								<div>
									<Items
										{scope}
										emptyState="No dependencies"
										items={project
											.getScopes()
											.filter(
												(s) =>
													!['bucket', scope.id].includes(s.id) &&
													s.items.length > 0 &&
													s.dependsOn.includes(scope.id)
											)}
									/>
								</div>
								<div>Dependencies:</div>
								<div style:background-color={calculateColor(scope, maxDependents)}>
									<Items
										{scope}
										emptyState="No dependencies"
										items={project
											.getScopes()
											.filter(
												(s) =>
													!['bucket', scope.id].includes(s.id) &&
													s.items.length > 0 &&
													s.unlocksDependencies(project).includes(scope.id)
											)}
									/>
								</div>
							</div>
							<div slot="headerScopeModal">Items of {scope.name}</div>
						</Scope>
					</div>
				{/each}
			</section>
		</div>
	{/each}
</div> -->
<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

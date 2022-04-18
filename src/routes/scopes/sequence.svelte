<script>
	import ScopeSequence from '$lib/components/Scopes/ScopeSequence.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { scopesStore } from '$lib/stores/scopesStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';

	const flipDurationMs = 300;

	let cols = [
		{
			title: "Do only the essential to focus on Risky and Unknowns (mock if it's necessary)",
			filter: function (s) {
				return s.id !== 'bucket' && s.items.length > 0 && s.dependents.length > 0 && !s.risky;
			},
			sort: sort
		},
		{
			title: 'Focus on Risky & Unknowns',
			filter: function (s) {
				return s.id !== 'bucket' && s.items.length > 0 && s.risky;
			},
			sort: sort
		},
		{
			title: 'Develop what was missing',
			filter: function (s) {
				return s.id !== 'bucket' && s.items.length > 0 && s.dependents.length > 0 && !s.risky;
			},
			sort: sort
		},
		{
			title: 'Remaining scopes',
			filter: function (s) {
				return s.id !== 'bucket' && s.items.length > 0 && !s.risky && s.dependents == 0;
			},
			sort: sort
		}
	];

	function handleDndConsider(e) {
		$scopesStore = e.detail.items;
	}
	function handleDndFinalize(e) {
		console.log('>>>', e.detail);
		$scopesStore = e.detail.items;
	}

	let maxDependents = $scopesStore.reduce((prev, curr) => {
		console.log(Math.max(prev, curr.dependents.length));
		return Math.max(prev, curr.dependents.length);
	}, 0);

	function percentageToHsl(percentage, hue0, hue1) {
		var hue = percentage * (hue1 - hue0) + hue0;
		return 'hsl(' + hue + ', 100%, 90%)';
	}

	function updateRisky(scope, checked) {
		scope.risky = checked;
		$scopesStore = $scopesStore; // force reactivity
	}

	function sort(first, second) {
		if (second.risky) {
			return -1;
		}
		if (first.dependents.length > second.dependents.length) {
			return -1;
		}
		if (first.dependents.length < second.dependents.length) {
			return 1;
		}
		if (first.dependencies.length > second.dependencies.length) {
			return -1;
		}
		if (first.dependencies.length < second.dependencies.length) {
			return 1;
		}
		return 0;
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

<div class={'grid  grid-cols-4 grid-flow-col gap-4 place-content-around'}>
	{#each cols as col}
		<div>
			<div class="h-24"><h3>{col.title}</h3></div>

			<section
				class={'grid grid-rows-6 grid-cols-1 grid-flow-col gap-4 place-content-around'}
				use:dndzone={{
					items: $scopesStore,
					flipDurationMs,
					type: 'scopeSequence',
					dropTargetClasses: ['bg-green-50']
				}}
				on:consider={handleDndConsider}
				on:finalize={handleDndFinalize}
			>
				{#each $scopesStore.filter(col.filter).sort(col.sort) as scope}
					<div>
						<Scope
							bind:parent={scope}
							editTitle={false}
							itemsModal={scope.items}
							checkbox
							checked={scope.risky}
							on:checkItem={(e) => {
								updateRisky(e.detail.item, e.detail.checked);
							}}
						>
							<div slot="header">
								<BadgeDependencies bind:scope />
							</div>
							<div slot="subTitle">Depends on:</div>
							<div
								slot="body"
								style:background-color={percentageToHsl(
									isNaN(scope.dependents.length / maxDependents)
										? 0
										: scope.dependents.length / maxDependents,
									120,
									0
								)}
							>
								<Items
									bind:items={$scopesStore}
									fnFilter={(items) => {
										return items.filter(
											(s) => s.id !== 'bucket' && s.id !== scope.id && s.items.length > 0
										);
									}}
								/>
							</div>
							<div slot="headerModal">Items of {scope.name}</div>
						</Scope>
					</div>
				{/each}
			</section>
		</div>
	{/each}
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

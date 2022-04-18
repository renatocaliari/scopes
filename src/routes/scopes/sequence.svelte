<script>
	import ScopeSequence from '$lib/components/Scopes/ScopeSequence.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { scopesStore } from '$lib/stores/scopesStore';
	import { SvelteComponentDev } from 'svelte/internal';

	const flipDurationMs = 300;
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
	<div>
		<div class="h-24">
			<h3>Do only the essential to focus on Risky and Unknowns (mock if it's necessary)</h3>
		</div>

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
			<!-- fazer essa condição no filtro: os arriscados estão na lista de dependentes -->
			{#each $scopesStore
				.filter((s) => s.id !== 'bucket' && s.items.length > 0 && s.dependents.length > 0 && !s.risky)
				.sort(function (first, second) {
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
				}) as scope (scope.id)}
				<div
					animate:flip={{ duration: flipDurationMs }}
					style:background-color={percentageToHsl(
						isNaN(scope.dependents.length / maxDependents)
							? 0
							: scope.dependents.length / maxDependents,
						120,
						0
					)}
				>
					<ScopeSequence bind:scope />
				</div>
			{/each}
		</section>
	</div>
	<div>
		<div class="h-24"><h3>Focus on Risky & Unknowns</h3></div>

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
			{#each $scopesStore
				.filter((s) => s.id !== 'bucket' && s.items.length > 0 && s.risky)
				.sort(function (first, second) {
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
				}) as scope (scope.id)}
				<div
					animate:flip={{ duration: flipDurationMs }}
					style:background-color={percentageToHsl(
						isNaN(scope.dependents.length / maxDependents)
							? 0
							: scope.dependents.length / maxDependents,
						120,
						0
					)}
				>
					<ScopeSequence bind:scope />
				</div>
			{/each}
		</section>
	</div>
	<div>
		<div class="h-24"><h3>Develop what is missing</h3></div>

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
			{#each $scopesStore
				.filter((s) => s.id !== 'bucket' && s.items.length > 0 && s.dependents.length > 0 && !s.risky)
				.sort(function (first, second) {
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
				}) as scope (scope.id)}
				<div
					animate:flip={{ duration: flipDurationMs }}
					style:background-color={percentageToHsl(
						isNaN(scope.dependents.length / maxDependents)
							? 0
							: scope.dependents.length / maxDependents,
						120,
						0
					)}
				>
					<ScopeSequence bind:scope />
				</div>
			{/each}
		</section>
	</div>
	<div>
		<div class="h-24"><h3>Remaining scopes</h3></div>

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
			{#each $scopesStore
				.filter((s) => s.id !== 'bucket' && s.items.length > 0 && !s.risky && s.dependents == 0)
				.sort(function (first, second) {
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
				}) as scope (scope.id)}
				<div
					animate:flip={{ duration: flipDurationMs }}
					style:background-color={percentageToHsl(
						isNaN(scope.dependents.length / maxDependents)
							? 0
							: scope.dependents.length / maxDependents,
						120,
						0
					)}
				>
					<ScopeSequence bind:scope />
				</div>
			{/each}
		</section>
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

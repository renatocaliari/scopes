<script>
	import Fa from 'svelte-fa/src/fa.svelte';

	export let scope;
	export let itemsScopeModal = [];
	export let editTitle = false;
	export let icon = undefined;
	export let classColor = 'bg-slate-50';
	export let width = '';
	export let collapsable = false;

	let textPlaceholder;
	$: {
		if (scope) {
			scope.name = scope.name?.replace('<br>', '');
			textPlaceholder =
				!scope.name || scope.name?.replace('<br>', '').trim().length === 0
					? 'Scope ' + scope.id.split('-')[1]
					: '';
		}
	}
</script>

<div
	name="scope-{scope.id}"
	class="card bg-base-100 shadow-xl p-4 {width} max-h-screen {classColor}"
>
	<div class:collapse={collapsable} class:collapse-arrow={collapsable}>
		<input type="checkbox" class:hidden={!collapsable} />
		<div class:collapse-title={collapsable} class="mb-2 w-full">
			<div class="flex flex-col w-full">
				<div class="inline-flex w-full">
					{#if editTitle}
						<div class="w-full ">
							<svelte:element
								this="h3"
								contenteditable
								placeholder={textPlaceholder}
								bind:innerHTML={scope.name}
								class="mr-2 mt-0 mb-0 w-full min-h-8 block border-dashed border-2 border-slate-200"
							/>
						</div>
						{#if $$slots.badge}
							<div>
								<slot name="badge" />
							</div>
						{/if}
					{:else}
						<div class="card-title w-full min-h-8">
							<label for="modal-{scope.id}" class="mr-2 link link-hover prose"
								><h3 class="inline-flex align-middle content-center items-center">
									{#if icon}
										<Fa {icon} class=" mr-2" />
									{/if}
									{!scope?.name || scope?.name?.replace('<br>', '').trim().length === 0
										? 'Scope ' + scope?.id?.split('-')[1]
										: scope?.name?.replace('<br>', '')}
								</h3></label
							>
						</div>
						{#if $$slots.badge}
							<div>
								<slot name="badge" />
							</div>
						{/if}
					{/if}
				</div>
				{#if $$slots.header}
					<div>
						<slot name="header" />
					</div>
				{/if}
			</div>
			{#if $$slots.subTitle}
				<div class="flex-none"><slot name="subTitle" /></div>
			{/if}
		</div>
		<div class:collapse-content={collapsable}>
			{#if $$slots.body}
				<slot name="body" />
			{/if}
		</div>
	</div>
</div>
<input type="checkbox" id="modal-{scope.id}" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label for="modal-{scope.id}" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		{#if $$slots.headerScopeModal}
			<h3 class="text-lg font-bold"><slot name="headerScopeModal" /></h3>
		{/if}
		{#if $$slots.bodyScopeModal}
			<slot name="bodyScopeModal" />
		{/if}
		{#if itemsScopeModal}
			{#each itemsScopeModal as itemScopeModal}
				{#if itemScopeModal['name']}
					<ul>
						<li>{itemScopeModal.name}</li>
					</ul>
				{/if}
			{/each}
		{/if}
	</div>
</div>

<style>
	:is([contenteditable], [placeholder]) {
		cursor: text;
	}

	[placeholder]:not(empty):before {
		content: attr(placeholder);
		display: block;
		opacity: 0.5;
	}
</style>

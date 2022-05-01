<script>
	import Icon from 'svelte-awesome';
	import { prevent_default } from 'svelte/internal';

	export let scope;
	export let itemsScopeModal = [];
	export let editTitle = false;
	export let icon = undefined;
	export let classColor = '';
	export let width = '';
	export let collapsable = false;

	let textPlaceholder;
	$: {
		if (scope) {
			// scope.name = scope.name?.replace('<br>', '');
			// textPlaceholder =
			// !scope.name || scope.name?.replace('<br>', '').trim().length === 0
			// 	? 'Scope ' + scope.id.split('-')[1]
			// 	: '';
			textPlaceholder =
				!scope.name || scope.name.trim().length === 0 ? 'Scope ' + scope.id.split('-')[1] : '';
		}
	}

	function handlePaste(e) {
		var clipboardData, pastedData;

		// Stop data actually bein	g pasted into div
		e.stopPropagation();
		e.preventDefault();

		// Get pasted data via clipboard API
		clipboardData = e.clipboardData || window.clipboardData;
		pastedData = clipboardData.getData('Text');

		e.target.textContent = pastedData;
	}
</script>

<div
	name="scope-{scope.id}"
	class="rounded-md border-[0.1em] border-slate-300 shadow-xl p-4 {width} max-h-screen {classColor}"
>
	<div class:collapse={collapsable} class:collapse-arrow={collapsable}>
		<input type="checkbox" class:hidden={!collapsable} />
		<div class:collapse-title={collapsable} class="mb-2 w-full">
			<div class="flex flex-col w-full">
				<div class="inline-flex w-full">
					{#if editTitle}
						<div class="w-full flex flex-wrap break-all">
							<svelte:element
								this="h3"
								on:paste|preventDefault|stopPropagation={handlePaste}
								contenteditable
								on:keypress={(e) => {
									if (e.code === 'Enter') {
										e.preventDefault();
									}
								}}
								placeholder={textPlaceholder}
								bind:textContent={scope.name}
								class="mr-2 mt-0 mb-0 w-full min-h-8 border-dashed border-2 border-slate-200 inline"
							/>
						</div>
						{#if $$slots.badge}
							<div>
								<slot name="badge" />
							</div>
						{/if}
					{:else}
						<div class="card-title w-full min-h-8 flex flex-wrap break-all">
							<label for="modal-{scope.id}" class="mr-2 link link-hover prose"
								><h3 class="align-middle content-center items-center">
									{#if icon}
										<Icon data={icon} class=" mr-2" />
									{/if}
									<!-- {!scope?.name || scope?.name?.replace('<br>', '').trim().length === 0
										? 'Scope ' + scope?.id?.split('-')[1]
										: scope?.name?.replace('<br>', '')} -->
									{!scope?.name || scope?.name?.trim().length === 0
										? 'Scope ' + scope?.id?.split('-')[1]
										: scope?.name}
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

	[contenteditable]:not(empty):not(:focus):before {
		content: attr(placeholder);
		display: inline;
		opacity: 0.5;
	}

	/* [placeholder]:empty:not(:focus):before {
		content: attr(placeholder);
		display: inline;
		opacity: 0.5;
	} */
</style>

<script>
	import { prevent_default } from 'svelte/internal';

	export let scope;
	export let itemsScopeModal = [];
	export let editTitle = false;
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

	let mouseIsOver = false;
	function mouseOver(e) {
		mouseIsOver = true;
	}

	function mouseOut(e) {
		mouseIsOver = false;
		e.target.blur();
	}
</script>

<div
	name="scope-{scope.i}"
	class="rounded-md border-[0.1em] border-slate-300 shadow-xl {width} max-h-screen h-full {classColor}"
>
	<div class:collapse={collapsable} class:collapse-arrow={collapsable}>
		<input type="checkbox" class:hidden={!collapsable} />
		<div class:collapse-title={collapsable} class="mb-2 w-full bg-slate-200">
			<div class="flex flex-col w-full">
				<div class="inline-flex w-full" class:px-4={!collapsable} class:pt-4={!collapsable}>
					{#if editTitle}
						<div class="w-full flex flex-wrap break-words mr-2 mt-0 mb-2 prose-h3:my-0">
							<svelte:element
								this="h3"
								on:paste|preventDefault|stopPropagation={handlePaste}
								on:mouseenter={mouseOver}
								on:mouseout={mouseOut}
								on:keypress={(e) => {
									if (e.code === 'Enter') {
										e.preventDefault();
									}
								}}
								contenteditable
								placeholder={textPlaceholder}
								bind:textContent={scope.name}
								class="w-full min-h-8 border-2 border-slate-400 inline"
								class:border-dashed={!scope.name || mouseIsOver}
								class:border-slate-400={!scope.name || mouseIsOver}
								class:border-slate-200={scope.name || !mouseIsOver}
							/>
						</div>
						{#if $$slots.badge}
							<div>
								<slot name="badge" />
							</div>
						{/if}
					{:else}
						<div class="card-title w-full min-h-8 flex flex-wrap break-words">
							<label for="modal-{scope.id}" class="mr-2 link link-hover prose"
								><h2 class="align-middle content-center items-center break-words">
									<!-- {!scope?.name || scope?.name?.replace('<br>', '').trim().length === 0
										? 'Scope ' + scope?.id?.split('-')[1]
										: scope?.name?.replace('<br>', '')} -->
									{!scope?.name || scope?.name?.trim().length === 0
										? 'Scope ' + scope?.id?.split('-')[1]
										: scope?.name}
								</h2></label
							>
						</div>
						{#if $$slots.badge}
							<div class="pb-2">
								<slot name="badge" />
							</div>
						{/if}
					{/if}
				</div>
				{#if $$slots.header}
					<div class="px-4">
						<slot name="header" />
					</div>
				{/if}
			</div>
			{#if $$slots.subTitle}
				<div class="flex-none p-2"><slot name="subTitle" /></div>
			{/if}
		</div>
		<div class:collapse-content={collapsable} class="overflow-visible px-2 pb-2">
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

<script>
	export let scope;
	export let itemsScopeModal = [];
	export let editTitle = false;
	export let checked = false;
	export let color = '#FFFFFF';
</script>

<div
	name="scope-{scope.id}"
	class="p-2 border-2 w-96"
	class:bg-red-300={checked}
	style:background-color={color}
>
	<div name="title" class="mb-2">
		<div class="flex flex-col w-full">
			<div class="inline-flex w-full">
				{#if editTitle}
					<svelte:element
						this="h3"
						contenteditable
						bind:innerHTML={scope.name}
						class="mr-2 mt-0 mb-0 w-full"
					/>
					{#if $$slots.badge}
						<slot name="badge" />
					{/if}
				{:else}
					<label for="modal-{scope.id}" class="mr-2 w-full link link-hover prose"
						><h3>{scope.name}</h3></label
					>
					{#if $$slots.badge}
						<slot name="badge" />
					{/if}
				{/if}
			</div>
			{#if $$slots.header}
				<slot name="header" />
			{/if}
		</div>
		{#if $$slots.subTitle}
			<div class="flex-none"><slot name="subTitle" /></div>
		{/if}
	</div>
	{#if $$slots.body}
		<slot name="body" />
	{/if}

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
</div>

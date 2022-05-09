<script>
	import { projectStore, storeSortedScopesDocumentation } from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';
	import CopyToClipboard from '$lib/components/CopyToClipboard.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { fade } from 'svelte/transition';
	// notice - fade in works fine but don't add svelte's fade-out (known issue)
	import { cubicIn } from 'svelte/easing';

	let reordered = false;
	let moving = false;

	projectStore.sortScopesByPriority();

	$: {
		if ($storeSortedScopesDocumentation && !moving) {
			saveDataIntoOriginalStore();
		}
	}

	$: checkList = {
		name: 'Tasks',
		items: [
			{
				name: 'documentation',
				optional: true,
				text: 'Re-order the blocks',
				checked: reordered
			}
		]
	};

	let exportText;
	let autoNumber = false;

	const flipDurationMs = 300;

	let successfullyCopied = undefined;
	const handleSuccessfullyCopied = (e) => {
		successfullyCopied = true;
	};

	const handleFailedCopy = () => {
		successfullyCopied = false;
	};

	function scopesToText(scopes) {
		let text = '';
		let textNumberTitle = 1;
		scopes.forEach((scope, idx) => {
			if ((scope.title || scope.name) && scope.id !== 'bucket') {
				text = text.concat(
					'- ### ' +
						(autoNumber ? textNumberTitle + '. ' : '') +
						(scope.title ? scope.title.trim() : scope.name ? 'Scope ' + scope.name : '') +
						'\n'
				);

				if (scope.description) {
					let textNumberDescription = 1;
					scope.description.split('\n').map((line) => {
						text = text.concat(
							'\t- ' +
								(autoNumber ? textNumberTitle + '.' + textNumberDescription + '. ' : '') +
								line +
								'\n'
						);
						textNumberDescription++;
					});
				}
				textNumberTitle++;
			}
		});

		exportText = text;
		return text;
	}

	function handleDndConsider(e) {
		$storeSortedScopesDocumentation = e.detail.items;
		reordered = true;
		moving = true;
	}
	function handleDndFinalize(e) {
		$storeSortedScopesDocumentation = e.detail.items;
		reordered = true;
		moving = false;
		saveDataIntoOriginalStore();
	}
	function proxyDndzone() {
		return dndzone.apply(null, arguments);
	}

	function saveDataIntoOriginalStore() {
		$storeSortedScopesDocumentation.map((s) => {
			let scopeOriginal = $projectStore.find((s2) => s2.id === s.id);
			scopeOriginal.title = s.title;
			scopeOriginal.description = s.description;
		});
		$projectStore = $projectStore;
	}
</script>

<NavigationScopes currentStep={5} let:currentStep>
	<NavigationCheckList {checkList} {currentStep} linkPreviousStep="/scopes/sequence">
		<div slot="buttons">
			<label
				for="modal-export"
				class="btn btn-outline modal-button mr-2"
				on:click={() => scopesToText($storeSortedScopesDocumentation)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-4 h-4 mr-1"
					><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
						d="M192 312C192 298.8 202.8 288 216 288H384V160H256c-17.67 0-32-14.33-32-32L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48v-128H216C202.8 336 192 325.3 192 312zM256 0v128h128L256 0zM568.1 295l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 288H384v48h110.1l-39.03 39.03C450.3 379.7 448 385.8 448 392s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 319.6 578.3 304.4 568.1 295z"
					/></svg
				>

				Export To Text [Markdown]</label
			>You will be able to choose to auto number each line written.
			<!-- {#if showUpdate}
				<label for="modal-update" class="btn btn-primary modal-update">Update</label>
			{/if} -->
		</div>
	</NavigationCheckList>
</NavigationScopes>

<div
	class="w-full"
	use:proxyDndzone={{
		items: $storeSortedScopesDocumentation,
		flipDurationMs,
		morphDisabled: false,
		dropTargetClasses: ['bg-green-50']
	}}
	on:consider={(e) => handleDndConsider(e)}
	on:finalize={(e) => handleDndFinalize(e)}
>
	{#each $storeSortedScopesDocumentation as scope, idx (scope.id)}
		<div class="m-2 flex justify-center mb-8" animate:flip={{ duration: flipDurationMs }}>
			<Scope bind:scope itemsScopeModal={scope.items} width="w-full">
				<div slot="badge" class="w-full inline-flex items-center align-middle">
					<BadgeDependencies project={projectStore} bind:scope />
					<div class="move cursor-grab align-middle content-center justify-items-center" />
				</div>
				<div slot="header" class="w-full">
					<div class="badge" class:hidden={!scope.indispensable}>Indispensable</div>
					<div class="badge" class:hidden={!scope.risky}>Risky</div>
					<h2
						class="mt-2 border-dashed border-2 border-gray-300"
						contenteditable
						bind:textContent={scope.title}
						placeholder="Write here the name of this group..."
					/>
				</div>
				<div slot="body">
					<div class="w-full flex flex-col-reverse sm:flex-row">
						<div class="w-full grow max-w-5xl">
							<textarea
								class="textarea textarea-bordered w-full h-full text-lg"
								placeholder="Write here the sections related to this group..."
								bind:value={scope.description}
							/>
						</div>
						<div class="p-2 w-full sm:w-96">
							<div>
								<h4 class="mt-0">Indispensable:</h4>
								<ul>
									{#each scope.items.filter((item) => item.indispensable) as item}
										<li><div class="min-h-8">{item.name}</div></li>
									{/each}
								</ul>
							</div>
							<div>
								<h4>Nice to have:</h4>
								<ul>
									{#each scope.items.filter((item) => !item.indispensable) as item}
										<li><div class="min-h-8">{item.name}</div></li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div slot="headerScopeModal">Items of {scope.name}</div>
			</Scope>
		</div>
	{/each}
</div>

<input type="checkbox" id="modal-export" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		{#if successfullyCopied}
			<div class="alert alert-success shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>Successfully copied to clipboard!</span>
				</div>
			</div>
		{/if}
		{#if successfullyCopied === false}
			<div class="alert alert-error shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>Failed to copy to clipboard!</span>
				</div>
			</div>
		{/if}
		<input
			type="checkbox"
			id="auto-number"
			class="toggle align-middle content-center items-center mr-2"
			bind:checked={autoNumber}
			on:change={() => scopesToText($projectStore)}
		/><label for="auto-number">Auto-number each line</label>
		<div class="divider" />
		<div style="white-space: pre-wrap;" class="w-fit h-96 overflow-auto">
			{exportText}
		</div>
		<div class="modal-action">
			<label for="modal-export" class="btn">Close</label>
			<CopyToClipboard
				text={exportText}
				let:copy
				on:copy={handleSuccessfullyCopied}
				on:fail={handleFailedCopy}
			>
				<label class="btn btn-primary" on:click={copy}>Copy to clipboard</label>
			</CopyToClipboard>
		</div>
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}

	:is([contenteditable], [placeholder]) {
		cursor: text;
	}

	[contenteditable]:empty:before {
		content: attr(placeholder);
		display: block;
		opacity: 0.5;
	}
</style>

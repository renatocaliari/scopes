<script>
	import { projectStore, sortedScopesDocumentation } from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import SvgArrow from './svgArrow.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';
	import CopyToClipboard from '$lib/components/CopyToClipboard.svelte';

	projectStore.sortScopesByPriority();
	$: {
		$sortedScopesDocumentation,
			$sortedScopesDocumentation.map((s) => {
				let scopeOriginal = $projectStore.find((s2) => s2.id === s.id);
				scopeOriginal.title = s.title;
				scopeOriginal.description = s.description;
			});
		$projectStore = $projectStore;
	}

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
			if (scope.title && scope.description) {
				text = text.concat((autoNumber ? textNumberTitle + '. ' : '') + scope.title.trim() + '\n');
				textNumberTitle;

				let textNumberDescription = 1;
				scope.description.split('\n').map((line) => {
					text = text.concat(
						'\t' +
							(autoNumber ? textNumberTitle + '.' + textNumberDescription + '. ' : '') +
							line +
							'\n'
					);
					textNumberDescription++;
				});
			}
		});

		exportText = text;
		return text;
	}
</script>

<NavigationScopes currentStep={4} let:currentStep>
	<NavigationCheckList {currentStep} linkPreviousStep="/scopes/sequence">
		<div slot="buttons">
			<label
				for="modal-export"
				class="btn btn-outline modal-button mr-2"
				on:click={() => scopesToText($projectStore)}>Export To Text</label
			>You will be able to choose to auto number each line written in the export option.
			<!-- {#if showUpdate}
				<label for="modal-update" class="btn btn-primary modal-update">Update</label>
			{/if} -->
		</div>
	</NavigationCheckList>
</NavigationScopes>

<div class="w-full ">
	{#each $sortedScopesDocumentation as scope, idx (scope.id)}
		<div class="m-2 flex justify-center ">
			<Scope bind:scope itemsScopeModal={scope.items} width="w-full">
				<div slot="badge" class="w-full ">
					<BadgeDependencies project={projectStore} bind:scope />
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
						<div class="w-full grow">
							<textarea
								class="textarea textarea-bordered w-full h-full text-lg"
								placeholder="Write here the sections related to this group..."
								bind:value={scope.description}
							/>
						</div>
						<div class="p-2">
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
		{#if idx + 1 < $sortedScopesDocumentation.length}
			<div class="flex justify-center">
				<SvgArrow />
			</div>
		{/if}
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
		<label for="auto-number" class="mr-2">Auto-number each line.</label><input
			type="checkbox"
			id="auto-number"
			class="toggle align-middle content-center items-center"
			bind:checked={autoNumber}
			on:change={() => scopesToText($projectStore)}
		/>
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
	[contenteditable]:empty:before {
		content: attr(placeholder);
		display: block;
		opacity: 0.5;
	}
</style>

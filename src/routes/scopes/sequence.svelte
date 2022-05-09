<script context="module">
	import CopyToClipboard from '$lib/components/CopyToClipboard.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { fade } from 'svelte/transition';
	// notice - fade in works fine but don't add svelte's fade-out (known issue)
	import { cubicIn } from 'svelte/easing';

	let showUpdate = false;
	let toggleAutoTodo = false;
	let toggleAddInfo = true;
</script>

<script>
	import {
		storeSortedScopesDocumentation,
		storeSortedGroupedSequenceScopes
	} from '$lib/stores/projectStore';
	import { projectStore } from '$lib/stores/projectStore';

	projectStore.sortScopesByPriority();

	let exportText;
	const flipDurationMs = 300;
	let reordered = false;

	let forkedScopes = $storeSortedGroupedSequenceScopes['sequence'].reduce((acc, g) => {
		let scopesForked = g.items.reduce((acc2, scope) => {
			if (scope.forkedScopeId) {
				acc2.push(scope);
			}
			return acc2;
		}, []);

		scopesForked;
		if (scopesForked.length) {
			acc.push(...scopesForked);
		}
		return acc;
	}, []);

	// console.log('>>> $storeSortedScopesDocumentation:', $storeSortedScopesDocumentation);
	// console.log('>>> forkedScopes:', forkedScopes);
	let scopes = [...$storeSortedScopesDocumentation, ...forkedScopes].reduce(
		(acc, scope, idx, arr) => {
			acc.push(scope);
			return acc.flat(2);
		},
		[]
	);
	console.log('scopes:', scopes);

	$: checkList = {
		name: 'Tasks',
		items: [
			{
				name: 'sequence',
				optional: true,
				text: 'At your own risk, you can re-order the sequence. But remeber, you may lose the benefits of the generated sequence',
				checked: reordered
			}
		]
	};

	let successfullyCopied = undefined;
	const handleSuccessfullyCopied = (e) => {
		successfullyCopied = true;
	};

	const handleFailedCopy = () => {
		successfullyCopied = false;
	};

	function scopesToText(groups) {
		let text = '';
		let idxGlobal = 0;

		let priorities = ['#A', '#B', '#C'];
		let idxPriority = 0;

		groups.forEach((group, idxGroup) => {
			group.items.forEach((scope, idxScope) => {
				idxGlobal++;

				if (idxGlobal > 1) {
					text = text.concat('\n');
				}
				text = text.concat(
					'- ### ' + 'Step ' + idxGlobal + ': **' + (scope.name || scope.placeholder) + '**'
				);

				let unlockDependencies = projectStore
					.scopeUnlocksDependencies(scope, scopes)
					.filter((item) => item != null);

				let dependsOn = scopes.filter(
					(s) => scope.dependsOn.includes(s.id) || scope.dependsOn.includes(s.forkedScopeId)
					// (s) => scope.dependsOn.includes(s.id)
				);

				// quero encontrar escopos duplicados com o mesmo id, mas o mesmo id pode significar
				// scope.id ou scope.forkedScopeId. se tiver os dois, dar prioridade apenas ao forkedid.

				if (toggleAddInfo) {
					if (
						scope.forkedScopeId ||
						scope.risky ||
						dependsOn?.length ||
						unlockDependencies.length
					) {
						text = text.concat('\n\t- Info:');

						if (scope.forkedScopeId) {
							text = text.concat(
								'\n\t\t- WARNING: The sole intention at this step is allowing the execution of the tasks of the next scope.' +
									'\n\t\t- Think about affordances or simulated ways to mimic the real behavior of the tasks here.' +
									'\n\t\t- In the world of software development you can think about dummy objects, fake objects, stubs and mocks.'
							);
						}
						if (scope.risky) {
							text = text.concat(
								scope.risky ? '\n\t- WARNING: This scope is RISKY because it has UNKNOWNS' : ''
							);
						}

						if (dependsOn?.length > 0) {
							text = text.concat('\n\t- This scope depends on the following scopes:');
							dependsOn.forEach((s) => {
								text = text.concat('\n\t\t- ' + s.name);
							});
						}
						// let unlocksScopes = group.items.filter((s) => s.dependsOn?.includes(scope.id));
						if (unlockDependencies.length > 0) {
							text = text.concat('\n\t- This scope unlocks the following scopes:');
							unlockDependencies.forEach((s) => {
								text = text.concat('\n\t\t- ' + s.name);
							});
						}
					}
				}

				if (!scope.forkedScopeId) {
					if (group.indispensableTasks) {
						text = text.concat('\n\t- Indispensable tasks:');
					} else {
						text = text.concat('\n\t- Nice-to-have tasks:');
					}
					if (scope.items.length) {
						scope.items.forEach((item) => {
							text = text.concat(
								'\n\t\t- ' +
									(toggleAutoTodo
										? group.indispensableTasks
											? 'NOW' + (idxPriority <= 3 ? ' [' + priorities[idxPriority] + '] ' : '')
											: 'LATER'
										: '') +
									' ' +
									item.name
							);
						});
					} else {
						text = text.concat('\n\t\t- No item added');
					}
				} else {
					text = text.concat(
						'\n\t\t- ' +
							(toggleAutoTodo
								? group.indispensableTasks
									? 'NOW' + (idxPriority <= 3 ? ' [' + priorities[idxPriority] + '] ' : '')
									: 'LATER'
								: '') +
							'At this step, do only what is needed to enable doing the tasks of the next scope.'
					);
				}
			});
		});

		exportText = text;
		return text;
	}

	function handleDndConsider(e) {
		$storeSortedGroupedSequenceScopes['sequence'] = e.detail.items;
		reordered = true;
	}
	function handleDndFinalize(e) {
		$storeSortedGroupedSequenceScopes['sequence'] = projectStore.generateSequence(e.detail.items);
		reordered = true;
	}
	function proxyDndzone() {
		if (arguments[1]['items'].length > 1) {
			return dndzone.apply(null, arguments);
		}
		return;
	}

	function confirmUpdate() {
		$storeSortedGroupedSequenceScopes['sequence'].set(
			projectStore.sortScopesByPriority().storeSortedGroupedAndForkedScopes
		);
	}

	function getEmoji(scope) {
		let emoji = '';
		if (scope.indispensable && scope.risky) {
			emoji = emoji + '🚨';
		} else if (scope.forkedScopeId) {
			emoji = emoji + '⏱️';
		} else if (scope.indispensable) {
			emoji = emoji + '';
		} else if (scope.indispensable) {
			emoji = emoji + '';
		}
		return emoji;
	}
</script>

<NavigationScopes currentStep={4} let:currentStep>
	<NavigationCheckList
		{currentStep}
		{checkList}
		optional={true}
		linkNextStep="/scopes/documentation"
		linkPreviousStep="/scopes/dependencies"
	>
		<div slot="buttons">
			<label
				for="modal-export"
				class="btn btn-outline modal-button"
				on:click={() => (exportText = scopesToText($storeSortedGroupedSequenceScopes['sequence']))}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-4 h-4 mr-1"
					><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
						d="M192 312C192 298.8 202.8 288 216 288H384V160H256c-17.67 0-32-14.33-32-32L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48v-128H216C202.8 336 192 325.3 192 312zM256 0v128h128L256 0zM568.1 295l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 288H384v48h110.1l-39.03 39.03C450.3 379.7 448 385.8 448 392s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 319.6 578.3 304.4 568.1 295z"
					/></svg
				> Export To Text [Markdown]</label
			>
			<!-- {#if showUpdate}
				<label for="modal-update" class="btn btn-primary modal-update">Update</label>
			{/if} -->
		</div>
	</NavigationCheckList>
</NavigationScopes>

<div class="flex flex-row w-full">
	<h2 class="flex flex-row w-full align-middle content-center items-center">
		Sequence for execution
		<label for="modal-about-sequence" class="cursor-pointer">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0
	512 512"
				class="w-5 h-5 ml-2"
				><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
					d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s13.1-32 32-32c17.1 0 32 14 32 32S273.1 400 256 400zM325.1 258L280 286V288c0 13-11 24-24 24S232 301 232 288V272c0-8 4-16 12-21l57-34C308 213 312 206 312 198C312 186 301.1 176 289.1 176h-51.1C225.1 176 216 186 216 198c0 13-11 24-24 24s-24-11-24-24C168 159 199 128 237.1 128h51.1C329 128 360 159 360 198C360 222 347 245 325.1 258z"
				/></svg
			></label
		>
	</h2>
</div>
<div class=" align-middle justify-center content-center items-center w-2/3">
	<section
		class="p-0 flex flex-col align-middle content-center items-center
			justify-center m-0"
		use:proxyDndzone={{
			items: $storeSortedGroupedSequenceScopes['sequence'],
			flipDurationMs,
			morphDisabled: false,
			type: 'sequence',
			dropTargetClasses: ['bg-green-50']
		}}
		on:consider={(e) => handleDndConsider(e)}
		on:finalize={(e) => handleDndFinalize(e)}
	>
		{#each $storeSortedGroupedSequenceScopes['sequence'] as group, idxGroup (group.id)}
			<fieldset
				class="w-full justify-start flex flex-col p-2 m-2
					align-middle content-center "
				class:box={group.dependencyPackage}
				class:border-2={group.dependencyPackage}
				class:border-slate-200={group.dependencyPackage}
				class:card={group.dependencyPackage}
			>
				{#if group.dependencyPackage}
					<legend class="ml-4 p-2">Sequence block with dependent scopes</legend>
				{/if}
				<!-- <div class="align-middle content-center justify-items-center min-w-fit">
						<h3 class="mt-2 ">Sequence {group.id}</h3>
					</div> -->
				{#each group.items as scope, idx (scope.id)}
					<!-- {@const calculatedColor = calculateColor(scope, maxDependents)} -->
					{@const nextOne = group.items[idx + 1] ? group.items[idx + 1] : { name: '' }}
					<div class="m-2 pl-2 justify-center flex flex-col align-middle">
						<div class="flex flex-col justify-start content-start items-start">
							<div class="flex flex-row justify-between w-full">
								<div
									class="flex flex-row content-center
										items-center align-middle"
								>
									<div class="text-xl font-bold">
										{scope.order} -
										{getEmoji(scope)}
										{scope.name || scope.placeholder}
									</div>
									{#if !scope.indispensable}
										<span class="ml-2 badge badge-outline">Nice-to-have</span>
									{:else}
										<span class="ml-2 badge badge-outline">Indispensable</span>
									{/if}
									{#if scope.risky}
										<span class="ml-2 badge badge-outline">Risky</span>
									{/if}
								</div>
								<div>
									<BadgeDependencies project={projectStore} {scopes} {scope} />
								</div>
							</div>
							<div class="flex flex-col gap-0 p-0 m-0">
								{#if scope.forkedScopeId}
									<div class="flex items-center content-center align-middle">
										<!-- <input type="checkbox" class="checkbox mr-2" />
												<p class="italic">
													At this step, do only the essential to be able to do the next risky scope.
												</p> -->
									</div>
									<div class="flex flex-col m-0 bg-yellow-50 mt-2 p-2 border-[1px]">
										At this step, do only what is needed to enable doing the tasks of the next
										scope.
										<br />
										Think about affordances or simulated ways to mimic the real behavior of the tasks.
										<br />
										In the world of software development you can think about dummy objects, fake objects,
										stubs and mocks.
									</div>
								{:else}
									{#if typeof group.indispensableTasks !== 'undefined'}
										<div class="pb-2">
											{#if group.indispensableTasks === true}
												Indispensable tasks:
											{:else if group.indispensableTasks === false}
												Nice-to-have tasks:
											{/if}
										</div>
									{/if}
									<div class="pb-2">
										{#each scope.items as item}
											<div class="flex items-center content-center align-middle">
												<input type="checkbox" class="checkbox mr-2" />{item.name}
											</div>
										{/each}
									</div>
								{/if}
								{#if !scope.items.length}
									<div
										class="flex items-center
											content-center align-middle italic"
									>
										No item added
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</fieldset>
		{/each}
	</section>
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
			id="add-info"
			class="toggle align-middle content-center items-center mr-2"
			bind:checked={toggleAddInfo}
			on:change={() => {
				scopesToText($storeSortedGroupedSequenceScopes['sequence']);
			}}
		/><label for="auto-number" class="mr-2"
			>Add info about each scope (dependencies, riskies, etc)</label
		>
		<input
			type="checkbox"
			id="auto-number"
			class="toggle align-middle content-center items-center mr-2"
			bind:checked={toggleAutoTodo}
			on:change={() => {
				scopesToText($storeSortedGroupedSequenceScopes['sequence']);
			}}
		/><label for="auto-number" class="mr-2">Put NOW/LATER* at the beginning of the tasks</label>
		<span class="label-text-alt"
			>(*experimentally in format used by <a href="https://logseq.com/" target="_blank">Logseq</a
			>)</span
		>
		<div class="divider" />

		<div style="white-space: pre-wrap;" class="w-full h-96 overflow-auto">
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

<input type="checkbox" id="modal-update" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">
			Scopes were changed in other steps. Do you want to lost this sequence and get an automatic new
			one based on the changes?
		</h3>
		<div class="modal-action">
			<label for="modal-update" class="btn">Cancel</label>
			<label for="modal-update" class="btn btn-primary" on:click={confirmUpdate}>Confirm</label>
		</div>
	</div>
</div>

<input type="checkbox" id="modal-about-sequence" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">About the sequence</h3>
		<div>
			The sequence is generated based on all information about scopes.<br />
			The criteria used are:
			<ol>
				<li>Indispensable & Risky scopes showing only indispensable tasks</li>
				<li>Indispensable non-risky scopes showing only indispensable tasks</li>
				<li>Indispensable Risky scopes showing only nice-to-have tasks</li>
				<li>Indispensable non-risky scopes showing only nice-to-have tasks</li>
				<li>Nice-to-have & Risky scopes showing only indispensable tasks</li>
				<li>Nice-to-have non-risky scopes showing only indispensable tasks</li>
				<li>Nice-to-have & Risky scopes showing only nice-to-have tasks</li>
				<li>Nice-to-have non-risky scopes showing only nice-to-have tasks</li>
			</ol>
			<p class="font-bold">Each criteria above considers the dependencies among the scopes</p>
		</div>
		<div class="modal-action">
			<label for="modal-about-sequence" class="btn btn-primary">ok</label>
		</div>
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

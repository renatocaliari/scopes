<script context="module">
	import CopyToClipboard from '$lib/components/CopyToClipboard.svelte';
	import { convertToNumberingScheme } from '$lib/utils/general';
	import {
		projectStore,
		sortedGroupedAndForkedScopes,
		sortedScopesDocumentation
	} from '$lib/stores/projectStore';
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import SvgArrow from './svgArrow.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import NavigationCheckList from '$lib/components/Scopes/NavigationCheckList.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
	import { fade } from 'svelte/transition';
	// notice - fade in works fine but don't add svelte's fade-out (known issue)
	import { cubicIn } from 'svelte/easing';
	import Icon from 'svelte-awesome';
	// import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

	let showUpdate = false;
	let toggleAutoTodo = false;
	let toggleAddInfo = true;
</script>

<script>
	projectStore.sortScopesByPriority();

	let niceToHaveScopesItems = JSON.parse(JSON.stringify($sortedScopesDocumentation));
	niceToHaveScopesItems
		.filter((s) => s.items.some((item) => item.indispensable))
		.map((s) => {
			s.items = s.items.filter((item) => !item.indispensable);
			return s;
		});

	let orderMetaGroups = [
		{
			id: 1,
			title: 'Indispensable & risky scopes with only indispensable tasks',
			items: $sortedGroupedAndForkedScopes
				.filter((g) => g.risky && g.indispensable)
				.map((g) => {
					g.items.filter((s) => {
						s.items = s.items.filter((item) => item.indispensable);
						return s;
					});
					return g;
				})
		},
		{
			id: 2,
			title: 'Indispensable & known scopes with only indispensable tasks',
			items: $sortedGroupedAndForkedScopes
				.filter((g) => !g.risky && g.indispensable)
				.map((g) => {
					g.items.filter((s) => {
						s.items = s.items.filter((item) => item.indispensable);
						return s;
					});
					return g;
				})
		},

		{
			id: 3,
			title: 'Nice-to-have & risky scopes with only indispensable tasks',
			items: $sortedGroupedAndForkedScopes
				.filter((g) => g.risky && !g.indispensable)
				.map((g) => {
					g.items.filter((s) => {
						s.items = s.items.filter((item) => item.indispensable);
						return s;
					});
					return g;
				})
		},
		{
			id: 4,
			title: 'Nice-to-have & known scopes with only indispensable tasks',
			items: $sortedGroupedAndForkedScopes
				.filter((g) => !g.risky && !g.indispensable)
				.map((g) => {
					g.items.filter((s) => {
						s.items = s.items.filter((item) => item.indispensable);
						return s;
					});
					return g;
				})
		},
		{
			id: 5,
			title: 'Nice-to-have tasks of all scopes',
			items: niceToHaveScopesItems.reduce((acc, scope, idx) => {
				acc.push({
					id: 'Nice-To-Have ' + idx,
					dependencyPackage: false,
					risky: false,
					indispensable: false,
					items: [niceToHaveScopesItems[idx]]
				});
				return acc;
			}, [])
		}
	];

	let exportText;
	const flipDurationMs = 300;
	let reordered = false;

	$: checkList = {
		name: 'Tasks',
		items: [
			{
				name: 'sequence',
				optional: true,
				text: 'Re-order the sequence inside its own priority category',
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

	function scopesToText(metaGroup) {
		let text = '';
		let idxGlobal = 0;

		let priorities = ['#A', '#B', '#C'];
		let idxPriority = 0;

		metaGroup.forEach((metaGroup, idxMetaGroup) => {
			if (metaGroup.items.length) {
				if (idxMetaGroup > 0) {
					idxPriority++;
					text = text.concat('\n');
				}
				text = text.concat('- # ' + metaGroup.title);
			}
			// console.log('groups: ', groups);
			metaGroup.items.forEach((group, idxGroup) => {
				console.log('group: ', group);
				group.items.forEach((scope, idx) => {
					idxGlobal++;

					// console.log('scope: ', scope);
					// console.log('idx + 1:', idx + 1, 'group.items:', group.items);
					text = text.concat(
						'\n- ### ' +
							(toggleAutoTodo ? (scope.forkedScopeId ? 'NOW ' : '') : '') +
							'Step ' +
							idxGlobal +
							': **' +
							(scope.name || scope.placeholder) +
							'**' +
							(scope.forkedScopeId ? '(do only the essential at this step)' : '')
					);

					let unlockDependencies = projectStore
						.scopeUnlocksDependencies(scope, group.items)
						.filter((item) => item != null);

					let scopes = $sortedGroupedAndForkedScopes.reduce((acc, group, idx, arr) => {
						acc.push(group.items);
						return acc.flat(2);
					}, []);
					let dependsOn = scopes.filter(
						(s) => scope.dependsOn.includes(s.id) || scope.dependsOn.includes(s.forkedScopeId)
					);

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
									'\n\t\t- WARNING: Do only the essential at this step to do the next scope [' +
										group.items[idx + 1].name +
										']'
								);
								text = text.concat(
									'\n\t\t- The sole intention at this step is allowing the execution of [' +
										group.items[idx + 1].name +
										'].' +
										'\n\t\t- Think about simulated ways to mimic the real behavior of the tasks here.' +
										'\n\t\t- In the world of development of software you can think about dummy objects, fake objects, stubs and mocks.' +
										'\n\t\t- ' +
										scope.name +
										" will appear on the sections below, so you'll be able to execute fully."
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
								text = text.concat('\n\t- This scope unlocks on the following scopes:');
								unlockDependencies.forEach((s) => {
									text = text.concat('\n\t\t- ' + s.name);
								});
							}
						}
					}

					let indispensableItems = scope.items?.filter((item) => item.indispensable);
					let niceToHave = scope.items?.filter((item) => !item.indispensable);
					if (indispensableItems?.length > 0) {
						text = text.concat('\n- Indispensable Tasks:');
						indispensableItems.forEach((item) => {
							text = text.concat(
								'\n\t- ' +
									(toggleAutoTodo
										? !scope.forkedScopeId
											? 'NOW' + (idxPriority <= 3 ? ' [' + priorities[idxPriority] + '] ' : '')
											: ''
										: '') +
									item.name
							);
						});
					}
				});
			});
		});

		if ($sortedScopesDocumentation.some((s) => s.items.some((item) => !item.indispensable))) {
			text = text.concat('\n- # Nice-to-have tasks');
			$sortedScopesDocumentation.forEach((scope) => {
				if (scope.items.some((item) => !item.indispensable)) {
					idxGlobal++;
					text = text.concat('\n- Step ' + idxGlobal + ': **' + scope.name + '**');
					let niceToHaveItems = scope.items.filter((item) => !item.indispensable);
					niceToHaveItems.forEach((item) => {
						text = text.concat(
							'\n\t- ' + (toggleAutoTodo === true ? 'LATER' + ' ' : '') + item.name
						);
					});
				}
			});
		}

		exportText = text;
		return text;
	}

	function handleDndConsider(e, idxMetaGroup) {
		orderMetaGroups[idxMetaGroup].items = e.detail.items;
		reordered = true;
	}
	function handleDndFinalize(e, idxMetaGroup) {
		orderMetaGroups[idxMetaGroup].items = e.detail.items;
		reordered = true;
	}
	function proxyDndzone() {
		if (arguments[1]['items'].length > 1) {
			return dndzone.apply(null, arguments);
		}
		return;
	}

	function confirmUpdate() {
		sortedGroupedAndForkedScopes.set(
			projectStore.sortScopesByPriority().sortedGroupedAndForkedScopes
		);
		$sortedGroupedAndForkedScopes = $sortedGroupedAndForkedScopes;
	}

	// let maxDependents = $projectStore.reduce((prev, curr) => {
	// 	return Math.max(prev, curr.dependsOn?.length);
	// }, 0);

	// function calculateColor(scope, maxDependents) {
	// 	return percentageToHsl(
	// 		isNaN(scope.dependsOn?.length / maxDependents) ? 0 : scope.dependsOn?.length / maxDependents,
	// 		35,
	// 		0
	// 	);
	// }
	// function percentageToHsl(percentage, hue0, hue1) {
	// 	var hue = percentage * (hue1 - hue0) + hue0;
	// 	return 'hsl(' + hue + ', 100%, ' + (100 - percentage * 10) + '%)';
	// }
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
				on:click={() => (exportText = scopesToText(orderMetaGroups))}
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

{#each orderMetaGroups as metaGroup, idxMeta (metaGroup.id)}
	{#if metaGroup.items.length}
		<div class=" align-middle content-center items-center">
			<div class="divider my-8">
				<h3>{metaGroup.title}</h3>
			</div>
			<section
				class="overflow-auto p-2 flex flex-col align-middle content-center items-center"
				use:proxyDndzone={{
					items: metaGroup.items,
					flipDurationMs,
					morphDisabled: false,
					type: 'metaGroup' + metaGroup.id,
					dropTargetClasses: ['bg-green-50']
				}}
				on:consider={(e) => handleDndConsider(e, idxMeta)}
				on:finalize={(e) => handleDndFinalize(e, idxMeta)}
			>
				{#each metaGroup.items as group, idxGroup (group.id)}
					<div
						animate:flip={{ duration: flipDurationMs }}
						class="card justify-start w-fit flex flex-col border-2 p-2 m-2 overflow-auto align-middle content-center"
						class:bg-orange-50={group.dependencyPackage}
					>
						{#if metaGroup.items.length > 1}
							<div class="move cursor-grab align-middle content-center justify-items-center">
								<svg viewBox="0 0 100 80" width="20" height="20">
									<rect width="70" height="12" />
									<rect y="20" width="70" height="12" />
									<rect y="40" width="70" height="12" />
								</svg>
							</div>
						{/if}
						<!-- <div class="align-middle content-center justify-items-center min-w-fit">
						<h3 class="mt-2 ">Sequence {group.id}</h3>
					</div> -->
						{#each group.items as scope, idx (scope.id)}
							<!-- {@const calculatedColor = calculateColor(scope, maxDependents)} -->
							{@const nextOne = group.items[idx + 1] ? group.items[idx + 1] : { name: '' }}
							{@const scopes = $sortedGroupedAndForkedScopes.reduce((acc, group, idx, arr) => {
								acc.push(group.items);
								return acc.flat(2);
							}, [])}
							<div class="m-2 justify-center flex flex-col align-middle">
								<div class="flex justify-start content-start items-start">
									<Scope
										{scope}
										editTitle={false}
										itemsScopeModal={scope.items}
										width="w-96"
										collapsable
									>
										<div slot="badge">
											<BadgeDependencies project={projectStore} {scopes} {scope} />
										</div>
										<div slot="header">
											<div class="badge" class:hidden={!scope.indispensable}>Indispensable</div>
											<div class="badge" class:hidden={!scope.forkedScopeId}>
												<!-- <Icon data={faCircleExclamation} class="mr-2" />  -->
												Do only the essential
											</div>
											<div class="badge" class:hidden={!scope.risky}>Risky</div>
										</div>
										<div slot="body">
											{#if scope.forkedScopeId}
												<div class="border-2 bg-yellow-50 p-2 text-left">
													<p>
														The sole intention at this step is allowing the execution of the next
														scope,
														<span class="font-bold bg-yellow-300 p-2">
															{nextOne.name || nextOne.placeholder}</span
														>. Think about simulated ways to mimic the real tasks here.
													</p>
													<p>
														In the world of development of software you can think about dummy
														objects, fake objects, stubs and mocks.
													</p>
													<p>
														<span class="font-bold bg-yellow-300 p-2"
															>{scope.name || scope.placeholder}</span
														>
														will appear on the sections below, so you'll be able to execute fully.
													</p>
												</div>
											{/if}
											{#if scope.items.filter((item) => item.indispensable).length}
												<h4>Indispensable:</h4>
												<Items
													bind:scope
													maxHeight=""
													items={scope.items.filter((item) => item.indispensable)}
												/>
											{/if}
											{#if scope.items.filter((item) => !item.indispensable).length}
												<h4>Nice to have:</h4>
												<Items
													bind:scope
													maxHeight=""
													items={scope.items.filter((item) => !item.indispensable)}
												/>
											{/if}
										</div>
										<div slot="headerScopeModal">Items of {scope.name}</div>
									</Scope>
								</div>
								{#if idx + 1 < group.items.length}
									<div class=" flex items-center justify-center mt-4">
										<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"
											><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
												d="M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z"
											/></svg
										>
									</div>
								{/if}
							</div>
						{/each}
						{#if group[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
							<div in:fade={{ duration: 200, easing: cubicIn }} class="custom-shadow-item" />
						{/if}
					</div>
				{/each}
			</section>
		</div>
	{/if}
{/each}

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
				scopesToText(orderMetaGroups);
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
				scopesToText(orderMetaGroups);
			}}
		/><label for="auto-number" class="mr-2">Put NOW/LATER* at the beginning of the tasks</label>
		<span class="label-text-alt"
			>(*experimentally in format used by <a href="https://logseq.com/" target="_blank">Logseq</a
			>)</span
		>
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

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
	.custom-shadow-item {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		visibility: visible;
		border: 1px dashed grey;
		background: lightblue;
		opacity: 0.5;
		margin: 0;
	}
</style>

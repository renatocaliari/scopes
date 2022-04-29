<script>
	import CopyToClipboard from '$lib/components/CopyToClipboard.svelte';
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
	import { dndzone } from 'svelte-dnd-action';
	import { deepEqual } from '$lib/utils/comparison';
	import Icon from 'svelte-awesome';
	// import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

	let exportText;
	let showUpdate = false;
	$: {
		$projectStore,
			projectStore.sortScopesByPriority(),
			(exportText = scopesToText($sortedGroupedAndForkedScopes));
	}

	const flipDurationMs = 300;

	let successfullyCopied = undefined;
	const handleSuccessfullyCopied = (e) => {
		successfullyCopied = true;
	};

	const handleFailedCopy = () => {
		successfullyCopied = false;
	};

	function scopesToText(groups) {
		let text = '';
		// console.log('groups: ', groups);
		groups.forEach((group, idxGroup) => {
			// console.log('group: ', group);
			group.items.forEach((scope, idx) => {
				// console.log('scope: ', scope);
				// console.log('idx + 1:', idx + 1, 'group.items:', group.items);
				// text = text.concat('\n- Step ' + (idx + 1) + ': Scope [' + scope.name + ']');
				// text = text.concat(
				// 	scope.forkedScopeId
				// 		? '\n\t- WARNING: Do only the essential at this step to do the next scope [' +
				// 				group.items[idx + 1].name +
				// 				']'
				// 		: ''
				// );
				// text = text.concat(
				// 	scope.risky ? '\n\t- WARNING: This scope is RISKY because has UNKNOWNS' : ''
				// );
				// if (scope.dependsOn?.length > 0) {
				// 	text = text.concat('\n\t- Depends on:');
				// 	scope.dependsOn.forEach((dependsOnId) => {
				// 		let sDepend = group.items.find((s) => s.id === dependsOnId);
				// 		text = text.concat('\n\t\t- ' + sDepend.name);
				// 	});
				// }
				// let unlocksScopes = group.items.filter((s) => s.dependsOn?.includes(scope.id));
				// if (unlocksScopes.length > 0) {
				// 	text = text.concat('\n\t- Unlock scopes:');
				// 	unlocksScopes.forEach((s) => {
				// 		text = text.concat('\n\t\t- ' + s.name);
				// 	});
				// }
				// let indispensableItems = scope.items?.filter((item) => item.indispensable);
				// let niceToHave = scope.items?.filter((item) => !item.indispensable);
				// if (indispensableItems?.length > 0) {
				// 	text = text.concat('\n\t- Indispensable items:');
				// 	indispensableItems.forEach((item) => {
				// 		text = text.concat('\n\t\t- ' + item.name);
				// 	});
				// }
				// if (niceToHave?.length > 0) {
				// 	text = text.concat('\n\t- Nice to have items:');
				// 	niceToHave.forEach((item) => {
				// 		text = text.concat('\n\t\t- ' + item.name);
				// 	});
				// }
			});
		});
		return text;
	}

	function handleDndConsider(e) {
		sortedGroupedAndForkedScopes.set(e.detail.items);
	}
	function handleDndFinalize(e) {
		sortedGroupedAndForkedScopes.set(e.detail.items);
	}
	function proxyDndzone() {
		return dndzone.apply(null, arguments);
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

<NavigationScopes currentStep={3} let:currentStep>
	<NavigationCheckList
		{currentStep}
		linkNextStep="/scopes/patternLanguage"
		linkPreviousStep="/scopes/unknowns"
	>
		<div slot="buttons">
			{#if exportText && exportText.trim().length > 0}
				<label for="modal-export" class="btn btn-warning modal-button">Export To Text</label>
			{/if}
			{#if showUpdate}
				<label for="modal-update" class="btn btn-warning modal-update">Update</label>
			{/if}
		</div>
	</NavigationCheckList>
</NavigationScopes>

<section
	class="overflow-auto p-2 border-2 flex flex-col w-full min-w-full"
	use:proxyDndzone={{
		items: $sortedGroupedAndForkedScopes,
		flipDurationMs,
		type: 'items',
		dropTargetClasses: ['bg-green-50']
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each $sortedGroupedAndForkedScopes as group, idxGroup (group.id)}
		<div
			animate:flip={{ duration: flipDurationMs }}
			class="card justify-start w-full flex flex-row border-2 p-2 m-2 overflow-auto align-middle content-center"
		>
			<div class="move cursor-grab align-middle content-center justify-items-center">
				<svg viewBox="0 0 100 80" width="20" height="20">
					<rect width="70" height="12" />
					<rect y="20" width="70" height="12" />
					<rect y="40" width="70" height="12" />
				</svg>
			</div>
			<div class="align-middle content-center justify-items-center min-w-fit">
				<h3 class="mt-2 ">Sequence {group.id}</h3>
			</div>
			{#each group.items as scope, idx (scope.id)}
				<!-- {@const calculatedColor = calculateColor(scope, maxDependents)} -->
				{@const nextOne = group[idx + 1] ? group[idx + 1] : { name: '' }}
				{@const scopes = $sortedGroupedAndForkedScopes.reduce((acc, group, idx, arr) => {
					acc.push(group.items);
					return acc.flat(2);
				}, [])}
				<div class="m-2 justify-center flex">
					<div class="justify-start content-start items-start">
						<Scope {scope} editTitle={false} itemsScopeModal={scope.items} width="w-96" collapsable>
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
											The sole intention at this step is allowing the execution of the next scope,
											<span class="font-bold bg-yellow-300 p-2">
												{nextOne.name || nextOne.placeholder}</span
											>. Think about simulated ways to mimic the real tasks here.
										</p>
										<p>
											In the world of development of software you can think about dummy objects,
											fake objects, stubs and mocks.
										</p>
										<p>
											<span class="font-bold bg-yellow-300 p-2"
												>{scope.name || scope.placeholder}</span
											>
											will appear later on again, so you'll be able to execute fully.
										</p>
									</div>
								{/if}
								<h4>Indispensable:</h4>
								<Items
									bind:scope
									maxHeight=""
									items={scope.items.filter((item) => item.indispensable == true)}
								/>
								<h4>Nice to have:</h4>
								<Items
									bind:scope
									maxHeight=""
									items={scope.items.filter((item) => item.indispensable == false)}
								/>
							</div>
							<div slot="headerScopeModal">Items of {scope.name}</div>
						</Scope>
					</div>
				</div>
				{#if idx + 1 < group.length}
					<div class="flex justify-center">
						<SvgArrow />
					</div>
				{/if}
			{/each}
		</div>
	{/each}
</section>

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
				<label class="btn btn-warning" on:click={copy}>Copy to clipboard</label>
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
			<label for="modal-update" class="btn btn-warning" on:click={confirmUpdate}>Confirm</label>
		</div>
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>

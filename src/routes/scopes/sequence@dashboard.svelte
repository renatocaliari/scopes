<script context="module">
	import moment from 'moment';
	import CopyToClipboard from '$lib/components/CopyToClipboard.svelte';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';
	import Sequence from '$lib/components/Scopes/Sequence.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';

	let toggleAutoTodo = false;
	let toggleAddInfo = false;
</script>

<script>
	import {
		storeScopesDocumentation,
		storeSortedGroupedSequenceScopes,
		ProjectStore,
		projectStore
	} from '$lib/stores/projectStore';
	import { deepEqual, normalizeGroupsScopesToCompare } from '$lib/utils/comparison';
	import { sequence } from '@sveltejs/kit/hooks';

	let exportText;
	const flipDurationMs = 300;

	let moving = false;
	let reordered_steps = false;
	let updatedSequence = false;
	let confirmUpdateStoreSequence = false;

	let forkedScopes;
	let scopesDocumentation;
	let groupedSequenceScopes;

	({ groupedSequenceScopes, forkedScopes, scopesDocumentation } =
		projectStore.sortScopesByPriority());

	$: {
		if ($storeSortedGroupedSequenceScopes && !moving) {
			updatedSequence =
				!deepEqual(
					normalizeGroupsScopesToCompare($storeSortedGroupedSequenceScopes.discovery.indispensable),
					normalizeGroupsScopesToCompare(groupedSequenceScopes.discovery.indispensable)
				) ||
				!deepEqual(
					normalizeGroupsScopesToCompare($storeSortedGroupedSequenceScopes.discovery.niceToHave),
					normalizeGroupsScopesToCompare(groupedSequenceScopes.discovery.niceToHave)
				) ||
				!deepEqual(
					normalizeGroupsScopesToCompare($storeSortedGroupedSequenceScopes.delivery.indispensable),
					normalizeGroupsScopesToCompare(groupedSequenceScopes.delivery.indispensable)
				) ||
				!deepEqual(
					normalizeGroupsScopesToCompare($storeSortedGroupedSequenceScopes.delivery.niceToHave),
					normalizeGroupsScopesToCompare(groupedSequenceScopes.delivery.niceToHave)
				);
		}
		if (
			(!$storeSortedGroupedSequenceScopes['discovery']['indispensable'].length &&
				!$storeSortedGroupedSequenceScopes['discovery']['niceToHave'].length &&
				!$storeSortedGroupedSequenceScopes['delivery']['indispensable'].length &&
				!$storeSortedGroupedSequenceScopes['delivery']['niceToHave'].length) ||
			(!moving && updatedSequence && confirmUpdateStoreSequence)
		) {
			$storeSortedGroupedSequenceScopes = groupedSequenceScopes;
			updatedSequence = false;
			confirmUpdateStoreSequence = false;
		}
	}

	$: checkList = {
		name: 'Tasks',
		items: [
			{
				name: 'steps_sequence',
				optional: true,
				text: 'You can re-order the steps of the sequence',
				checked: reordered_steps
			}
		]
	};

	let scopes = [...scopesDocumentation.solution, ...forkedScopes];

	let successfullyCopied = undefined;
	const handleSuccessfullyCopied = (e) => {
		successfullyCopied = true;
	};

	const handleFailedCopy = () => {
		successfullyCopied = false;
	};
</script>

<NavigationScopes stepId="sequence" {checkList} optional={true}>
	<div slot="buttons">
		<label
			for="modal-export"
			class="btn btn-outline modal-button"
			on:click={() =>
				(exportText = projectStore.sequencesToText(
					$storeSortedGroupedSequenceScopes,
					scopes,
					toggleAddInfo,
					toggleAutoTodo
				))}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-4 h-4 mr-1"
				><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
					d="M192 312C192 298.8 202.8 288 216 288H384V160H256c-17.67 0-32-14.33-32-32L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48v-128H216C202.8 336 192 325.3 192 312zM256 0v128h128L256 0zM568.1 295l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 288H384v48h110.1l-39.03 39.03C450.3 379.7 448 385.8 448 392s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 319.6 578.3 304.4 568.1 295z"
				/></svg
			> Export To Text [Markdown]</label
		>
	</div>
</NavigationScopes>

<div
	class="sm:flex sm:flex-col md:flex md:flex-col w-full content-center items-center justify-center"
>
	<div
		class="flex flex-col align-middle justify-center content-center items-center xl:w-2/3 w-full p-2 "
	>
		<h1 class="flex flex-row align-middle content-center items-center text-center">
			Optimized execution sequence
			<br />{#if $projectStore.deadline}
				due {moment($projectStore.deadline).fromNow()}
			{/if}
			<!-- <label for="modal-about-sequence" class="cursor-pointer">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0
	512 512"
					class="w-5 h-5 ml-2"
					><path
						d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s13.1-32 32-32c17.1 0 32 14 32 32S273.1 400 256 400zM325.1 258L280 286V288c0 13-11 24-24 24S232 301 232 288V272c0-8 4-16 12-21l57-34C308 213 312 206 312 198C312 186 301.1 176 289.1 176h-51.1C225.1 176 216 186 216 198c0 13-11 24-24 24s-24-11-24-24C168 159 199 128 237.1 128h51.1C329 128 360 159 360 198C360 222 347 245 325.1 258z"
					/></svg
				></label
			> -->
		</h1>

		{#if updatedSequence}
			<div class="w-full rounded-md outline outline-2 outline-black bg-yellow-50 p-2">
				<div class="text-lg p-2">
					The sequence or the scope information below are different from the generated sequence.
				</div>
				<div class="flex justify-end">
					<label for="modal-update" class="btn btn-primary modal-button"> Update sequence</label>
				</div>
			</div>
		{/if}

		<Sequence
			bind:groupsScopes={$storeSortedGroupedSequenceScopes['discovery']['indispensable']}
			bind:reordered_steps
			bind:moving
			title="Discovery Indispensable"
			showMitigatorsForRiskyTasks
		/>
		<Sequence
			bind:groupsScopes={$storeSortedGroupedSequenceScopes['delivery']['indispensable']}
			bind:reordered_steps
			bind:moving
			title="Delivery Indispensable"
			showNotificationAboutForkedScopes
		/>
		<Sequence
			bind:groupsScopes={$storeSortedGroupedSequenceScopes['discovery']['niceToHave']}
			bind:reordered_steps
			bind:moving
			title="Discovery Nice-To-Have"
			showMitigatorsForRiskyTasks
		/>
		<Sequence
			bind:groupsScopes={$storeSortedGroupedSequenceScopes['delivery']['niceToHave']}
			bind:reordered_steps
			bind:moving
			title="Delivery Nice-To-Have"
			showNotificationAboutForkedScopes
		/>
	</div>
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
				exportText = projectStore.sequencesToText(
					$storeSortedGroupedSequenceScopes,
					scopes,
					toggleAddInfo,
					toggleAutoTodo
				);
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
				exportText = projectStore.sequencesToText(
					$storeSortedGroupedSequenceScopes,
					scopes,
					toggleAddInfo,
					toggleAutoTodo
				);
			}}
		/><label for="auto-number" class="mr-2">Put LATER* at the beginning of the tasks</label>
		<span class="flex label-text-alt"
			>(*experimentally in format used by <a href="https://logseq.com/" target="_blank">Logseq</a
			>)</span
		>
		<div class="divider" />

		<div style="white-space: pre-wrap;" class="w-full h-96 max-h-96 overflow-auto">
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
		<h3 class="font-bold text-lg">Do you want to get the updated sequence?</h3>
		<div class="modal-action">
			<label for="modal-update" class="btn">Cancel</label>
			<label
				for="modal-update"
				class="btn btn-primary"
				on:click={() => (confirmUpdateStoreSequence = true)}>Confirm</label
			>
		</div>
	</div>
</div>

<input type="checkbox" id="modal-about-sequence" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="font-bold text-lg">About the sequence</h3>
		<div class="max-h-96 overflow-y-auto">
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

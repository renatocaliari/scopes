<script>
	import { v4 as uuidv4 } from 'uuid';

	import { projectStore } from '$lib/stores/projectStore';
	import BadgeDependencies from '$lib/components/Scopes/BadgeDependencies.svelte';

	export let title;
	export let groupsScopes;
	export let showNotificationAboutForkedScopes = false;
	export let showMitigatorsForRiskyTasks = false;
	export let showNotificationAboutAutomatableTasks = true;
	export let showNotificationAboutDelegableTasks = true;

	let name = 'sequence' + uuidv4();

	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { fade } from 'svelte/transition';
	// notice - fade in works fine but don't add svelte's fade-out (known issue)
	import { cubicIn } from 'svelte/easing';

	const flipDurationMs = 300;
	let moving = false;
	let reordered = false;

	function handleDndConsider(e) {
		groupsScopes = e.detail.items;
		reordered = true;
		moving = true;
	}
	function handleDndFinalize(e) {
		groupsScopes = projectStore.generateSequence(e.detail.items);
		reordered = true;
		moving = false;
	}
	function proxyDndzone() {
		if (arguments[1]['items'].length > 1) {
			return dndzone.apply(null, arguments);
		}
		return;
	}

	function getEmoji(scope) {
		let emoji = '';
		if (scope.risky) {
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

<div class="w-full">
	{#if title && groupsScopes.length}
		<h3
			class="text-left items-start content-start justify-start w-full z-index:9999999 min-h-12 sticky top-0 bg-white bg-opacity-100"
		>
			{title}
		</h3>
	{/if}
	<section
		class="p-0 flex flex-col align-middle content-center items-center 
			justify-center w-full ml-2 pl-4 border-l-4 border-slate-300 z-index: 0"
		use:proxyDndzone={{
			items: groupsScopes,
			flipDurationMs,
			morphDisabled: false,
			type: name,
			dropTargetClasses: ['bg-green-50']
		}}
		on:consider={(e) => handleDndConsider(e)}
		on:finalize={(e) => handleDndFinalize(e)}
	>
		{#each groupsScopes as group, idxGroup (group.id)}
			<fieldset
				class="w-full justify-start flex flex-col p-2 m-2
					align-middle content-center "
				class:box={group.dependencyPackage}
				class:border-2={group.dependencyPackage}
				class:border-slate-200={group.dependencyPackage}
				class:card={group.dependencyPackage}
			>
				{#if group.dependencyPackage}
					<legend class="ml-4 p-2">Block with dependent scopes</legend>
				{/if}
				{#each group.items as scope, idx (scope.id)}
					{@const nextOne = group.items[idx + 1] ? group.items[idx + 1] : { name: '' }}
					<div class="m-2 pl-2 justify-center flex flex-col align-middle">
						<div class="flex flex-col">
							<div class="flex flex-row justify-between w-full">
								<div
									class="flex flex-col align-middle text-left items-start content-start justify-start"
								>
									<div class="text-xl font-bold">
										{scope.order} -
										{getEmoji(scope)}
										{scope.name || scope.placeholder}
									</div>
									<div class="flex flex-row gap-2">
										{#if !scope.indispensable}
											<span class="badge badge-outline break-normal">Nice-to-have</span>
										{:else}
											<span class="badge badge-primary text-white break-normal">Indispensable</span>
										{/if}
										{#if scope.risky}
											<span class="badge badge-accent text-white break-normal">Risky</span>
										{/if}
									</div>
								</div>
								<div>
									<BadgeDependencies project={projectStore} scopes={group.items} {scope} />
								</div>
							</div>
							<div class="flex flex-col gap-0 p-0 m-0">
								{#if scope.forkedScopeId && showNotificationAboutForkedScopes}
									<div class="flex flex-col m-0 bg-yellow-50 mt-2 p-2 border-[1px]">
										At this step, do only what is needed and as little as possible, to enable doing
										the tasks of the next step.
										<div class="text-xs">
											Think about affordances or simulated ways to mimic the real behavior of the
											tasks.
											<br />
											In the world of software development you can think about dummy objects, fake objects,
											stubs and mocks.
										</div>
									</div>
								{:else if scope.risky && showMitigatorsForRiskyTasks}
									<div class="pb-2">
										{#each scope.items as item}
											<div class="flex m-0 bg-yellow-50 mt-2 p-2 border-[1px]">
												{#if item.risky}
													🚨
												{/if}
												{item.name}
											</div>
											<div class="flex flex-col align-middle">
												Actions to mitigate the risks of this task:
												{#each item.mitigators as mitigator}
													<div class="flex align-middle">
														<input type="checkbox" class="checkbox mr-2" />
														{mitigator.name}
													</div>
												{/each}
											</div>
										{/each}
									</div>
								{:else}
									{#if typeof group.indispensableTasks !== 'undefined'}
										<div class="py-2">
											{#if group.indispensableTasks === true}
												<span class="font-bold">Indispensable tasks:</span>
											{:else if group.indispensableTasks === false}
												<span class="font-bold">Nice-to-have tasks:</span>
											{/if}
										</div>
									{/if}
									<div class="pb-2">
										{#each scope.items as item}
											<div class="flex flex-col">
												<div class="flex ">
													<input type="checkbox" class="checkbox mr-2" />
													{#if item.risky}
														🚨
													{/if}
													{item.name}
												</div>
												{#if item.automatable && item.automatableDescription && showNotificationAboutAutomatableTasks}
													<div class="flex flex-col bg-yellow-50 my-2 p-2 border-[1px]">
														Try to automate it:
														<div class="text-xs">{item.automatableDescription}</div>
													</div>
												{/if}
												{#if item.delegable && item.delegableDescription && showNotificationAboutDelegableTasks}
													<div class="flex flex-col bg-yellow-50 my-2 p-2 border-[1px]">
														Try to delegate it to:
														<div class="text-xs">{item.delegableDescription}</div>
													</div>
												{/if}
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

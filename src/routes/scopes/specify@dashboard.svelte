<script>
	import Scope from '$lib/components/Scopes/Scope.svelte';
	import ToggleClassificationOnOff from '$lib/components/Scopes/ToggleClassificationOnOff.svelte';
	import Items from '$lib/components/Scopes/Items.svelte';
	import { projectStore } from '$lib/stores/projectStore';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';

	let fieldAddText;

	let sortedScopes = $projectStore['scopes'].filter(
		(scope) => scope.id !== 'bucket' && scope.items.length > 0
	);

	$: {
		$projectStore,
			(sortedScopes = $projectStore['scopes'].filter(
				(scope) => scope.id !== 'bucket' && scope.items.length > 0
			));
	}

	let checklist;
	$: checkList = {
		items: [
			{
				name: 'specify',
				optional: false,
				text: 'Specify every risky, automatable or delegable task',
				checked: sortedScopes.some((scope) =>
					scope.items.some(
						(item) =>
							item.mitigators.length || item.automatableDescription || item.delegableDescription
					)
				)
			}
		]
	};

	let visibleScope;
	if (!visibleScope) {
		visibleScope = sortedScopes[0];
	}

	function addItemMitigator(scope, item, value) {
		projectStore.itemAddMitigator(scope, item, value);
		$projectStore = $projectStore;
	}
</script>

<NavigationScopes stepId="specify" optional={true} {checkList} />

<div
	class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 grid-flow-row gap-4 place-content-around"
>
	{#each $projectStore['scopes'].filter((scope) => scope.id !== 'bucket' && scope.items.length > 0 && scope.items.some((item) => item.risky || item.automatable || item.delegable)) as scope, idx}
		<div id={'scope' + idx} class="w-full justify-between items-center">
			<div class="flex flex-row justify-center items-center align-middle gap-2">
				<Scope bind:scope itemsScopeModal={scope.items} width="w-96" editTitle>
					<div slot="body">
						{#each scope.items.filter((item) => item.risky || item.automatable || item.delegable) as item}
							<div class="flex min-h-12 align-middle items-center">👉 {item.name}</div>
							<div class="ml-2 pl-2 border-l-4 border-slate-300 text-sm">
								{#if item.risky}
									<div class="">
										<div class="flex w-full justify-center badge">Risky</div>
										<div>
											<div class="my-2">
												What specific actions could mitigate the risks of this task? (kinds of
												actions: <a href="https://en.wikipedia.org/wiki/Research">research</a>,
												<a href="https://en.wikipedia.org/wiki/Proof_of_concept">proof of concept</a
												>,
												<a href="https://en.wikipedia.org/wiki/Spike_(software_development)"
													>spike</a
												>, etc) <br /><br />
												Type each detailed action:
											</div>
											<Items
												bind:scope
												bind:items={item.mitigators}
												maxHeight=""
												allowEditItem
												allowAddItem
												allowRemoveItem
												dragAndDrop={true}
												placeholderAddItem="type here and press ENTER"
												on:addItem={(e) => {
													addItemMitigator(scope, item, e.detail.value, true);
												}}
											/>
										</div>
									</div>
								{/if}
								{#if item.automatable}
									<div class="flex w-full justify-center badge">Automatable</div>
									<div class="p-2">
										<label for="txtAutomatableDescription"
											>How could you try to automate it? (tools, process, etc)</label
										>
										<textarea
											id="txtAutomatableDescription"
											class="textarea textarea-bordered w-full h-full"
											placeholder="Write here..."
											bind:value={item.automatableDescription}
										/>
									</div>
								{/if}
								{#if item.delegable}
									<div class="flex w-full justify-center badge">Delegable</div>

									<div class="p-2">
										<label for="txtDelegableDescription"
											>Who could you try to delegate this to?</label
										>
										<textarea
											id="txtDelegableDescription"
											class="textarea textarea-bordered w-full h-full"
											placeholder="Write here..."
											bind:value={item.delegableDescription}
										/>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</Scope>
			</div>
			<!-- <div class="w-12 mr-4">
				{#if sortedScopes[idx + 1]}
					<a
						href="#{'slide' + (idx + 1)}"
						class="btn btn-circle"
						on:click={() => (visibleScope = sortedScopes[idx + 1])}>❯</a
					>
				{/if}
			</div> -->
		</div>
	{/each}
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
	}
</style>
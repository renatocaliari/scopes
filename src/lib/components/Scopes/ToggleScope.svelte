<script>
	import { createEventDispatcher } from 'svelte';

	export let scope;
	export let checked = false;
	export let checkText = '';

	const dispatch = createEventDispatcher();

	function checkItem(scope, checked) {
		dispatch('checkItem', {
			item: scope,
			checked: checked
		});
	}
</script>

{checked}
<div class="form-control">
	<label class="label cursor-pointer">
		<span class="label-text mr-2"
			><div class="badge" class:badge-outline={!checked}>{checkText}</div></span
		>
		<input
			type="checkbox"
			class="toggle toggle-primary"
			{checked}
			on:change={(e) => checkItem(scope, e.target.checked)}
		/>
	</label>
</div>

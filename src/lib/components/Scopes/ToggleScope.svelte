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

<div class="form-control place-content-around w-full">
	<label class="label cursor-pointer">
		<span class="label-text mr-2">{checkText}</span>
		<input
			type="checkbox"
			class="toggle toggle-primary"
			{checked}
			on:change={(e) => checkItem(scope, e.target.checked)}
		/>
	</label>
</div>

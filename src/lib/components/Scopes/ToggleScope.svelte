<script>
	import { createEventDispatcher } from 'svelte';

	export let scope;
	export let checked = false;
	export let checkText = '';
	export let cssClass = 'toggle-primary';

	const dispatch = createEventDispatcher();

	function checkItem(e, scope, checked) {
		dispatch('checkItem', {
			element: e.currentTarget,
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
			class="toggle {cssClass}"
			{checked}
			on:change={(e) => checkItem(e, scope, e.currentTarget.checked)}
		/>
	</label>
</div>

<script>
	export let label;
	// need to include name,
	// this will be the key in your json
	export let name;
	export let type;
	export let placeholder;
	export let _class = 'input input-bordered w-full max-w-xs';
	export let value = '';

	if (name === 'email') {
		console.log('email:', value);
	}

	function handleChange(event) {
		value = event.target.value;
	}

	function typeAction(node) {
		node.type = type;
	}
</script>

<div class="text-left">
	<label for={name} class="label">
		<span class="label-text">{label}</span>
		<span class="label-text-alt" />
	</label>
	<input
		id={name}
		{name}
		{placeholder}
		class={_class}
		{...$$restProps}
		use:typeAction
		bind:value
		on:keydown={handleChange}
	/>
	<label for={name} class="label">
		<span class="label-text-alt" />
		<span class="label-text-alt" />
	</label>
</div>

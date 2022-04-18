<script>
	export let label;
	// need to include name,
	// this will be the key in your json
	export let name;
	export let _class = 'select select-bordered w-full max-w-xs';
	export let selectItemText = 'Pick one';

	const { ...outro } = $$restProps;

	let restProps = Object.entries($$restProps);
	for (const [i, [key, value]] of restProps.entries()) {
		if (key === 'selectItemText') {
			restProps = restProps.slice(i, 1);
			break;
		}
	}
</script>

<div class="text-left">
	<label for={name} class="label">
		<span class="label-text">{label}</span>
		<span class="label-text-alt" />
	</label>
	<select id={name} {name} class={_class} {restProps}>
		{#if selectItemText}
			<option disabled selected>{selectItemText}</option>
		{/if}
		<slot />
	</select>
	<label for={name} class="label">
		<span class="label-text-alt" />
		<span class="label-text-alt" />
	</label>
</div>

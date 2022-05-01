<script>
	import { browser } from '$app/env';

	if (browser) {
		goto('/scopes/dump	');
	}
	import { goto } from '$app/navigation';
</script>

This template uses and has:
<ul>
	<li>DaisyUI & TailwindCSS</li>
	<li>svelte-actions: https://github.com/sw-yx/svelte-actions</li>
	<li>svelte-mount: https://github.com/ghostdevv/svelte-mount</li>
	<li>uuid v4: to generate id</li>
</ul>

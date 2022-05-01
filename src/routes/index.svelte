<script>
	import { browser } from '$app/env';

	if (browser) {
		goto('/scopes/dump	');
	}
	import { goto } from '$app/navigation';
</script>

Here will be a landing page :)

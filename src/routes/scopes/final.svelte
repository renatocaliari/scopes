<script>
	import ToolEraser from '$lib/components/Scopes/ToolEraser.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import { projectStore, storeSortedScopesDocumentation } from '$lib/stores/projectStore';
</script>

<NavigationScopes currentStep={6} />

<div class="w-full h-[calc(100vh-250px)]">
	<ToolEraser content={projectStore.documentationToText($storeSortedScopesDocumentation)} />
</div>

<style>
</style>

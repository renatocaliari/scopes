<script>
	import ReactAdapter from '$lib/components/ReactAdapter.svelte';
	import NavigationScopes from '$lib/components/Scopes/NavigationScopes.svelte';
	import { projectStore, storeScopesDocumentation } from '$lib/stores/projectStore';
</script>

<NavigationScopes stepId="workspace" />

<!-- <div class="w-full h-[calc(100vh-250px)]">
	<ReactAdapter
		el={Button}
		class="mui-btn"
		children="Hello"
		variant="contained"
		color="primary"
		onClick={() => alert('hello world!')}
	/>

	<Renderer
		page={state.page}
		pageState={state.pageState}
		{shapeUtils}
		onPan={handlePan}
		onPinch={handlePinch}
		onPointCanvas={handleCanvasPoint}
		onPointShape={handleShapePoint}
		onPointerMove={handlePointerMove}
		onPointerUp={handlePointerUp}
		onHoverShape={handleShapeHover}
		onUnhoverShape={handleShapeUnhover}
		onShapeChange={handleShapeChange}
		{meta}
		{theme}
	/>
</div> -->
<style>
</style>

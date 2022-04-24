<script>
	export let currentBtn = 1;
	export let activeBtns = [1, 2, 3, 4];
</script>

<div class="btn-group justify-center my-4">
	<a
		class="btn"
		class:btn-active={currentBtn == 1}
		class:btn-disabled={!activeBtns.includes(1)}
		href="/scopes/dump">Dump & Cluster</a
	>
	<a
		class="btn"
		class:btn-active={currentBtn == 2}
		class:btn-disabled={!activeBtns.includes(1)}
		href="/scopes/dependencies">Dependencies</a
	>
	<a
		class="btn"
		class:btn-active={currentBtn == 3}
		class:btn-disabled={!activeBtns.includes(1)}
		href="/scopes/unknowns">Unknowns</a
	>
	<a
		class="btn"
		class:btn-active={currentBtn == 4}
		class:btn-disabled={!activeBtns.includes(1)}
		href="/scopes/sequence">Sequence</a
	>
	<a
		class="btn"
		class:btn-active={currentBtn == 5}
		class:btn-disabled={!activeBtns.includes(1)}
		href="/scopes/patternLanguage">Pattern Language</a
	>
</div>

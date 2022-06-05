<script>
	import WhatAreScopes from '$lib/components/Scopes/WhatAreScopes.svelte';
</script>

<svelte:head>
	<title>How it works? | {import.meta.env.VITE_APP_NAME}</title>
</svelte:head>

<h1>How it works?</h1>
<h2>Single Person or Multidisciplinary team</h2>
<div>
	{import.meta.env.VITE_APP_NAME} expects the people necessary for the execution and completion of the
	project to be available and focused on it.
</div>
<div>It could be a single person executing all scopes or a single multidisciplinary team.</div>

<h2>First step: Dump & Cluster</h2>
<div>
	{import.meta.env.VITE_APP_NAME} has 7 steps, the first step mandatory and the others recommended.
</div>
<div>
	At that step, you need to dump all tasks you think is necessary to complete a project. After that,
	you need to cluster the tasks in scopes.
</div>

<h3>What are Scopes?</h3>
<WhatAreScopes />

<h2>Remaining steps</h2>
In the other steps you'll need to classify:
<ul>
	<li>which scopes are nice-to-have? Otherwise, the scopes are indispensable to execute.</li>
	<li>which tasks are risky?</li>
	<li>
		which tasks are nice-to-have? You can have an indispensable scope with some nice-to-have tasks,
		or a nice-to-have scope with indispensable tasks, if you decided to execute this scope.
	</li>
	<li>which tasks are automatable?</li>
	<li>which tasks are delegable?</li>
</ul>

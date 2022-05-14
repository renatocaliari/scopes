<svelte:head>
	<title>Scopefully</title>
</svelte:head>

<header class="center">
	<div class="container">
		<hgroup>
			<sub>beta v0.0.2</sub>
			<h1>Scopefully</h1>
			<h3>The tool to help you understand the execution of your next project before start it.</h3>
		</hgroup>
		<p>
			<a role="button" href="/scopes/dump" sveltekit:prefetch>Get Started for FREE</a>
			<a role="button" class="contrast outline" href="/about" sveltekit:prefetch>About</a>
		</p>
		<p>
			All the information will be stored locally in your browser. <br />You can export the final
			result.
		</p>
	</div>
</header>
<section style="padding-bottom: 100px;" />

<div class="container center">
	<h2>How Scopefully helps you</h2>
</div>

<!-- <p class="mt-2 text-lg text-center text-gray-600">
				Check out our list of awesome features below.
			</p> -->
<div class="grid">
	<div>
		<article>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				style="width:24px; height:24px;"
				viewBox="0 0 512 512"
				stroke-width="1.5"
				stroke="currentColor"
				fill="white"
				stroke-opacity=""
				stroke-linecap="round"
				stroke-linejoin="round"
				><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
				<path
					d="M232.5 5.171C247.4-1.718 264.6-1.718 279.5 5.171L498.1 106.2C506.6 110.1 512 118.6 512 127.1C512 137.3 506.6 145.8 498.1 149.8L279.5 250.8C264.6 257.7 247.4 257.7 232.5 250.8L13.93 149.8C5.438 145.8 0 137.3 0 127.1C0 118.6 5.437 110.1 13.93 106.2L232.5 5.171zM498.1 234.2C506.6 238.1 512 246.6 512 255.1C512 265.3 506.6 273.8 498.1 277.8L279.5 378.8C264.6 385.7 247.4 385.7 232.5 378.8L13.93 277.8C5.438 273.8 0 265.3 0 255.1C0 246.6 5.437 238.1 13.93 234.2L67.13 209.6L219.1 279.8C242.5 290.7 269.5 290.7 292.9 279.8L444.9 209.6L498.1 234.2zM292.9 407.8L444.9 337.6L498.1 362.2C506.6 366.1 512 374.6 512 383.1C512 393.3 506.6 401.8 498.1 405.8L279.5 506.8C264.6 513.7 247.4 513.7 232.5 506.8L13.93 405.8C5.438 401.8 0 393.3 0 383.1C0 374.6 5.437 366.1 13.93 362.2L67.13 337.6L219.1 407.8C242.5 418.7 269.5 418.7 292.9 407.8V407.8z"
				/></svg
			>
			<h4 class="text-xl font-medium text-gray-700">Discover scopes</h4>
			<footer>
				<p class="grow text-base text-center text-gray-500">
					Freely, dump all you think is needed to do or solve and cluster the items in scopes.
				</p>
			</footer>

			<!-- viewBox="0 0 512 512" -->
		</article>
	</div>

	<div>
		<article>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				style="width:24px; height:24px;"
				stroke-width="1.5"
				stroke="currentColor"
				fill="white"
				stroke-opacity=""
				stroke-linecap="round"
				stroke-linejoin="round"
				><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
					d="M0 96C0 60.65 28.65 32 64 32H448C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96zM64 416H224V160H64V416zM448 160H288V416H448V160z"
				/></svg
			>
			<h4 class="text-xl font-medium text-gray-700 text-center">Indispensable or Nice-to-have</h4>
			<footer>
				<p class="grow text-base text-center text-gray-500">
					Separate the indispensable scopes and tasks from the nice-to-have ones.
				</p>
			</footer>
		</article>
	</div>
</div>

<footer />

<style>
	.center {
		text-align: center;
	}

	h1 {
		font-size: 80px;
	}
	h2 {
		font-size: 44px;
	}
	h3 {
		font-size: 24px;
	}
</style>

<script>
	// import mixpanel from 'mixpanel-browser';

	let mixpanel = {
		track: () => {}
	};
</script>

<svelte:head>
	<title>Scopefully</title>
</svelte:head>

<div class="flex flex-col justify-center items-center">
	<div class="hero min-h-fit sm:mt-24">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-8xl mb-2 font-bold">Scopefully</h1>
				<span class="text-3xl">(Beta v0.0.1)</span>
				<p class="text-2xl">
					The tool to help you understand the execution of your next project before start it.
				</p>
				<a href="/scopes/dump" class="btn btn-primary">Get Started for FREE</a>
				<a href="/about" class="btn btn-outline ml-4">About</a>

				<p class="text-lg">
					All the information will be <br />stored locally in your browser. <br /><br /> You can export
					the final result.
				</p>
			</div>
		</div>
	</div>

	<!-- Section 1 -->
	<section class="py-20 bg-white">
		<div class="container max-w-6xl mx-auto">
			<h2 class="text-4xl font-bold tracking-tight text-center">How Scopefully helps you</h2>
			<!-- <p class="mt-2 text-lg text-center text-gray-600">
				Check out our list of awesome features below.
			</p> -->
			<div class="grid grid-cols-4 gap-8 mt-10 sm:grid-cols-8 lg:grid-cols-12 sm:px-8 xl:px-0">
				<div
					class="relative flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 overflow-hidden bg-gray-100 sm:rounded-xl"
				>
					<div class="p-3 text-white bg-primary rounded-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-8 h-8"
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

						<!-- viewBox="0 0 512 512" -->
					</div>
					<h4 class="text-xl font-medium text-gray-700">Discover scopes</h4>
					<p class="grow text-base text-center text-gray-500">
						Freely, dump all you think is needed to do or solve and cluster the items in scopes.
					</p>
				</div>

				<div
					class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl"
				>
					<div class="p-3 text-white bg-primary rounded-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							class="w-8 h-8"
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
					</div>
					<h4 class="text-xl font-medium text-gray-700 text-center">
						Indispensable or Nice-to-have
					</h4>
					<p class="grow text-base text-center text-gray-500">
						Separate the indispensable scopes and tasks from the nice-to-have ones.
					</p>
				</div>

				<div
					class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl"
				>
					<div class="p-3 text-white bg-primary rounded-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							class="w-8 h-8"
							stroke-width="1.5"
							stroke="currentColor"
							fill="white"
							stroke-linecap="round"
							stroke-linejoin="round"
							><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
								d="M256 303.1c26.5 0 48-21.5 48-48S282.5 207.1 256 207.1S208 229.5 208 255.1S229.5 303.1 256 303.1zM213.6 188L142.7 74.71C132.5 58.41 109.9 54.31 95.25 66.75c-44.94 38.1-76.19 91.82-85.17 152.8C7.266 238.7 22.67 255.8 42.01 255.8h133.8C175.8 227.2 191 202.3 213.6 188zM416.8 66.75c-14.67-12.44-37.21-8.338-47.41 7.965L298.4 188c22.6 14.3 37.8 39.2 37.8 67.8h133.8c19.34 0 34.74-17.13 31.93-36.26C492.9 158.6 461.7 104.8 416.8 66.75zM298.4 323.5C286.1 331.2 271.6 335.9 256 335.9s-30.1-4.701-42.4-12.4L142.7 436.9c-10.14 16.21-4.16 38.2 13.32 45.95C186.6 496.4 220.4 504 256 504s69.42-7.611 100-21.18c17.48-7.752 23.46-29.74 13.32-45.95L298.4 323.5z"
							/></svg
						>
					</div>
					<h4 class="text-xl font-medium text-gray-700">Risky Unknowns</h4>
					<p class="grow text-base text-center text-gray-500">
						Highlight scopes with risky unknowns vs routine work
					</p>
				</div>

				<div
					class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl"
				>
					<div class="p-3 text-white bg-primary rounded-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 512"
							class="w-8 h-8 "
							stroke-width="1.5"
							stroke="currentColor"
							fill="white"
							stroke-linecap="round"
							stroke-linejoin="round"
							><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
								d="M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z"
							/></svg
						>
					</div>
					<h4 class="text-xl font-medium text-gray-700">Dependencies</h4>
					<p class="grow text-base text-center text-gray-500">Set dependencies among the scopes.</p>
				</div>

				<div
					class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl"
				>
					<div class="p-3 text-white bg-primary rounded-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							class="w-8 h-8 "
							stroke-width="1.5"
							stroke="currentColor"
							fill="white"
							stroke-linecap="round"
							stroke-linejoin="round"
							><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
								d="M320 192c0 17.69 14.31 31.1 32 31.1L416 224c17.69 0 32-14.31 32-32s-14.31-32-32-32V63.98c0-11.19-5.844-21.53-15.38-27.34c-9.531-5.781-21.41-6.188-31.34-1.062l-32 16.59c-15.69 8.125-21.81 27.44-13.69 43.13C329.3 106.3 340.4 112.6 352 112.6V160C334.3 160 320 174.3 320 192zM392 255.6c-48.6 0-88 39.4-88 88c0 36.44 22.15 67.7 53.71 81.07l-7.682 8.004c-10.72 11.16-10.34 28.88 .8125 39.56C356.3 477.4 363.3 480 370.2 480c7.344 0 14.72-2.875 20.19-8.625c69.61-72.53 89.6-85.39 89.6-127.8C480 294.1 440.6 255.6 392 255.6zM392 367.6c-13.23 0-24-10.77-24-24s10.77-24 24-24s24 10.77 24 24S405.2 367.6 392 367.6zM216 320.3c-8.672 0-17.3 3.5-23.61 10.38L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-11.95-13.01-32.2-13.91-45.22-1.969c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C231.5 323.1 223.7 320.3 216 320.3z"
							/></svg
						>
					</div>
					<h4 class="text-xl font-medium text-gray-700">Sequence of execution</h4>
					<p class="grow text-base text-center text-gray-500">
						Discover an optimal sequence to execute your scopes based on previous steps. Scopefully
						do that automatically. You can export to text in markdown format.
					</p>
				</div>

				<div
					class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl"
				>
					<div class="p-3 text-white bg-primary rounded-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
							class="w-8 h-8 "
							stroke-width="1.5"
							stroke="currentColor"
							fill="white"
							stroke-linecap="round"
							stroke-linejoin="round"
							><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
								d="M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z"
							/></svg
						>
					</div>
					<h4 class="text-xl font-medium text-gray-700">Documentation</h4>
					<p class="grow text-base text-center text-gray-500">
						Create a documentation based on the scopes and tasks.
					</p>
				</div>
			</div>
		</div>
	</section>
</div>

<div class="flex flex-col justify-center items-center">
	<div class="text-2xl leading-relaxed sm:w-4/5 p-4">
		<h2 class="text-4xl font-bold tracking-tight text-center">
			Scopefully helps you speed up execution of a project, slowing down the moment of structuring
			how it will be carried out.
		</h2>
		<div>
			Accelerating or skipping the mapping of a project to be executed causes many obstacles to be
			discovered only later, blocking execution, or many tasks needing to be re-planned or redone.
			That is, you end up delaying the entire project or not being able to complete it in the
			desired period.
		</div>

		<h2 class="text-4xl font-bold tracking-tight text-center">
			For which cases can you use Scopefully?
		</h2>
		<div>
			You can use it to things like:
			<ul>
				<li>
					<span class="bg-accent p-0.5 text-white">shape</span> your next
					<span class="bg-primary p-0.5 text-white">project</span>
				</li>
				<li>
					<span class="bg-accent p-0.5 text-white">plan</span> the
					<span class="bg-primary p-0.5 text-white">next cycle of development</span> of your digital
					product
				</li>
				<li>
					<span class="bg-accent p-0.5 text-white">plan</span> the
					<span class="bg-primary p-0.5 text-white">next cycle of discovery</span> of your digital product
				</li>
				<li>
					<span class="bg-accent p-0.5 text-white">define</span> the next
					<span class="bg-primary p-0.5 text-white">sprint</span> of SCRUM
				</li>
				<li>
					<span class="bg-accent p-0.5 text-white">plan</span>
					<span class="bg-primary p-0.5 text-white">projects</span> of Marketing, Sales, Development,
					Design, Data, etc
				</li>
				<li>
					<span class="bg-accent p-0.5 text-white">plan</span> the next cycle of your
					<span class="bg-primary p-0.5 text-white">personal tasks</span>, be it for your week,
					month, etc
				</li>
				<li><span class="bg-primary p-0.5 text-white">whatever</span> you want</li>
			</ul>
		</div>
		<h2 class="text-4xl font-bold tracking-tight text-center">Export to Text [Markdown]</h2>
		<div>
			Export the results of sequence and documentation to text in markdown format. So, you can paste
			it on you note taking tool like <a href="https://logseq.com/" target="_blank">Logseq</a>,
			<a href="https://obsidian.md/" target="_blank">Obsidian</a>
			or <a href="https://roamresearch.com/" target="_blank">Roam</a>.
		</div>

		<h2 class="text-4xl font-bold tracking-tight text-center">What Scopefully is not about?</h2>
		<div>
			Scopefully is not a tool to manager continuous & infinite backlog and tasks. For it you can
			use many other tools like Fibery.io, Clickup, Jira, Trello, etc.
		</div>
		<div class="mt-4">
			At the same time, Scopefully is an add-on. It fits in your workflow precisely by pushing you
			to choose what to do for the next project or cycle and discovery the best sequence to execute
			it.
		</div>
		<div class="mt-4">
			In the case you use other tool to manage all your tasks, instead of dump the items from you
			brain, you can copy the name of items in text format from the tool you use and import in the
			Scopefully. And, after you follow the steps on Scopefully, you can export the result.
		</div>
	</div>
</div>
<div class="mb-4" />

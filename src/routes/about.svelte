<svelte:head>
	<title>About | {import.meta.env.VITE_APP_NAME}</title>
</svelte:head>

<div class="flex flex-col justify-center items-center">
	<h1>About</h1>
	<div class="text-2xl sm:w-4/5  p-4">
		<span>
			Hi! I'm Cali (Renato Caliari) from Brazil.
			<span
				>I created <span class="font-bold">{import.meta.env.VITE_APP_NAME}</span> with the intention
				of making our projects planning and execution more intentional.
			</span>
		</span>
		<p>You can:</p>
		<ul>
			<li>
				know more about me on my personal site (pt-BR): <a href="https://renatocaliari.com"
					>https://renatocaliari.com</a
				>
			</li>
			<li>
				follow me or send me a DM on Twitter: <a href="https://twitter.com/renatocaliari/"
					>@renatocaliari</a
				>
			</li>
			<li>
				connect on LinkedIn: <a href="https://linkedin.com/in/renatocaliari/"
					>https://linkedin.com/in/renatocaliari/</a
				>
			</li>
			<li>
				follow me on medium (pt-BR): <a href="https://medium.com/@renatocaliari"
					>https://medium.com/@renatocaliari</a
				>. There I write about organizational culture, product development and lifestyle
			</li>
		</ul>

		<h2 class="mt-4 mb-4">Inspiration and credit</h2>
		This product was inspired by:
		<ul>
			<li>
				<a href="https://world.hey.com/rjs/">Ryan Singer</a>'s material on digital product
				development and <a href="https://basecamp.com/shapeup/3.3-chapter-12">Shape Up</a>.
			</li>
			<li>
				<a href="https://www.businessinsider.com/tim-ferriss-disss-system-to-learn-anything-2015-3"
					>DiSSS (Deconstruction, Selection, Sequencing and Stakes)</a
				>: a framework created by Tim Ferris, devised to help people master new information-based
				topics
			</li>
			<li>
				<a href="https://nesslabs.com/dust-procrastination"
					>DUST (Difficult, Unclear, Scary and Tedious)
				</a>: a simple method created by Graham Allcott that identifies why you are procrastinating.
			</li>
			<li>
				<a href="https://productivephysician.com/procrastinate-on-purpose/"
					>Procrastinate on Purpose</a
				> by Rory Vaden
			</li>
		</ul>

		<h2 class="mt-8 mb-4">Potential for the future</h2>
		<ul>
			<li>allow share a url for current project with other people</li>
			<li>
				allow users to create a personal account and save data in the cloud to manage several
				projects
			</li>
			<li>embed excalidraw to allow draw flows and shapes</li>
			<li>allow integration with zapier or make</li>
			<li>manage releases of scopes inspired by something like Story Map</li>
			<li>etc</li>
		</ul>
		<h2 class="mt-8 mb-4">Data & Analytics</h2>
		<p>Currently, all data is being stored in your own browser, using localStorage.</p>
		<!-- <p>
			I installed Mixpanel only to know about pages visited and actions executed, without any
			personal information. I don't track any other data.
		</p> -->
		<!-- <p>
			You can set your browser to <a
				href="https://support.google.com/chrome/answer/2790761?hl=en&co=GENIE.Platform%3DDesktop"
				>"Do Not Track"</a
			> anything.
		</p> -->
		<h2 class="mt-8 mb-4">Context and learning</h2>
		<p>To develop this tool I'm using Svelte + SvelteKit.</p>
		<p>
			I made this first version while relearning how to develop software and at the same time
			learning Svelte and SvelteKit, after many years without developing.
		</p>
		<p>There were mixed days of excitement, frustration, study, and trial and error.</p>
		<p>In recent years I worked as:</p>
		<ul>
			<li>Product Manager</li>
			<li>HR Manager</li>
			<li>Teacher on leadership</li>
			<li>
				Consultant helping organization in organizational design, culture and product management.
			</li>
		</ul>
	</div>
</div>

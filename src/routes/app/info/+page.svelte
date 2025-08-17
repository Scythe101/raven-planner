<script>
	import { authStore } from '$stores/AuthStore';
	import { goto } from '$app/navigation';

	import { userData, loadUserData, saveUserData } from '$stores/UserStore';
	let lastLoadedUserId;
	let hasInitializedSelection;
	let info = $derived($userData);

	$effect(() => {
		const currentUser = $authStore.currentUser;
		const isLoading = $authStore.isLoading;

		if (!currentUser && !isLoading) {
			// User logged out - clear everything
			if (lastLoadedUserId) {
				lastLoadedUserId = null;
				hasInitializedSelection = false;
			}
		} else if (currentUser && !isLoading) {
			if (lastLoadedUserId !== currentUser.uid) {
				lastLoadedUserId = currentUser.uid;
				hasInitializedSelection = false;
				loadUserData().catch((error) => {
					console.error('Failed to load user data:', error);
					lastLoadedUserId = null;
				});
			}
		}
	});

	$effect(() => {
		const newUserData = $userData;
		if (newUserData && !hasInitializedSelection) {
			info = structuredClone(newUserData); // Create a deep copy to avoid proxy issues
			hasInitializedSelection = true;
		}
	});
</script>

<h1>Here's some information you should know about this website!</h1>
<h2 class="mt-4">Tips</h2>
<p class="text-xl">
	I made this on a big monitor, so the text scaling is really big on chromebooks (and smaller
	screens in general). I recommend pressing ctrl + plus or minus until the website is at a good size
	for you, which should help resolve the problem until I actually get around to fixing it.
</p>
<p class="mt-2 text-xl">
	If you are in Conservatory or have <a
		target="_blank"
		class="text-sky-700 underline"
		href="http://www.ccaravensathletics.com/pe-credit.html">athletics PE credit</a
	>, press the "+" button in the top right corner of the course selection tiles to be able to add it
	to your schedule planner!
</p>
<img class="h-60" src="/add_course_example.png" alt="Example of + button" />

<h2 class="mt-4">Warnings</h2>
<p class="text-xl">
	This should not be taken as academic advice, it's just a tool to help you plan. If you are in need
	of academic help, <a
		target="_blank"
		class="text-sky-700 underline"
		href="https://sites.google.com/sduhsd.net/cca-counseling/home"
		>please reach out to a counselor</a
	>.
</p>
<p class="mt-2 text-xl">
	I cannot gurantee that my code will work 100% of the time, especially since this is my first time
	tackling a big project.
</p>
<p class="mt-2 text-xl">
	All the course profile information was copied directly from the <a
		target="_blank"
		class="text-sky-700 underline"
		href="https://sites.google.com/sduhsd.net/cca-counseling/home">counselors' website</a
	>, and some information may be dependent on the teacher.
</p>
<p class="mt-2 text-xl">
	Although the majority of the code was written by me, some of it was written with the help of (not
	directly by) AI. The exception to this is the course profiles, as I am not spending 16 hours
	painstakingly copying over 150+ course profiles.
</p>
<p class="mt-2 text-xl">
	This doesn't stop you from putting courses in the wrong slot (ie English 9 in sophomore year) so
	look at the prerequisites in the course profiles.
</p>

<h2 class="mt-4">Technical Info (feel free to skip if you're not interested)</h2>
<p class="text-xl">
	The source code for this whole project is on <a
		target="_blank"
		href="https://github.com/Scythe101/raven-planner"
		class="text-sky-700 underline">GitHub</a
	>!
</p>
<p class="mt-2 text-xl">This took me around a month to build.</p>
<p class="mt-2 mb-4 text-xl">
	<a target="_blank" href="https://svelte.dev/" class="text-sky-700 underline">Svelte</a> is my
	framework of choice,
	<a target="_blank" href="https://firebase.google.com" class="text-sky-700 underline">Firebase</a>
	is the database and authentication,
	<a target="_blank" href="https://figma.com/" class="text-sky-700 underline">Figma</a>
	was used for designing, and
	<a target="_blank" href="https://code.visualstudio.com/" class="text-sky-700 underline">VS Code</a
	>
	and <a target="_blank" href="https://zed.dev/" class="text-sky-700 underline">Zed</a> are where this
	website was written.
</p>

{#if !info || info?.settings?.newUser}
	<button
		onclick={() => {
			info.settings.newUser = false;
			userData.set(info);
			saveUserData();
			goto('/app/selection');
		}}
		class="font-noto-serif shadow-sharp hover:shadow-sharp-hover mt-8 mb-4 ml-0.5 flex h-12 w-fit cursor-pointer flex-row items-center justify-center gap-3 rounded-full border-2 border-slate-900 bg-white px-4 py-2 text-lg font-semibold shadow-slate-900 transition-all duration-200 hover:-translate-0.5"
		>I understand and read everything, let me access the website.</button
	>
{/if}

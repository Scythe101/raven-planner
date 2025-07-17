<script>
	import { auth, db } from '$lib/firebase/firebase.client';
	import { authStore } from '../../../stores/AuthStore';
	import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let selection = $state({
		freshman: {
			fall: [],
			spring: []
		},
		sophomore: {
			fall: [],
			spring: []
		}
	});
	let courses = $state({
		cca: {
			"AP Calculus AB": {

			}
		}
	})
	let selectionEdit = $state(JSON.stringify(selection, null, 4));
	let courseEdit = $state(JSON.stringify(courses, null, 4));
	let isLoading = false;
	let isSaving = false;
	let isSaved = false;

	// Load data from Firestore when component mounts
	onMount(async () => {
		if ($authStore.currentUser) {
			await loadData();
		}
	});

	// Also load data when user becomes available
	$effect(() => {
        if ($authStore.currentUser && !$authStore.isLoading) {
            loadData();
        }
    });

	async function loadData() {
		if (isLoading) return; // Prevent multiple simultaneous loads
		isLoading = true;

		try {
			const userRef = doc(db, 'users', $authStore.currentUser.uid);
			const docSnap = await getDoc(userRef);
			const courseRef = collection(db, 'courses');
			const courseSnap = await getDocs(courseRef);

			if (docSnap.exists()) {
				const userData = docSnap.data();
				if (userData.selection) {
					selection = userData.selection;
					selectionEdit = JSON.stringify(selection, null, 4);
				}
			}
			if (courseSnap.exists()) {
				const courseData = courseSnap.data();
				if (courseData.cca) {
					courses = courseData.cca;
					courseEdit = JSON.stringify(courses, null, 4);
				}
			}
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			isLoading = false;
		}
	}

	async function save() {
		isSaving = true;
		isSaved = false;

		try {
			const userRef = doc(db, 'users', $authStore.currentUser.uid);
			await setDoc(
				userRef,
				{
					selection: selection
				},
				{ merge: true }
			);
			isSaving = true;
			console.log('Data saved successfully!');
		} catch (error) {
			console.error('Error saving user data:', error);
		} finally {
			isSaving = false;
			isSaved = true;
		}
		try {
			const courseRef = collection(db, 'courses');
			await setDoc(
				doc(courseRef, 'cca'),
				{
					"AP Calc": "test"
				},
				{merge:true}
			);
			isSaving = true;
		} catch (error) {
			console.error("Error saving courses", error);
		}finally {
			isSaving = false;
			isSaved = true;
		}
	}

	function parseSelection() {
		try {
			selection = JSON.parse(selectionEdit);
		} catch (error) {
			selection = "error parsing";
		}
	}

	function parseCourses() {
		try {
			courses = JSON.parse(courseEdit);
		} catch (error) {
			courses = "ERROR";
		}
	}
	// auto-save
	// let debounceTimeout;

	// function debounceSave() {
	//     clearTimeout(debounceTimeout);
	//     debounceTimeout = setTimeout(() => {
	//         save();
	//     }, 1000); // 1000ms debounce
	// }

	// // Autosave when testList changes (but not on initial load)
	// $: if ($authStore.currentUser && !isLoading && testList.length >= 0) {
	//     debounceSave();
	// }
</script>

<h1 class="font-bold text-7xl mt-4">Home</h1>

{#if $authStore.currentUser}
	<h2 class="text-3xl">Current User: {$authStore.currentUser.email}</h2>

	<div class="mt-8">
		<h3 class="text-2xl font-semibold mb-4">Test List:</h3>

		{#if isLoading}
			<p class="text-gray-600 mb-4">Loading data...</p>
		{/if}

		<ul class="list-disc pl-6 mb-4">
			<!-- {#each testList as item, index}
				<li class="mb-2">
					<input
						bind:value={testList[index]}
						class="border-2 px-2 py-1 mr-2"
						placeholder="Enter item"
					/>
					<button
						class="border-2 px-2 py-1 bg-red-200"
						on:click={() => (testList = testList.filter((_, i) => i !== index))}
					>
						Delete
					</button>
				</li>
			{/each} -->
		</ul>
		{#if !isLoading}
			<textarea class="h-96 w-96" bind:value={selectionEdit}></textarea>
			<textarea class="h-96 w-96" bind:value={courseEdit}></textarea>
		{/if}
		<button class="border-2 px-4 py-2 bg-blue-200" onclick={save}> Save </button>
		<button class="border-2 px-4 py-2 bg-green-200" onclick={parseSelection}> Parse Selection </button>
		<button class="border-2 px-4 py-2 bg-green-200" onclick={parseCourses}> Parse Courses </button>
		<p class="text-sm text-gray-600 mt-4">
			Selection data: {JSON.stringify(selection)}
		</p>
		<p class="text-sm text-gray-600 mt-4">
			Course data: {JSON.stringify(courses)}
		</p>
	</div>
{:else}
	<h2 class="text-3xl">Loading User...</h2>
{/if}
{#if isSaving}
	<svg
		class="mr-3 -ml-1 size-5 animate-spin text-black"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
		></circle><path
			class="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path></svg
	>
{:else if isSaved}
	<p class="text-2xl">Saved!</p>
{/if}
<div class="flex flex-col text-lg gap-4 my-4 w-auto">
	<a href="/app/profiles">Course Profiles</a>
	<a href="/app/selection">Course Selection</a>
	<a href="/app/requirements">Graduation Requirements</a>
</div>

<button class="border-2 px-4 py-2 bg-gray-200 mt-4" onclick={() => auth.signOut()}>
	Sign Out
</button>


{#if $authStore.currentUser}
	{#each Object.entries(selection) as [year, semesters]}
		<h3 class="text-lg font-black">{year}</h3>
		<div class="flex flex-row">
			{#each Object.entries(semesters) as [semester, courses]}
			<div class="flex-col">
				<h2 class="text-md font-semibold">{semester}</h2>
				
					{#each courses as course}
						<p>{course}</p>
					{/each}
			</div>
			{/each}
		</div>
	{/each}
{/if}
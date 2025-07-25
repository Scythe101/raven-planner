<script>
	import { auth, db } from '$lib/firebase/firebase.client';
	import { authStore } from '../../stores/AuthStore';
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
		'AP Calculus AB': {
			difficulty: 'hard',
			weighted: true,
			url: '/app/profiles/ap_calculus_ab',
			homework: '60-90',
			type: 'math',
			credits: 10,
			academic: true
		},
		'Integrated Math 3 Honors': {
			url: '/app/profiles/integrated_math_3_honors',
			difficulty: 'hard',
			academic: true,
			homework: '60-90',
			credits: 10,
			type: 'math',
			weighted: true
		},
		'Integrated Math 2': {
			difficulty: 'moderate',
			credits: 10,
			url: '/app/profiles/integrated_math_2',
			weighted: false,
			academic: true,
			homework: '60-90',
			type: 'math'
		},
		'Integrated Math 2 Honors': {
			type: 'math',
			credits: 10,
			homework: '60-90',
			difficulty: 'hard',
			academic: true,
			weighted: false,
			url: '/app/profiles/integrated_math_2_honors'
		},
		'AP Calculus BC': {
			homework: '60-90',
			academic: true,
			credits: 10,
			url: '/app/profiles/ap_calculus_bc',
			difficulty: 'hard',
			weighted: true,
			type: 'math'
		},
		'English 9 Honors': {
			academic: true,
			homework: '30-60',
			type: 'english',
			url: '/app/profiles/english_9_honors',
			credits: 10,
			difficulty: 'hard',
			weighted: false
		},
		'Advanced Math for Decision Making': {
			credits: 10,
			academic: true,
			homework: '0-30',
			weighted: false,
			url: '/app/profiles/advanced_math_for_decision_making',
			difficulty: 'easy',
			type: 'math'
		},
		'Advanced Topics in Math': {
			credits: 10,
			academic: true,
			homework: '0-30',
			weighted: false,
			url: '/app/profiles/advanced_topics_in_math',
			difficulty: 'moderate',
			type: 'math'
		},
		'AP Statistics': {
			credits: 10,
			academic: true,
			homework: '60-90',
			weighted: true,
			url: '/app/profiles/ap_statistics',
			difficulty: 'hard',
			type: 'math'
		},
		'Calculus 3': {
			credits: 5,
			academic: true,
			homework: '60-90',
			weighted: false,
			url: '/app/profiles/calculus_3',
			difficulty: 'hard',
			type: 'math'
		},
		'Integrated Math 1 Honors': {
			credits: 10,
			academic: true,
			homework: '60-90',
			weighted: false,
			url: '/app/profiles/integrated_math_1_honors',
			difficulty: 'hard',
			type: 'math'
		},
		'Integrated Math 1 Readiness': {
			credits: 10,
			academic: true,
			homework: '0-30',
			weighted: false,
			url: '/app/profiles/integrated_math_1_readiness',
			difficulty: 'easy',
			type: 'math'
		},
		'Integrated Math 1': {
			credits: 10,
			academic: true,
			homework: '60-90',
			weighted: false,
			url: '/app/profiles/integrated_math_1',
			difficulty: 'moderate',
			type: 'math'
		},
		'Integrated Math 3': {
			difficulty: 'moderate',
			credits: 10,
			url: '/app/profiles/integrated_math_3',
			weighted: false,
			academic: true,
			homework: '60-90',
			type: 'math'
		},
		'Integrated Math 1/2 Essentials': {
			difficulty: 'easy',
			credits: 10,
			url: '/app/profiles/integrated_math_1-2_essentials',
			weighted: false,
			academic: true,
			homework: '0-30',
			type: 'math'
		},
		'Intro to Calculus': {
			difficulty: 'moderate',
			credits: 10,
			url: '/app/profiles/intro_to_calculus',
			weighted: false,
			academic: true,
			homework: '30-60',
			type: 'math'
		},
		'Linear Algebra': {
			difficulty: 'hard',
			credits: 10,
			url: '/app/profiles/linear_algebra',
			weighted: false,
			academic: true,
			homework: '60-90',
			type: 'math'
		},
		'Personal Financial Literacy': {
			difficulty: 'easy',
			credits: 10,
			url: '/app/profiles/personal_financial_literacy',
			weighted: false,
			academic: true,
			homework: '0-30',
			type: 'math'
		},
		Statistics: {
			difficulty: 'moderate',
			credits: 10,
			url: '/app/profiles/statistics',
			weighted: false,
			academic: true,
			homework: '30-60',
			type: 'math'
		}
	});
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
		if (isLoading) return;
		isLoading = true;

		try {
			const userRef = doc(db, 'users', $authStore.currentUser.uid);
			const docSnap = await getDoc(userRef);
			const courseRef = doc(db, 'courses', 'cca');
			const courseSnap = await getDoc(courseRef);

			if (docSnap.exists()) {
				const userData = docSnap.data();
				if (userData.selection) {
					selection = userData.selection;
					selectionEdit = JSON.stringify(selection, null, 4);
				}
			}
			if (courseSnap.exists()) {
				const courseData = courseSnap.data();
				courses = courseData;
				courseEdit = JSON.stringify(courses, null, 4);
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

			const courseRef = doc(db, 'courses', 'cca');
			await setDoc(courseRef, courses, { merge: false });

			isSaving = true;
			console.log('Data saved successfully!');
		} catch (error) {
			console.error('Error saving user data:', error);
		} finally {
			isSaving = false;
			isSaved = true;
		}
	}

	function parseSelection() {
		try {
			selection = JSON.parse(selectionEdit);
		} catch (error) {
			selection = 'error parsing' + error;
		}
	}

	function parseCourses() {
		try {
			courses = JSON.parse(courseEdit);
		} catch (error) {
			courses = 'ERROR';
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

<h1 class="mt-4">Home</h1>

{#if $authStore.currentUser}
	<h2 class="text-3xl">Current User: {$authStore.currentUser.email}</h2>

	<div class="mt-8">
		<h3 class="mb-4 text-2xl font-semibold">Test List:</h3>

		{#if isLoading}
			<p class="mb-4 text-gray-600">Loading data...</p>
		{/if}

		<ul class="mb-4 list-disc pl-6">
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
			<textarea class="h-96 w-112" bind:value={courseEdit}></textarea>
		{/if}
		<button class="border-2 bg-blue-200 px-4 py-2" onclick={save}> Save </button>
		<button class="border-2 bg-green-200 px-4 py-2" onclick={parseSelection}>
			Parse Selection
		</button>
		<button class="border-2 bg-green-200 px-4 py-2" onclick={parseCourses}> Parse Courses </button>
		<p class="mt-4 text-sm text-gray-600">
			Selection data: {JSON.stringify(selection)}
		</p>
		<p class="mt-4 text-sm text-gray-600">
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

<button class="mt-4 border-2 bg-gray-200 px-4 py-2" onclick={() => auth.signOut()}>
	Sign Out
</button>

{#if $authStore.currentUser}
	{#each Object.entries(selection) as [year, semesters] (year)}
		<h3 class="text-lg font-black">{year}</h3>
		<div class="flex flex-row">
			{#each Object.entries(semesters) as [semester, courses] (semester)}
				<div class="flex-col">
					<h2 class="text-md font-semibold">{semester}</h2>

					{#each courses as course (course)}
						<p>{course}</p>
					{/each}
				</div>
			{/each}
		</div>
	{/each}
{/if}

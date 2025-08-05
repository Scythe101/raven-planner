<script>
	import { auth, db } from '$lib/firebase/firebase.client';
	import { authStore } from '../../stores/AuthStore';
	import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import {
		userData,
		loadUserData,
		loadingUserData,
		savingUserData,
		saveUserData
	} from '$stores/UserStore';
	import {
		courseData,
		loadCourseData,
		loadingCourseData,
		saveCourseData
	} from '$stores/CourseStore';

	let selection = $state(null);

	let courses = $state({});
	let selectionEdit = $derived(JSON.stringify(selection, null, 4));
	// let courseEdit = $derived(JSON.stringify(courses, null, 4));
	let courseEdit = $state({
		'Linear Algebra': {
			homework: '60-90',
			type: 'math',
			difficulty: 'hard',
			credits: 10,
			url: '/app/profiles/cca/linear_algebra',
			weighted: false,
			academic: true
		},
		'Integrated Math 2': {
			type: 'math',
			credits: 10,
			homework: '60-90',
			url: '/app/profiles/cca/integrated_math_2',
			difficulty: 'moderate',
			weighted: false,
			academic: true
		},
		'Calculus 3': {
			credits: 5,
			academic: true,
			url: '/app/profiles/cca/calculus_3',
			type: 'math',
			weighted: false,
			difficulty: 'hard',
			homework: '60-90'
		},
		'English 9 Honors': {
			difficulty: 'hard',
			weighted: false,
			credits: 10,
			url: '/app/profiles/cca/english_9_honors',
			homework: '30-60',
			academic: true,
			type: 'english'
		},
		'Advanced Topics in Math': {
			credits: 10,
			difficulty: 'moderate',
			homework: '0-30',
			weighted: false,
			academic: true,
			url: '/app/profiles/cca/advanced_topics_in_math',
			type: 'math'
		},
		'Integrated Math 1/2 Essentials': {
			url: '/app/profiles/cca/integrated_math_1-2_essentials',
			weighted: false,
			homework: '0-30',
			credits: 10,
			difficulty: 'easy',
			type: 'math',
			academic: true
		},
		'AP Calculus BC': {
			academic: true,
			weighted: true,
			homework: '60-90',
			credits: 10,
			url: '/app/profiles/cca/ap_calculus_bc',
			type: 'math',
			difficulty: 'hard'
		},
		'Integrated Math 3 Honors': {
			url: '/app/profiles/cca/integrated_math_3_honors',
			credits: 10,
			difficulty: 'hard',
			homework: '60-90',
			weighted: true,
			academic: true,
			type: 'math'
		},
		'Integrated Math 1': {
			weighted: false,
			academic: true,
			credits: 10,
			difficulty: 'moderate',
			type: 'math',
			url: '/app/profiles/cca/integrated_math_1',
			homework: '60-90'
		},
		'Integrated Math 1 Honors': {
			difficulty: 'hard',
			homework: '60-90',
			weighted: false,
			type: 'math',
			academic: true,
			credits: 10,
			url: '/app/profiles/cca/integrated_math_1_honors'
		},
		Statistics: {
			difficulty: 'moderate',
			academic: true,
			type: 'math',
			url: '/app/profiles/cca/statistics',
			homework: '30-60',
			weighted: false,
			credits: 10
		},
		'Integrated Math 2 Honors': {
			homework: '60-90',
			difficulty: 'hard',
			weighted: false,
			credits: 10,
			type: 'math',
			academic: true,
			url: '/app/profiles/cca/integrated_math_2_honors'
		},
		'Intro to Calculus': {
			academic: true,
			type: 'math',
			credits: 10,
			weighted: false,
			url: '/app/profiles/cca/intro_to_calculus',
			difficulty: 'moderate',
			homework: '30-60'
		},
		'AP Calculus AB': {
			homework: '60-90',
			type: 'math',
			weighted: true,
			url: '/app/profiles/cca/ap_calculus_ab',
			academic: true,
			difficulty: 'hard',
			credits: 10
		},
		'Integrated Math 3': {
			url: '/app/profiles/cca/integrated_math_3',
			credits: 10,
			difficulty: 'moderate',
			homework: '60-90',
			weighted: false,
			type: 'math',
			academic: true
		},
		'Advanced Math for Decision Making': {
			url: '/app/profiles/cca/advanced_math_for_decision_making',
			difficulty: 'easy',
			weighted: false,
			homework: '0-30',
			type: 'math',
			academic: true,
			credits: 10
		},
		'Personal Financial Literacy': {
			type: 'math',
			credits: 10,
			weighted: false,
			academic: true,
			difficulty: 'easy',
			url: '/app/profiles/cca/personal_financial_literacy',
			homework: '0-30'
		},
		'Integrated Math 1 Readiness': {
			academic: true,
			difficulty: 'easy',
			type: 'math',
			url: '/app/profiles/cca/integrated_math_1_readiness',
			homework: '0-30',
			credits: 10,
			weighted: false
		},
		'AP Statistics': {
			url: '/app/profiles/cca/ap_statistics',
			difficulty: 'hard',
			type: 'math',
			academic: true,
			weighted: true,
			credits: 10,
			homework: '60-90'
		}
	});
	let isSaving = false;
	let isSaved = false;

	let lastLoadedUserId = null;
	let hasInitializedSelection = false;
	let hasInitializedCourses = false;
	let lastCoursesLoaded = { '': '' };

	$effect(() => {
		if (!hasInitializedCourses) {
			loadCourseData().catch((err) => {
				console.error('error loading course data', err);
			});
			hasInitializedCourses = true;
		}
	});

	$effect(() => {
		const data = $courseData;
		if (data && Object.keys(data).length > 0 && lastCoursesLoaded != data) {
			courses = structuredClone(data);
			courseEdit = JSON.stringify(courses, null, 4);
			lastCoursesLoaded = data;
		}
	});

	// Single effect to handle all auth and data loading logic
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

	// Separate effect for updating UI when userData changes
	$effect(() => {
		const newUserData = $userData;
		if (newUserData?.selection && !hasInitializedSelection) {
			selection = structuredClone(newUserData.selection); // Create a deep copy to avoid proxy issues
			selectionEdit = JSON.stringify(selection, null, 4);
			hasInitializedSelection = true;
		}
	});

	function parseSelection() {
		try {
			const parsedSelection = JSON.parse(selectionEdit);
			selection = parsedSelection;
			userData.update((data) => ({
				...data,
				selection: selection
			}));
		} catch (error) {
			selection = 'error parsing' + error;
		}
	}

	function parseCourses() {
		try {
			const parsedCourses = JSON.parse(courseEdit);
			courseData.update(() => parsedCourses);
		} catch {
			courses = 'ERROR';
		}
	}
</script>

<h1 class="mt-4">Home</h1>

{#if $authStore.currentUser}
	<h2 class="text-3xl">Current User: {$authStore.currentUser.email}</h2>

	<div class="mt-8">
		<h3 class="mb-4 text-2xl font-semibold">Test List:</h3>

		{#if $loadingUserData}
			<p class="mb-4 text-gray-600">Loading data...</p>
		{/if}
		{#if !$loadingUserData}
			<textarea class="h-96 w-96" bind:value={selectionEdit}></textarea>
			<textarea class="h-96 w-112" bind:value={courseEdit}></textarea>
		{/if}
		<button
			class="border-2 bg-blue-200 px-4 py-2"
			onclick={() => {
				saveUserData();
				saveCourseData();
			}}
		>
			Save
		</button>
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

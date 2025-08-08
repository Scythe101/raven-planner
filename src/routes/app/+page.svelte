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

	let info = $state(null);

	let courses = $state({});
	let infoEdit = $derived(JSON.stringify(info, null, 4));
	let courseEdit = $derived(JSON.stringify(courses, null, 4));
	
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
			// courseEdit = JSON.stringify(courses, null, 4);
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
		if (newUserData && !hasInitializedSelection) {
			info = structuredClone(newUserData); // Create a deep copy to avoid proxy issues
			infoEdit = JSON.stringify(info, null, 4);
			hasInitializedSelection = true;
		}
	});

	function parseSelection() {
		try {
			const parsedInfo = JSON.parse(infoEdit);
			info = parsedInfo;
			userData.set(parsedInfo);
		} catch (error) {
			info = 'error parsing' + error;
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
	{#if !$loadingUserData && $userData.settings.newUser}
		<h1>Go to Info to learn more</h1>
	{/if}
	<div class="mt-8">
		<h3 class="mb-4 text-2xl font-semibold">Test List:</h3>

		{#if $loadingUserData}
			<p class="mb-4 text-gray-600">Loading data...</p>
		{/if}
		{#if !$loadingUserData}
			<textarea class="h-96 w-96" bind:value={infoEdit}></textarea>
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
			Selection data: {JSON.stringify(info)}
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

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

	let photoUrl = $state('');

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
			photoUrl = $authStore.currentUser.photoUrl
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

<svelte:head>
	<title>Raven Planner</title>
</svelte:head>
<h1 class="mt-4">Welcome!</h1>

{#if $authStore.currentUser}
	<div class="mt-8">
		<p class="text-2xl">I haven't made a home page yet, so use the sidebar to navigate to the other pages :)</p>
		<!-- <a href="/app/requirements" class="font-dm-serif-display italic text-3xl">Credits</a> -->
	</div>
	{:else}
	<h2 class="text-3xl">Loading...</h2>
{/if}
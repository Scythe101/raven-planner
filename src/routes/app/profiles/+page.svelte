<script>
	import { db } from '$lib/firebase/firebase.client';
	import CourseTileSkeleton from '../../../components/CourseTileSkeleton.svelte';
	import { authStore } from '$stores/AuthStore';
	import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import ProfilesCategory from '../../../components/ProfilesCategory.svelte';

	let courses = $state({});
	let isLoading = false;

	onMount(async () => {
		if ($authStore.currentUser) {
			await loadData();
		}
	});

	$effect(() => {
		if ($authStore.currentUser && !$authStore.isLoading) {
			loadData();
		}
	});

	async function loadData() {
		if (isLoading) return; // Prevent multiple simultaneous loads
		isLoading = true;

		try {
			const courseRef = doc(db, 'courses', 'cca');
			const courseSnap = await getDoc(courseRef);
			if (courseSnap.exists()) {
				const courseData = courseSnap.data();
				courses = courseData;
			}
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

{#if $authStore.currentUser && !isLoading && Object.keys(courses).length > 0}
	<ProfilesCategory {courses} type="math" />
	<ProfilesCategory {courses} type="english" />
{:else}
	<h1 class="mb-4">Math</h1>
	<div class="mr-8 mb-8 grid grid-cols-4 gap-3 2xl:grid-cols-6">
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
		<CourseTileSkeleton />
	</div>

	<h1 class="mb-4">English</h1>
{/if}

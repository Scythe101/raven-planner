<script>
	import { authStore } from '$stores/AuthStore';
	import { loadUserData, userData } from '$stores/UserStore';
	let { courseSelected, isSelected } = $props();
	import { courseData, loadCourseData, loadingCourseData } from '$stores/CourseStore';
	import SearchTile from '$components/SearchTile.svelte';
	let lastLoadedUserId = null;
	let hasInitializedSelection = false;
	let currentUserData = $state(null);
	let hasInitializedCourses = false;
	let courses = $state({});
	let lastCoursesLoaded;
	let sortedCourses = $state({});
	let courseSelection = $derived($courseSelected);

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
		if (newUserData?.selection) {
			if (!hasInitializedSelection) {
				hasInitializedSelection = true;
			}
			currentUserData = structuredClone(newUserData.selection); // Update every time userData changes
		}
	});

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
			sortedCourses = Object.fromEntries(
				Object.entries(courses).sort(([a], [b]) => a.localeCompare(b))
			);
			lastCoursesLoaded = data;
		}
	});
</script>

<div
	class="shadow-sharp relative mr-4 mb-4 flex h-[calc(100dvh-2rem)] w-72 flex-1 flex-col overflow-x-hidden rounded-3xl bg-amber-50 p-4 ring-2 shadow-slate-900 ring-slate-900"
>
	<div class="absolute flex flex-col {courseSelection ? '-translate-x-110' : ''} duration-200">
		<h1>Select a class to edit!</h1>
	</div>
	<div
		class="absolute flex flex-col {courseSelection
			? ''
			: 'translate-x-110'} w-[calc(100%-3rem)] duration-200"
	>
		<button
			class="size-12 cursor-pointer bg-white"
			onclick={() => {
				courseSelected.set(null);
				isSelected = false;
			}}>X</button
		>

		<p>{courseSelection}</p>
		<div class="grid grid-cols-1 gap-2">
			{#if sortedCourses}
				{#each Object.entries(sortedCourses) as [courseName, courseDetails] (courseName)}
					{#if courseDetails}
						<SearchTile
							name={courseName}
							difficulty={courseDetails.difficulty}
							type={courseDetails.type}
							homework={courseDetails.homework}
							url={courseDetails.url}
							credits={courseDetails.credits}
							{courseSelected}
							data={$courseData}
						/>
					{/if}
				{/each}
			{/if}
		</div>

		<textarea>{JSON.stringify(currentUserData, null, 2)}</textarea>
	</div>
</div>

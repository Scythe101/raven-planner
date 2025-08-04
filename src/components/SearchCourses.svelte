<script>
	import { authStore } from '$stores/AuthStore';
	import { loadUserData, userData } from '$stores/UserStore';
	let { courseSelected, isSelected } = $props();
	import { courseData, loadCourseData, loadingCourseData } from '$stores/CourseStore';
	import SearchTile from '$components/SearchTile.svelte';
	import { onMount } from 'svelte';
	import RemoveClass from '$components/RemoveClass.svelte';
	import Filters from './Filters.svelte';

	let lastLoadedUserId = null;
	let hasInitializedSelection = false;
	let currentUserData = $state(null);
	let hasInitializedCourses = false;
	let courses = $state({});
	let lastCoursesLoaded;
	let sortedCourses = $state({});
	let courseSelection = $derived($courseSelected);
	let searchQuery = $state('');
	let typeFilter = $state('');
	let difficultyFilter = $state('');
	let homeworkFilter = $state('');
	let creditsFilter = $state('');
	let academicFilter = $state('');
	let weightedFilter = $state('');

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

	let filteredCourses = $derived.by(() => {
		// this removes trailing and leading spaces
		let handledSearchQuery = searchQuery;
		while (handledSearchQuery[0] === ' ') {
			handledSearchQuery = handledSearchQuery.slice(1, handledSearchQuery.length);
		}

		while (handledSearchQuery[handledSearchQuery.length - 1] == ' ') {
			handledSearchQuery = handledSearchQuery.slice(0, handledSearchQuery.length - 2);
		}

		return Object.fromEntries(
			Object.entries(sortedCourses).filter(([key]) =>
				key.toLowerCase().includes(handledSearchQuery.toLowerCase())
			)
		);
	});
</script>

<div
	class="shadow-sharp sticky top-4 mr-4 mb-4 flex h-[calc(100dvh-2rem)] flex-col overflow-x-hidden rounded-3xl bg-amber-50 p-4 ring-2 shadow-slate-900 ring-slate-900 {courseSelection
		? 'overflow-y-scroll'
		: 'overflow-y-hidden'}"
>
	<div
		class="sticky flex h-20 flex-col {courseSelection ? '-translate-x-110' : ''} top-0 duration-200"
	>
		<h1>Select a class to edit!</h1>
	</div>
	<div
		class="absolute flex flex-col {courseSelection
			? ''
			: 'translate-x-110'} w-[calc(100%-3rem)] duration-200"
	>
		<div class="mb-4 flex w-full flex-row">
			<button
				class="shadow-sharp hover:shadow-sharp-hover h-12 w-fit cursor-pointer rounded-full bg-white p-2 ring-2 ring-slate-900 duration-200 hover:-translate-0.5"
				onclick={() => {
					courseSelected.set(null);
					isSelected = false;
				}}>Close</button
			>
			<div class="ml-auto">
				<RemoveClass {courseSelected} />
			</div>
		</div>
		<input
			type="text"
			bind:value={searchQuery}
			class="mb-4 ml-1 h-12 rounded-full bg-white p-4 ring-2 ring-slate-900 placeholder:text-slate-400 placeholder:italic"
			placeholder="Search for a class..."
		/>
		<Filters />
		<!-- <p>{courseSelection}</p> -->
		<div class="grid grid-cols-1 gap-3 pb-4">
			{#if filteredCourses}
				{#each Object.entries(filteredCourses) as [courseName, courseDetails] (courseName)}
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

		<!-- <textarea>{JSON.stringify(currentUserData, null, 2)}</textarea> -->
	</div>
</div>

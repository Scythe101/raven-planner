<script>
	import { authStore } from '$stores/AuthStore';
	import { loadUserData, userData } from '$stores/UserStore';
	let { courseSelected, isSelected } = $props();
	import { courseData, loadCourseData, loadingCourseData } from '$stores/CourseStore';
	import SearchTile from '$components/SearchTile.svelte';
	import { onMount } from 'svelte';
	import RemoveClass from '$components/RemoveClass.svelte';
	import Filter from '$components/Filter.svelte';
	import { writable } from 'svelte/store';
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
	let typeFilter = writable('');
	let difficultyFilter = writable('');
	let homeworkFilter = writable('');
	let creditsFilter = writable('');
	let academicFilter = writable('');
	let weightedFilter = writable('');
	let openFilter = writable(null);

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
		let handledSearchQuery = searchQuery.trim();
		const currentTypeFilter = $typeFilter;
		const currentDifficultyFilter = $difficultyFilter;
		const currentHomeworkFilter = $homeworkFilter;
		const currentCreditsFilter = $creditsFilter;
		const currentAcademicFilter = $academicFilter;
		const currentWeightedFilter = $weightedFilter;

		return Object.fromEntries(
			Object.entries(sortedCourses).filter(([key, details]) => {
				const matchesSearch = key.toLowerCase().includes(handledSearchQuery.toLowerCase());

				// if no type is selected (empty string) then ignore the type filter,
				// otherwise perform the check against the selected type
				const matchesType =
					currentTypeFilter === '' ||
					details.type.toLowerCase() === currentTypeFilter.toLowerCase();

				const matchesDifficulty =
					currentDifficultyFilter === '' ||
					details.difficulty.toLowerCase() === currentDifficultyFilter.toLowerCase();

				const matchesHomework =
					currentHomeworkFilter == '' ||
					details.homework.toLowerCase() === currentHomeworkFilter.toLowerCase();

				const matchesCredits =
					currentCreditsFilter === '' || details.credits === parseInt(currentCreditsFilter);
				const matchesAcademic =
					currentAcademicFilter === '' ||
					details.academic === (currentAcademicFilter === 'yes' ? true : false);
				const matchesWeighted =
					currentWeightedFilter === '' ||
					details.weighted === (currentWeightedFilter === 'yes' ? true : false);

				return (
					matchesSearch &&
					matchesType &&
					matchesDifficulty &&
					matchesHomework &&
					matchesCredits &&
					matchesAcademic &&
					matchesWeighted
				);
			})
		);
	});
</script>

<div
	id="search-courses"
	class="shadow-sharp sticky top-4 mr-4 mb-4 flex h-[calc(100dvh-2rem)] w-70 flex-col overflow-x-hidden rounded-3xl bg-orange-50 p-4 ring-2 shadow-slate-900 ring-slate-900 2xl:w-92 {courseSelection
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
				class="flat-button font-noto-serif shadow-sharp hover:shadow-sharp-hover h-12 w-fit cursor-pointer rounded-full bg-white p-2 ring-2 ring-slate-900 duration-200 hover:-translate-0.5"
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
			class="search mb-2 ml-1 h-12 rounded-full bg-white p-4 ring-2 ring-slate-900 placeholder:text-slate-400 placeholder:italic"
			placeholder="Search for a class..."
		/>
		<Filters
			{typeFilter}
			{openFilter}
			{difficultyFilter}
			{creditsFilter}
			{homeworkFilter}
			{academicFilter}
			{weightedFilter}
		/>
		<!-- <p>{courseSelection}</p> -->
		<div class="mt-2 grid grid-cols-1 gap-3 pb-4">
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

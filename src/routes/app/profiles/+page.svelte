<script>
	import CourseTileSkeleton from '$components/CourseTileSkeleton.svelte';
	import { authStore } from '$stores/AuthStore';
	import { onMount } from 'svelte';
	import ProfilesCategory from '$components/ProfilesCategory.svelte';
	import { loadCourseData, courseData } from '$stores/CourseStore';
	import { writable } from 'svelte/store';
	import Filters from '$components/Filters.svelte';

	let courses = $state({});
	let isLoading = false;
	let hasInitializedCourses = false;
	let lastCoursesLoaded = null;
	let searchQuery = $state('');
	let typeFilter = writable('');
	let difficultyFilter = writable('');
	let homeworkFilter = writable('');
	let creditsFilter = writable('');
	let academicFilter = writable('');
	let weightedFilter = writable('');
	let openFilter = writable(null);
	let sortedCourses = $state({});

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
					currentHomeworkFilter === '' ||
					details.homework.toLowerCase() === currentHomeworkFilter.toLowerCase();

				const matchesCredits =
					currentCreditsFilter === '' || details.credits == parseInt(currentCreditsFilter);
				const matchesAcademic =
					currentAcademicFilter === '' ||
					details.academic === (currentAcademicFilter == 'yes' ? true : false);
				const matchesWeighted =
					currentWeightedFilter === '' ||
					details.weighted === (currentWeightedFilter == 'yes' ? true : false);

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

<svelte:head>
	<title>Course Profiles</title>
</svelte:head>

<div class="mr-4 flex max-w-192 flex-col">
	<input
		type="text"
		bind:value={searchQuery}
		class="shadow-sharp hover:shadow-sharp-hover focus:shadow-sharp mb-2 ml-1 h-12 rounded-full bg-white p-4 ring-2 ring-slate-900 duration-100 placeholder:text-slate-400 placeholder:italic hover:-translate-0.5 focus:translate-0"
		placeholder="Search for a class..."
	/>
	<Filters
		{typeFilter}
		{openFilter}
		{difficultyFilter}
		{homeworkFilter}
		{creditsFilter}
		{academicFilter}
		{weightedFilter}
	/>
</div>
{#if $authStore.currentUser && !isLoading && Object.keys(courses).length > 0}
	<ProfilesCategory courses={filteredCourses} type="social studies" />
	<ProfilesCategory courses={filteredCourses} type="english" />
	<ProfilesCategory courses={filteredCourses} type="math" />
	<ProfilesCategory courses={filteredCourses} type="physical science" />
	<ProfilesCategory courses={filteredCourses} type="life science" />
	<ProfilesCategory courses={filteredCourses} type="world language" />
	<ProfilesCategory courses={filteredCourses} type="physical education" />
	<ProfilesCategory courses={filteredCourses} type="visual arts" />
	<ProfilesCategory courses={filteredCourses} type="practical arts" />
	<ProfilesCategory courses={filteredCourses} type="electives" />
{:else}
	<h1 class="mb-4">History</h1>
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

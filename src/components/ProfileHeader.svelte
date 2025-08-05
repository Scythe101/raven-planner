<script>
	import { loadCourseData, loadingCourseData, courseData } from '$stores/CourseStore';

	let { course } = $props();
	let profileData = $state({});
	let hasInitializedCourses = false;
	let lastCoursesLoaded = null;

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
			profileData = structuredClone(data)[course];
			lastCoursesLoaded = data;
		}
	});

	function capitalize(str) {
		if (typeof str === 'string') {
			return str.replace(/^\w/, (c) => c.toUpperCase());
		} else {
			return '';
		}
	}
</script>

<h1 class="mb-8">{course}</h1>

<h2 class="mb-2">Quick Info</h2>
<div class="flex flex-row gap-12">
	<div class="flex-col">
		<h1 class="text-lg">Type</h1>
		{#if !$loadingCourseData && profileData.type}
			<p class=" -mt-2 text-2xl">{capitalize(profileData.type)}</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-14 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
	<div class="flex-col">
		<h1 class="text-lg">Difficulty</h1>
		{#if !$loadingCourseData && profileData.difficulty}
			<p class=" -mt-2 text-2xl">{capitalize(profileData.difficulty)}</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-14 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
	<div class="flex-col">
		<h1 class="text-lg">Homework</h1>
		{#if !$loadingCourseData && profileData.homework}
			<p class=" -mt-2 text-2xl">{profileData.homework} Minutes</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-32 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
	<div class="flex-col">
		<h1 class="text-lg">Credits</h1>
		{#if !$loadingCourseData && profileData.credits}
			<p class=" -mt-2 text-2xl">{profileData.credits} Credits</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-20 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
	<div class="flex-col">
		<h1 class="text-lg italic">Academic?</h1>
		{#if !$loadingCourseData && profileData.academic !== null}
			<p class=" -mt-2 text-2xl">{profileData.academic ? 'Yes' : 'No'}</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-8 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
	<div class="flex-col">
		<h1 class="text-lg">Weighted?</h1>
		{#if !$loadingCourseData && profileData.weighted !== null}
			<p class=" -mt-2 text-2xl">{profileData.weighted ? 'Yes' : 'No'}</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-8 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
</div>

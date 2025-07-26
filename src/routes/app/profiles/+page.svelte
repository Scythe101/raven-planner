<script>
	import CourseTileSkeleton from '../../../components/CourseTileSkeleton.svelte';
	import { authStore } from '$stores/AuthStore';
	import { onMount } from 'svelte';
	import ProfilesCategory from '../../../components/ProfilesCategory.svelte';
	import { loadCourseData, courseData } from '$stores/CourseStore';

	let courses = $state({});
	let isLoading = false;
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
			courses = structuredClone(data);
			lastCoursesLoaded = data;
		}
	});
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

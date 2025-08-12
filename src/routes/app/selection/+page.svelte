<script>
	import SelectionTile from '$components/SelectionTile.svelte';
	import SearchCourses from '$components/SearchCourses.svelte';
	import { authStore } from '$stores/AuthStore';
	import { loadCourseData, courseData } from '$stores/CourseStore';
	import { loadUserData, userData, saveUserData } from '$stores/UserStore';
	import { writable } from 'svelte/store';

	let selection = $state({
		freshman: {
			fall: [],
			spring: []
		},
		sophomore: {
			fall: [],
			spring: []
		},
		junior: {
			fall: [],
			spring: []
		},
		senior: {
			fall: [],
			spring: []
		}
	});
	let courses = $state({});
	const courseSelected = writable(null);

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

		if (newUserData?.selection) {
			// console.log('Setting selection from user data:', newUserData.selection);
			selection = structuredClone(newUserData.selection); // Create a deep copy to avoid proxy issues
			hasInitializedSelection = true;
		} else if (newUserData && !newUserData.selection) {
			// console.log('User data exists but no selection found, initializing default selection');
			// Initialize default selection structure
			const defaultSelection = {
				freshman: { fall: [], spring: [] },
				sophomore: { fall: [], spring: [] },
				junior: { fall: [], spring: [] },
				senior: { fall: [], spring: [] }
			};
			selection = defaultSelection;
			hasInitializedSelection = true;
		} else if (newUserData === null) {
			// console.log('User data is null - user may not exist in database');
		}
	});
</script>

<svelte:head>
	<title>Course Selection</title>
</svelte:head>

<div class="flex flex-row gap-8">
	<div class="grid h-fit flex-1 grid-cols-1 gap-x-12 gap-y-16 p-2 2xl:grid-cols-2">
		<div>
			<h1>Freshman</h1>
			<div class="flex flex-row gap-6">
				<SelectionTile
					fall="true"
					{courseSelected}
					courses={selection.freshman.fall}
					year="freshman"
				/>
				<SelectionTile
					fall="false"
					{courseSelected}
					courses={selection.freshman.spring}
					year="freshman"
				/>
			</div>
		</div>
		<div>
			<h1>Sophomore</h1>
			<div class="flex flex-row gap-6">
				<SelectionTile
					fall="true"
					{courseSelected}
					courses={selection.sophomore.fall}
					year="sophomore"
				/>
				<SelectionTile
					fall="false"
					{courseSelected}
					courses={selection.sophomore.spring}
					year="sophomore"
				/>
			</div>
		</div>
		<div>
			<h1>Junior</h1>
			<div class="flex flex-row gap-6">
				<SelectionTile fall="true" {courseSelected} courses={selection.junior.fall} year="junior" />
				<SelectionTile
					fall="false"
					{courseSelected}
					courses={selection.junior.spring}
					year="junior"
				/>
			</div>
		</div>
		<div>
			<h1>Senior</h1>
			<div class="flex flex-row gap-6">
				<SelectionTile fall="true" {courseSelected} courses={selection.senior.fall} year="senior" />
				<SelectionTile
					fall="false"
					{courseSelected}
					courses={selection.senior.spring}
					year="senior"
				/>
			</div>
		</div>
	</div>
	<SearchCourses {courseSelected} />
</div>
<!-- <button
	class="shadow-sharp hover:shadow-sharp-hover fixed bottom-4 h-12 w-16 cursor-pointer rounded-full bg-amber-100 ring-2 shadow-slate-900 ring-slate-900 duration-100 hover:-translate-0.5"
	onclick={saveUserData}>Save</button
> -->

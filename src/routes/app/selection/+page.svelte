<script>
	import SelectionTile from '$components/SelectionTile.svelte';
	import SearchCourses from '$components/SearchCourses.svelte';
	import { authStore } from '$stores/AuthStore';
	import { loadCourseData, courseData } from '$stores/CourseStore';
	import { loadUserData, userData } from '$stores/UserStore';

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
	let courseSelected = $state(null);

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
			selection = structuredClone(newUserData.selection); // Create a deep copy to avoid proxy issues
			hasInitializedSelection = true;
		}
	});
</script>

<div class="flex flex-row gap-8">
	<div class="grid h-fit w-full grid-cols-1 gap-x-12 gap-y-32 p-2 xl:grid-cols-2 2xl:w-3/4">
		<div>
			<h1>Freshman</h1>
			<div class="flex flex-row gap-6">
				<SelectionTile
					fall="true"
					bind:courseSelected
					courses={selection.freshman.fall}
					year="freshman"
				/>
				<SelectionTile
					fall="false"
					bind:courseSelected
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
					courses={selection.sophomore.fall}
					year="sophomore"
					bind:courseSelected
				/>
				<SelectionTile
					fall="false"
					courses={selection.sophomore.spring}
					bind:courseSelected
					year="sophomore"
				/>
			</div>
		</div>
		<div>
			<h1>Junior</h1>
			<div class="flex flex-row gap-6">
				<SelectionTile
					fall="true"
					bind:courseSelected
					courses={selection.junior.fall}
					year="junior"
				/>
				<SelectionTile
					fall="false"
					bind:courseSelected
					courses={selection.junior.spring}
					year="junior"
				/>
			</div>
		</div>
		<div>
			<h1>Senior</h1>
			<div class="flex flex-row gap-6">
				<SelectionTile
					fall="true"
					bind:courseSelected
					courses={selection.senior.fall}
					year="senior"
				/>
				<SelectionTile
					fall="false"
					bind:courseSelected
					courses={selection.senior.spring}
					year="senior"
				/>
			</div>
		</div>
	</div>
	<SearchCourses {courseSelected} />
</div>

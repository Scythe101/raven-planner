<script>
	import Checkbox from '$components/Checkbox.svelte';
	import ProgressBar from '$components/ProgressBar.svelte';
	import { authStore } from '$stores/AuthStore';
	import { courseData, loadCourseData } from '$stores/CourseStore';
	import { userData, loadUserData } from '$stores/UserStore';
	// const englishCredits = $derived.by(() => {});
	let courses = $derived($courseData);
	let userSelection = $derived($userData?.selection);
	let lastLoadedUserId = null;
	let lastCoursesLoaded = null;
	let hasInitializedSelection = false;
	let hasInitializedCourses = false;
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
	
	function containsClass(sel, targets) {
		// values: string[] of course names to match (case-insensitive)
		if (!sel || !Array.isArray(targets) || targets.length === 0) return false;
		let found = false;
		Object.values(sel).forEach((year) => {
			if (found) return;
			const userSel = [
				...year.fall,
				...year.spring
			];
			userSel.forEach((c) => {
				if (found) return;
				if (targets.includes(c)) {
					found = true;
				}
			});
		});
		return found;
	}

	let im1hReq = $derived(containsClass(userSelection, ["Integrated Math 1", "Integrated Math 1 Honors"]));

</script>

<svelte:head>
	<title>Graduation Requirements</title>
</svelte:head>

<p class="mb-2">
	<strong>NOTE:</strong> These requirements are a combination of the high school graduation requirements
	and the college A-G requirements, and take the hardest parts from each to ensure that you are prepared
	for college.
</p>

<div class="grid grid-cols-2 gap-y-4 2xl:w-3/4">
	<div class="">
		<h2>Social Studies</h2>
		<p>World History, US History, Government, and Economy are required.</p>
		<ProgressBar lower={0} upper={30} />
	</div>
	<div class="">
		<h2>English</h2>
		<p>English 9, 10, 11, and 12 (or higher) are required.</p>

		<ProgressBar lower={10} upper={40} />
	</div>
	<div class="">
		<h2>Mathematics</h2>
		<p>Integrated Math 1 or Algebra 1 (or higher) required.</p>
		<ProgressBar lower={20} upper={30} />
	</div>
	<div class="">
		<h2>Physical Science</h2>
		<ProgressBar lower={0} upper={10} />
	</div>
	<div class="">
		<h2>Life Science</h2>
		<ProgressBar lower={10} upper={10} />
	</div>

	<div class="">
		<h2>Visual/Performing Art</h2>
		<ProgressBar lower={0} upper={10} />
	</div>

	<div class="">
		<h2>Physical Education</h2>
		<p>2 PE courses (one in 9th grade, one in 10th) are required.</p>
		<ProgressBar lower={10} upper={20} />
	</div>

	<div class="">
		<h2>Practical Art</h2>
		<ProgressBar lower={10} upper={10} />
	</div>
	<div class="">
		<h2>World Language</h2>
		<ProgressBar lower={30} upper={30} />
	</div>
	<div class="">
		<h2>Electives</h2>
		<ProgressBar lower={20} upper={70} />
	</div>
</div>
<div class="mt-8">
	<h2>Individual Course Requirements</h2>
	<!-- TODO: add rest of required courses here -->
	<Checkbox checked={im1hReq} text="Integrated Math 1 (if you took it in middle school, it counts too.)" />
	<Checkbox checked={false} text="9th Grade PE with Health" />
	<Checkbox checked={false} text="10th Grade PE" />
	<Checkbox checked={false} text="World History" />
	<Checkbox checked={false} text="US History" />
	<Checkbox checked={false} text="Economy" />
	<Checkbox checked={false} text="Biology" />
	<Checkbox checked={false} text="Chemistry" />
	<Checkbox checked={false} text="English 9" />
	<Checkbox checked={false} text="English 10" />
	<Checkbox checked={false} text="English 11" />
	<Checkbox checked={false} text="English 12" />
</div>

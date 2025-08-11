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

	// loading data
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

	// credits progress calculation
	const flatSelection = $derived.by(() => {
		if (!userSelection) {
			return null;
		}
		return Object.values(userSelection).flatMap((year) => {
			return [...(year.fall || []), ...(year.spring || [])];
		});
	});

	const creditRequirements = {
		'social studies': 30,
		english: 40,
		math: 30,
		'physical science': 10,
		'life science': 10,
		'visual arts': 10,
		'physical education': 20,
		'practical arts': 10,
		'world language': 30,
		electives: 70
	};

	// calc all credits at once to avoid re-counting excess
	const credits = $derived.by(() => {
		//resets all credits to 0 to prevent double-counting
		const credits = Object.fromEntries(Object.keys(creditRequirements).map((type) => [type, 0]));
		if (!userSelection || !courses || !flatSelection) {
			return credits;
		}

		let excess = 0;

		//FIXED: currently doesnt work for 2 classes in 1 semester, ie calc 3/linear algebra
		flatSelection.forEach((sel) => {
			let creditsToAdd = 10;
			if (sel == "Athletics PE Credit") {
				creditsToAdd = 5;
			}
			if (sel === 'Unscheduled') return;
			let selType = courses[sel]?.type;
			if (sel === 'Calculus 3/Linear Algebra') {
				selType = 'math';
			}
			if (sel === 'AP Government/AP Economics') {
				selType = 'social studies';
			}
			if (sel === 'Government/Economics') {
				selType = 'social studies';
			}
			if (selType) {
				// this logic is absolutely horribly scuffed
				if ((credits[selType]+creditsToAdd) <= creditRequirements[selType]) {
					credits[selType] += creditsToAdd;
				} else if((credits[selType] + 5) <= creditRequirements[selType]) {
					creditsToAdd-=5;
					credits[selType] += creditsToAdd;
					excess += 5;
				} 
				else {
					excess += creditsToAdd;
				}
			}
		});

		credits.excess = excess;
		return credits;
	});

	let socialStudiesCredits = $derived(credits['social studies']);
	let englishCredits = $derived(credits['english']);
	let mathCredits = $derived(credits['math']);
	let physicalScienceCredits = $derived(credits['physical science']);
	let lifeScienceCredits = $derived(credits['life science']);
	let visualArtsCredits = $derived(credits['visual arts']);
	let peCredits = $derived(credits['physical education']);
	let practicalArtsCredits = $derived(credits['practical arts']);
	let worldLanguageCredits = $derived(credits['world language']);
	let electivesCredits = $derived(credits['electives'] + credits.excess);

	// meets course reqs calc
	function containsClass(sel, targets) {
		if (!sel || !Array.isArray(targets) || targets.length === 0) return false;
		const targetSet = new Set(targets);
		let found = false;
		Object.values(sel).forEach((year) => {
			if (found) return;
			const userSel = [...year.fall, ...year.spring];
			userSel.forEach((course) => {
				if (found) return;
				if (targetSet.has(course)) {
					found = true;
				}
			});
		});
		return found;
	}

	let im1hReq = $derived(
		containsClass(userSelection, [
			'Integrated Math 1',
			'Integrated Math 1 Honors',
			'Integrated Math 2',
			'Integrated Math 2 Honors'
		])
	);
	let english9Req = $derived(containsClass(userSelection, ['English 9', 'English 9 Honors']));
	let english10Req = $derived(containsClass(userSelection, ['English 10', 'English 10 Honors']));
	let english11Req = $derived(containsClass(userSelection, ['English 11', 'AP English Language']));
	let english12Req = $derived(
		containsClass(userSelection, ['English 12', 'AP English Literature'])
	);
	let worldHistoryReq = $derived(
		containsClass(userSelection, ['World History', 'AP World History'])
	);
	let usHistoryReq = $derived(containsClass(userSelection, ['US History', 'AP US History']));
	let economyGovReq = $derived(
		containsClass(userSelection, ['Government/Economy', 'AP Government/AP Economics'])
	);
	let biologyReq = $derived(containsClass(userSelection, ['Biology']));
	let chemistryReq = $derived(containsClass(userSelection, ['Chemistry', 'Honors Chemistry']));
	let pe9Req = $derived(containsClass(userSelection, ['Year One PE', 'Dance PE']));
	let pe10Req = $derived(
		containsClass(userSelection, [
			'Year Two PE',
			'Weight Training',
			'Sports Performance Training',
			'Fitness Walking'
		])
	);
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
		<ProgressBar lower={socialStudiesCredits} upper={creditRequirements['social studies']} />
	</div>
	<div class="">
		<h2>English</h2>
		<p>English 9, 10, 11, and 12 (or higher) are required.</p>

		<ProgressBar lower={englishCredits} upper={creditRequirements['english']} />
	</div>
	<div class="">
		<h2>Mathematics</h2>
		<p>Integrated Math 1 or Algebra 1 (or higher) required.</p>
		<ProgressBar lower={mathCredits} upper={creditRequirements['math']} />
	</div>
	<div class="">
		<h2>Physical Science</h2>
		<ProgressBar lower={physicalScienceCredits} upper={creditRequirements['physical science']} />
	</div>
	<div class="">
		<h2>Life Science</h2>
		<ProgressBar lower={lifeScienceCredits} upper={creditRequirements['life science']} />
	</div>

	<div class="">
		<h2>Visual/Performing Art</h2>
		<ProgressBar lower={visualArtsCredits} upper={creditRequirements['visual arts']} />
	</div>

	<div class="">
		<h2>Physical Education</h2>
		<p>2 PE courses (one in 9th grade, one in 10th) are required.</p>
		<ProgressBar lower={peCredits} upper={creditRequirements['physical education']} />
	</div>

	<div class="">
		<h2>Practical Art</h2>
		<ProgressBar lower={practicalArtsCredits} upper={creditRequirements['practical arts']} />
	</div>
	<div class="">
		<h2>World Language</h2>
		<ProgressBar lower={worldLanguageCredits} upper={creditRequirements['world language']} />
	</div>
	<div class="">
		<h2>Electives</h2>
		<ProgressBar lower={electivesCredits} upper={creditRequirements['electives']} />
	</div>
</div>
<div class="mt-8">
	<h2>Individual Course Requirements</h2>
	<p class="mb-4 text-xl">
		This also checks if you have a higher level-equivalent, such as an honors or AP course.
	</p>
	<Checkbox
		checked={im1hReq}
		text="Integrated Math 1 (if you took it in middle school, it counts for the course requirement, but not credits.)"
	/>
	<Checkbox checked={pe9Req} text="9th Grade PE with Health" />
	<Checkbox checked={pe10Req} text="10th Grade PE" />
	<Checkbox checked={worldHistoryReq} text="World History" />
	<Checkbox checked={usHistoryReq} text="US History" />
	<Checkbox checked={economyGovReq} text="Government/Economy" />
	<Checkbox checked={biologyReq} text="Biology" />
	<Checkbox checked={chemistryReq} text="Chemistry" />
	<Checkbox checked={english9Req} text="English 9" />
	<Checkbox checked={english10Req} text="English 10" />
	<Checkbox checked={english11Req} text="English 11" />
	<Checkbox checked={english12Req} text="English 12" />
</div>
<!-- <button
	onclick={() => {
		console.log(flatSelection);
	}}>test</button
> -->

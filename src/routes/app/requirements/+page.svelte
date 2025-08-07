<script>
	import ProgressBar from '$components/ProgressBar.svelte';
	import { courseData } from '$stores/CourseStore';
	import { userData } from '$stores/UserStore';
	// const englishCredits = $derived.by(() => {});
</script>

<h1 class="mt-4">SDUHSD</h1>
<p class="mb-2">
	These are the requirements to graduate from high school. Assuming you follow through with your
	course selection and pass all classes, this is what your graduation status will look like at the
	end of high school.
</p>

<div class="grid w-3/4 grid-cols-2 gap-y-4">
	<div class="">
		<h2>English</h2>
		<p>English 9, 10, 11, and 12 (or higher) are required.</p>

		<ProgressBar lower={10} upper={40} />
	</div>
	<div class="">
		<h2>Visual/Performing Art</h2>
		<ProgressBar lower={0} upper={10} />
	</div>
	<div class="">
		<h2>Mathematics</h2>
		<p>Integrated Math 1 or Algebra 1 (or higher) required.</p>
		<ProgressBar lower={20} upper={30} />
	</div>
	<div class="">
		<h2>Physical Education</h2>
		<p>2 PE courses (one in 9th grade, one in 10th) are required.</p>
		<ProgressBar lower={10} upper={20} />
	</div>
	<div class="">
		<h2>Science</h2>
		<p>1 life science and 1 physical science required.</p>
		<ProgressBar lower={10} upper={20} />
	</div>
	<div class="">
		<h2>Practical Art</h2>
		<ProgressBar lower={10} upper={10} />
	</div>
	<div class="">
		<h2>Social Science</h2>
		<p>World History, US History, Government, and Economy are required.</p>
		<ProgressBar lower={0} upper={30} />
	</div>
	<div class="">
		<h2>Electives</h2>
		<ProgressBar lower={20} upper={70} />
	</div>
</div>

<h1>A-G Requirements</h1>

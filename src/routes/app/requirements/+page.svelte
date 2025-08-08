<script>
	import ProgressBar from '$components/ProgressBar.svelte';
	import { courseData } from '$stores/CourseStore';
	import { userData } from '$stores/UserStore';
	// const englishCredits = $derived.by(() => {});
</script>

<p class="mb-2">
	<strong>NOTE:</strong> These requirements are a combination of the high school graduation requirements
	and the college A-G requirements, and take the hardest parts from each to ensure that you are prepared
	for college.
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
		<h2>Social Studies</h2>
		<p>World History, US History, Government, and Economy are required.</p>
		<ProgressBar lower={0} upper={30} />
	</div>
	<div class="">
		<h2>Electives</h2>
		<ProgressBar lower={20} upper={70} />
	</div>
</div>

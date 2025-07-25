<script>
	let { courses, type } = $props();
	import CourseTile from '../components/CourseTile.svelte';
	function capitalize(str) {
		if (typeof str === 'string') {
			return str.replace(/^\w/, (c) => c.toUpperCase());
		} else {
			return '';
		}
	}
	const sortedCourses = Object.fromEntries(
		Object.entries(courses).sort(([a], [b]) => a.localeCompare(b))
	);
</script>

<h1 class="font-dm-serif-display mb-4 text-4xl italic">{capitalize(type)}</h1>
<div class="mr-8 mb-8 grid grid-cols-4 gap-3 2xl:grid-cols-6">
	{#each Object.entries(sortedCourses) as [courseName, courseDetails] (courseName)}
		{#if courseDetails.type === type}
			<CourseTile
				name={courseName}
				difficulty={courseDetails.difficulty}
				type={courseDetails.type}
				homework={courseDetails.homework}
				url={courseDetails.url}
				credits={courseDetails.credits}
			/>
		{/if}
	{/each}
</div>

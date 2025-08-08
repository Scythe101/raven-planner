<script>
	let { courses, type } = $props();
	import CourseTile from '$components/CourseTile.svelte';
	import { capitalize } from '$lib';
	const sortedCourses = $derived(
		Object.fromEntries(Object.entries(courses).sort(([a], [b]) => a.localeCompare(b)))
	);
	const filteredCourses = $derived(
		Object.fromEntries(
			Object.entries(sortedCourses).filter(([_, details]) => {
				const matchesType = details.type.toLowerCase() === type.toLowerCase();
				return matchesType;
			})
		)
	);
</script>

{#if Object.entries(filteredCourses).length > 0}
	<h1 class="mb-4">{capitalize(type)}</h1>
	<div class="mr-8 mb-8 grid grid-cols-4 gap-3 2xl:grid-cols-6">
		{#each Object.entries(filteredCourses) as [courseName, courseDetails] (courseName)}
			<CourseTile
				name={courseName}
				difficulty={courseDetails.difficulty}
				type={courseDetails.type}
				homework={courseDetails.homework}
				url={courseDetails.url}
				credits={courseDetails.credits}
			/>
		{/each}
	</div>
{/if}

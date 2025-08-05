<script>
	import Filter from './Filter.svelte';
	let {
		typeFilter,
		openFilter,
		difficultyFilter,
		homeworkFilter,
		creditsFilter,
		academicFilter,
		weightedFilter
	} = $props();
	let options = $state(null);
	let filter = $state(null);
	let isOpen = $derived($openFilter !== null);
	let color = $state(null);

	$effect(() => {
		if ($openFilter == 'type') {
			options = ['English', 'Math', 'Practical Arts'];
			filter = typeFilter;
			color = 'red';
		} else if ($openFilter == 'difficulty') {
			options = ['Easy', 'Moderate', 'Hard'];
			filter = difficultyFilter;
			color = 'orange';
		} else if ($openFilter == 'homework') {
			options = ['0-30', '30-60', '60-90'];
			filter = homeworkFilter;
			color = 'yellow';
		} else if ($openFilter == 'credits') {
			options = ['5', '10'];
			filter = creditsFilter;
			color = 'green';
		} else if ($openFilter == 'academic') {
			options = ['Yes', 'No'];
			filter = academicFilter;
			color = 'sky';
		} else if ($openFilter == 'weighted') {
			options = ['Yes', 'No'];
			filter = weightedFilter;
			color = 'purple';
		}
	});
</script>

<div class="flex flex-row flex-wrap">
	<Filter id="type" {openFilter} filter={typeFilter} color="red" />
	<Filter id="difficulty" {openFilter} filter={difficultyFilter} color="orange" />
	<Filter id="homework" {openFilter} filter={homeworkFilter} color="yellow" />
	<Filter id="credits" {openFilter} filter={creditsFilter} color="green" />
	<Filter id="academic" {openFilter} filter={academicFilter} color="sky" />
	<Filter id="weighted" {openFilter} filter={weightedFilter} color="purple" />
</div>
{#if isOpen}
	<div class="flex flex-row gap-4">
		<!-- <button class="cursor-pointer" onclick={() => filter.set('english')}>English</button>

			<button class="cursor-pointer" onclick={() => filter.set('math')}>Math</button> -->
		{#each options as option, i (i)}
			<button
				class="cursor-pointer {$filter == option.toLowerCase() ? 'bg-white' : `bg-${color}-200 `}"
				onclick={() => {
					if ($filter === option.toLowerCase()) {
						filter.set('');
					} else {
						filter.set(option.toLowerCase());
					}
				}}>{option}</button
			>
		{/each}
	</div>
{/if}

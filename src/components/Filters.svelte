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

	function getColorClasses(color) {
		const colorMap = {
			red: 'bg-red-200 hover:bg-red-300',
			orange: 'bg-orange-200 hover:bg-orange-300',
			yellow: 'bg-yellow-200 hover:bg-yellow-300',
			green: 'bg-green-200 hover:bg-green-300',
			sky: 'bg-sky-200 hover:bg-sky-300',
			purple: 'bg-purple-200 hover:bg-purple-300'
		};
		return colorMap[color] || '';
	}

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

<div class="flex flex-row flex-wrap gap-x-6 mx-4 gap-y-4 mt-2 mb-2">
	<Filter id="type" {openFilter} filter={typeFilter} color="red" />
	<Filter id="difficulty" {openFilter} filter={difficultyFilter} color="orange" />
	<Filter id="homework" {openFilter} filter={homeworkFilter} color="yellow" />
	<Filter id="credits" {openFilter} filter={creditsFilter} color="green" />
	<Filter id="academic" {openFilter} filter={academicFilter} color="sky" />
	<Filter id="weighted" {openFilter} filter={weightedFilter} color="purple" />
</div>
{#if isOpen}
	<hr class="border-gray-300 my-1">
	<div class="font-noto-serif flex flex-row gap-6 mt-2 ml-4 mb-2">
		<!-- <button class="cursor-pointer" onclick={() => filter.set('english')}>English</button>

			<button class="cursor-pointer" onclick={() => filter.set('math')}>Math</button> -->
		{#each options as option, i (i)}
			<button
				class="cursor-pointer -my-1 py-1 -mx-2 px-2 rounded-full ring-slate-900 duration-100 {getColorClasses(color)} {$filter == option.toLowerCase() ? 'ring-2' : 'hover:ring-1'}"
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

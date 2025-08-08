<script>
	let { openFilter, filter } = $props();
	let options = $state([]);

	if ($openFilter === 'type') {
		options = ['English', 'Math', 'Visual Arts', 'Practical Arts'];
	}
</script>

<div class="flex flex-row bg-white shadow-lg">
	{#each options as option, i (i)}
		<button
			class="bg-black-200 m-1 cursor-pointer rounded-full px-3 py-1"
			onclick={() => {
				if ($filter === option.toLowerCase()) {
					filter.set('');
				} else {
					filter.set(option.toLowerCase());
				}
				openFilter.set(null);
			}}
		>
			{option}
		</button>
	{/each}
</div>

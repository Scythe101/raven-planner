<script>
	import { get } from 'svelte/store';
	let { fall, courses, year, courseSelected } = $props();

	const semester = fall === 'true' ? 'fall' : 'spring';

	function isButtonSelected(index) {
		if (!$courseSelected) {
			return false;
		}

		const expectedPath = `selection.${year}.${semester}[${index}]`;
		return $courseSelected === expectedPath;
	}

	let courseSelection = $derived($courseSelected);
</script>

<div
	class="shadow-sharp w-1/2 rounded-lg pb-4 ring-2 shadow-slate-900 ring-slate-900 {fall === 'true'
		? 'bg-orange-300'
		: 'bg-fuchsia-300'}"
>
	<h3
		class="font-dm-serif-display m-2 mb-4 flex h-8 w-16 items-center justify-center rounded-full bg-white italic ring-2 ring-slate-900"
	>
		{fall === 'true' ? 'Fall' : 'Spring'}
	</h3>
	{#if courses}
		<div class="mx-4 flex flex-col gap-6">
			{#each courses as _, i (i)}
				<button
					class="font-noto-serif cursor-pointer rounded-full text-left text-xl ring-slate-900 transition-all duration-150 hover:-m-2 hover:bg-white hover:p-2 hover:ring-2 {isButtonSelected(
						i
					)
						? '-m-2 bg-white p-2 ring-2'
						: ''}"
					onclick={() => {
						// courseSelected = null;
						courseSelected.set(`selection.${year}.${semester}[${i}]`);
						// setTimeout(() => {
						// 	console.log(courseSelection);
						// }, 0);
					}}>{courses[i]}</button
				>
			{/each}
		</div>
	{/if}
</div>

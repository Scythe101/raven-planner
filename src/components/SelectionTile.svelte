<script>
	import { userData, saveUserData } from '$stores/UserStore';
	let { fall, courses, year, courseSelected } = $props();

	const semester = fall === 'true' ? 'fall' : 'spring';

	const length = $derived.by(() => {
		if (!$userData) {
			return 0;
		}
		return $userData.selection[year][semester].length;
	});

	function isButtonSelected(index) {
		if (!$courseSelected) {
			return false;
		}

		const expectedPath = `selection.${year}.${semester}[${index}]`;
		return $courseSelected === expectedPath;
	}

	function addCourse() {
		if (!$userData) {
			return;
		}
		const currentUserData = $userData;

		if (length > 5) {
			return;
		}
		currentUserData.selection[year][semester].push('Unscheduled');
		userData.set(currentUserData);
		saveUserData();
	}

	function removeCourse() {
		if (!$userData) {
			return;
		}
		const currentUserData = $userData;

		if (length < 5) {
			return;
		}
		currentUserData.selection[year][semester].splice(length - 1, 1);
		userData.set(currentUserData);
		saveUserData();
	}
</script>

<div
	class="shadow-sharp w-1/2 rounded-lg pb-4 ring-2 shadow-slate-900 ring-slate-900 {fall === 'true'
		? 'bg-orange-300'
		: 'bg-fuchsia-300'}"
>
	<div class="flex items-start">
		<h3
			class="font-dm-serif-display m-2 mb-4 flex h-8 w-16 items-center justify-center rounded-full bg-white italic ring-2 ring-slate-900"
		>
			{fall === 'true' ? 'Fall' : 'Spring'}
		</h3>
		<div class="mt-2 mr-2 ml-auto flex flex-row gap-x-2">
			<button
				class="flex size-4 items-center justify-center rounded-full bg-white ring-2 ring-slate-900 {length >
				5
					? 'cursor-not-allowed opacity-50'
					: 'cursor-pointer'}"
				onclick={addCourse}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					viewBox="0 0 10 10"
					fill="currentColor"
				>
					<rect x="4" y="1" width="2" height="8" rx="2" />
					<rect x="1" y="4" width="8" height="2" rx="2" />
				</svg>
			</button>
			<button
				class="flex size-4 cursor-pointer items-center justify-center rounded-full bg-white ring-2 ring-slate-900
				{length < 5 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
				onclick={removeCourse}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					viewBox="0 0 10 10"
					fill="currentColor"
				>
					<rect x="1" y="4" width="8" height="2" rx="2" />
				</svg>
			</button>
		</div>
	</div>
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

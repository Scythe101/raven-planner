<script>
	import { userData, saveUserData, currentSelection } from '$stores/UserStore';
	let { fall, courses, year, courseSelected } = $props();

	const semester = fall === 'true' ? 'fall' : 'spring';

	const currentSelectionData = $derived.by(() => {
		if (!$userData) {
			return null;
		}
		if ($currentSelection === "selection") {
			return $userData.selection[year][semester];
		} else if ($currentSelection === "selection1") {
			return $userData.selection1[year][semester];
		} else if ($currentSelection === "selection2") {
			return $userData.selection2[year][semester];
		}
	});

	const length = $derived.by(() => {
		if (!$userData) {
			return 0;
		}
		return currentSelectionData.length;
	});

	function isButtonSelected(index) {
		if (!$courseSelected) {
			return false;
		}

		const expectedPath = `${$currentSelection}.${year}.${semester}[${index}]`;
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
		currentUserData[$currentSelection][year][semester].push('Unscheduled');
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
		currentUserData[$currentSelection][year][semester].splice(length - 1, 1);
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
					viewBox="0 0 16 16"
					fill="currentColor"
					class="size-4"
				>
					<path
						d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z"
					/>
				</svg>
			</button>
			<button
				class="flex size-4 cursor-pointer items-center justify-center rounded-full bg-white ring-2 ring-slate-900
				{length < 5 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
				onclick={removeCourse}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="size-4"
				>
					<path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
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
						let path = `${$currentSelection}.${year}.${semester}[${i}]`;
						courseSelected.set(path);
					}}>{courses[i]}</button
				>
			{/each}
		</div>
	{/if}
</div>

<script>
	import { userData, saveUserData, currentSelection } from '$stores/UserStore';
	import { mode } from 'mode-watcher';
	let { fall, courses, year, courseSelected } = $props();

	const semester = fall === 'true' ? 'fall' : 'spring';

	const currentSelectionData = $derived.by(() => {
		if (!$userData) {
			return null;
		}
		if ($currentSelection === 'selection') {
			return $userData.selection[year][semester];
		} else if ($currentSelection === 'selection1') {
			return $userData.selection1[year][semester];
		} else if ($currentSelection === 'selection2') {
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

	function getColor() {
		if (mode.current === 'light') {
			if (fall === 'true') {
				return 'bg-orange-300 shadow-slate-900 ring-slate-900';
			} else {
				return 'bg-fuchsia-300 shadow-slate-900 ring-slate-900';
			}
		} else {
			if (fall === 'true') {
				return 'bg-ctp-peach-950 shadow-ctp-peach ring-ctp-peach';
			} else {
				return 'bg-ctp-lavender-950 shadow-ctp-lavender ring-ctp-lavender';
			}
		}
	}
	function getButtonColor() {
		if (mode.current === 'light') {
			return 'bg-white';
		} else {
			if (fall === 'true') {
				return 'bg-ctp-peach-950';
			} else {
				return 'bg-ctp-lavender-950';
			}
		}
	}

	function getSelectionColor() {
		if (mode.current === 'light') {
			return 'bg-white ring-slate-900';
		} else {
			if (fall === 'true') {
				return 'bg-ctp-peach-900 ring-ctp-peach-700';
			} else {
				return 'bg-ctp-lavender-900 ring-ctp-lavender-700';
			}
		}
	}

	function getSelectionHoverColor() {
		if (mode.current === 'light') {
			return 'hover:ring-slate-900';
		} else {
			if (fall === 'true') {
				return 'hover:ring-ctp-peach-700';
			} else {
				return 'hover:ring-ctp-lavender-700';
			}
		}
	}
	// dark mode implementation broke transitions:(
</script>

<div class="selection-tile shadow-sharp w-1/2 rounded-xl pb-4 ring-2 {getColor()}">
	<div class="flex items-start">
		<h3
			class="uncolored-flat-button font-dm-serif-display m-2 mb-4 flex h-8 w-16 items-center justify-center rounded-full italic ring-2 ring-slate-900 {getButtonColor()}"
		>
			{fall === 'true' ? 'Fall' : 'Spring'}
		</h3>
		<div class="mt-2 mr-2 ml-auto flex flex-row gap-x-2">
			<button
				class="uncolored-flat-button flex size-4 items-center justify-center rounded-full ring-2 ring-slate-900 {getButtonColor()} {length >
				5
					? 'cursor-not-allowed opacity-50'
					: 'cursor-pointer'}"
				onclick={addCourse}
				aria-label="Add course"
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
				class="uncolored-flat-button flex size-4 cursor-pointer items-center justify-center rounded-full ring-2 ring-slate-900 {getButtonColor()}
				{length < 5 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
				onclick={removeCourse}
				aria-label="Remove course"
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
					class="font-noto-serif cursor-pointer rounded-xl text-left text-xl transition-all duration-150 hover:-m-2 hover:p-2 hover:ring-2 {getSelectionHoverColor()} {isButtonSelected(
						i
					)
						? `-m-2 p-2 ring-2 ${getSelectionColor()}`
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

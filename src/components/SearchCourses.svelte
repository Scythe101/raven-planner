<script>
	import { authStore } from '$stores/AuthStore';
	import { loadUserData, userData } from '$stores/UserStore';
	let { courseSelected } = $props();
	let lastLoadedUserId = null;
	let hasInitializedSelection = false;
	let currentUserData = $state(null);

	$effect(() => {
		const currentUser = $authStore.currentUser;
		const isLoading = $authStore.isLoading;

		if (!currentUser && !isLoading) {
			// User logged out - clear everything
			if (lastLoadedUserId) {
				lastLoadedUserId = null;
				hasInitializedSelection = false;
			}
		} else if (currentUser && !isLoading) {
			if (lastLoadedUserId !== currentUser.uid) {
				lastLoadedUserId = currentUser.uid;
				hasInitializedSelection = false;
				loadUserData().catch((error) => {
					console.error('Failed to load user data:', error);
					lastLoadedUserId = null;
				});
			}
		}
	});

	// Separate effect for updating UI when userData changes
	$effect(() => {
		const newUserData = $userData;
		if (newUserData?.selection) {
			if (!hasInitializedSelection) {
				hasInitializedSelection = true;
			}
			currentUserData = structuredClone(newUserData.selection); // Update every time userData changes
		}
	});

	function setNestedValue(obj, path, value) {
		const keys = path.split('.');
		let current = obj;

		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i];
			const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);

			if (arrayMatch) {
				const [, arrayKey, index] = arrayMatch;
				if (!current[arrayKey]) current[arrayKey] = [];
				if (!current[arrayKey][index]) current[arrayKey][index] = {};
				current = current[arrayKey][index];
			} else {
				if (!current[key]) current[key] = {};
				current = current[key];
			}
		}

		const lastKey = keys[keys.length - 1];
		const arrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/);

		if (arrayMatch) {
			const [, arrayKey, index] = arrayMatch;
			if (!current[arrayKey]) current[arrayKey] = [];
			current[arrayKey][index] = value;
		} else {
			current[lastKey] = value;
		}
	}
</script>

{#if courseSelected}
	<div
		class="shadow-sharp mr-4 mb-4 flex h-[calc(100dvh-2rem)]
	w-72 flex-1
    flex-col rounded-3xl bg-amber-50 p-4 ring-2 shadow-slate-900 ring-slate-900"
	>
		<button
			class="size-12 cursor-pointer bg-white"
			onclick={() => {
				courseSelected = null;
			}}>X</button
		>
		<p>{courseSelected}</p>

		<textarea>{JSON.stringify(currentUserData, null, 2)}</textarea>
		<button
			class="size-16 cursor-pointer bg-white"
			onclick={() => {
				console.log('courseSelected path:', courseSelected);
				console.log('Current userData:', $userData);

				const updatedData = structuredClone($userData);
				setNestedValue(updatedData, courseSelected, 'New Course Value');

				console.log('Updated data:', updatedData);
				userData.set(updatedData);
				currentUserData = structuredClone(updatedData.selection);
			}}>Add test data</button
		>
	</div>
{/if}

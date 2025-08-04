<script>
	import { userData, saveUserData } from '$stores/UserStore';
	import { get } from 'svelte/store';

	let { courseSelected } = $props();
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

<button
	class="shadow-sharp hover:shadow-sharp-hover ml-1 flex h-12 w-fit flex-col rounded-full border-2 border-slate-900 bg-white p-3 text-left align-top shadow-slate-900 transition-all duration-200 hover:-translate-0.5 hover:bg-red-200"
	onclick={() => {
		// console.log('courseSelected path:', courseSelected);
		// console.log('Current userData:', $userData);

		const currentUserData = $userData;
		if (!currentUserData) {
			// console.error('No user data available');
			return;
		}

		const updatedData = structuredClone(currentUserData);
		// Make sure to update the selection property specifically
		setNestedValue(updatedData, get(courseSelected), 'Unscheduled');

		// console.log('Updated data:', updatedData);
		userData.set(updatedData);

		saveUserData();
	}}
>
	<h3 class="text-md duration-100 hover:font-bold">Drop Class</h3>
</button>

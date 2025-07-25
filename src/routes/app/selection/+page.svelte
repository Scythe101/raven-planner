<script>
	import { auth, db } from '$lib/firebase/firebase.client';
	import { authStore } from '../../../stores/AuthStore';
	import { doc, setDoc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import SelectionTile from '$components/SelectionTile.svelte';

	let selection = $state({
		freshman: {
			fall: [],
			spring: []
		},
		sophomore: {
			fall: [],
			spring: []
		}
	});
	let courses = $state({});
	let isLoading = false;
	let isSaving = false;
	let isSaved = false;

	// Load data from Firestore when component mounts
	onMount(async () => {
		if ($authStore.currentUser) {
			await loadData();
		}
	});

	// Also load data when user becomes available
	$effect(() => {
		if ($authStore.currentUser && !$authStore.isLoading) {
			loadData();
		}
	});

	async function loadData() {
		if (isLoading) return;
		isLoading = true;

		try {
			const userRef = doc(db, 'users', $authStore.currentUser.uid);
			const docSnap = await getDoc(userRef);
			const courseRef = doc(db, 'courses', 'cca');
			const courseSnap = await getDoc(courseRef);

			if (docSnap.exists()) {
				const userData = docSnap.data();
				if (userData.selection) {
					selection = userData.selection;
				}
			}
			if (courseSnap.exists()) {
				const courseData = courseSnap.data();
				courses = courseData;
			}
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="grid w-3/4 grid-cols-2 gap-x-12 gap-y-50 p-2">
	<div>
		<h1>Freshman</h1>
		<div class="flex flex-row gap-6">
			<SelectionTile fall="true" courses={selection.freshman.fall} />
			<SelectionTile fall="false" />
		</div>
	</div>
	<div>
		<h1>Sophomore</h1>
	</div>
	<div>
		<h1>Freshman</h1>
	</div>
	<div>
		<h1>Sophomore</h1>
	</div>
</div>

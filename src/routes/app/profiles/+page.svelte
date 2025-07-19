<script>
    import { auth, db } from '$lib/firebase/firebase.client';
	import CourseTile from '../../../components/CourseTile.svelte';
	import { authStore } from '../../../stores/AuthStore';
	import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';

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
	let courses = $state({
		cca: {
			"AP Calculus AB": {

			}
		}
	})
	let selectionEdit = $state(JSON.stringify(selection, null, 4));
	let courseEdit = $state(JSON.stringify(courses, null, 4));
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
		if (isLoading) return; // Prevent multiple simultaneous loads
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
					selectionEdit = JSON.stringify(selection, null, 4);
				}
			}
			if (courseSnap.exists()) {
                const courseData = courseSnap.data();
                courses = courseData;
                courseEdit = JSON.stringify(courses, null, 4);
			}
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			isLoading = false;
		}
	}

	async function save() {
		isSaving = true;
		isSaved = false;

		try {
			const userRef = doc(db, 'users', $authStore.currentUser.uid);
			await setDoc(
				userRef,
				{
					selection: selection
				},
				{ merge: true }
			);

            const courseRef = doc(db, 'courses', 'cca');
			await setDoc(
				courseRef,
				courses,
				{merge: false }
			);

			isSaving = true;
			console.log('Data saved successfully!');
		} catch (error) {
			console.error('Error saving user data:', error);
		} finally {
			isSaving = false;
			isSaved = true;
		}
	}
</script>

<h1>Course Profiles</h1>


{#if $authStore.currentUser}
    {#each Object.entries(courses) as [courseName, courseDetails]}
		<CourseTile name={courseName} difficulty={courseDetails.difficulty} />
    {/each}
{/if}
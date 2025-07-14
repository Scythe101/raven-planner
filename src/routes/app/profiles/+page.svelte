<script>
    import {auth, db} from '$lib/firebase/firebase.client';
	import { authStore } from "../../../stores/AuthStore";
    import { doc, setDoc, getDoc } from 'firebase/firestore';
    import { onMount } from 'svelte';

    let testList = [];
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
    $: if ($authStore.currentUser && !$authStore.isLoading) {
        loadData();
    }

    async function loadData() {
        if (isLoading) return; // Prevent multiple simultaneous loads
        isLoading = true;
        
        try {
            const userRef = doc(db, "users", $authStore.currentUser.uid);
            const docSnap = await getDoc(userRef);
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (userData.test) {
                    testList = userData.test;
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            isLoading = false;
        }
    }
    
    async function save(){
        isSaving = true;
        isSaved = false;

        try {
            const userRef = doc(db, "users", $authStore.currentUser.uid);
            await setDoc(
                userRef,
                {
                    test: testList,
                },
                { merge: true }
            );
            isSaving = true;
            console.log('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
        } finally {
            isSaving = false;
            isSaved = true;
        }
    }
</script>

<h1>Course Profiles</h1>
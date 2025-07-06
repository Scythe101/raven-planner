<script>
    import {auth, db} from '$lib/firebase/firebase.client';
	import { authStore } from "../../../stores/AuthStore";
    import { doc, setDoc, getDoc } from 'firebase/firestore';
    import { onMount } from 'svelte';

    let testList = [];
    let isLoading = false;
    
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
        try {
            const userRef = doc(db, "users", $authStore.currentUser.uid);
            await setDoc(
                userRef,
                {
                    test: testList,
                },
                { merge: true }
            );
            console.log('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
</script>

<h1 class="font-bold text-7xl">Home</h1>

{#if $authStore.currentUser}
    <h2 class="text-3xl">Current User: {$authStore.currentUser.email}</h2>
    
    <div class="mt-8">
        <h3 class="text-2xl font-semibold mb-4">Test List:</h3>
        
        {#if isLoading}
            <p class="text-gray-600 mb-4">Loading data...</p>
        {/if}
        
        <ul class="list-disc pl-6 mb-4">
            {#each testList as item, index}
                <li class="mb-2">
                    <input 
                        bind:value={testList[index]} 
                        class="border-2 px-2 py-1 mr-2"
                        placeholder="Enter item"
                    />
                    <button 
                        class="border-2 px-2 py-1 bg-red-200"
                        on:click={() => testList = testList.filter((_, i) => i !== index)}
                    >
                        Delete
                    </button>
                </li>
            {/each}
        </ul>
        
        <button 
            class="border-2 px-4 py-2 bg-green-200 mr-2"
            on:click={() => testList = [...testList, ""]}
        >
            Add Item
        </button>
        
        <button class="border-2 px-4 py-2 bg-blue-200" on:click={save}>
            Save
        </button>
        
        <p class="text-sm text-gray-600 mt-4">
            Current data: {JSON.stringify(testList)}
        </p>
    </div>
{:else}
    <h2 class="text-3xl">Loading User...</h2>
{/if}

<button class="border-2 px-4 py-2 bg-gray-200 mt-4" on:click={() => auth.signOut()}>
    Sign Out
</button>
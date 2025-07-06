<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase/firebase.client';
	import { browser } from '$app/environment';
	import { authStore } from '../../stores/AuthStore';

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			console.log(user);
			authStore.update((curr) => {
				return {
					...curr,
					isLoading: false,
					currentUser: user
				};
			});
		});
	});
	let { children } = $props();
</script>

<main class="bg-amber-50 min-h-dvh">
	{@render children()}
</main>
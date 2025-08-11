<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/firebase/firebase.client';
	import { authStore } from '$stores/AuthStore';

	const user = $derived($authStore.currentUser);

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			console.log('Auth state changed:', user);
			console.log('Current pathname:', window.location.pathname);
			console.log('User exists:', !!user);
			console.log('AuthStore loading:', $authStore.isLoading);

			authStore.update((curr) => {
				return {
					...curr,
					isLoading: false,
					currentUser: user
				};
			});
		});

		return unsubscribe;
	});

	$effect(() => {
		if (browser && !user && !$authStore.isLoading && $page.url.pathname.startsWith('/app')) {
			goto('/auth');
		}
	});

	$effect(() => {
		if (browser && user && !$authStore.isLoading && $page.url.pathname === '/auth') {
			goto('/app');
		}
	});

	// $effect(() => {
	// 	if (browser && user && !$authStore.isLoading && $page.url.pathname.startsWith('/app') && $page.url.pathname !== '/app/info') {
	// 		goto('/app/info');
	// 	}
	// });

	let { children } = $props();
</script>

<main class="min-h-screen-dvh bg-white">
	{@render children()}
</main>

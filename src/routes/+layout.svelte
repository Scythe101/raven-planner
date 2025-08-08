<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { auth } from '$lib/firebase/firebase.client';
	import { authStore } from '../stores/AuthStore';

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

			if (
				browser &&
				!user &&
				!$authStore.isLoading &&
				window.location.pathname.startsWith('/app')
			) {
				console.log('Redirecting to /auth - user not logged in but trying to access /app');
				window.location.href = '/auth';
				return;
			}

			if (user && window.location.pathname === '/auth') {
				console.log('Redirecting to /app - user is logged in but trying to access /auth');
				window.location.href = '/app';
				return;
			}
		});

		return unsubscribe;
	});

	let { children } = $props();
</script>

<main class="min-h-screen-dvh bg-white">
	{@render children()}
</main>

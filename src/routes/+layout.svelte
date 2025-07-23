<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { auth } from '$lib/firebase/firebase.client';
	import { authStore } from '../stores/AuthStore';

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			console.log('Auth state changed:', user);
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
				window.location.href = '/auth';
				return;
			}

			if (user && window.location.pathname === '/auth') {
				window.location.href = '/app';
				return;
			}
		});

		return unsubscribe;
	});

	let { children } = $props();
</script>

<main class="min-h-dvh bg-white">
	{@render children()}
</main>

<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/firebase/firebase.client';
	import { authStore } from '$stores/AuthStore';
	import { loadTheme } from '$stores/ThemeStore';
	import { ModeWatcher } from 'mode-watcher';

	const user = $derived($authStore.currentUser);

	onMount(() => {
		loadTheme();
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			// console.log('Auth state changed:', user);
			// console.log('Current pathname:', window.location.pathname);
			// console.log('User exists:', !!user);
			// console.log('AuthStore loading:', $authStore.isLoading);

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
			goto('/app/selection');
		}
	});

	// $effect(() => {
	// 	if (browser && user && !$authStore.isLoading && $page.url.pathname.startsWith('/app') && $page.url.pathname !== '/app/info') {
	// 		goto('/app/info');
	// 	}
	// });

	let { children } = $props();
</script>

<ModeWatcher />
<main class="min-h-screen-dvh viewport">
	{@render children()}
</main>
<div class="warning items-center justify-center text-center">
	<h1>Come back on a tablet or computer or device with a larger screen.</h1>
</div>

<style>
	/* Hidden by default */
	.viewport {
		display: block;
	}

	.warning {
		display: none;
	}

	/* Show when width < 1024px OR height < 700px */
	@media (max-width: 1000px), (max-height: 400px) {
		.viewport {
			display: none;
		}
		.warning {
			display: flex;
		}
	}
</style>

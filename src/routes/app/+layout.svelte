<script>
	import Sidebar from '$components/Sidebar.svelte';
	import { auth } from '$lib/firebase/firebase.client';
	import { authHandlers } from '$stores/AuthStore';
	import { authStore } from '$stores/AuthStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { userData, loadUserData, loadingUserData, saveUserData } from '$stores/UserStore';
	let lastLoadedUserId;
	let hasInitializedSelection;
	let info = $derived($userData);

	$effect(() => {
		const currentUser = $authStore.currentUser;
		const isLoading = $authStore.isLoading;

		if (!currentUser && !isLoading) {
			// User logged out - clear everything
			if (lastLoadedUserId) {
				lastLoadedUserId = null;
				hasInitializedSelection = false;
			}
		} else if (currentUser && !isLoading) {
			if (lastLoadedUserId !== currentUser.uid) {
				lastLoadedUserId = currentUser.uid;
				hasInitializedSelection = false;
				loadUserData().catch((error) => {
					console.error('Failed to load user data:', error);
					lastLoadedUserId = null;
				});
			}
		}
	});

	$effect(() => {
		const newUserData = $userData;
		if (newUserData && !hasInitializedSelection) {
			info = structuredClone(newUserData); // Create a deep copy to avoid proxy issues
			hasInitializedSelection = true;
		}
	});

	let redirect = $derived(
		$page.url.pathname.startsWith('/app') &&
			$page.url.pathname !== '/app/info' &&
			info &&
			info.settings?.newUser
	);

	$effect(() => {
		if (redirect) {
			goto('/app/info');
		}
	});

	let { children } = $props();
</script>

<div class="h-screen-dvh flex gap-8">
	<Sidebar class="fixed h-full bg-white" />
	<div class="flex-1 overflow-y-auto">
		<!-- Shown only when viewport is too small -->
		{@render children()}
	</div>
</div>

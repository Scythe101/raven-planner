<script>
    import { auth } from '$lib/firebase/firebase.client';
	import { authHandlers } from '$stores/AuthStore';
	import { authStore } from '$stores/AuthStore';
	import { userData, loadUserData, loadingUserData } from '$stores/UserStore';

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
</script>

<h1>hi :3</h1>

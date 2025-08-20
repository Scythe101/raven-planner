<script>
	import { authStore } from '$stores/AuthStore';
	import { userData, loadUserData, saveUserData } from '$stores/UserStore';
	import { changeTheme } from '$stores/ThemeStore';

	let userTheme = $derived($userData?.settings?.theme);

	let lastLoadedUserId;
	let hasInitializedSelection;

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

<div class="flex flex-row">
	<button
		class="h-24 w-24 {userTheme === 'light' ? 'bg-red-200' : 'bg-orange-200'}"
		onclick={() => {
			changeTheme('light');
		}}>Light</button
	>
	<button
		class="h-24 w-24 {userTheme === 'dark' ? 'bg-red-200' : 'bg-orange-200'}"
		onclick={() => {
			changeTheme('dark');
		}}>Dark</button
	>
	<button
		class="h-24 w-24 {userTheme === 'system' ? 'bg-red-200' : 'bg-orange-200'}"
		onclick={() => {
			changeTheme('system');
		}}>System</button
	>
</div>

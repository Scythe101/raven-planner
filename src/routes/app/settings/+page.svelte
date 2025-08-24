<script>
	import { authStore } from '$stores/AuthStore';
	import { userData, loadUserData, saveUserData, changeEmailVisibility } from '$stores/UserStore';
	import { changeTheme } from '$stores/ThemeStore';
	import { mode } from 'mode-watcher';
	import { onDestroy } from 'svelte';

	let userTheme = $derived($userData?.settings?.theme);
	let userEmailShow = $derived($userData?.settings?.showEmail);

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

	function getColor(option, userMode) {
		if(option === userMode) {
			if(mode.current === "light") {
				return 'bg-green-200';
			} else {
				return 'bg-ctp-green text-ctp-base';
			}
			
		} else {
			if(mode.current === "light") {
				return 'bg-white';
			} else {
				return 'bg-ctp-surface0 ';
			}
		}
	}
</script>

<h1>Appearance</h1>

<h3 class="text-2xl mb-2">Theme</h3>
<div class="flex flex-row pl-1 gap-4">
	<button
		class="h-40 w-56 flex flex-col rounded-xl standard-button {getColor(userTheme,'light')}"
		onclick={() => {
			changeTheme('light');
		}}>
			<div class="m-2 p-3 rounded-xl h-full bg-white gap-2 flex flex-col ring-2">
				<div class="h-2 w-1/3 bg-black rounded-xl"></div>
				<div class="w-full flex-1 rounded-xl flex flex-row gap-2">
					<div class="w-1/2 bg-orange-300 ring-slate-900 rounded-lg ring-2"></div>
					<div class="w-1/2 bg-fuchsia-300 ring-slate-900 rounded-lg ring-2"></div>
				</div>
			</div>
			<p class="mt-auto mb-2 mx-auto text-center">Light</p>
		</button>
	<button
		class="h-40 w-56 flex flex-col rounded-xl standard-button {getColor(userTheme,'dark')}"
		onclick={() => {
			changeTheme('dark');
		}}>
			<div class="m-2 p-3 rounded-xl h-full bg-ctp-base gap-2 flex flex-col ring-2">
				<div class="h-2 w-1/3 bg-ctp-rosewater rounded-xl"></div>
				<div class="w-full flex-1 rounded-xl flex flex-row gap-2">
					<div class="w-1/2 bg-ctp-peach-950 ring-ctp-peach rounded-lg ring-2"></div>
					<div class="w-1/2 bg-ctp-lavender-950 ring-ctp-lavender rounded-lg ring-2"></div>
				</div>
			</div>
			<p class="mt-auto mb-2 mx-auto text-center">Dark</p>
		</button>
	<button
		class="h-40 w-56 flex flex-col rounded-xl standard-button {getColor(userTheme,'system')}"
		onclick={() => {
			changeTheme('system');
		}}>
		<div class="rounded-xl h-full flex flex-row ring-2 bg-white m-2 flex-1">
			<div class="flex flex-col w-1/2 h-full gap-2 bg-white pr-1 pl-3 pt-3 pb-3 rounded-l-xl">
				<div class="h-2 w-2/3 bg-black rounded-xl"></div>
				<div class="w-full flex-1 rounded-xl flex flex-row gap-2">
					<div class="w-full bg-orange-300 rounded-lg ring-2 ring-slate-900"></div>
				</div>
			</div>
			<div class="flex flex-col w-1/2 h-full gap-2 bg-ctp-base pl-1 pr-3 pt-3 pb-3 rounded-r-xl">
				<div class="h-2 w-2/3 rounded-xl"></div>
				<div class="w-full flex-1 rounded-xl flex flex-row gap-2">
					<div class="w-full bg-ctp-lavender-950 ring-ctp-lavender rounded-lg ring-2"></div>
				</div>
			</div>
		</div>
		<p class="mt-auto mb-2 mx-auto text-center">System</p>
	</button>
</div>

<h3 class="text-2xl mt-4 mb-2">Show email in sidebar</h3>
<div class="flex flex-row pl-1 gap-4">
	<button class="text-xl font-noto-serif  standard-button rounded-xl h-20 w-26 {getColor(userEmailShow, true)}" onclick={() => {changeEmailVisibility(true)}}>
		True
	</button>
	<button class="text-xl font-noto-serif standard-button rounded-xl h-20 w-26 {getColor(userEmailShow, false)}" onclick={() => {changeEmailVisibility(false)}}>
		False
	</button>
</div>
<!-- 
<h1 class="mt-8">Profiles</h1> -->

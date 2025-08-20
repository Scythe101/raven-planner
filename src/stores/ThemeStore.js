import { get, writable } from 'svelte/store';
import { setMode, mode } from 'mode-watcher';
import { userData, saveUserData } from '$stores/UserStore';

export async function changeTheme(theme) {
	const data = get(userData);
	if (data?.settings?.theme !== theme) {
		data.settings.theme = theme;
		userData.set(data);
	}

	setMode(theme);

	await saveUserData();
}

export async function loadTheme() {
	const data = get(userData);
	if (!data) {
		setMode('system');
	} else if (data?.settings?.theme) {
		setMode(data.settings.theme);
	}
	// console.log(mode.current);
}

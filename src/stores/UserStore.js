import { writable, derived, get } from 'svelte/store';
import { authStore } from './AuthStore.js';
import { db } from '$lib/firebase/firebase.client';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
const defaultUserData = {
	selection: {
		freshman: {
			fall: ['Unscheduled', 'Unscheduled', 'Unscheduled', 'Unscheduled'],
			spring: ['Unscheduled', 'Unscheduled', 'Unscheduled', 'Unscheduled']
		},
		sophomore: {
			fall: ['Unscheduled', 'Unscheduled', 'Unscheduled', 'Unscheduled'],
			spring: ['Unscheduled', 'Unscheduled', 'Unscheduled', 'Unscheduled']
		},
		junior: {
			fall: ['Unscheduled', 'Unscheduled', 'Unscheduled', 'Unscheduled'],
			spring: ['Unscheduled', 'Unscheduled', 'Unscheduled', 'Unscheduled']
		},
		senior: {
			fall: ['Unscheduled', 'Unscheduled', 'Unscheduled', 'Unscheduled'],
			spring: ['Unscheduled', 'Unscheduled', 'Unscheduled', 'Unscheduled']
		}
	},
	settings: {
		theme: 'light'
	}
};
export const userData = writable(null);
export const loadingUserData = writable(false);
export const savingUserData = writable(false);

export async function loadUserData() {
	const currentUser = get(authStore).currentUser;
	const currentlyLoading = get(loadingUserData);

	if (!currentUser) {
		userData.set(null);
		loadingUserData.set(false);
		return;
	}

	// Prevent multiple simultaneous loads

	loadingUserData.set(true);

	try {
		const userRef = doc(db, 'users', currentUser.uid);
		const userSnap = await getDoc(userRef);

		const stillCurrentUser = get(authStore).currentUser;
		if (!stillCurrentUser || stillCurrentUser.uid !== currentUser.uid) {
			return; // User changed, abort this load
		}

		if (userSnap.exists()) {
			const data = userSnap.data();
			const structuredData = {
				selection: data.selection || defaultUserData.selection,
				settings: data.settings || defaultUserData.settings
			};

			userData.set(structuredData);
			return structuredData;
		} else {
			userData.set(defaultUserData);
			return null;
		}
	} catch (error) {
		console.error('Error loading data:', error);

		throw error;
	} finally {
		loadingUserData.set(false);
	}
}

export async function saveUserData() {
	const currentUser = get(authStore).currentUser;
	const currentlySaving = get(savingUserData);
	const stillCurrentUser = get(authStore).currentUser;
	if (currentlySaving || !currentUser) return;
	if (!stillCurrentUser || stillCurrentUser.uid !== currentUser.uid) {
		return; // User changed, abort this load
	}

	savingUserData.set(true);
	try {
		const dataToSave = get(userData);

		if (!dataToSave || typeof dataToSave !== 'object') {
			console.error('No valid data to save');
			return;
		}

		const userRef = doc(db, 'users', currentUser.uid);
		await setDoc(userRef, dataToSave, { merge: true });
	} catch (error) {
		console.error('Error saving user data:', error);
	} finally {
		savingUserData.set(false);
	}
}

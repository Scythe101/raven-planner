import { writable, derived, get } from 'svelte/store';
import { authStore } from './AuthStore.js';
import { db } from '$lib/firebase/firebase.client';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

export const userData = writable(null);
export const loadingUserData = writable(false);

export async function loadUserData() {
	const currentUser = get(authStore).currentUser;
	const currentlyLoading = get(loadingUserData);

	if (!currentUser) {
		userData.set(null);
		loadingUserData.set(false);
		return;
	}

	if (currentlyLoading || !currentUser) return; // Prevent multiple simultaneous loads

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
			userData.set(data);
			return data;
		} else {
			userData.set(null);
			return null;
		}
	} catch (error) {
		console.error('Error loading data:', error);
		throw error;
	} finally {
		loadingUserData.set(false);
	}
}

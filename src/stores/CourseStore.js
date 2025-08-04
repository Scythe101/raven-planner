import { writable, derived, get } from 'svelte/store';
import { authStore } from './AuthStore.js';
import { db } from '$lib/firebase/firebase.client';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

export const courseData = writable(null);
export const loadingCourseData = writable(false);
export const savingCourseData = writable(false);

export async function loadCourseData() {
	const currentUser = get(authStore).currentUser;
	const currentlyLoading = get(loadingCourseData);

	if (currentlyLoading) return; // Prevent multiple simultaneous loads

	loadingCourseData.set(true);

	try {
		const courseRef = doc(db, 'courses', 'cca');
		const courseSnap = await getDoc(courseRef);

		if (courseSnap.exists()) {
			const data = courseSnap.data();
			courseData.set(data);
			return data;
		} else {
			courseData.set(null);
			return null;
		}
	} catch (error) {
		console.error('Error loading data:', error);
		throw error;
	} finally {
		loadingCourseData.set(false);
	}
}

export async function saveCourseData() {
	let currentlySaving = get(savingCourseData);
	if (currentlySaving) return;

	loadingCourseData.set(true);
	try {
		const dataToSave = get(courseData);
		if (typeof dataToSave !== 'object') {
			console.error('No valid data to save');
			return;
		}

		const courseRef = doc(db, 'courses', 'cca');
		await setDoc(courseRef, dataToSave, { merge: true });
	} catch (error) {
		console.error('Error saving user data:', error);
	} finally {
		savingCourseData.set(false);
	}
}

import { writable } from 'svelte/store';
import { auth } from '../lib/firebase/firebase.client';
import {
	createUserWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	updateEmail,
	updatePassword,
	signInWithEmailAndPassword,
	sendEmailVerification,
	GoogleAuthProvider,
	signInWithPopup
} from 'firebase/auth';

export const authStore = writable({
	isLoading: true,
	currentUser: null
});

// TODO: add github auth
export const authHandlers = {
	logout: async () => {
		try {
			await signOut(auth);
		} catch (err) {
			console.error(err);
		}
	},
	googleSignIn: async () => {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
		} catch (err) {
			console.error(err);
		}
	}
};

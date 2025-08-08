import { writable } from 'svelte/store';
import { auth } from '../lib/firebase/firebase.client';
import { signOut, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from 'firebase/auth';

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
	},
	githubSignIn: async () => {
		try {
			const provider = new GithubAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
		} catch (error) {
			console.error(error);
		}
	}
};

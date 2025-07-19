import { writable } from 'svelte/store';
import { auth } from '../lib/firebase/firebase.client';
import { createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmail, updatePassword, signInWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const authStore = writable({
    isLoading: true,
    currentUser: null
});

//TODO: add try/catch for errors, Google sign-in
export const authHandlers = {
    signup: async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await sendEmailVerification(user);

    },
    login: async (email, password) => {
        try {
        await signInWithEmailAndPassword(auth, email, password);
        } catch(err) {
            console.error(err)
        }
    },
    logout: async () => {
        try {
            await signOut(auth);
        } catch(err){
            console.error(err);
        }
    },
    resetPassword: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch(err) {
            console.error(err);
        }
    },
    updateEmail: async (email) => {
        try {
            await updateEmail(auth, email);
        } catch(err) {
            console.error(err);
        }
    },
    updatePassword: async (password) => {
        await updatePassword(auth, password);
    },
    googleSignIn: async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider); // Use signInWithPopup instead of signInWithRedirect
            const user = result.user;
        } catch(err) {
            console.error(err);
        }
    }
}
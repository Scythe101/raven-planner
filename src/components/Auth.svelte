<script>
import { authHandlers, authStore } from '../stores/AuthStore';
import { auth } from "../lib/firebase/firebase.client";
import { onMount } from 'svelte';
import { getRedirectResult } from 'firebase/auth';
    let register = false;
    let email = '';
    let password = '';
    let confirmPassword = '';

    async function handleSubmit() {
        if ( !email || !password || (register && !confirmPassword) ) {
            return;
        }

        if ( register && password === confirmPassword ) {
            try {
                await authHandlers.signup(email, password);
            } catch (error) {
                console.error('Error during registration:', error);
            }
        } else {
            try {
                await authHandlers.login(email, password);
            } catch (error) {
                console.error('Error during login:', error);
            }
        }
        if ($authStore.currentUser) {
            window.location.href = '/app/home';
        }
    }
    onMount(async () => {
        console.log('onMount executed...');
        try {
            console.log('Checking for redirect result...');
            const result = await getRedirectResult(auth);
            if (result) {
                const user = result.user;
                console.log('Google Sign-In successful:', user);
                window.location.href = '/app/home';
            } else {
                console.log('No redirect result found.');
            }
        } catch (error) {
            console.error('Error handling Google Sign-In redirect:', error);
        }
    });
</script>
<div class="flex flex-col items-center justify-center">
    {#if register}
    <h1 class="font-bold">Sign Up</h1>
    {:else}
    <h1 class="font-bold">Log In</h1>
    {/if}
    <form class="flex flex-col gap-4">
        <label>
            <input bind:value={email} type="text" placeholder="Email"/>
        </label>
        <label>
            <input bind:value={password} type="password" placeholder="Password"/>
        </label>
        {#if register}
            <label>
                <input bind:value={confirmPassword} type="password" placeholder="Confirm Password"/>
            </label>
            <button type="submit" class="border-2" on:click={handleSubmit}>Sign Up</button>
            <button type="button" on:click={() => register = false}>Already have an account? Sign In</button>
        {:else}
            <button type="submit" class="border-2" on:click={handleSubmit}>Sign In</button>
            <button type="button" on:click={() => register = true}>Don't have an account? Sign Up</button>
        {/if}
        
<button 
    class="border-2 px-4 py-2 bg-red-500 text-white rounded"
    on:click={authHandlers.googleSignIn}
>
    Sign in with Google
</button>
    </form>
</div>
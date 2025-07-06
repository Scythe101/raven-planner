<script>
import { authHandlers, authStore } from '../stores/AuthStore';

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

    </form>
</div>
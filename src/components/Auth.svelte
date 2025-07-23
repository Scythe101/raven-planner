<script>
	import { authHandlers } from '../stores/AuthStore';
	import GoogleLogo from './GoogleLogo.svelte';
</script>

<div class="flex flex-col items-center justify-center">
	<h1 class="font-noto-serif mt-32 text-center text-4xl font-semibold">Choose an Auth Provider</h1>
	<p class="font-noto-serif mt-2 text-lg">
		Make sure to sign in with the one you made the account with!
	</p>
	<div class="mt-24 flex flex-col">
		<button
			class="font-noto-serif shadow-sharp flex h-16 w-72 cursor-pointer flex-row items-center justify-center gap-3 rounded-full bg-white px-4 py-2 text-lg font-semibold ring-2 shadow-slate-900 ring-slate-900"
			on:click={authHandlers.googleSignIn}
		>
			<GoogleLogo />
			Continue with Google
		</button>
	</div>
</div>

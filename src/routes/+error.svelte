<script>
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<div class="text-center">
		<h1 class="font-dm-serif-text -mb-3 font-medium not-italic">{page.status}</h1>
		<h1 class="font-noto-serif text-6xl font-medium not-italic">{page.error.message}</h1>
	</div>
	<a
		href="/"
		class="font-noto-serif shadow-sharp hover:shadow-sharp-hover mt-8 flex h-12 w-48 cursor-pointer flex-row items-center justify-center gap-3 rounded-full border-2 border-slate-900 bg-white px-4 py-2 text-lg font-semibold shadow-slate-900 transition-all duration-200 hover:-translate-0.5"
		>Return to Home</a
	>
</div>

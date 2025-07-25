<script>
	import { page } from '$app/state';

	import { auth } from '$lib/firebase/firebase.client';
	let currentPage = $derived(page.url.pathname);
</script>

<div
	class="shadow-sharp m-4
    box-content flex w-72 flex-col rounded-3xl bg-orange-50 p-6 ring-2 shadow-slate-900 ring-slate-900"
>
	<h1 class="">Raven Planner</h1>
	<div class="font-noto-serif mt-24 flex flex-col gap-8 text-2xl font-medium">
		<a
			href="/app"
			class={currentPage === '/app'
				? '-m-3 rounded-full bg-white p-3 ring-2 ring-slate-900'
				: 'hover:white appearance-none transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			>Home</a
		>
		<a
			class={currentPage === '/app/selection'
				? '-m-3 rounded-full bg-white p-3 ring-2 ring-slate-900'
				: 'hover:white appearance-none transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			href="/app/selection">Course Selection</a
		>
		<a
			class={currentPage.startsWith('/app/profiles')
				? '-m-3 rounded-full bg-white p-3 ring-2 ring-slate-900'
				: 'hover:white appearance-none transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			href="/app/profiles">Course Profiles</a
		>
		<a
			href="/app/requirements"
			class={currentPage === '/app/requirements'
				? '-m-3 rounded-full bg-white p-3 ring-2 ring-slate-900'
				: 'hover:white transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			>Graduation Reqs</a
		>
	</div>
	<div class="font-noto-serif mt-auto flex flex-col gap-6 text-2xl font-medium">
		<a
			class={currentPage === '/app/info'
				? '-m-2 rounded-full bg-white p-2 ring-2 ring-slate-900'
				: 'hover:white transition-all duration-200 hover:-m-2 hover:rounded-full hover:bg-white hover:p-2'}
			href="/app/settings">Info</a
		>
		<a
			class={currentPage === '/app/settings'
				? '-m-2 rounded-full bg-white p-2 ring-2 ring-slate-900'
				: 'hover:white transition-all duration-200 hover:-m-2 hover:rounded-full hover:bg-white hover:p-2'}
			href="/app/settings">Settings</a
		>
	</div>
	<div class="font-noto-serif mt-12 flex flex-col text-lg font-medium">
		<button
			class="-m-2 cursor-pointer rounded-full p-2 text-left ring-slate-900 transition-all duration-200 hover:bg-red-200 hover:ring-2"
			onclick={() => auth.signOut()}>Sign Out</button
		>
	</div>
</div>

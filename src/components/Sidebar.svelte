<script>
	import { page } from '$app/state';
	let currentPage = $derived(page.url.pathname);
</script>

<div
	class="shadow-sharp m-4
    box-content flex w-72 flex-col rounded-3xl bg-orange-50 p-6 ring-2 shadow-slate-900 ring-slate-900"
>
	<h1 class="font-dm-serif-display text-4xl italic">Raven Planner</h1>
	<div class="font-noto-serif mt-24 flex flex-col gap-8 text-2xl font-medium">
		<a
			href="/app"
			class={currentPage === '/app'
				? '-m-3 rounded-full border-2 border-slate-900 bg-white p-3'
				: 'hover:white appearance-none transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			>Home</a
		>
		<a
			class={currentPage === '/app/selection'
				? '-m-3 rounded-full border-2 border-slate-900 bg-white p-3'
				: 'hover:white appearance-none transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			href="/app/selection">Course Selection</a
		>
		<a
			class={currentPage.startsWith('/app/profiles')
				? '-m-3 rounded-full border-2 border-slate-900 bg-white p-3'
				: 'hover:white appearance-none transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			href="/app/profiles">Course Profiles</a
		>
		<a
			href="/app/requirements"
			class={currentPage === '/app/requirements'
				? '-m-3 rounded-full border-2 border-slate-900 bg-white p-3'
				: 'hover:white transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			>Graduation Reqs</a
		>
	</div>
	<a
		class="font-noto-serif mt-auto text-2xl font-medium {currentPage === '/app/settings'
			? '-m-3 rounded-full border-2 border-slate-900 bg-white'
			: 'hover:white transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}"
		href="/app/settings">Settings</a
	>
</div>

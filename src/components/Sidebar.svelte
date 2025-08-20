<script>
	import { page } from '$app/state';
	import { userData, currentSelection } from '$stores/UserStore';
	import LogOut from '$components/LogOut.svelte';
	import Settings from '$components/Settings.svelte';

	let currentPage = $derived(page.url.pathname);
	let selected = $state('selection');
</script>

<div
	id="sidebar"
	class="shadow-sharp m-4
    box-content flex w-72 flex-col rounded-3xl bg-orange-50 p-6 ring-2 shadow-slate-900 ring-slate-900"
>
	<a class="flex flex-row items-center gap-4" href="/">
		<img src="/planner.png" alt="raven planner" class="w-12" />

		<h2 class="w-fit">Raven Planner</h2>
	</a>
	<div class="font-noto-serif mt-12 flex flex-col gap-8 text-2xl font-medium">
		<a
			class={currentPage === '/app/selection'
				? 'sidebar-item-selected -m-3 rounded-full bg-white p-3 ring-2 ring-slate-900'
				: 'sidebar-item appearance-none transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			href="/app/selection">Course Selection</a
		>
		<a
			class={currentPage.startsWith('/app/profiles')
				? 'sidebar-item-selected -m-3 rounded-full bg-white p-3 ring-2 ring-slate-900'
				: 'sidebar-item appearance-none  transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			href="/app/profiles">Course Profiles</a
		>
		<a
			href="/app/requirements"
			class={currentPage === '/app/requirements'
				? 'sidebar-item-selected -m-3 rounded-full bg-white p-3 ring-2 ring-slate-900'
				: 'sidebar-item transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			>Graduation Reqs</a
		>
		<a
			class={currentPage === '/app/info'
				? 'sidebar-item-selected -m-3 rounded-full bg-white p-3 ring-2 ring-slate-900'
				: 'sidebar-item transition-all duration-200 hover:-m-3 hover:rounded-full hover:bg-white hover:p-3'}
			href="/app/info">Info</a
		>
	</div>
	<div class="font-noto-serif mt-auto flex flex-col gap-6 text-2xl font-medium"></div>

	<p class="text-secondary mb-4 italic">{$userData?.email}</p>
	<div class="flex flex-row items-center">
		<!-- settings is currently disabled -->
		<Settings />
		<div
			id="profile-selector"
			class="mx-4 grid flex-1 rounded-full bg-white ring-2 ring-slate-900 transition-all hover:bg-slate-200"
		>
			<svg
				class="relative right-10 z-10 col-start-1 row-start-1 h-4 w-4 self-center justify-self-end transition-all forced-colors:hidden"
				viewBox="0 0 16 16"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
					clip-rule="evenodd"
				></path>
			</svg>
			<select
				class="col-start-1 row-start-1 h-12 w-full appearance-none pr-3 text-center focus:outline-0"
				bind:value={selected}
				onchange={() => {
					currentSelection.set(selected);
				}}
			>
				<option value="selection">Profile 1</option>
				<option value="selection1">Profile 2</option>
				<option value="selection2">Profile 3</option>
			</select>
		</div>

		<LogOut />
	</div>
</div>

<script>
	import Sidebar from '$components/Sidebar.svelte';

	let { children } = $props();
</script>

<div class="h-screen-dvh w-screen-dvw flex xl:gap-8">
	<Sidebar class="fixed w-full bg-white xl:h-full" selection="home" />
	<div class="flex-1 overflow-y-auto">
		{@render children()}
	</div>
</div>

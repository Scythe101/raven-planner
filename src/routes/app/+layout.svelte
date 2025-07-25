<script>
	import Sidebar from '../../components/Sidebar.svelte';
	let { children } = $props();
</script>

<div class="h-screen-dvh flex gap-8">
	<Sidebar class="fixed h-full bg-white" selection="home" />
	<div class="flex-1 overflow-y-auto">
		{@render children()}
	</div>
</div>

<script>
	import '../app.css';
	

	let { children } = $props();
</script>

<main class="bg-amber-50 min-h-dvh">
	{@render children()}
</main>
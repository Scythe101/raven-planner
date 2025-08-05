<script>
	let { id, openFilter, color, filter } = $props();
	let isOpen = $derived($openFilter == id);
	function capitalize(str) {
		if (typeof str === 'string') {
			return str.replace(/^\w/, (c) => c.toUpperCase());
		} else {
			return '';
		}
	}
</script>

<div class="ml-1 w-fit">
	<button
		class="cursor-pointer bg-{color}-200"
		onclick={() => {
			if ($openFilter == id) {
				openFilter.set(null);
			} else {
				openFilter.set(id);
				console.log(id);
			}
		}}
	>
		{#if $filter}
			{capitalize(id) + ': ' + capitalize($filter)}
		{:else}
			{capitalize(id)}
		{/if}
	</button>
</div>

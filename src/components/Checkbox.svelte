<script>
	let { checked, text } = $props();
</script>

<div class="flex items-center gap-x-1">
	{#if checked}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6 text-green-600"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6 text-red-600"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
		</svg>
	{/if}
	<p class="text-xl">{text}</p>
</div>

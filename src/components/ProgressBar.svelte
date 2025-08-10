<script>
	let { lower, upper } = $props();
	let percentage = $derived((lower / upper) * 100);
	function bgColor() {
		if (percentage >= 100) {
			return '#86efac'; // green-300
		} else if (percentage > 50 && percentage < 100) {
			return '#bef264'; // lime-300
		} else if (percentage > 40 && percentage <= 50) {
			return '#fde047'; // yellow-200
		} else {
			return '#fca5a5'; // red-300
		}
	}
</script>

<div class="mt-2 flex w-3/4 flex-row items-center">
	<div
		class="shadow-sharp ml-0.5 h-6 flex-1 overflow-hidden rounded-full bg-white ring-2 shadow-slate-900 ring-slate-900"
	>
		{#if lower > 0}
			<div
				class="h-full rounded-full ring-2 ring-slate-900"
				style="width: {percentage}%; background-color: {bgColor()};"
			></div>
		{/if}
	</div>
	<p class="mt-0.5 ml-4">{lower}/{upper} Credits</p>
</div>

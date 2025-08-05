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
	function getColorClasses(color) {
		const colorMap = {
			red: 'bg-red-200 hover:bg-red-300',
			orange: 'bg-orange-200 hover:bg-orange-300',
			yellow: 'bg-yellow-200 hover:bg-yellow-300',
			green: 'bg-green-200 hover:bg-green-300',
			sky: 'bg-sky-200 hover:bg-sky-300',
			purple: 'bg-purple-200 hover:bg-purple-300'
		};
		return colorMap[color] || '';
	}
</script>

<div class="w-fit">
	<button
		class="cursor-pointer -my-1 py-1 -mx-2 px-2 rounded-full ring-slate-900 font-noto-serif duration-100 {$openFilter == id ? 'ring-2' : 'hover:ring-1'} {getColorClasses(color)}"
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

<script>
	import { capitalize } from '$lib';
	import { mode } from 'mode-watcher';
	let { id, openFilter, color, filter } = $props();
	function getColorClasses(color) {
		let colorMap = {
			red: 'bg-red-200 hover:bg-red-300',
			orange: 'bg-orange-200 hover:bg-orange-300',
			yellow: 'bg-yellow-200 hover:bg-yellow-300',
			green: 'bg-green-200 hover:bg-green-300',
			sky: 'bg-sky-200 hover:bg-sky-300',
			purple: 'bg-purple-200 hover:bg-purple-300'
		};
		if (mode.current === 'dark') {
			colorMap = {
				red: 'bg-ctp-red-950 hover:bg-ctp-red-900',
				orange: 'bg-ctp-peach-950 hover:bg-ctp-peach-900',
				yellow: 'bg-ctp-yellow-950 hover:bg-ctp-yellow-900',
				green: 'bg-ctp-green-950 hover:bg-ctp-green-950',
				sky: 'bg-ctp-blue-950 hover:bg-ctp-blue-900',
				purple: 'bg-ctp-lavender-950 hover:bg-ctp-lavender-900'
			};
		}
		return colorMap[color] || '';
	}
</script>

<div class="w-fit">
	<button
		class="class-filter font-noto-serif -mx-2 -my-1 cursor-pointer rounded-full px-2 py-1 ring-slate-900 duration-100 {$openFilter ==
		id
			? 'ring-2'
			: 'hover:ring-1'} {getColorClasses(color)}"
		onclick={() => {
			if ($openFilter === id) {
				openFilter.set(null);
			} else {
				openFilter.set(id);
				// console.log(id);
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

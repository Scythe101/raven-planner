<script>
	let { fall, courses } = $props();
</script>

<div
	class="shadow-sharp h-72 w-1/2 rounded-lg ring-2 shadow-slate-900 ring-slate-900 {fall === 'true'
		? 'bg-orange-300'
		: 'bg-pink-300'}"
>
	<h3
		class="font-dm-serif-display m-2 flex h-8 w-16 items-center justify-center rounded-full bg-white italic ring-2 ring-slate-900"
	>
		{fall === 'true' ? 'Fall' : 'Spring'}
	</h3>
	{#if courses}
		<p>{courses[0]}</p>
	{/if}
</div>

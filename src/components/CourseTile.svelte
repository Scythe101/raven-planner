<script>
	let { name, difficulty, type, homework, url, credits } = $props();
	function capitalize(str) {
		if (typeof str === 'string') {
			return str.replace(/^\w/, (c) => c.toUpperCase());
		} else {
			return '';
		}
	}
</script>

<a
	class="shadow-sharp hover:shadow-sharp-hover mt-1 ml-1 h-40 rounded-lg border-2 border-slate-900 bg-rose-100 p-3 shadow-slate-900 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:bg-rose-200"
	href={url}
>
	<h3 class="text-lg font-bold">{name}</h3>
	<p>{capitalize(difficulty)}</p>
	<p>{credits} Credits</p>
	<p>{homework} Minutes</p>
</a>

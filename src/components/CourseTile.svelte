<script>
	import { capitalize } from '$lib';
	let { name, difficulty, homework, url, credits } = $props();
</script>

<a
	class="course-tile shadow-sharp hover:shadow-sharp-hover mt-1 ml-1 h-40 rounded-lg border-2 border-slate-900 bg-red-100 p-3 shadow-slate-900 transition-all duration-200 hover:-translate-0.5 hover:bg-red-200 2xl:h-44"
	href={url}
>
	<h3 class="font-noto-serif text-lg font-bold not-italic">{name}</h3>
	<p>{capitalize(difficulty)}</p>
	<p>{credits} Credits</p>
	<p>{homework} Minutes</p>
</a>

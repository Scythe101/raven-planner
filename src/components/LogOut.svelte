<script>
	import { authHandlers } from '$stores/AuthStore';

	let isAnimating = false;

	function handleMouseEnter() {
		if (!isAnimating) {
			isAnimating = true;
			setTimeout(() => {
				isAnimating = false;
			}, 400);
		}
	}
</script>

<button
	id="logout-button"
	class="group/logout flex size-12 cursor-pointer items-center justify-center rounded-full bg-red-200 p-2 text-left ring-2 ring-slate-900 transition-all duration-200 hover:bg-red-300"
	onclick={() => authHandlers.logout()}
	onmouseenter={handleMouseEnter}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-6"
	>
		<!-- Box path -->
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
		/>
		<!-- Arrow path -->
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12 9l-3 3m0 0 3 3m-3-3h12.75"
			class="arrow"
			class:animate={isAnimating}
		/>
	</svg>
</button>

<style>
	.arrow {
		transition: transform 0.3s ease-in-out;
	}

	.arrow.animate {
		animation: arrow-slide-out-in 0.4s ease-in-out forwards;
	}

	@keyframes arrow-slide-out-in {
		0% {
			transform: translateX(0);
			opacity: 1;
		}
		50% {
			transform: translateX(-40px);
			opacity: 0;
		}
		51% {
			transform: translateX(40px);
			opacity: 0;
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>

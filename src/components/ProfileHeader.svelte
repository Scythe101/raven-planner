<script>
	import { db } from '$lib/firebase/firebase.client';
	import { doc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { authStore } from '$stores/AuthStore';

	let { course } = $props();
	let profileData = $state({});
	let isLoading = false;

	onMount(async () => {
		if ($authStore.currentUser) {
			await loadData();
		}
	});

	$effect(() => {
		if ($authStore.currentUser && !$authStore.isLoading) {
			loadData();
		}
	});

	async function loadData() {
		if (isLoading) return;
		isLoading = true;
		try {
			const courseRef = doc(db, 'courses', 'cca');
			const courseSnap = await getDoc(courseRef);
			if (courseSnap.exists()) {
				const courseData = courseSnap.data();
				// TODO: optimize loading... currently it fetches the whole CCA document ;-;
				profileData = courseData[course];
			}
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			isLoading = false;
		}
	}

	function capitalize(str) {
		if (typeof str === 'string') {
			return str.replace(/^\w/, (c) => c.toUpperCase());
		} else {
			return '';
		}
	}
</script>

<h1 class="font-dm-serif-display mb-8 text-4xl italic">{course}</h1>

<h2 class="font-dm-serif-display mb-2 text-3xl italic">Quick Info</h2>
<div class="flex flex-row gap-12">
	<div class="flex-col">
		<h1 class="font-dm-serif-display text-lg italic">Type</h1>
		{#if !isLoading && profileData.type}
			<p class="font-noto-serif -mt-2 text-2xl">{capitalize(profileData.type)}</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-14 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
	<div class="flex-col">
		<h1 class="font-dm-serif-display text-lg italic">Difficulty</h1>
		{#if !isLoading && profileData.difficulty}
			<p class="font-noto-serif -mt-2 text-2xl">{capitalize(profileData.difficulty)}</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-14 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
	<div class="flex-col">
		<h1 class="font-dm-serif-display text-lg italic">Homework</h1>
		{#if !isLoading && profileData.homework}
			<p class="font-noto-serif -mt-2 text-2xl">{profileData.homework} Minutes</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-32 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
	<div class="flex-col">
		<h1 class="font-dm-serif-display text-lg italic">Credits</h1>
		{#if !isLoading && profileData.credits}
			<p class="font-noto-serif -mt-2 text-2xl">{profileData.credits} Credits</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-20 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
	<div class="flex-col">
		<h1 class="font-dm-serif-display text-lg italic">Academic?</h1>
		{#if !isLoading && profileData.academic}
			<p class="font-noto-serif -mt-2 text-2xl">{profileData.academic ? 'Yes' : 'No'}</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-8 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
	<div class="flex-col">
		<h1 class="font-dm-serif-display text-lg italic">Weighted?</h1>
		{#if !isLoading && profileData.weighted}
			<p class="font-noto-serif -mt-2 text-2xl">{profileData.weighted ? 'Yes' : 'No'}</p>
		{:else}
			<div class="flex h-5 items-center">
				<div class="h-2 w-8 animate-pulse rounded bg-orange-200"></div>
			</div>
		{/if}
	</div>
</div>

<script lang="ts">
	import { getSelectedSpace, clearSelectedSpace } from '$lib/store.svelte';
	import type { SpaceT } from '$lib/types';
	import { getLocationOpenInformation } from '$lib/utils';
	import { IsUrlTag, IsDetailTag } from '$lib/types';
	import Lightbox from './Lightbox.svelte';
	import { toggleFavorite, isFavorite, getUserLocation } from '$lib/store.svelte';

	let isOpen = $state(false);
	let startY = $state(0);
	let currentY = $state(0);
	let isDragging = $state(false);

	const selectedSpace = $derived(getSelectedSpace());
	const space = $derived(selectedSpace?.space);
	const locationIndex = $derived(selectedSpace?.location ?? 0);
	const favorited = $derived(space ? isFavorite(space.name) : false);

	$effect(() => {
		if (space) {
			isOpen = true;
		}
	});

	function handleTouchStart(e: TouchEvent) {
		startY = e.touches[0].clientY;
		isDragging = true;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isDragging) return;
		currentY = e.touches[0].clientY;
		const diff = currentY - startY;
		if (diff > 0) {
			e.preventDefault();
		}
	}

	function handleTouchEnd() {
		if (!isDragging) return;
		isDragging = false;
		const diff = currentY - startY;
		if (diff > 100) {
			closeSheet();
		}
		currentY = 0;
	}

	function closeSheet() {
		isOpen = false;
		setTimeout(() => {
			clearSelectedSpace();
		}, 300);
	}

	function openInMaps(space: SpaceT, locationIdx: number) {
		function esc(unsafe: string): string {
			return unsafe
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;')
				.replaceAll('"', '&quot;')
				.replaceAll("'", '&#039;');
		}

		const userLoc = getUserLocation().location?.coords;
		if (!userLoc) {
			const approxId = `${space.name}, ${space.location[locationIdx].address}`;
			window.open(`https://www.google.com/maps?q=${esc(approxId)}`, '_blank');
			return;
		}

		const travelMode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'transit';
		const url = `https://www.google.com/maps/dir/?api=1&travelmode=${travelMode}&origin=${userLoc.latitude},${userLoc.longitude}&destination=${space.location[locationIdx].coordinates.lat},${space.location[locationIdx].coordinates.lng}`;
		window.open(url, '_blank');
	}
</script>

{#if space}
	<!-- Backdrop (mobile only) -->
	<div
		class="fixed inset-0 bg-black/50 z-[6000] transition-opacity duration-300 md:hidden"
		class:opacity-0={!isOpen}
		class:opacity-100={isOpen}
		class:pointer-events-none={!isOpen}
		onclick={closeSheet}
	/>

	<!-- Bottom Sheet (mobile) -->
	<div
		class="fixed bottom-0 left-0 right-0 bg-[#f9f8f3] z-[6001] transition-transform duration-300 ease-out md:hidden"
		style="transform: translateY({isOpen ? '0' : '100%'}); box-shadow: 10px -10px 0px -3px #343333;"
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
	>
		<!-- Handle bar -->
		<div class="w-full flex justify-center pt-3 pb-2" onclick={closeSheet}>
			<div class="w-12 h-1.5 bg-gray-400 rounded-full"></div>
		</div>

		<div class="px-4 pb-6 max-h-[70vh] overflow-y-auto">
			<!-- Header -->
			<div class="flex justify-between items-start mb-3">
				<div>
					<h2 class="text-xl font-bold">{space.name}</h2>
					<p class="text-sm text-gray-600">{space.location[locationIndex].address}</p>
				</div>
				<button
					class="text-2xl transition-transform hover:scale-110"
					class:text-red-500={favorited}
					class:text-gray-300={!favorited}
					onclick={() => toggleFavorite(space.name)}
				>
					{favorited ? '♥' : '♡'}
				</button>
			</div>

			<!-- Image -->
			{#if space.images && space.images.length > 0}
				<Lightbox
					images={space.images.map((x: string) => `/images/${space.city}/${x}`)}
					mainImageClass="rounded-lg w-full h-48 object-cover"
					lightboxImageClass="rounded-lg shadow-black"
				/>
			{/if}

			<!-- Description -->
			<p class="text-sm mt-3 mb-4">{space.description}</p>

			<!-- Open Status -->
			{#if true}
				{@const hours = getLocationOpenInformation(new Date(), space)}
				<div class="flex items-center gap-2 mb-4">
					{#if hours.status === 'open'}
						<span class="px-2 py-1 bg-green-700 text-white rounded text-sm">Open</span>
						{#if hours.till}
							<span class="text-sm">
								Closes in {#if hours.till.hours > 0}{hours.till.hours} hrs
								{/if}{hours.till.minutes} mins
							</span>
						{:else}
							<span class="text-sm">Always open</span>
						{/if}
					{:else}
						<span
							class="px-2 py-1 {hours.from
								? 'bg-yellow-600'
								: 'bg-red-700'} text-white rounded text-sm">Closed</span
						>
						{#if hours.from}
							<span class="text-sm"
								>Opens in {#if hours.from.hours > 0}{hours.from.hours} hrs
								{/if}{hours.from.minutes} mins</span
							>
						{/if}
					{/if}
				</div>
			{/if}

			<!-- Tags -->
			{#if space.tags}
				<div class="flex flex-wrap gap-1 mb-4">
					{#each space.tags as tag}
						{#if typeof tag === 'string'}
							<span class="px-2 py-1 bg-white rounded shadow text-xs">{tag}</span>
						{:else if IsUrlTag(tag)}
							<button
								class="px-2 py-1 bg-primary-700 text-white rounded shadow text-xs animate-pulse"
								onclick={() => window.open(tag.url, '_blank')}
							>
								{tag.label}
							</button>
						{:else if IsDetailTag(tag)}
							<button
								class="px-2 py-1 bg-primary-700 text-white rounded shadow text-xs animate-pulse"
								onclick={() => alert(tag.detail)}
							>
								{tag.label}
							</button>
						{/if}
					{/each}
				</div>
			{/if}

			<!-- Action Button -->
			<button
				class="w-full px-4 py-3 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-800 font-medium"
				onclick={() => openInMaps(space, locationIndex)}
			>
				Visit Space!
			</button>
		</div>
	</div>

	<!-- Desktop Card -->
	<div
		class="hidden md:block fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#f9f8f3] z-[6001] max-w-2xl w-[calc(100%-2rem)] transition-all duration-300"
		style="box-shadow: 10px 10px 0px -3px #343333;"
		class:opacity-0={!isOpen}
		class:opacity-100={isOpen}
		class:translate-y-4={!isOpen}
		class:translate-y-0={isOpen}
		class:pointer-events-none={!isOpen}
	>
		<div class="px-6 py-5 max-h-[50vh] overflow-y-auto">
			<!-- Header -->
			<div class="flex justify-between items-start mb-3">
				<div>
					<h2 class="text-xl font-bold">{space.name}</h2>
					<p class="text-sm text-gray-600">{space.location[locationIndex].address}</p>
				</div>
				<div class="flex items-center gap-3">
					<button
						class="text-2xl transition-transform hover:scale-110"
						class:text-red-500={favorited}
						class:text-gray-300={!favorited}
						onclick={() => toggleFavorite(space.name)}
					>
						{favorited ? '♥' : '♡'}
					</button>
					<button
						class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
						onclick={closeSheet}
						aria-label="Close"
					>
						×
					</button>
				</div>
			</div>

			<div class="flex gap-4">
				<!-- Image -->
				{#if space.images && space.images.length > 0}
					<div class="flex-shrink-0">
						<Lightbox
							images={space.images.map((x: string) => `/images/${space.city}/${x}`)}
							mainImageClass="rounded-lg w-48 h-32 object-cover"
							lightboxImageClass="rounded-lg shadow-black"
						/>
					</div>
				{/if}

				<div class="flex-1">
					<!-- Description -->
					<p class="text-sm mb-4">{space.description}</p>

					<!-- Open Status -->
					{#if true}
						{@const hours = getLocationOpenInformation(new Date(), space)}
						<div class="flex items-center gap-2 mb-4">
							{#if hours.status === 'open'}
								<span class="px-2 py-1 bg-green-700 text-white rounded text-sm">Open</span>
								{#if hours.till}
									<span class="text-sm">
										Closes in {#if hours.till.hours > 0}{hours.till.hours} hrs
										{/if}{hours.till.minutes} mins
									</span>
								{:else}
									<span class="text-sm">Always open</span>
								{/if}
							{:else}
								<span
									class="px-2 py-1 {hours.from
										? 'bg-yellow-600'
										: 'bg-red-700'} text-white rounded text-sm">Closed</span
								>
								{#if hours.from}
									<span class="text-sm"
										>Opens in {#if hours.from.hours > 0}{hours.from.hours} hrs
										{/if}{hours.from.minutes} mins</span
									>
								{/if}
							{/if}
						</div>
					{/if}

					<!-- Tags -->
					{#if space.tags}
						<div class="flex flex-wrap gap-1 mb-4">
							{#each space.tags as tag}
								{#if typeof tag === 'string'}
									<span class="px-2 py-1 bg-white rounded shadow text-xs">{tag}</span>
								{:else if IsUrlTag(tag)}
									<button
										class="px-2 py-1 bg-primary-700 text-white rounded shadow text-xs animate-pulse"
										onclick={() => window.open(tag.url, '_blank')}
									>
										{tag.label}
									</button>
								{:else if IsDetailTag(tag)}
									<button
										class="px-2 py-1 bg-primary-700 text-white rounded shadow text-xs animate-pulse"
										onclick={() => alert(tag.detail)}
									>
										{tag.label}
									</button>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Action Button -->
			<button
				class="w-full px-4 py-3 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-800 font-medium mt-4"
				onclick={() => openInMaps(space, locationIndex)}
			>
				Visit Space!
			</button>
		</div>
	</div>
{/if}

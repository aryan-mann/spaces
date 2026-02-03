<script lang="ts">
	import {
		getSelectedSpace,
		setSelectedSpace,
		getUserLocation,
		toggleFavorite,
		isFavorite
	} from '$lib/store.svelte';
	import { IsUrlTag, type OpenInformationT, type SpaceT, IsDetailTag } from '$lib/types';
	import { scrollIntoCenterOnDoubleClick } from '$lib/usetils';
	import { getLocationOpenInformation } from '$lib/utils';
	import '@splidejs/svelte-splide/css';
	import Lightbox from './Lightbox.svelte';

	interface Props {
		location: SpaceT;
		spaceChainNumber?: number;
	}

	let { location, spaceChainNumber = 0 }: Props = $props();

	let rootDiv: HTMLElement | null = $state(null);
	let isSelected = $state(false);

	const selectedSpace = $derived(getSelectedSpace());
	const userLocation = $derived(getUserLocation());
	const favorited = $derived(isFavorite(location.name));

	$effect(() => {
		isSelected = selectedSpace?.space === location && selectedSpace?.location === spaceChainNumber;
		if (isSelected && rootDiv) {
			rootDiv.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
		}
	});

	const imageAlt = `Space at ${location?.location[spaceChainNumber].address || location.name}`;
	const currentTime = new Date();
	const hours: OpenInformationT = getLocationOpenInformation(currentTime, location);

	let infoPanelOpen = $state(false);

	function openInMaps() {
		function esc(unsafe: string): string {
			return unsafe
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;')
				.replaceAll('"', '&quot;')
				.replaceAll("'", '&#039;');
		}

		const userLoc = userLocation.location?.coords;
		if (!userLoc) {
			const approxId = `${location.name}, ${location.location[spaceChainNumber].address}`;
			window.open(`https://www.google.com/maps?q=${esc(approxId)}`, '_blank');
			return;
		}

		const travelMode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'transit';
		const url = `https://www.google.com/maps/dir/?api=1&travelmode=${travelMode}&origin=${userLoc.latitude},${userLoc.longitude}&destination=${location.location[spaceChainNumber].coordinates.lat},${location.location[spaceChainNumber].coordinates.lng}`;
		window.open(url, '_blank');
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={rootDiv}
	data-location={location.name}
	data-selected={isSelected}
	class="location-card"
	ondblclick={() => {
		setSelectedSpace(location, spaceChainNumber);
	}}
	use:scrollIntoCenterOnDoubleClick
>
	<div class="w-[300px] md:w-[450px] select-none cursor-grabbing">
		<p class="text-sm md:text-md mb-2 text-center">{location.location[spaceChainNumber].address}</p>
		{#if location.images && location.images.length > 0}
			<Lightbox
				images={location.images.map((x) => `/images/${location.city}/${x}`)}
				mainImageClass="rounded max-h-52 w-full object-cover shadow"
				lightboxImageClass="rounded-lg shadow-black"
			/>
		{:else}
			<img class="location-image" alt={imageAlt} src="https://picsum.photos/seed/picsum/600/450" />
		{/if}
		<div class="flex justify-between items-center mt-4">
			<p class="text-lg md:text-2xl mb-1">{location.name}</p>
			<div class="flex items-center gap-2">
				<button
					class="text-2xl transition-transform hover:scale-110"
					class:text-red-500={favorited}
					class:text-gray-300={!favorited}
					onclick={() => toggleFavorite(location.name)}
					aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
				>
					{favorited ? '♥' : '♡'}
				</button>
				<p class="text-lg">#{spaceChainNumber + 1}</p>
			</div>
		</div>
		<p class="text-sm md:text-base mb-4">{location.description}</p>
		<div class="flex relative gap-3 items-center">
			{#if !infoPanelOpen}
				{#if hours.status === 'open'}
					<div class="flex justify-between items-center w-full flex-wrap gap-1">
						<span class="text-sm md:text-base px-2 py-1 bg-green-700 text-white rounded">Open</span>
						{#if hours.till}
							<span
								>Closes in
								{#if hours.till.hours > 0}
									{hours.till.hours} hrs & {' '}
								{/if}
								{#if hours.till.minutes > 0}
									{hours.till.minutes} mins
								{:else}
									under a minute
								{/if}
							</span>
						{:else}
							<span>Always open</span>
						{/if}
					</div>
				{:else}
					<div class="flex justify-between items-center w-full">
						<span
							class="text-sm md:text-base px-2 py-1 {hours.from
								? 'bg-yellow-600'
								: 'bg-red-700'} text-white rounded">Closed</span
						>
						{#if hours.from}
							<span
								>Opens in {#if hours.from.hours > 0}{hours.from.hours} hrs & {' '}{/if}{hours.from
									.minutes} mins</span
							>
						{:else}
							<span>Opens tomorrow</span>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
		<div class="flex items-center justify-center mt-2">
			<button
				class="px-2 py-1 bg-primary-600 text-white rounded shadow max-w-[140px] hover:bg-primary-800"
				onclick={() => openInMaps()}
			>
				Visit Space!
			</button>
		</div>
		{#if location.tags}
			<div class="tags">
				{#each location.tags as tag}
					{#if typeof tag === 'string'}
						<span class="tag">{tag}</span>
					{:else if IsUrlTag(tag)}
						<span
							class="tag detailed"
							onclick={() => {
								window.open(tag.url, '_blank');
							}}>{tag.label}</span
						>
					{:else if IsDetailTag(tag)}
						<span
							class="tag detailed"
							onclick={() => {
								alert(tag.detail);
							}}>{tag.label}</span
						>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.location-card {
		@apply px-4 py-4 bg-[#f9f8f3] border-black border-[1px] active:bg-[#fce2ae];

		&[data-selected='false'] {
			box-shadow: 10px 10px 0px -3px #343333;
		}
		&[data-selected='true'] {
			box-shadow: 10px 10px 0px -3px #9f7e2a;
		}

		.location-image-slider {
			@apply relative mb-2;

			.pagination {
				@apply bg-[#343333] py-1 text-white rounded-b;
			}
		}

		.tags {
			@apply mt-2 flex items-center gap-1 w-full flex-wrap p-1;

			.tag {
				@apply rounded shadow text-xs px-2 py-1 bg-white text-black;

				&.detailed {
					@apply animate-pulse bg-primary-700 text-white hover:bg-primary-800 cursor-pointer;
				}
			}
		}

		.location-image {
			@apply mb-4 h-52 w-full rounded shadow object-cover;
		}
	}
</style>

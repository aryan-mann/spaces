<script lang="ts">
	import { selectedSpace, userLocation } from '$lib/store';
	import { IsUrlTag, type CityT, type OpenInformationT, type SpaceT, IsDetailTag } from '$lib/types';
	import { scrollIntoCenterOnDoubleClick } from '$lib/usetils';
	import {  getLocationOpenInformation } from '$lib/utils';
	import '@splidejs/svelte-splide/css';
	import Lightbox from './Lightbox.svelte';

	export let location: SpaceT;
	export let spaceChainNumber: number = 0;

	let rootDiv: HTMLElement | null = null;
	let isSelected = false;
	$: {
		isSelected = $selectedSpace === location;
		if (isSelected && rootDiv) {
			rootDiv.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
		}
	}

	const imageAlt = `Space at ${location?.location[spaceChainNumber].address || location.name}`;
	const currentTime = new Date();
	const hours: OpenInformationT = getLocationOpenInformation(currentTime, location);

	let infoPanelOpen: boolean = false;

	function openInMaps() {
		function esc(unsafe: string): string {
			return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
		}

		const userLoc = $userLocation.location?.coords;
		if (!userLoc) {
			const approxId = `${location.name}, ${location.location[spaceChainNumber].address}`
			window.open(`https://www.google.com/maps?q=${esc(approxId)}`, "_blank");
			return;
		}

		const travelMode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'transit';
		const url = `https://www.google.com/maps/dir/?api=1&travelmode=${travelMode}&origin=${userLoc.latitude},${userLoc.longitude}&destination=${location.location[spaceChainNumber].coordinates.lat},${location.location[spaceChainNumber].coordinates.lng}`
		window.open(url, "_blank");
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	bind:this={rootDiv}
	data-location={location.name}
	data-selected={isSelected}
	class="location-card"
	on:dblclick={() => { $selectedSpace = location; }}
	use:scrollIntoCenterOnDoubleClick
>
	<div class="w-[300px] md:w-[450px] select-none cursor-grabbing">
		<p class="text-sm md:text-md mb-2 text-center">{location.location[spaceChainNumber].address}</p>
		<!-- Top buttons 
		<div class="top-buttons-container grid grid-cols-3 gap-4 items-stretch justify-center mb-2">
			<div class="flex text-gray-800 rounded items-center justify-center text-sm">
				<p>
				{#if $userLocation?.location?.coords && location.coordinates}
					{@const dist = distanceToUser($userLocation.location, location.coordinates, 'ms')}
					🚶 {Math.round((dist.distance / 1.5)*0.0166667)} mins 🚶‍♀️
				{:else if $userLocation.loading}
					...
				{:else}
				    ...
				{/if}
				</p>
			</div>
			<button class="px-2 py-1 bg-secondary-600 text-white rounded shadow max-w-[100px] hover:bg-primary-400" on:click={() => openInMaps()}>
				Navigate
			</button>
			<div class="flex items-center justify-center">
				{#if location.rating}
				<div>
					{#each getStarRating(location.rating).split('') as c}
					<span class="text-yellow-600">{c}</span>
					{/each}
				</div>
				{/if}
			</div>
		</div> -->
		{#if location.images && location.images.length > 0}
			<Lightbox 
				images={location.images.map(x => `/images/${location.city}/${x}`)}
				mainImageClass="rounded max-h-52 w-full object-cover shadow"
				lightboxImageClass="rounded-lg shadow-black"
			/>
		{:else}
			<img class="location-image" alt={imageAlt} src="https://picsum.photos/seed/picsum/600/450" />
		{/if}
		<div class="flex justify-between items-center mt-4">
			<p class="text-lg md:text-2xl mb-1">{location.name}</p>
			<p class="text-lg">#{spaceChainNumber+1}</p>
		</div>
        <p class="text-sm md:text-base mb-4">{location.description}</p>
		<div class="flex relative gap-3 items-center">
			{#if !infoPanelOpen}
			{#if hours.status === "open"}
				<div class="flex justify-between items-center w-full flex-wrap gap-1">
					<span class="text-sm md:text-base px-2 py-1 bg-green-700 text-white rounded">Open</span>
				{#if hours.till}
				<span>Closes in 
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
					<span class={`text-sm md:text-base px-2 py-1 ${hours.from ? 'bg-yellow-600': 'bg-red-700'} text-white rounded`}>Closed</span>
					{#if hours.from}
					<span>Opens in {#if hours.from.hours > 0}{hours.from.hours} hrs & {' '}{/if}{hours.from.minutes} mins</span>
					{:else}
					<span>Opens tomorrow</span>
					{/if}
				</div>
			{/if}
			{:else}
		<!-- <div class="absolute bg-primary-900 text-white rounded shadow px-3 py-2">
				<ul>
					<li>Monday: 9am – 5pm</li>
					<li>Tuesday: 9am – 5pm</li>
					<li>Wednesday: 9am – 5pm</li>
					<li>Thursday: 9am – 5pm</li>
					<li>Friday: 9am – 5pm</li>
					<li>Saturday: 9am – 5pm</li>
					<li>Sunday: 9am – 5pm</li>
				</ul>
			</div> -->
			{/if}
			<!-- <div class="flex justify-end flex-grow">
				<div on:click={() => { 
					// Temporarily disabled because information above is not updated based on the space yet 
					// infoPanelOpen = !infoPanelOpen; 
				}} class="p-1 cursor-pointer hover:font-bold">ⓘ</div>
			</div> -->
		</div>
		<div class="flex items-center justify-center mt-2">
			<button class="px-2 py-1 bg-primary-600 text-white rounded shadow max-w-[140px] hover:bg-primary-800" on:click={() => openInMaps()}>
				Visit Space!
			</button>
		</div>
        {#if location.tags}
        <div class="tags">
        {#each location.tags as tag}
			{#if typeof tag === "string"}
            <span class="tag">{tag}</span>
			{:else if IsUrlTag(tag)}
			<span class="tag detailed" on:click={() => { window.open(tag.url, "_blank"); }}>{tag.label}</span>
			{:else if IsDetailTag(tag)}
			<span class="tag detailed" on:click={() => { alert(tag.detail); }}>{tag.label}</span>
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
			box-shadow: 10px 10px 0px -3px #9F7E2A;
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

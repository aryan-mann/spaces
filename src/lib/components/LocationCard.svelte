<script lang="ts">
	import { selectedSpace, userLocation } from '$lib/store';
	import type { CityT, OpenInformationT, SpaceT } from '$lib/types';
	import { scrollIntoCenterOnDoubleClick } from '$lib/usetils';
	import { distanceToUser, parseOpeningHours } from '$lib/utils';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';

	export let location: SpaceT;
	export let city: CityT;

	let rootDiv: HTMLElement | null = null;
	let isSelected = false;
	$: {
		isSelected = $selectedSpace === location;
		if (isSelected && rootDiv) {
			rootDiv.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
		}
	}

	const imageAlt = `Space at ${location?.address || location.name}`;
	const currentTime = new Date();
	const hours: OpenInformationT = parseOpeningHours(currentTime, location.openingHours);

	function openInMaps() {
		function esc(unsafe: string): string {
			return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
		}

		const userLoc = $userLocation.location?.coords;
		if (!userLoc) {
			const approxId = `${location.name}, ${location.address}`
			window.open(`https://www.google.com/maps?q=${esc(approxId)}`, "_blank");
			return;
		}

		const travelMode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'transit';
		const url = `https://www.google.com/maps/dir/?api=1&travelmode=${travelMode}&origin=${userLoc.latitude},${userLoc.longitude}&destination=${location.coordinates.lat},${location.coordinates.lng}`
		window.open(url, "_blank");
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	bind:this={rootDiv}
	data-location={location.name}
	data-selected={isSelected}
	class="location-card"
	use:scrollIntoCenterOnDoubleClick
>
	<div class="w-[300px] md:w-[450px] select-none cursor-grabbing">
		<div class="flex justify-between items-center">
			<p class="text-sm">
				{#if $userLocation?.location?.coords && location.coordinates}
					{distanceToUser($userLocation.location, location.coordinates, 'ms')} away
				{/if}
			</p>
			<button on:click={() => openInMaps()}>Go</button>
			<p class="underline cursor-pointer" on:click={() => { $selectedSpace = location; }}>Select on map</p>
		</div>
		{#if location.images && location.images.length > 0}
			{#if location.images.length > 1}
				<Splide
					hasTrack={false}
					class="location-image-slider"
					aria-label={`Images of ${location.name}`}
					options={{
						gap: '1rem',
						arrows: false,
					}}
				>
					<SplideTrack>
						{#each location.images as locImage (locImage)}
							<SplideSlide>
								<img
									class="location-image"
									alt={imageAlt}
									src={`/images/${city.slug}/${locImage}`}
								/>
							</SplideSlide>
						{/each}
					</SplideTrack>
                    <ul class="pagination splide__pagination"></ul>
				</Splide>
			{:else}
				<img
					class="location-image"
					alt={imageAlt}
					src={`/images/${city.slug}/${location.images[0]}`}
				/>
			{/if}
		{:else}
			<img class="location-image" alt={imageAlt} src="https://picsum.photos/seed/picsum/600/450" />
		{/if}
		<div class="flex justify-between items-center mt-2">
			<p class="text-2xl mb-1">{location.name}</p>
		</div>
        <p class="mb-2">{location.description}</p>
		<div class="flex gap-3 items-center">
			{#if hours.open}
				<span class="px-2 py-1 bg-green-700 text-white rounded">Open</span>
				{#if hours.till}
				<span>Closes in {#if hours.till.hours > 0}{hours.till.hours} hrs & {' '}{/if}{hours.till.minutes} mins</span>
				{:else}
				<span>Always open</span>
				{/if}
			{:else}
				<span class="px-2 py-1 bg-red-700 text-white rounded">Closed</span>
				{#if hours.from}
				<span>Opens in {#if hours.from.hours > 0}{hours.from.hours} hrs & {' '}{/if}{hours.from.minutes} mins</span>
				{:else}
				<span>Temporarily closed for renovation</span>
				{/if}
			{/if}
			<div class="flex justify-end flex-grow">
				<div class="p-1 cursor-pointer hover:font-bold">ⓘ</div>
			</div>
		</div>
        {#if location.tags}
        <div class="tags">
        {#each location.tags as tag}
            <span class="tag">{tag}</span>
        {/each}
        </div>
        {/if}
	</div>
</div>

<style lang="scss">
	.location-card {
		@apply px-4 py-4 bg-blue-50 rounded border-black border-[1px] hover:bg-blue-100;

		&[data-selected='false'] {
			box-shadow: 10px 10px 0px -3px #343333;
		}
		&[data-selected='true'] {
			box-shadow: 10px 10px 0px -3px #fd8700;
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
            }
        }

		.location-image {
			@apply mb-4 h-52 w-full rounded shadow object-cover;
		}
	}
</style>

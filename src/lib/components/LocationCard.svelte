<script lang="ts">
	import { selectedSpace } from '$lib/store';
	import type { CityT, SpaceT } from '$lib/types';
	import { scrollIntoCenterOnDoubleClick } from '$lib/usetils';
	import { distanceToUser } from '$lib/utils';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';

	export let location: SpaceT;
	export let city: CityT;
	export let userLocation: GeolocationPosition | null;

	let rootDiv: HTMLElement | null = null;
	let isSelected = false;
	$: {
		isSelected = $selectedSpace === location;
		if (isSelected && rootDiv) {
			rootDiv.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
		}
	}

	const imageAlt = `Space at ${location?.address || location.name}`;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	bind:this={rootDiv}
	data-location={location.name}
	data-selected={isSelected}
	class="location-card"
	on:click={() => {
		$selectedSpace = location;
	}}
	use:scrollIntoCenterOnDoubleClick
>
	<div class="w-[300px] md:w-[450px] select-none">
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
		<p class="text-3xl mb-1">{location.name}</p>
        <p class="mb-2">{location.description}</p>
		<p class=""><b>Open:</b> {location.openingHours}</p>
        {#if location.tags}
        <div class="tags">
        {#each location.tags as tag}
            <span class="tag">{tag}</span>
        {/each}
        </div>
        {/if}
		<!-- {#if location.address}<p>{location.address}</p>{/if} -->
		{#if userLocation != null && location.coordinates}
			<p class="mt-4">Distance: {distanceToUser(userLocation, location.coordinates, 'ms')}</p>
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
            @apply mt-2 flex items-center gap-1 w-full flex-wrap p-1 bg-[#343333];
			box-shadow: 5px 5px 0px -3px #fd8700;

            .tag {
                @apply rounded shadow text-xs px-2 py-1 bg-white text-black;
            }
        }

		.location-image {
			@apply mb-4 h-64 w-full rounded shadow object-cover;
		}
	}
</style>
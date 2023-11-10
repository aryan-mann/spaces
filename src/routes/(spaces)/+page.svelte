<script lang="ts">
	import GeoLocation from '$lib/components/GeoLocation.svelte';
	import LocationList from '$lib/components/LocationList.svelte';
	import Map from '$lib/components/Map.svelte';
	import { cityFilters, selectedSpace, userLocation } from '$lib/store';
	import { SupportedCity, type CityT, type SpaceDataT } from '$lib/types';
	import Filters from '$lib/components/Filters.svelte';
	import { filterSpaces } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;
	$: spaces = filterSpaces(data.spaces, $cityFilters, $userLocation);
</script>

<svelte:head>
	<title>ourspac.es | San Francisco</title>
</svelte:head>
<div class="relative">
	<GeoLocation />
	<!-- Map component -->
	<Map
		{spaces}
		onMarkerClicked={(m) => {
			$selectedSpace = m;
		}}
	/>
	<div class="absolute top-0 z-[5000]">
		<!-- Filters -->
		<Filters {spaces} />
		<!-- Locations -->
		<!-- <LocationList {spaces} /> -->
	</div>
</div>

<style lang="scss">
	.gl-status {
		@apply w-full flex md:justify-center gap-8 items-center px-4 text-center py-4;
		&[data-available='not-available'] {
			@apply bg-red-500;
		}
		&[data-loaded='loading'] {
			@apply bg-yellow-300;
		}
		&[data-loaded='loaded'] {
			@apply bg-green-700 text-white;
		}
	}
</style>
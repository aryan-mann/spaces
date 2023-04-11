<script lang="ts">
	import GeoLocation from '$lib/components/GeoLocation.svelte';
	import LocationList from '$lib/components/LocationList.svelte';
	import Map from '$lib/components/Map.svelte';
	import { cityFilters, selectedSpace, userLocation } from '$lib/store';
	import { SupportedCity, type CityT, type SpaceDataT } from '$lib/types';
	import Filters from '$lib/components/Filters.svelte';
	import { filterCity } from '$lib/utils';

	let city: CityT | null = null;
	$: city = filterCity(SupportedCity.SAN_FRANCISCO, $cityFilters, $userLocation);
</script>

<svelte:head>
	<title>ourspac.es | {city?.displayName || "Around You"}</title>
</svelte:head>
<div>
	<GeoLocation />
	<!-- Map component -->
	<Map
		city={city}
		onMarkerClicked={(m) => {
			$selectedSpace = m;
		}}
	/>
	<!-- Filters -->
	<Filters {city} />
	<!-- Locations -->
	<LocationList {city} />
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


<script lang="ts">
	import GeoLocation from '$lib/components/GeoLocation.svelte';
	import data from '$lib/data.json';
	import LocationList from '$lib/components/LocationList.svelte';
	import Map from '$lib/components/Map.svelte';
	import { cityFilters, selectedSpace, userLocation } from '$lib/store';
	import type { CityT, SpaceDataT } from '$lib/types';
	import Filters from '$lib/components/Filters.svelte';
	import { distanceBetweenCoordinates } from '$lib/utils';

	// TODO: remove type assertion
	const spaceData: SpaceDataT = <SpaceDataT> data;
	let city: CityT | null = null;

	function reloadCity(showOnlyVetted: boolean, userLocation: GeolocationPosition | null) {
		city = { ...spaceData.cities['san-francisco'] };
		if (city !== null) {
			if (showOnlyVetted) {
				city.spaces = city.spaces.filter((x) => x.vetted);
			}

			city.spaces = [...city.spaces].sort((space1, space2) => {
				if (userLocation) {
					const userCoords = { lat: userLocation.coords.latitude, lng: userLocation.coords.longitude };
					let space1Distance = distanceBetweenCoordinates(space1.coordinates, userCoords).distance;
					console.log(`space1distance: ${space1Distance}`)
					let space2Distance = distanceBetweenCoordinates(space2.coordinates, userCoords).distance;
					console.log(`space2distance: ${space2Distance}`)
					return space1Distance - space2Distance;
				}
				return + (space1.name > space2.name);
			});
		}
	}
	$: reloadCity($cityFilters.showOnlyVetted, $userLocation);
</script>

<svelte:head>
	<title>Spaces | {city?.displayName || "Around You"}</title>
</svelte:head>
<div>
	<GeoLocation let:geoLocationAvailable let:loading let:location let:refreshCoords let:errorMessage>
		<!-- Geolocaiton -->
		{@const geoStatusText =
			geoLocationAvailable === null
				? 'Setting up'
				: geoLocationAvailable === false
				? 'Your device does not support geolocation.'
				: loading
				? 'Finding your location'
				: errorMessage.length > 0
				? errorMessage
				: `Got your location!`}
		<div class="flex w-full">
			{#key geoStatusText}
				<div
					class="gl-status"
					data-loaded={loading ? 'loading' : 'loaded'}
					data-available={geoLocationAvailable === null
						? 'unknown'
						: geoLocationAvailable === true
						? 'available'
						: 'not-available'}
				>
					<p>{geoStatusText}</p>
					<button class:hidden={!location || loading} class="px-2 bg-blue-50 rounded shadow text-gray-800 border-2 border-white hover:bg-blue-200" on:click={() => { refreshCoords() }}>I moved!</button>
				</div>
			{/key}
		</div>
		<!-- Map component -->
		<Map
			{city}
			onMarkerClicked={(m) => {
				$selectedSpace = m;
			}}
		/>
		<!-- Filters -->
		<Filters {city} />
		<!-- Locations -->
		<LocationList {city} userLocation={location} />
	</GeoLocation>
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


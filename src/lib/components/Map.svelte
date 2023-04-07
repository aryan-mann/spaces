<script lang="ts">
	import { selectedSpace, userLocation } from '$lib/store';
	import type { CityT, SpaceT } from '$lib/types';
	import { mapMarkerDeselected, mapMarkerSelected, spaceRepresentationOnMap, userRepresentationOnMap } from '$lib/utils';
	const API_KEY = 'AIzaSyDXQ6Vhx0C6WV7xLQs0iVWMO_vLVJjGGhs';
	import GMaps from '@googlemaps/js-api-loader';
	import { afterUpdate, onMount } from 'svelte';

	const { Loader } = GMaps;

	export let mapCenter = { latitude: 37.79, longitude: -122.40237, altitude: 17 };
	export let city: CityT | null = null;
	export let mapLoaded: boolean = false;
	export let onMapLoaded: (map: google.maps.Map) => void = (_) => {};
	export let onMarkerClicked: (marker: SpaceT) => void = (_) => {};

	const maps_loader = new Loader({
		apiKey: API_KEY,
		version: 'beta',
		libraries: ['drawing', 'places', 'marker']
	});

	let map: google.maps.Map;
	let mapDiv: HTMLElement;
	let markers: { [key: string]: google.maps.marker.AdvancedMarkerView } = {};
	let userMarker: google.maps.marker.AdvancedMarkerView | null = null;
	let lastSelectedMapMarker: Element | null = null;

	userLocation.subscribe((val) => {
		if (val === null || !mapLoaded) {
			return;
		}
		
		const coords = { lat: val.coords.latitude, lng: val.coords.longitude };
		if (userMarker === null) {
			userMarker = new google.maps.marker.AdvancedMarkerView({
				title: `Your Location`,
				position: coords,
				map: map,
				content: userRepresentationOnMap(val),
                collisionBehavior: google.maps.CollisionBehavior.REQUIRED,
				zIndex: 101
			});
		} else {
			userMarker.position = coords;
		}

		console.log(`User location updated. Panning to`, coords);
		map.panTo(coords);
	}, (inv) => {
		
	});

	onMount(async () => {
		await maps_loader.load();
		const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

		map = new Map(mapDiv, {
			center: { lat: mapCenter.latitude, lng: mapCenter.longitude },
			zoom: mapCenter.altitude,
			mapId: '4c755e7bfa5a1b80',
			clickableIcons: false,
			controlSize: 1,
			disableDefaultUI: true,
			mapTypeControl: false,
			isFractionalZoomEnabled: true
		});
		mapLoaded = true;

		// A marker with a custom inline SVG.
		city?.spaces.forEach((mm) => {
            const marker = new google.maps.marker.AdvancedMarkerView({
				title: mm.name,
				position: { lat: mm.coordinates.lat, lng: mm.coordinates.lng },
				map: map,
				content: spaceRepresentationOnMap(mm),
                collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL
			});
            
			markers[mm.name] = marker;
            marker.addListener("click", () => { markerClicked(mm, marker) });
		});

		onMapLoaded(map);

		selectedSpace.subscribe((val) => {
			if (!mapLoaded || !val)
				return;

			const selectedMapMarker = markers[val.name];
			if (lastSelectedMapMarker !== null) {
				lastSelectedMapMarker.setAttribute("data-selected", "false");
			}
			selectedMapMarker.content?.setAttribute("data-selected", "true");
			lastSelectedMapMarker = selectedMapMarker.content!;

			map.panTo({ lat: val.coordinates.lat, lng: val.coordinates.lng })
		})
	});

	afterUpdate(() => {
		if (city === null || !mapLoaded)
			return;

		if (Object.entries(markers).length === city.spaces.length)
			return;

		// Remove all markers
		Object.values(markers).forEach((marker) => {
			marker.map = null
		});

		markers = {};
		// A marker with a custom inline SVG.
		city?.spaces.forEach((mm) => {
            const marker = new google.maps.marker.AdvancedMarkerView({
				title: mm.name,
				position: { lat: mm.coordinates.lat, lng: mm.coordinates.lng },
				map: map,
				content: spaceRepresentationOnMap(mm),
                collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL
			});
            
			markers[mm.name] = marker;
            marker.addListener("click", () => { markerClicked(mm, marker) });
		});
	})

	function markerClicked(space: SpaceT, spaceDiv: google.maps.marker.AdvancedMarkerView) {
		if (lastSelectedMapMarker != null) {
			mapMarkerDeselected(lastSelectedMapMarker);
		}

		const selectedMapMarker = spaceDiv.content;
		if (selectedMapMarker) {
			mapMarkerSelected(selectedMapMarker);
			lastSelectedMapMarker = selectedMapMarker;
		}

		map.panTo(space.coordinates);
		onMarkerClicked(space);
	}
</script>

<div>
	<div class="map" bind:this={mapDiv} />
</div>

<style lang="scss">
	.map {
		@apply h-[700px] w-full;
	}
</style>

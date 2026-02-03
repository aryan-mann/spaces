<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { GeolocationStateT, SpaceT } from '$lib/types';
	import {
		mapMarkerDeselected,
		mapMarkerSelected,
		spaceRepresentationOnMap,
		userRepresentationOnMap
	} from '$lib/utils';
	import { getSelectedSpace, setSelectedSpace, getUserLocation } from '$lib/store.svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	interface Props {
		mapCenter?: { latitude: number; longitude: number; altitude: number };
		spaces?: Array<SpaceT>;
		mapLoaded?: boolean;
		onMarkerClicked?: (marker: SpaceT, location: number) => void;
	}

	let {
		mapCenter = { latitude: 37.79, longitude: -122.40237, altitude: 17 },
		spaces = [],
		mapLoaded = $bindable(false),
		onMarkerClicked = () => {}
	}: Props = $props();

	// Use CartoDB Voyager tiles - clean, modern, free
	const MAP_STYLE: maplibregl.StyleSpecification = {
		version: 8,
		sources: {
			carto: {
				type: 'raster',
				tiles: [
					'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
					'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
					'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
					'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
				],
				tileSize: 256,
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
			}
		},
		layers: [
			{
				id: 'carto',
				type: 'raster',
				source: 'carto'
			}
		]
	};

	let mapElement: HTMLElement | null = $state(null);
	let map: maplibregl.Map | null = null;
	let mapMarkers: { [key: string]: { marker: maplibregl.Marker; html: HTMLElement } } = {};
	let userMarker: maplibregl.Marker | null = null;
	let lastSelectedMapMarker: HTMLElement | null = null;
	let isMapReady = $state(false);

	onMount(() => {
		if (!mapElement) return;

		map = new maplibregl.Map({
			container: mapElement,
			style: MAP_STYLE,
			center: [mapCenter.longitude, mapCenter.latitude],
			zoom: mapCenter.altitude,
			attributionControl: false
		});

		map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

		map.on('load', () => {
			isMapReady = true;
			mapLoaded = true;
		});
	});

	// Handle spaces updates - only when map is ready
	$effect(() => {
		if (!isMapReady || !map || spaces.length === 0) return;

		// Clear existing markers
		Object.values(mapMarkers).forEach(({ marker }) => marker.remove());
		mapMarkers = {};

		// Add new markers
		for (const space of spaces) {
			for (let i = 0; i < space.location.length; i++) {
				const markerHtml = spaceRepresentationOnMap(space, i);
				const coords = space.location[i].coordinates;

				const marker = new maplibregl.Marker({
					element: markerHtml,
					anchor: 'bottom'
				})
					.setLngLat([coords.lng, coords.lat])
					.addTo(map);

				marker.getElement().addEventListener('click', () => {
					markerClicked(space, i, markerHtml);
				});

				mapMarkers[`${space.name}-${i}`] = { marker, html: markerHtml };
			}
		}
	});

	// Handle selected space changes
	$effect(() => {
		const item = getSelectedSpace();
		if (!isMapReady || !map || !item) return;

		const { space, location } = item;
		const selectedMapMarker = mapMarkers[`${space.name}-${location}`];

		if (lastSelectedMapMarker !== null) {
			mapMarkerDeselected(lastSelectedMapMarker);
		}
		if (selectedMapMarker) {
			mapMarkerSelected(selectedMapMarker.html);
			lastSelectedMapMarker = selectedMapMarker.html;
		}

		const coords = space.location[location].coordinates;
		map.flyTo({
			center: [coords.lng, coords.lat],
			zoom: 18,
			essential: true
		});
	});

	// Handle user location updates
	$effect(() => {
		const state = getUserLocation();
		if (!isMapReady || !map || !state?.location?.coords || state.loading) return;

		if (userMarker) {
			userMarker.remove();
			userMarker = null;
		}

		const markerHtml = userRepresentationOnMap(state);
		const userCoords = {
			lat: state.location.coords.latitude,
			lng: state.location.coords.longitude
		};

		userMarker = new maplibregl.Marker({
			element: markerHtml,
			anchor: 'bottom'
		})
			.setLngLat([userCoords.lng, userCoords.lat])
			.addTo(map);

		userMarker.getElement().addEventListener('click', () => {
			const loc = state.location?.coords;
			if (loc && map) {
				map.flyTo({
					center: [loc.longitude, loc.latitude],
					zoom: 15,
					essential: true
				});
			}
		});

		map.flyTo({
			center: [userCoords.lng, userCoords.lat],
			zoom: 18,
			essential: true
		});
	});

	function markerClicked(space: SpaceT, location: number, markerHtml: HTMLElement) {
		if (lastSelectedMapMarker != null) {
			mapMarkerDeselected(lastSelectedMapMarker);
		}

		if (markerHtml) {
			mapMarkerSelected(markerHtml);
			lastSelectedMapMarker = markerHtml;
		}

		setSelectedSpace(space, location);
		if (map) {
			const coords = space.location[location].coordinates;
			map.flyTo({
				center: [coords.lng, coords.lat],
				zoom: 18,
				essential: true
			});
		}
		onMarkerClicked(space, location);
	}

	onDestroy(() => {
		map?.remove();
	});

	function refreshCoords() {
		getUserLocation().refreshCoords?.();
	}
</script>

<div class="map">
	<div bind:this={mapElement} class="w-full h-screen"></div>
	<div class="absolute right-2 top-4 z-[1200]">
		<button
			onclick={refreshCoords}
			class="cursor-pointer px-1 py-1 bg-primary-900 opacity-60 hover:opacity-70 active:opacity-90 text-white rounded"
		>
			{#if getUserLocation().geoLocationAvailable === false}
				Location N/A
			{:else if getUserLocation().loading}
				Locating..
			{:else if getUserLocation().location}
				Located
			{:else if (getUserLocation()?.errorMessage?.length || 0) > 0}
				You denied location access
			{/if}
		</button>
	</div>
</div>

<style>
	:global(.maplibregl-map) {
		font-family: inherit;
	}
	:global(.maplibregl-ctrl-attrib) {
		font-size: 10px;
	}
</style>

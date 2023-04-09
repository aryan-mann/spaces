<script lang="ts">
    import { onMount, onDestroy, afterUpdate } from 'svelte';
    import type { CityT, MapMarkerT, SpaceT } from '$lib/types';
	import { mapMarkerDeselected, mapMarkerSelected, spaceRepresentationOnMap } from '$lib/utils';
    import type { DivIcon, Marker, Map as LeafletMap } from '@types/leaflet';
	import { selectedSpace } from '$lib/store';

	export let mapCenter = { latitude: 37.79, longitude: -122.40237, altitude: 17 };
	export let city: CityT | null = null;
	export let mapLoaded: boolean = false;
	export let onMarkerClicked: (marker: SpaceT) => void = (_) => {};

    let mapElement: HTMLElement | null = null;
    let map: LeafletMap;
    let mapMarkers: { [key: string]: { marker: Marker, html: HTMLElement } } = {}

    let lastLoadedSpaces: SpaceT[] = [];
    let updating: boolean = false;
    let lastSelectedMapMarker: HTMLElement | null = null;
    
    onMount(async () => {
        const leaflet = await import('leaflet');
        map = leaflet.map(mapElement!).setView([mapCenter.latitude, mapCenter.longitude], mapCenter.altitude);

        // Add a tile layer
        leaflet.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapLoaded = true;

        selectedSpace.subscribe((space) => {
			if (!mapLoaded || !space)
				return;

			const selectedMapMarker = mapMarkers[space.name];
			if (lastSelectedMapMarker !== null) {
                mapMarkerDeselected(lastSelectedMapMarker);
			}
            mapMarkerSelected(selectedMapMarker.html);
			lastSelectedMapMarker = selectedMapMarker.html;

			map.flyTo(space.coordinates, 18);
		})

        refreshMap();
    })

    afterUpdate(async () => {
        await refreshMap();
    })

    async function refreshMap() {
        // console.log(`Map Loaded: ${mapLoaded} | City Null: ${city === null} | Spaces Null: ${city?.spaces === null}`);
        // console.log(`City Spaces Length: ${city?.spaces.length} | Updating: ${updating} | Last Loaded Equal: ${lastLoadedSpaces === city?.spaces}`)
        if (!mapLoaded || city === null || city.spaces === null ||
         city.spaces.length <= 0 || updating || lastLoadedSpaces === city.spaces)
            return;

        const leaflet = await import('leaflet');

        // Remove existing markers
        Object.values(mapMarkers).forEach((marker) => {
            marker.marker.removeFrom(map);
        })

        updating = true;
        for (let space of city.spaces) {
            const markerHtml = spaceRepresentationOnMap(space);
            const markerDivIcon = leaflet.divIcon({ 
                html: markerHtml,
                className: "space-marker",
            });
            const marker = leaflet.marker(space.coordinates, { 
                title: space.name,
                icon: markerDivIcon,
                draggable: false 
            })
            marker.on("click", () => { markerClicked(space, marker, markerHtml);  })

            mapMarkers[space.name] = { marker: marker, html: markerHtml };
            marker.addTo(map);
        }

        lastLoadedSpaces = [...city.spaces]
        updating = false;
    }

    function markerClicked(space: SpaceT, marker: Marker, markerHtml: HTMLElement) {
        if (lastSelectedMapMarker != null) {
			mapMarkerDeselected(lastSelectedMapMarker);
		}

		if (markerHtml) {
			mapMarkerSelected(markerHtml);
			lastSelectedMapMarker = markerHtml;
		}

        $selectedSpace = space;
        map.flyTo(space.coordinates, 18)
		onMarkerClicked(space);
	}

    onDestroy(() => {
        map?.remove();
    })
</script>


<div class="map">
    <div bind:this={mapElement}></div>
</div>

<style>
    @import 'leaflet/dist/leaflet.css';
    .map div {
        @apply h-[400px] md:h-[600px];
    }
</style>
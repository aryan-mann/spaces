<script lang="ts">
    import { onMount, onDestroy, afterUpdate } from 'svelte';
    import type { GeolocationStateT, SpaceT } from '$lib/types';
	import { mapMarkerDeselected, mapMarkerSelected, spaceRepresentationOnMap, userRepresentationOnMap } from '$lib/utils';
    // @ts-ignore – Cannot import type declaration files
    import type { Marker, Map as LeafletMap } from '@types/leaflet';
	import { selectedSpace, userLocation } from '$lib/store';

	export let mapCenter = { latitude: 37.79, longitude: -122.40237, altitude: 17 };
    export let spaces: Array<SpaceT> = [];
    export let mapLoaded: boolean = false;
	export let onMarkerClicked: (marker: SpaceT) => void = (_) => {};

    let mapElement: HTMLElement | null = null;
    let map: LeafletMap;
    let mapMarkers: { [key: string]: { marker: Marker, html: HTMLElement } } = {}
    let userMarker: Marker | null = null;

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
        if (!mapLoaded || spaces === null || spaces.length <= 0 || updating || lastLoadedSpaces === spaces)
            return;

        const leaflet = await import('leaflet');
        // Remove existing markers
        Object.values(mapMarkers).forEach((marker) => {
            marker.marker.removeFrom(map);
        })

        updating = true;
        for (let space of spaces) {
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

        lastLoadedSpaces = [...spaces]
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

    async function addUserMapMarker(state: GeolocationStateT) {
        if (!mapLoaded || !($userLocation?.location?.coords) || $userLocation.loading)
            return;

        if (userMarker) {
            userMarker?.removeFrom(map);
            userMarker = null;
        }

        const leaflet = await import('leaflet');
        const markerHtml = userRepresentationOnMap($userLocation);
        const markerDivIcon = leaflet.divIcon({ 
            html: markerHtml,
            className: "space-user-marker"
        });
        const userCoords = { lat: $userLocation.location.coords.latitude, lng: $userLocation.location.coords.longitude };
        const marker = leaflet.marker(userCoords, { 
            title: `You`,
            icon: markerDivIcon,
            draggable: false 
        })
        marker.on("click", () => {
            const loc = $userLocation.location?.coords;
            if (loc) {
                map.flyTo({ lat: loc.latitude, lng: loc.longitude }, 15);
            }
        });

        userMarker = marker;
        marker.addTo(map);
        map.flyTo(userCoords, 18, { animate: true })
    }

    $: addUserMapMarker($userLocation)

    onDestroy(() => {
        map?.remove();
    })
</script>


<div class="map">
    <div bind:this={mapElement}></div>
    <div class="absolute right-2 top-2 z-[500]">
        <p>
        {#if $userLocation.geoLocationAvailable === false}
        Location N/A
        {:else if $userLocation.loading}
        Locating..
        {:else if $userLocation.location}
        Located
        {:else}
        {JSON.stringify($userLocation)}
        {/if}
        </p>
    </div>
</div>

<style>
    @import 'leaflet/dist/leaflet.css';
    .map div {
        @apply h-[400px] md:h-[800px];
    }
</style>
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { MapMarkerT, SpaceT } from '$lib/types';
    import leaflet from 'leaflet';

    export let mapCenter = { latitude: 37.7823763, longitude: -122.4023424, altitude: 13 };
    export let mapMarkers: Array<SpaceT> = [];
    export let markerClicked: any;

    let mapElement: HTMLElement | null = null;
    let map: any;
    
    onMount(() => {
        map = leaflet.map(mapElement!).setView([mapCenter.latitude, mapCenter.longitude], mapCenter.altitude);

        // Add a tile layer
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        for (let marker of mapMarkers) {
            leaflet.marker([marker.coordinates.lat, marker.coordinates.lng ])
                .addTo(map)
                .on("click", () => { markerClicked(marker) })
                .bindPopup(`${marker.name}<br />${marker.address}<br />${marker.description}`)
                .bindTooltip(`${marker.name}`);
        }
        // leaflet.marker([51.5, -0.09]).addTo(map)
        //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        //     .openPopup();
    })

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
        @apply h-96;
    }
</style>
<script lang="ts">
	import { userLocation } from '$lib/store';
	import { onMount } from 'svelte';

	const ARTIFICIAL_DELAY = 1000;

	export let geoLocationAvailable: boolean | null = null;
	export let hasLocation: boolean = false;
	export let location: GeolocationPosition | null = null;
	export let loading: boolean = false;
	export let errorMessage: string = '';
	export const refreshCoords = () => {
		queryLocation();
	};

	function queryLocation() {
		if (loading) return;

		loading = true;
		geoLocationAvailable = 'geolocation' in navigator;
		if (!geoLocationAvailable) return;

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setTimeout(() => {
					hasLocation = true;
					location = pos;
					userLocation.set(pos);
					loading = false;
				}, ARTIFICIAL_DELAY);
			},
			(err) => {
				loading = false;
				userLocation.set(null);
				errorMessage = `Unable to get location: ${err.message}`;
			},
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	}

	onMount(() => {
		queryLocation();
	});
</script>

<slot {geoLocationAvailable} {location} {hasLocation} {loading} {refreshCoords} {errorMessage} />

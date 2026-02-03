<script lang="ts">
	import { getUserLocation, updateUserLocation } from '$lib/store.svelte';
	import { onMount } from 'svelte';

	const ARTIFICIAL_DELAY = 1000;

	export const refreshCoords = () => {
		queryLocation();
	};

	function queryLocation() {
		const currentLocation = getUserLocation();
		if (currentLocation.loading) return;

		updateUserLocation({ loading: true });
		updateUserLocation({ geoLocationAvailable: 'geolocation' in navigator });

		if (!getUserLocation().geoLocationAvailable) return;

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setTimeout(() => {
					updateUserLocation({
						location: pos,
						loading: false,
						errorMessage: null
					});
				}, ARTIFICIAL_DELAY);
			},
			(err) => {
				updateUserLocation({
					loading: false,
					location: null,
					errorMessage: `Unable to get location: ${err.message}`
				});
			},
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	}

	onMount(() => {
		queryLocation();
		updateUserLocation({ refreshCoords });
	});
</script>

<slot
	location={getUserLocation().location}
	loading={getUserLocation().loading}
	errorMessage={getUserLocation().errorMessage}
	geolocationAvailable={getUserLocation().geoLocationAvailable}
	{refreshCoords}
/>

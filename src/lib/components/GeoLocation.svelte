<script lang="ts">
	import { userLocation } from '$lib/store';
	import { onMount } from 'svelte';

	const ARTIFICIAL_DELAY = 1000;
	export const refreshCoords = () => {
		queryLocation();
	};

	function queryLocation() {
		if ($userLocation.loading) 
			return;

		$userLocation.loading = true;
		$userLocation.geoLocationAvailable = 'geolocation' in navigator;
		if (!$userLocation.geoLocationAvailable) 
			return;

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				console.log(`Found location: ${pos}`)
				setTimeout(() => {
					$userLocation.location = pos;
					$userLocation.loading = false;
					$userLocation.errorMessage = null;
				}, ARTIFICIAL_DELAY);
			},
			(err) => {
				console.log(`Unable to get location: ${err}`)
				$userLocation.loading = false;
				$userLocation.location = null;
				$userLocation.errorMessage = `Unable to get location: ${err.message}`;
			},
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	}

	onMount(() => {
		queryLocation();
	});
</script>

<slot location={$userLocation.location} loading={$userLocation.loading} 
	errorMessage={$userLocation.errorMessage} geolocationAvailable={$userLocation.geoLocationAvailable}
	{refreshCoords} />

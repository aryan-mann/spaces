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

		// Check if geolocation is available first
		const isAvailable = 'geolocation' in navigator;
		console.log('[GeoLocation] Starting location request, available:', isAvailable);
		updateUserLocation({ loading: true, geoLocationAvailable: isAvailable });

		if (!isAvailable) {
			console.log('[GeoLocation] Geolocation not available');
			updateUserLocation({ loading: false });
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				console.log('[GeoLocation] Got position:', pos.coords.latitude, pos.coords.longitude);
				setTimeout(() => {
					updateUserLocation({
						location: pos,
						loading: false,
						errorMessage: null
					});
				}, ARTIFICIAL_DELAY);
			},
			(err) => {
				console.log('[GeoLocation] Error:', err.code, err.message);
				// If high accuracy fails, try without it
				if (err.code === 3) {
					console.log('[GeoLocation] Trying fallback without high accuracy...');
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							console.log(
								'[GeoLocation] Fallback success:',
								pos.coords.latitude,
								pos.coords.longitude
							);
							setTimeout(() => {
								updateUserLocation({
									location: pos,
									loading: false,
									errorMessage: null
								});
							}, ARTIFICIAL_DELAY);
						},
						(err2) => {
							console.log('[GeoLocation] Fallback failed:', err2.code, err2.message);
							updateUserLocation({
								loading: false,
								location: null,
								errorMessage: err2.message || 'Location access denied'
							});
						},
						{ enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
					);
				} else {
					updateUserLocation({
						loading: false,
						location: null,
						errorMessage: err.message || 'Location access denied'
					});
				}
			},
			{ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
		);
	}

	onMount(() => {
		queryLocation();
		updateUserLocation({ refreshCoords });
	});
</script>

<script lang="ts">
	import GeoLocation from '$lib/components/GeoLocation.svelte';
	import LocationList from '$lib/components/LocationList.svelte';
	import Map from '$lib/components/Map.svelte';
	import BottomSheet from '$lib/components/BottomSheet.svelte';
	import { getCityFilters, getUserLocation, setSelectedSpace } from '$lib/store.svelte';
	import Filters from '$lib/components/Filters.svelte';
	import { filterSpaces } from '$lib/utils';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const spaces = $derived(filterSpaces(data.spaces, getCityFilters(), getUserLocation()));
</script>

<svelte:head>
	<title>ourspac.es | San Francisco</title>
</svelte:head>
<div class="relative">
	<GeoLocation />
	<Map
		{spaces}
		onMarkerClicked={(space, location) => {
			setSelectedSpace(space, location);
		}}
	/>
	<div class="absolute top-0 z-[5000]">
		<Filters {spaces} />
		<!-- Locations -->
		<!-- <LocationList {spaces} /> -->
	</div>
</div>

<BottomSheet />

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

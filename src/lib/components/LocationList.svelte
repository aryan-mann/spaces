<script lang="ts">
	import type { CityT, SpaceT } from "$lib/types";
	import { scrollableByMouse } from "$lib/usetils";
	import LocationCard from "./LocationCard.svelte";
    
    export let city: CityT | null = null;
    export let userLocation: GeolocationPosition | null = null;
</script>

{#if city}
<div class="relative flex overflow-x-scroll w-full  p-8 gap-8" use:scrollableByMouse>
{#each city.spaces as location, index (location.name)}
    <LocationCard {city} {location} {userLocation} />
{/each}
</div>
{/if}
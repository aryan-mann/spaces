<script lang="ts">
	import type { CityT, SpaceT } from "$lib/types";
	import { scrollableByMouse } from "$lib/usetils";
	import LocationCard from "./LocationCard.svelte";
    
    export let city: CityT | null = null;
</script>

{#if city}
<div class="relative flex overflow-x-scroll w-full px-8 py-2 gap-8 mb-8" use:scrollableByMouse>
{#each city.spaces as location (location.name)}
    <LocationCard {city} {location} />
{/each}
</div>
{/if}
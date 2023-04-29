<script lang="ts">
	import type { CityT, SpaceT } from "$lib/types";
	import { scrollableByMouse } from "$lib/usetils";
	import LocationCard from "./LocationCard.svelte";
    
    export let spaces: Array<SpaceT> = [];
</script>

{#if spaces?.length > 0}
<div class="relative flex overflow-x-scroll w-full px-6 md:px-12 pt-1 pb-6 gap-8" use:scrollableByMouse>
{#each spaces as location (location.name)}
    <LocationCard {location} />
{/each}
</div>
{/if}
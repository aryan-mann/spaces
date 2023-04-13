<script lang="ts">
	import { page } from "$app/stores";
    import { cityFilters } from "$lib/store";
	import type { CityT, SpaceT } from "$lib/types";
	import { isDebugView } from "$lib/utils";
	import Dropdown, { type OptionT } from "./input/Dropdown.svelte";
	import Toggle from "./input/Toggle.svelte";

    export let spaces: Array<SpaceT> = [];
    const spaceOptions: Array<OptionT> = [
        { name: 'Park', value: 'Park' },
        { name: 'POPO', value: 'POPO' },
        { name: 'Cafe', value: 'Cafe' }
    ]
</script>

<div class="relative md:px-8 py-3">
    <div class="filter-container flex gap-4 p-1 items-center overflow-x-auto">
        <div class="results">
            Found {spaces?.length || 0} Results
        </div>
        <Toggle label="Show Only Open" bind:checked={$cityFilters.showOnlyOpen} />
        <!-- Vetted -->
        {#if isDebugView($page)}
        <Toggle label="Show Only Vetted" bind:checked={$cityFilters.showOnlyVetted} />
        {/if}
        <!-- Type -->
        <Dropdown label="Space Type" options={spaceOptions} />
    </div>
</div>

<style lang="scss">
    .filter-container {
        @apply absolute bottom-2 z-[500] px-4 w-full overflow-x-auto md:max-w-[calc(100vw-4rem)];
    }
    .results {
        @apply px-2 mr-2 bg-blue-50 py-1 border-b-2 w-full md:w-auto whitespace-nowrap;
        box-shadow: 6px 6px 0px -3px #343333;
    }
</style>
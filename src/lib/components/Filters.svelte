<script lang="ts">
	import { page } from "$app/stores";
    import { cityFilters } from "$lib/store";
	import type { CityT } from "$lib/types";
	import { isDebugView } from "$lib/utils";
	import Dropdown, { type OptionT } from "./input/Dropdown.svelte";
	import Toggle from "./input/Toggle.svelte";

    export let city: CityT | null;
    const spaceOptions: Array<OptionT> = [
        { name: 'Park', value: 'Park' },
        { name: 'POPO', value: 'POPO' },
        { name: 'Cafe', value: 'Cafe' }
    ]
</script>

<div class="px-2 md:px-8 py-3">
    <div class="filter-container flex gap-4 p-1 items-center overflow-x-auto">
        <div class="results">
            Found {#if city}{city.spaces.length}{:else}...{/if} Results
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
    .results {
        @apply mr-2 bg-blue-50 px-2 py-1 border-b-2 w-full md:w-auto whitespace-nowrap;
        box-shadow: 6px 6px 0px -3px #343333;
    }
</style>
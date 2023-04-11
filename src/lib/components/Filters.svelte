<script lang="ts">
	import { cityFilters } from "$lib/store";
	import type { CityT } from "$lib/types";
	import Dropdown, { type OptionT } from "./input/Dropdown.svelte";
	import Toggle from "./input/Toggle.svelte";

    let spaceType: string = "";
    export let city: CityT | null;

    const spaceOptions: Array<OptionT> = [
        { name: 'Park', value: 'Park' },
        { name: 'POPO', value: 'POPO' }
    ]
</script>

<div class="px-8 py-3">
    <div class="container flex gap-4 p-1 items-center overflow-x-auto">
        <div class="results">
            Found {#if city}{city.spaces.length}{:else}...{/if} Results
        </div>
        <Toggle label="Show Only Open" bind:checked={$cityFilters.showOnlyOpen} />
        <!-- Vetted -->
        <Toggle label="Show Only Vetted" bind:checked={$cityFilters.showOnlyVetted} />
        <!-- Type -->
        <Dropdown label="Space Type" options={spaceOptions} bind:value={spaceType} />
    </div>
</div>

<style lang="scss">
    .container > * {
        min-width: 200px;
    }
    .results {
        @apply mr-2 bg-blue-50 px-2 py-1 border-b-2 w-full md:w-auto;
            box-shadow: 6px 6px 0px -3px #343333;
    }
</style>
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
    <div class="flex gap-4 p-1 items-center">
        <div class="results">
            Found {#if city}{city.spaces.length}{:else}...{/if} Results
        </div>
        <!-- Vetted -->
        <Toggle label="Show Only Vetted" bind:checked={$cityFilters.showOnlyVetted} />
        <!-- Type -->
        <p>{spaceType}</p>
        <Dropdown label="Space Type" options={spaceOptions} bind:value={spaceType} />
    </div>
</div>

<style lang="scss">
    .results {
        @apply mr-2 bg-blue-50 px-2 py-1 border-b-2;
            box-shadow: 6px 6px 0px -3px #343333;
    }
</style>
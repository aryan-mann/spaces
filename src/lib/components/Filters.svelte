<script lang="ts">
	import { cityFilters } from "$lib/store";
	import type { CityT } from "$lib/types";
	import Toggle from "./input/Toggle.svelte";

    export let city: CityT | null;
</script>

<div class="px-8 pt-8">
    <div class="flex p-1 items-center">
        <div class="results">
            Found {#if city}{city.spaces.length}{:else}...{/if} Results
        </div>
        <!-- Vetted -->
        <Toggle label="Show Only Vetted" bind:checked={$cityFilters.showOnlyVetted} />
    </div>
</div>

<style lang="scss">
    input[type="checkbox"].chip {
        @apply p-4 border-4;
    }
    .results {
        @apply mr-6 bg-blue-50 px-2 py-1 border-b-2;
            box-shadow: 6px 6px 0px -3px #343333;
    }
</style>
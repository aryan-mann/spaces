<script lang="ts" context="module">
    export interface OptionT {
        name: string;
        value: string;
    }
</script>

<script lang="ts">
	import { cityFilters } from "$lib/store";

    export let label: string;
    export let options: Array<OptionT>
    export let value: string = "";
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="dropdown inline-flex items-center bg-orange-100 py-1 px-2 rounded shadow">
    <span class="select-none">{label}</span>
    <div class="px-4 py-[1px] rounded ml-3 transition-colors duration-500 select-none">
        <select bind:value={$cityFilters.spaceType}>
            <option value="">Any</option>
            {#each options as option (option.name)}
            <option value={option.value}>{option.name}</option>
            {/each}
        </select>
    </div>
</label>

<style lang="scss">
    label.dropdown {
        box-shadow: 6px 6px 0px -3px #343333;
    }
    label.dropdown div {
        @apply px-4 py-[1px] rounded ml-3 transition-colors duration-500 select-none;

        select {
            @apply px-1 rounded border-black border-[1px];
        }
    }
</style>
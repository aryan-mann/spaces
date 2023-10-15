<script lang="ts">
    export let label: string;
    export let checked: boolean = false;

    export let display: { checked: string, unchecked: string } = { checked: '✓', unchecked: '✗' }
</script>

<label class="toggle inline-flex items-center bg-primary-100 py-1 px-2 shadow">
    <input type="checkbox" class="sr-only" bind:checked={checked}>
    <span class="select-none whitespace-nowrap">{label}</span>
    <div class="px-4 py-[1px] rounded ml-3 transition-colors duration-500 select-none" data-checked={checked}>
        <span class:text-black={checked} class:text-red-800={!checked}>
            {checked ? display.checked: display.unchecked}
        </span>
    </div>
</label>

<style lang="scss">
    label.toggle {
        box-shadow: 6px 6px 0px -3px #343333;
    }
    label.toggle div {
        @apply px-4 py-[1px] rounded ml-3 transition-colors duration-500 select-none;
        &[data-checked=true] {
            @apply bg-green-300;

            &:hover {
                @apply bg-green-400;
            }
        }
        &[data-checked=false] {
            @apply bg-yellow-300;

            &:hover {
                @apply bg-yellow-400;
            }
        }
    }
</style>
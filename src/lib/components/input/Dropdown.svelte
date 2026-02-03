<script lang="ts" module>
	export interface OptionT {
		name: string;
		value: string;
	}
</script>

<script lang="ts">
	import { getCityFilters, updateCityFilters } from '$lib/store.svelte';

	interface Props {
		label: string;
		options: Array<OptionT>;
	}

	let { label, options }: Props = $props();

	const cityFilters = $derived(getCityFilters());
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<label class="dropdown inline-flex items-center bg-primary-100 py-1 px-2 shadow">
	<span class="select-none whitespace-nowrap">{label}</span>
	<div class="px-4 py-[1px] rounded ml-3 transition-colors duration-500 select-none">
		<select
			value={cityFilters.spaceType}
			onchange={(e) => updateCityFilters({ spaceType: e.currentTarget.value })}
		>
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

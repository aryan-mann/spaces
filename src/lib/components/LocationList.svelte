<script lang="ts">
	import type { SpaceT } from '$lib/types';
	import { scrollableByMouse } from '$lib/usetils';
	import LocationCard from './LocationCard.svelte';

	interface Props {
		spaces?: Array<SpaceT>;
	}

	let { spaces = [] }: Props = $props();
</script>

{#if spaces?.length > 0}
	<div
		class="flex overflow-x-scroll w-full px-6 md:px-12 pt-0 pb-10 gap-8 mb-8"
		use:scrollableByMouse
	>
		{#each spaces as space (space.name)}
			{#each space.location as location, i (location.address)}
				<LocationCard location={space} spaceChainNumber={i} />
			{/each}
		{/each}
	</div>
{/if}

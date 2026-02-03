<script lang="ts">
	import { page } from '$app/state';
	import {
		getCityFilters,
		getCurrentUser,
		getGlobalStore,
		getUserLocation,
		setCurrentUser,
		updateCityFilters
	} from '$lib/store.svelte';
	import type { SpaceT } from '$lib/types';
	import { isDebugView } from '$lib/utils';

	import Dropdown, { type OptionT } from './input/Dropdown.svelte';
	import Toggle from './input/Toggle.svelte';
	import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

	interface Props {
		spaces?: Array<SpaceT>;
	}

	let { spaces = [] }: Props = $props();

	const spaceOptions: Array<OptionT> = [
		{ name: 'Park', value: 'Park' },
		{ name: 'POPO', value: 'POPO' },
		{ name: 'Cafe', value: 'Cafe' }
	];

	async function loginWithGoogle() {
		try {
			const provider = new GoogleAuthProvider();
			provider.addScope('profile');
			provider.addScope('email');
			const result = await signInWithPopup(getGlobalStore().auth, provider);
			const credential = GoogleAuthProvider.credentialFromResult(result);

			if (credential !== null) {
				setCurrentUser(result.user);
			}
		} catch (e) {
			setCurrentUser(null);
		}
	}

	async function logOut() {
		await signOut(getGlobalStore().auth);
		setCurrentUser(null);
	}

	function refreshLocation() {
		const userLoc = getUserLocation();
		if (userLoc.refreshCoords) {
			userLoc.refreshCoords();
		}
	}

	const currentUser = $derived(getCurrentUser());
	const cityFilters = $derived(getCityFilters());
	const userLocation = $derived(getUserLocation());

	const locationEmoji = $derived.by(() => {
		if (userLocation.geoLocationAvailable === false) {
			return '🚫';
		}
		if (userLocation.loading) {
			return '📡';
		}
		if (userLocation.location) {
			return '🎯';
		}
		if (userLocation.errorMessage) {
			return '❓';
		}
		return '📍';
	});

	const locationTitle = $derived.by(() => {
		if (userLocation.geoLocationAvailable === false) {
			return 'Location not available';
		}
		if (userLocation.loading) {
			return 'Locating...';
		}
		if (userLocation.location) {
			return 'Located';
		}
		if (userLocation.errorMessage) {
			return 'Unable to find you';
		}
		return 'Get location';
	});
</script>

<div class="md:px-8 py-3 z-[2000] mt-20 flex w-screen">
	<div class="filter-container flex flex-wrap gap-4 p-1 items-center">
		<div class="boxxy">
			<input
				class="bg-transparent px-2"
				placeholder="filter from {spaces?.length || 0} spaces"
				type="text"
				value={cityFilters.spaceName}
				oninput={(e) => updateCityFilters({ spaceName: e.currentTarget.value })}
			/>
		</div>
		<button
			class="boxxy cursor-pointer"
			onclick={refreshLocation}
			title={locationTitle}
			disabled={userLocation.loading}
		>
			{locationEmoji}
		</button>
		<Toggle
			label="Show Only Open"
			checked={cityFilters.showOnlyOpen}
			onchange={(checked) => updateCityFilters({ showOnlyOpen: checked })}
		/>
		{#if isDebugView(page)}
			<Toggle
				label="Show Only Vetted"
				checked={cityFilters.showOnlyVetted}
				onchange={(checked) => updateCityFilters({ showOnlyVetted: checked })}
			/>
		{/if}
		<Dropdown label="Space Type" options={spaceOptions} />
	</div>
</div>

<style lang="scss">
	.filter-container {
		@apply absolute left-0 flex items-center justify-center z-[500] w-full overflow-x-auto;
	}
	.boxxy {
		@apply px-2 mr-2 bg-blue-50 py-1 border-b-2 w-full md:w-auto whitespace-nowrap;
		box-shadow: 6px 6px 0px -3px #343333;

		&.active {
			@apply hover:bg-blue-200;
		}
	}
</style>

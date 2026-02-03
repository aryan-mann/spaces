<script lang="ts">
	import { page } from '$app/state';
	import {
		getCityFilters,
		getCurrentUser,
		getGlobalStore,
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

	const currentUser = $derived(getCurrentUser());
	const cityFilters = $derived(getCityFilters());
</script>

<div class="md:px-8 py-3 z-[2000] mt-20 flex w-screen">
	<div class="filter-container flex gap-4 p-1 items-center overflow-x-auto">
		<div class="boxxy active flex items-center justify-center">
			{#if currentUser === null}
				<button
					class="flex items-center justify-center"
					onclick={async () => {
						await loginWithGoogle();
					}}
				>
					<img class="h-6 w-auto" alt="" src="/images/logo-google.png" />
					<p class="mx-2">Sign In</p>
				</button>
			{:else}
				<button
					class="flex items-center justify-center px-1"
					onclick={async () => {
						await logOut();
					}}
				>
					<img
						class="rounded-full h-6 duration-500 w-auto mr-2"
						src={currentUser.photoURL}
						alt=""
					/>
					<p>Logout <b>{currentUser.displayName?.split(' ')[0]}</b>?</p>
				</button>
			{/if}
		</div>
		<div class="boxxy">
			<input
				class="bg-transparent px-2"
				placeholder="filter space by name"
				type="text"
				value={cityFilters.spaceName}
				oninput={(e) => updateCityFilters({ spaceName: e.currentTarget.value })}
			/>
		</div>
		<div class="boxxy">
			Found {spaces?.length || 0} Results
		</div>
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

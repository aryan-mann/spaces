<script lang="ts">
	import { page } from '$app/stores';
	import { cityFilters, currentUser, globalStore } from '$lib/store';
	import type { CityT, SpaceT } from '$lib/types';
	import { isDebugView } from '$lib/utils';

	import Dropdown, { type OptionT } from './input/Dropdown.svelte';
	import Toggle from './input/Toggle.svelte';
	import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

	export let spaces: Array<SpaceT> = [];
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
			const result = await signInWithPopup($globalStore.auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);

			if (credential !== null) {
				// const token = credential.accessToken;
				$currentUser = result.user;
			}
		} catch (e) {
			$currentUser = null;
		}
	}

    async function logOut() {
        await signOut($globalStore.auth);
        $currentUser = null;
    }
</script>

<div class="md:px-8 py-3 z-[2000] mt-20 flex w-screen">
	<div class="filter-container flex gap-4 p-1 items-center overflow-x-auto">
		<div class="boxxy active flex items-center justify-center">
			{#if $currentUser === null}
				<button
					class="flex items-center justify-center"
					on:click={async () => {
						await loginWithGoogle();
					}}
				>
					<img class="h-6 w-auto" alt="" src="/images/logo-google.png" />
					<p class="mx-2">Sign In</p>
				</button>
            {:else}
            <div class="flex items-center justify-center px-1 cursor-pointer" on:click={async () => { await logOut(); }}>
                <img class="rounded-full h-6 duration-500 w-auto mr-2" src={$currentUser.photoURL} alt="" />
                <p>Logout <b>{$currentUser.displayName?.split(' ')[0]}</b>?</p>
            </div>
			{/if}
		</div>
		<div class="boxxy">
			<input class="bg-transparent px-2" placeholder="filter space by name" type="text" bind:value={$cityFilters.spaceName} />
		</div>
		<div class="boxxy">
			Found {spaces?.length || 0} Results
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

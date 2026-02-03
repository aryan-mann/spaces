<script lang="ts">
	import '../../app.scss';
	import '../../app.postcss';

	import Header from '$lib/aspects/header.svelte';
	import Footer from '$lib/aspects/footer.svelte';
	import 'firebase/firestore';

	import { initializeApp } from 'firebase/app';
	import { getAuth } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { setGlobalStore } from '$lib/store.svelte';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const firebaseConfig = {
		apiKey: 'AIzaSyAEjzI1GFrnM2He9TVEnS7ViGbvwnilSlo',
		authDomain: 'our-spaces-ari.firebaseapp.com',
		projectId: 'our-spaces-ari',
		storageBucket: 'our-spaces-ari.appspot.com',
		messagingSenderId: '653892601833',
		appId: '1:653892601833:web:fb76c8d012230ce942ed78',
		measurementId: 'G-F114291VFY'
	};

	onMount(() => {
		const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);
		setGlobalStore({ app, auth });
	});
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta
		name="viewport"
		content="width=device-width, minimum-scale=1.0, maximum-scale = 1.0, user-scalable = no"
	/>
	<link rel="icon" type="image/x-icon" href="favicon.ico" />
	<link rel="manifest" href="/manifest.json" />
	<meta name="description" content="Comforting spaces around you" />
	<meta name="theme-color" content="#fd8700" />
</svelte:head>
<Header />
{@render children()}
<Footer />

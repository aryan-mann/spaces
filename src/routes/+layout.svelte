<script>
	import '../app.scss';
	import '../app.postcss';
	import 'leaflet/dist/leaflet.css';
	
	import Header from '$lib/aspects/header.svelte';
	import Footer from '$lib/aspects/footer.svelte';
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name = "viewport" content = "width=device-width, minimum-scale=1.0, maximum-scale = 1.0, user-scalable = no">
	<link rel="manifest" href="/manifest.json" />
	<meta name="description" content="Comforting spaces around you" />
	<meta name="theme-color" content="#fd8700" />
</svelte:head>
<Header />
<slot />
<Footer />

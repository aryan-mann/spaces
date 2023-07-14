<script lang="ts">
    import FaRegHandPointRight from 'svelte-icons/fa/FaRegHandPointRight.svelte'
    import FaRegHandPointLeft from 'svelte-icons/fa/FaRegHandPointLeft.svelte'
    import MdPhotoLibrary from 'svelte-icons/md/MdPhotoLibrary.svelte'

	export let images: string[] = [];

    export let mainImageClass: string = 'rounded';
    export let lightboxImageClass: string = 'rounded-lg shadow-white';

    // Tracks whether the lightbox is open
	let lightboxOpen: boolean = false;
	function toggleLightbox() {
		lightboxOpen = !lightboxOpen;
	}

    // Tracks the index of the current image being shown in lightbox
	let currentLightboxImageIndex: number = 0;
    function previousImage() {
        currentLightboxImageIndex -= 1;
        if (currentLightboxImageIndex < 0) {
            currentLightboxImageIndex = images.length -1;
        }
    }
    function nextImage() {
        currentLightboxImageIndex += 1;
        if (currentLightboxImageIndex >= images.length) {
            currentLightboxImageIndex = 0;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="relative" on:click={toggleLightbox}>
	<img class={`main-image ${mainImageClass}`} class:many={images.length > 1} src={images[0]} alt="" />
    {#if images.length > 1}
    <div class="absolute right-0 top-0 w-4 h-4 text-white mr-2 mt-2">
        <MdPhotoLibrary />
    </div>
    {/if}
    <slot />
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    on:click|stopPropagation={toggleLightbox}
	class:hidden={!lightboxOpen}
	class="fixed left-0 top-0 z-[9999] w-screen h-screen bg-black bg-opacity-70 flex justify-center items-center"
>
	<div class="lightbox-container">
        <img class={`lightbox-image ${lightboxImageClass}`} src={images[currentLightboxImageIndex]} alt="" />
        <div class="flex mt-3 w-full items-center justify-center">
            <p class="select-none text-center text-white bg-black rounded px-2 py-1">{currentLightboxImageIndex+1} of {images.length}</p>
        </div>
        {#if images.length > 1}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click|stopPropagation|preventDefault={previousImage} class="slider-buttons prev left-0">
			<FaRegHandPointLeft />
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click|stopPropagation|preventDefault={nextImage} class="slider-buttons next right-0">
			<FaRegHandPointRight />
		</div>
        {/if}
	</div>
</div>

<style>
    .main-image.many {
        @apply cursor-pointer hover:shadow-lg;
    }
    .lightbox-container {
        @apply w-full p-2 h-fit max-w-screen-md relative;
    }
    .slider-buttons {
        box-shadow: 2px 2px 0px 0px #d81159;
        bottom: calc(50% - 20px);
        @apply flex items-center transform-gpu duration-200 p-2 justify-center cursor-pointer absolute rounded-full w-10 h-10 bg-white hover:bg-gray-300 active:bg-gray-500;
    }
    .slider-buttons.prev {
        @apply active:rotate-45 hover:-rotate-12;
    }
    .slider-buttons.next {
        @apply active:-rotate-45 hover:rotate-12;
    }
    .slider-buttons p {
        @apply text-xl;
    }
</style>
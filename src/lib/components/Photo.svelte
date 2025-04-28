<script lang="ts">
	import { useProgressiveImg } from '$lib/utils/useProgressiveImg.svelte';
	import type { ImageDefinition } from 'jazz-tools';

	const { img, width }: { img: ImageDefinition | null; width: number } = $props();
	const { res, src } = $derived(
		useProgressiveImg({
			image: img,
			targetWidth: width || 16
		})
	);
</script>

<img
	{src}
	alt="Background"
	class="w-full object-cover"
	class:blur-lg={res === 'placeholder'}
	class:animate-pulse={res === 'placeholder'}
	loading="lazy"
/>

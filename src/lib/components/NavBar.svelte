<script lang="ts">
	import { goto } from '$app/navigation';

	let { title }: { title: string } = $props();
</script>

<nav class="navbar">
	<div class="navbar-start">
		<button class="btn btn-ghost btn-circle" onclick={() => goto('/')}
			><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
				><title>arrow_left_fill</title><g id="arrow_left_fill" fill="none" fill-rule="nonzero"
					><path
						d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z"
					/><path
						fill="currentColor"
						d="M3.283 10.94a1.5 1.5 0 0 0 0 2.12l5.656 5.658a1.5 1.5 0 1 0 2.122-2.122L7.965 13.5H19.5a1.5 1.5 0 0 0 0-3H7.965l3.096-3.096a1.5 1.5 0 1 0-2.122-2.121L3.283 10.94Z"
					/></g
				></svg
			></button
		>
	</div>
	<h3 class="navbar-center font-display text-base-content text-2xl">{title}</h3>
	<div class="navbar-end"></div>
</nav>

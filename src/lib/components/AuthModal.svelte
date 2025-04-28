<script lang="ts">
	import { usePasskeyAuth } from 'jazz-svelte';
	import LogInBanner from './illustrations/LogInBanner.svelte';

	const auth = usePasskeyAuth({ appName: 'Gleam' });

	let { authModal = $bindable() } = $props();

	function signIn() {
		auth.current.logIn().catch((e) => {
			console.error(e);
		});
		authModal.close();
	}

	function signUp(e: Event) {
		const formData = new FormData(e.currentTarget as HTMLFormElement);
		const name = formData.get('name') as string;

		auth.current.signUp(name).catch((e) => {
			console.error(e);
		});
	}
	let newUser = $state<boolean>(false);
</script>

<dialog class="modal" bind:this={authModal}>
	<div class="modal-box">
		<button
			type="button"
			onclick={authModal?.close()}
			class="btn btn-circle btn-sm absolute top-4 right-4"
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4"
				><title>close_fill</title><g id="close_fill" fill="none" fill-rule="evenodd"
					><path
						d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
					/><path
						fill="currentColor"
						d="m12 14.122 5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879 6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"
					/></g
				></svg
			>
		</button>
		<form method="dialog" onsubmit={signUp}>
			<div class="w-full"><LogInBanner /></div>
			<h3 class=" mb-2 text-center text-3xl font-semibold">{newUser ? 'Sign Up' : 'Sign In'}</h3>
			<button
				class="btn btn-ghost btn-block text-base-content mb-2"
				onclick={(e) => {
					e.preventDefault();
					newUser = !newUser;
				}}
			>
				For {newUser ? 'existing' : 'new'} users
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="inline-block"
					><title>right_fill</title><g id="right_fill" fill="none" fill-rule="evenodd"
						><path
							d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z"
						/><path
							fill="currentColor"
							d="M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12 8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z"
						/></g
					></svg
				>
			</button>
			{#if newUser}
				<label
					>Name
					<input class="input w-full rounded-xl" id="name" name="name" />
				</label>
				<div class="modal-action">
					<button type="submit" class="btn btn-primary btn-block">Sign Up</button>
				</div>
			{:else}
				<button type="button" class="btn btn-primary btn-block" onclick={signIn}>Sign In</button>
			{/if}
		</form>
	</div>
</dialog>

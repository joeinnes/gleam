<script lang="ts">
	import { usePasskeyAuth } from 'jazz-svelte';

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
</script>

<dialog class="modal" bind:this={authModal}>
	<div class="modal-box">
		<form method="dialog" onsubmit={signUp}>
			<h3 class="text-lg font-bold">Sign Up or Sign In</h3>
			<label
				>Name
				<input class="input" id="name" name="name" />
			</label>
			<button type="button" class="btn btn-link" onclick={signIn}
				>Already have an account? Sign In!</button
			>
			<div class="modal-action">
				<button type="submit" class="btn btn-primary">Sign Up</button>
			</div>
		</form>
	</div>
</dialog>

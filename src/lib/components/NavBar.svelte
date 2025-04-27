<script lang="ts">
	import { useAccount, useAccountOrGuest, usePasskeyAuth } from 'jazz-svelte';
	import AuthModal from './AuthModal.svelte';

	let { me } = $derived(
		useAccountOrGuest({
			resolve: {
				profile: true
			}
		})
	);
	const { logOut } = $derived(useAccount());
	const auth = usePasskeyAuth({ appName: 'Gleam' });
	let authModal = $state<HTMLDialogElement>();
</script>

<nav class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl" href="/">Gleam</a>
	</div>
	<div class="flex items-center gap-2">
		{#if auth.state !== 'signedIn'}
			<button class="btn btn-ghost" onclick={() => authModal?.showModal()}>Guest</button>
			<AuthModal bind:authModal />
		{:else if me?._type === 'Account'}
			<div class="dropdown dropdown-end">
				<button class="btn btn-ghost" onclick={() => console.log()}
					>{me.profile.name.split(' ')[0]}</button
				>
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img
							alt="Tailwind CSS Navbar component"
							src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
						/>
					</div>
				</div>
				<ul
					tabindex="0"
					class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
				>
					<li>
						<a class="justify-between"> Profile </a>
					</li>
					<li><a>Settings</a></li>
					<li>
						<button onclick={logOut}>Log Out</button>
					</li>
				</ul>
			</div>
		{/if}
	</div>
</nav>

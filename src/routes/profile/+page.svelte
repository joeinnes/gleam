<script lang="ts">
	import { useAccount } from 'jazz-svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import { goto } from '$app/navigation';

	let { me, logOut } = $derived(
		useAccount({
			resolve: {
				root: true,
				profile: true
			}
		})
	);

	async function save() {
		window.history.back();
	}
</script>

<svelte:head><title>Gleam | Profile</title></svelte:head>

<NavBar title="Profile" />

{#if me?.profile}
	<label class="label" for="name">
		<span class="label-text">Name</span>
	</label>
	<input
		type="text"
		id="name"
		bind:value={me.profile.name}
		class="input input-bordered mb-2 w-full rounded-xl"
	/>
	<label class="label" for="apikey">
		<span class="label-text">API Key</span>
	</label>
	<input
		type="text"
		id="name"
		bind:value={me.root.apiKey}
		class="input input-bordered mb-2 w-full rounded-xl"
	/>
	<p class="text-sm">
		Get your API key <a
			href="https://aistudio.google.com/app/apikey"
			target="_blank"
			class="underline">here</a
		>. Your API key is encrypted before it is stored securely on our servers.
	</p>
	<button class="btn btn-primary btn-block mt-2" onclick={save}>Save</button>
{/if}

<button
	class="btn btn-secondary btn-block mt-auto"
	onclick={() => {
		logOut();
		goto('/');
	}}>Log Out</button
>

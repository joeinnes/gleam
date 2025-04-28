<script lang="ts" module>
	declare module 'jazz-svelte' {
		interface Register {
			Account: GleamAccount;
		}
	}
</script>

<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';

	import Dock from '$lib/components/Dock.svelte';
	import { GleamAccount } from '$lib/schema';
	import '../app.css';
	import { JazzProvider } from 'jazz-svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>Gleam</title>
</svelte:head>
<JazzProvider
	sync={{
		peer: PUBLIC_API_URL as `wss://${string}` | `ws://${string}`,
		when: 'signedUp'
	}}
	AccountSchema={GleamAccount}
>
	<main
		class="text-primary container mx-auto flex min-h-screen max-w-xl flex-1 flex-col px-4 py-2 pb-18"
	>
		{@render children?.()}
	</main>
	<Dock />
</JazzProvider>

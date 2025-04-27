<script lang="ts" module>
	declare module 'jazz-svelte' {
		interface Register {
			Account: GleamAccount;
		}
	}
</script>

<script lang="ts">
	import Dock from '$lib/components/Dock.svelte';
	import type { GleamAccount } from '$lib/schema';
	import '../app.css';
	import { JazzProvider } from 'jazz-svelte';
	let { children } = $props();
</script>

<JazzProvider
	sync={{
		peer: `wss://cloud.jazz.tools/?key=you@example.com`,
		when: 'never'
	}}
>
	{@render children?.()}
</JazzProvider>
<Dock />

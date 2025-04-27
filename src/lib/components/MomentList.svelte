<script lang="ts">
	import type { ListOfMoments } from '$lib/schema';
	import MomentCard from './MomentCard.svelte';

	let { memories }: { memories: ListOfMoments | null } = $props();
</script>

{#each memories || [] as moment}
	<MomentCard {moment} />
{/each}

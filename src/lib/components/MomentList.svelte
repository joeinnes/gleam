<script lang="ts">
	import type { Moment } from '$lib/schema';
	import MomentCard from './MomentCard.svelte';
	import EmptyState from './illustrations/EmptyState.svelte';
	import type { co } from 'jazz-tools';

	let { memories }: { memories: co<Moment | null>[] | undefined } = $props();

	let sortedMemories = $derived(
		(memories || [])
			.filter(
				(moment): moment is Moment => moment?.date instanceof Date && !isNaN(moment.date.getTime())
			)
			.sort((a, b) => (b?.date?.getTime() || 0) - (a?.date?.getTime() || 0))
	);

	let groupedMoments = $derived(
		Object.groupBy(sortedMemories, (moment) => {
			return (
				moment?.date.toLocaleDateString('en-GB', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				}) || 'Unknown'
			);
		})
	);

	let sortedDateKeys = $derived(Object.keys(groupedMoments));
</script>

<div class="flex h-full flex-1 flex-col gap-2">
	{#if memories?.length}
		<h1 class="text-base-content font-display pt-2 text-4xl">Moments</h1>
	{/if}

	{#each sortedDateKeys as dateKey}
		{@const momentsForDate = groupedMoments[dateKey]}
		{#if momentsForDate?.length}
			<h2 class="text-base-content text pt-4 font-bold">
				{dateKey ===
				new Date().toLocaleDateString('en-GB', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})
					? 'Today'
					: dateKey}
			</h2>
			{#each momentsForDate as moment}
				{#if moment}
					<MomentCard {moment} />{/if}
			{/each}
		{/if}
	{:else}
		{#if !memories?.length}
			<EmptyState />
		{/if}
	{/each}
</div>

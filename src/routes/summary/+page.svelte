<script lang="ts">
	import { useAccount } from 'jazz-svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import { generateSummary } from '$lib/utils/getGenAISummary';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';

	let { me } = $derived(
		useAccount({
			resolve: {
				root: { myMoments: { $each: true } }
			}
		})
	);

	let startDate = $state('');
	let endDate = $state('');
	let summary = $state('');
	let loading = $state(false);

	let sanitizedSummaryHtml = $derived.by(() => {
		if (!summary) return '';
		if (typeof window !== 'undefined') {
			const rawHtml = marked.parse(summary) as string;
			return DOMPurify.sanitize(rawHtml);
		}
		return '';
	});

	async function requestSummary() {
		loading = true;
		summary = '';
		await me?.ensureLoaded({
			resolve: {
				root: {
					myMoments: {
						$each: true
					}
				}
			}
		});

		// Calculate the end date boundary (start of the day AFTER the selected end date)
		let endDateBoundary: Date | null = null;
		if (endDate) {
			endDateBoundary = new Date(endDate);
			endDateBoundary.setDate(endDateBoundary.getDate() + 1); // Move to the next day
		}

		const moments =
			me?.root.myMoments.filter((moment) => {
				if (!moment?.date || moment.isDeleted || moment.isPrivate) return false;
				const startMatch = !startDate || moment.date >= new Date(startDate);
				const endMatch = !endDateBoundary || moment.date < endDateBoundary;
				return startMatch && endMatch;
			}) || [];

		if (moments.length === 0) {
			console.error('No moments found');
			loading = false;
			return;
		}

		if (!me?.root?.apiKey) {
			console.error('No API key found');
			summary = 'API Key not configured. Please add it in your profile.';
			loading = false;
			return;
		}

		const generated = await generateSummary(me.root.apiKey, moments);

		summary = generated || 'There was an issue generating the summary. Please try again later.';

		loading = false;
	}

	function setRange(period: 'week' | 'month' | 'year' | 'all-time') {
		const end = new Date();
		const start = new Date();

		switch (period) {
			case 'week':
				start.setDate(end.getDate() - 7);
				break;
			case 'month':
				start.setMonth(end.getMonth() - 1);
				break;
			case 'year':
				start.setFullYear(end.getFullYear() - 1);
				break;
			case 'all-time':
				start.setFullYear(0);
				break;
		}

		startDate = start.toISOString().split('T')[0];
		endDate = end.toISOString().split('T')[0];
	}
</script>

<svelte:head>
	<title>Gleam | Summaries</title>
</svelte:head>

<NavBar title="Summaries" />
<div class="mt-4 flex flex-wrap gap-2">
	<button class="btn btn-sm" onclick={() => setRange('week')}>Past Week</button>
	<button class="btn btn-sm" onclick={() => setRange('month')}>Past Month</button>
	<button class="btn btn-sm" onclick={() => setRange('year')}>Past Year</button>
	<button class="btn btn-sm" onclick={() => setRange('all-time')}>All Time</button>
</div>

<div class="form-control mt-4 grid grid-cols-2 gap-4">
	<div>
		<label class="label" for="startDate">
			<span class="label-text">Start Date</span>
		</label>
		<input
			type="date"
			id="startDate"
			bind:value={startDate}
			class="input input-bordered w-full rounded-xl"
		/>
	</div>
	<div>
		<label class="label" for="endDate">
			<span class="label-text">End Date</span>
		</label>
		<input
			type="date"
			id="endDate"
			bind:value={endDate}
			class="input input-bordered w-full rounded-xl"
		/>
	</div>
</div>
<button
	class="btn btn-primary my-2 w-full"
	onclick={requestSummary}
	disabled={loading || (!startDate && !endDate)}
>
	{#if loading}
		<span class="loading loading-spinner"></span>
	{/if}
	Generate Summary
</button>

{#if summary}
	<div class="card bg-base-200 prose mt-6 mb-16 max-w-none p-4">
		<h2 class="card-title">Generated Summary</h2>
		<div class="prose prose-md">{@html sanitizedSummaryHtml}</div>
		<button
			class="btn btn-primary btn-block mt-2"
			onclick={() =>
				navigator.clipboard.write([
					new ClipboardItem({
						'text/html': sanitizedSummaryHtml
					})
				])}>Copy</button
		>
	</div>
{/if}

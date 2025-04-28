<script lang="ts">
	import { useAccount } from 'jazz-svelte';
	import MomentList from '$lib/components/MomentList.svelte';
	import { Moment } from '$lib/schema';

	let { me } = $derived(
		useAccount({
			resolve: {
				root: {
					myMoments: true
				}
			}
		})
	);
</script>

<svelte:head>
	<title>Gleam | My Moments</title>
</svelte:head>

<MomentList memories={me?.root?.myMoments.filter((el: Moment | null) => !el?.isDeleted)} />

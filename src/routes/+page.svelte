<script lang="ts">
	import { useAccountOrGuest } from 'jazz-svelte';
	import MomentList from '$lib/components/MomentList.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import { Moment } from '$lib/schema';

	let { me } = $derived(
		useAccountOrGuest({
			resolve: {
				root: true
			}
		})
	);

	function getTimeBasedGreeting() {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good morning';
		if (hour < 18) return 'Good afternoon';
		return 'Good evening';
	}
</script>

<NavBar />

<main class="container mx-auto max-w-xl px-4 py-2">
	{getTimeBasedGreeting()}
	{me?.profile?.name?.split(' ')[0]}!
	<a href="/moment/new" class="btn btn-secondary btn-block mt-2 mb-4">Add Moment</a>
	<MomentList memories={me?.root?.myMoments.filter((el: Moment) => !el.isDeleted)} />
</main>

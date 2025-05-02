<script lang="ts">
	import { useAccount } from 'jazz-svelte';
	import { page } from '$app/state';
	import { Moment } from '$lib/schema';
	import NavBar from '$lib/components/NavBar.svelte';
	import Photo from '$lib/components/Photo.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte'; // Added import
	import { goto } from '$app/navigation';

	let { me } = $derived(
		useAccount({
			resolve: {
				root: { myMoments: true }
			}
		})
	);

	let momentId = $derived(page.params.id);
	let moment = $derived(me?.root?.myMoments.find((m) => m && m.id === momentId && !m.isDeleted));

	let isEditing = $state(false);
	let showConfirmModal = $state(false); // Added state for modal visibility
	let photoToDeleteIndex = $state<number | null>(null); // State for photo deletion
	let cw = $state(16);

	// Renamed original deleteMoment and added requestDeleteMoment
	function requestDeleteMoment() {
		if (moment) {
			showConfirmModal = true;
		}
	}

	// Function to request photo deletion
	function requestDeletePhoto(index: number) {
		if (moment?.photos) {
			photoToDeleteIndex = index;
			showConfirmModal = true;
		}
	}

	function confirmDeleteMoment() {
		if (moment) {
			moment.isDeleted = true;
			// Navigate back to the home page or show a confirmation
			goto('/');
		}
	}
</script>

<NavBar
	title={moment?.date.toLocaleDateString('en-GB', {
		dateStyle: 'medium'
	}) || 'Moment'}
/>

<main class="container mx-auto max-w-xl px-4 py-2">
	{#if moment}
		<article class="card bg-base-100 text-base-content mt-4 overflow-hidden shadow-sm">
			{#if (moment.photos?.length || 0) > 0}
				<div class="carousel w-full" bind:clientWidth={cw}>
					{#each moment.photos || [] as photo, i}
						{@const photosLength = moment.photos?.length || 0}
						<div class="carousel-item relative w-full" id="item-{i + 1}">
							<Photo img={photo} width={cw} />
							{#if isEditing}
								<button
									class="btn btn-circle btn-error btn-xs absolute top-2 right-2 z-10"
									onclick={() => requestDeletePhoto(i)}
								>
									✕
								</button>
							{/if}
							{#if photosLength > 1}
								<div
									class="absolute top-1/2 right-1 left-1 flex -translate-y-1/2 transform justify-between"
								>
									<button
										class="btn btn-circle btn-ghost btn-xs"
										onclick={(e) => {
											e.preventDefault();
											location.replace(`#item-${i === 0 ? photosLength : i}`);
										}}>❮</button
									>
									<button
										onclick={(e) => {
											e.preventDefault();
											location.replace(`#item-${i === photosLength - 1 ? 1 : i + 2}`);
										}}
										class="btn btn-circle btn-ghost btn-xs">❯</button
									>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
			<div class="card-body">
				{#if isEditing}
					<textarea class="textarea textarea-bordered w-full rounded-xl" bind:value={moment.content}
					></textarea>
					<div class="card-actions justify-end gap-2">
						<button class="btn btn-sm btn-ghost" onclick={() => (isEditing = false)}>Cancel</button>
						<button class="btn btn-sm btn-primary" onclick={() => (isEditing = false)}>Save</button>
					</div>
				{:else}
					<p class="text-lg">{moment.content}</p>
					<div class="card-actions text-base-content/70 justify-end text-sm">
						{moment.date.toLocaleString('en-GB', {
							dateStyle: 'medium',
							timeStyle: 'short'
						})}
					</div>
					<div class="card-actions mt-4 justify-end gap-2">
						<button class="btn btn-sm btn-outline btn-error" onclick={requestDeleteMoment}
							>Delete</button
						>
						<button class="btn btn-sm btn-secondary" onclick={() => (isEditing = true)}>Edit</button
						>
					</div>
				{/if}
			</div>
		</article>
	{:else}
		<p class="mt-8 text-center">Moment not found or has been deleted.</p>
		<a href="/" class="btn btn-link mx-auto mt-4 block">Go back home</a>
	{/if}

	<!-- Confirmation Modal -->
	<ConfirmModal
		bind:open={showConfirmModal}
		title={photoToDeleteIndex !== null ? 'Delete Photo?' : 'Delete Moment?'}
		message={photoToDeleteIndex !== null
			? 'Are you sure you want to delete this photo? This action cannot be undone.'
			: 'Are you sure you want to delete this moment? This action cannot be undone.'}
		confirmLabel="Delete"
		onConfirm={() => {
			if (photoToDeleteIndex !== null && moment?.photos) {
				moment.photos.splice(photoToDeleteIndex, 1);
				photoToDeleteIndex = null; // Reset after deletion
			} else {
				confirmDeleteMoment(); // Handle moment deletion
			}
		}}
		onCancel={() => {
			photoToDeleteIndex = null; // Reset if cancelled
		}}
	/>
</main>

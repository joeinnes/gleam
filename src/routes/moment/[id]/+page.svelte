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
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
										><title>close_fill</title><g id="close_fill" fill="none" fill-rule="evenodd"
											><path
												d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
											/><path
												fill="currentColor"
												d="m12 14.122 5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879 6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"
											/></g
										></svg
									>
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

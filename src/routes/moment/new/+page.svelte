<script lang="ts">
	import { Group } from 'jazz-tools';
	import { createImage } from 'jazz-browser-media-images';
	import { Moment, PhotoList } from '$lib/schema';
	import { useAccount } from 'jazz-svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import { goto } from '$app/navigation';
	let { addModal = $bindable() } = $props();
	let { me } = $derived(
		useAccount({
			resolve: {
				root: { myMoments: true }
			}
		})
	);

	let dtSelector = $state<HTMLInputElement>();
	$effect(() => {
		if (!dtSelector) return;
		const now = new Date();
		const year = now.getFullYear();
		const month = (now.getMonth() + 1).toString().padStart(2, '0');
		const day = now.getDate().toString().padStart(2, '0');
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

		dtSelector.value = formattedDateTime;
	});

	// Store all selected files here
	let accumulatedFiles = $state<File[]>([]);
	let fileInput = $state<HTMLInputElement>();
	let loading = $state(false); // <-- Add this line

	// Derive previews from the accumulated list
	let previews = $derived(
		accumulatedFiles.map((file) => ({
			url: URL.createObjectURL(file),
			name: file.name
		}))
	);

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			accumulatedFiles = [...accumulatedFiles, ...Array.from(target.files)];
			target.value = '';
		}
	}

	$effect(() => {
		const currentUrls = previews.map((p) => p.url);
		return () => {
			currentUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	});

	async function handleSubmit(e: Event) {
		loading = true; // <-- Set loading to true
		try {
			await me?.ensureLoaded({
				resolve: {
					root: {
						myMoments: true
					}
				}
			});
			const form = e.currentTarget as HTMLFormElement;
			const formData = new FormData(form);
			const content = formData.get('content') as string;
			const dateString = formData.get('date') as string;
			const isPrivate = (formData.get('isPrivate') as string) === 'on';
			const date = new Date(dateString);
			const momentGroup = Group.create();
			const photoListGroup = Group.create();
			photoListGroup.extend(momentGroup);
			const photoList = PhotoList.create([], { owner: photoListGroup });
			for (let i = 0; i < accumulatedFiles.length; i++) {
				const file = accumulatedFiles[i];
				const photoGroup = Group.create();
				photoGroup.extend(photoListGroup);
				const photo = await createImage(file, { owner: photoGroup });
				photoList.push(photo);
			}
			const momentObj = {
				date,
				content,
				photos: photoList,
				isDeleted: false,
				isPrivate
			};
			const moment = Moment.create(momentObj, { owner: momentGroup });
			me?.root?.myMoments?.push(moment);
			form.reset();
			addModal?.close();
			accumulatedFiles = [];
			goto('/');
		} catch (error) {
			console.error('Error saving moment:', error);
			// Handle error appropriately, maybe show a message to the user
		} finally {
			loading = false; // <-- Set loading to false in finally block
		}
		return false; // Prevent page reload on form subm
	}
</script>

<svelte:head>
	<title>Gleam | New Moment</title>
</svelte:head>

<NavBar title="New Moment" />

<form method="dialog" onsubmit={handleSubmit} class="flex flex-col space-y-4">
	<label
		><span>What made you smile today?</span><textarea
			class="textarea w-full rounded-xl"
			required
			placeholder="Write something joyful..."
			name="content"
		></textarea></label
	>
	<label
		><span>When?</span><input
			type="datetime-local"
			name="date"
			class="input w-full rounded-xl"
			bind:this={dtSelector}
			required
		/></label
	>

	<label class="label">
		<input
			type="checkbox"
			name="isPrivate"
			class="toggle checked:bg-primary checked:text-primary-content checked:border-primary !mt-0 transition-colors"
		/>
		<p>Private memory</p>
	</label>

	<label>
		<!-- Hidden file input, use on:change -->
		<input
			type="file"
			class="hidden"
			bind:this={fileInput}
			onchange={handleFileChange}
			multiple
			accept="image/*"
		/>
		<button
			type="button"
			class="bg-base-200 hover:bg-base-200 text-base-content place-it1ems-center mb-2 grid aspect-[16/9] w-full cursor-pointer rounded-xl text-3xl"
			onclick={() => fileInput?.click()}
		>
			<div
				class="flex flex-col items-center justify-center opacity-60 transition-opacity hover:opacity-100"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="30%" height="auto" viewBox="0 0 24 24"
					><title>camera_2_fill</title><g id="camera_2_fill" fill="none"
						><path
							d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
						/><path
							fill="currentColor"
							d="M14.793 3a1.5 1.5 0 0 1 .95.34l.11.1L17.415 5H20a2 2 0 0 1 1.995 1.85L22 7v12a2 2 0 0 1-1.85 1.995L20 21H4a2 2 0 0 1-1.995-1.85L2 19V7a2 2 0 0 1 1.85-1.995L4 5h2.586l1.56-1.56a1.5 1.5 0 0 1 .913-.433L9.207 3zM12 7.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6"
						/></g
					></svg
				>
				<p class="text-lg">Add a photo</p>
			</div>
		</button>
		<div class="grid grid-cols-3 gap-2">
			<!-- Iterate over previews derived from accumulatedFiles -->
			{#each previews as preview (preview.url)}<div
					class="bg-base-300 group relative grid aspect-square place-items-center overflow-hidden rounded-xl"
				>
					<img
						class="h-full w-full object-cover object-center"
						src={preview.url}
						alt={preview.name}
					/>
					<button
						type="button"
						class="btn btn-xs btn-circle btn-error absolute top-1 right-1 transition-opacity group-hover:opacity-100 md:opacity-0"
						onclick={() =>
							(accumulatedFiles = accumulatedFiles.filter((f) => f.name !== preview.name))}
						><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
							><title>close_fill</title><g id="close_fill" fill="none" fill-rule="evenodd"
								><path
									d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
								/><path
									fill="currentColor"
									d="m12 14.122 5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879 6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"
								/></g
							></svg
						></button
					>
				</div>{/each}
		</div></label
	>

	<button type="submit" class="btn btn-primary font-medium" disabled={loading}>
		{#if loading}
			<span class="loading loading-spinner"></span>
		{/if}
		Save Moment
	</button>
</form>

<style lang="postcss">
	@reference "tailwindcss";
	label > span {
		@apply mb-2 text-lg;
	}
	input,
	textarea {
		@apply mt-2;
	}
</style>

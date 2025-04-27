<script lang="ts">
	import { Group } from 'jazz-tools';
	import { createImage } from 'jazz-browser-media-images';
	import { Moment, PhotoList } from '$lib/schema';
	import { useAccount } from 'jazz-svelte';
	let { addModal = $bindable() } = $props();
	let { me } = $derived(
		useAccount({
			resolve: {
				root: { myMoments: true }
			}
		})
	);

	/* 	date = co.Date;
	content = co.string;
	photos = co.optional.ref(PhotoList);
	isDeleted = co.boolean; */
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
		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const content = formData.get('content') as string;
		const dateString = formData.get('date') as string;
		const date = new Date(dateString);
		const isDeleted = false;
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
			isDeleted
		};
		const moment = Moment.create(momentObj, { owner: momentGroup });
		me.root.myMoments.push(moment);
		form.reset();
		addModal?.close();
		accumulatedFiles = [];
		return false; // Prevent page reload on form subm
	}
	$inspect(me?.root);
</script>

<nav class="navbar">
	<div class="navbar-start">
		<button class="btn btn-ghost btn-circle" onclick={() => window.history.back()}>&larr;</button>
	</div>
	<h3 class="navbar-center text-lg font-bold">Add a moment</h3>
	<div class="navbar-end"></div>
</nav>
<main class="container mx-auto max-w-xl px-4 py-2">
	<form method="dialog" onsubmit={handleSubmit} class="flex flex-col space-y-2">
		<label
			><span>What made you happy?</span><textarea class="textarea textarea-xl w-full" required
			></textarea></label
		>
		<label
			><span>When?</span><input
				type="datetime-local"
				class="input w-full"
				bind:this={dtSelector}
				required
			/></label
		>
		<label
			><span>Photos</span>
			<!-- Hidden file input, use on:change -->
			<input
				type="file"
				class="hidden"
				bind:this={fileInput}
				onchange={handleFileChange}
				multiple
				accept="image/*"
			/>
			<div class="grid grid-cols-3 gap-2">
				<!-- Iterate over previews derived from accumulatedFiles -->
				{#each previews as preview (preview.url)}<div
						class="bg-base-300 group relative grid aspect-square place-items-center overflow-hidden rounded"
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
							>✕</button
						>
					</div>{/each}
				<button
					type="button"
					class="bg-base-300 hover:bg-base-200 grid aspect-square cursor-pointer place-items-center rounded text-3xl"
					onclick={() => fileInput?.click()}
				>
					+
				</button>
			</div></label
		>
		<div class="modal-action">
			<!-- if there is a button in form, it will close the modal -->
			<button class="btn" type="button" onclick={() => window.history.back()}>Cancel</button>
			<button type="submit" class="btn btn-primary">Save Moment</button>
		</div>
	</form>
</main>

<style lang="postcss">
	@reference "tailwindcss";
	label > span {
		@apply text-lg font-bold;
	}
	input {
		@apply text-base;
	}
</style>

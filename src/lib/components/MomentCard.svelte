<script lang="ts">
	import type { Moment } from '$lib/schema';

	let { moment }: { moment: Moment } = $props();
	import Photo from './Photo.svelte';
	let cw = $state(16);
</script>

<a
	href="/moment/{moment.id}"
	class="block no-underline transition-shadow duration-200 hover:shadow-md"
>
	<article
		class="card card-side bg-base-100 text-base-content grid h-full grid-cols-3 overflow-hidden shadow-sm"
	>
		<div class={(moment?.photos?.length || 0) > 0 ? '' : 'hidden'} bind:clientWidth={cw}>
			<div class="carousel h-full">
				{#each moment.photos || [] as photo, i}
					{@const photosLength = moment.photos?.length || 0}
					<div class="carousel-item relative w-full" id="item-{i + 1}">
						<Photo img={photo} width={cw} />
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
		</div>
		<div
			class="card-body text-lg {(moment?.photos?.length || 0) > 0 ? 'col-span-2' : 'col-span-3'}"
		>
			<p>{moment.content}</p>
			<div class="card-actions justify-end text-sm italic">
				{moment.date.toLocaleTimeString('en-GB', {
					hour: 'numeric',
					minute: 'numeric',
					hour12: true
				})}
			</div>
		</div>
	</article>
</a>

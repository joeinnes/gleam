<script lang="ts">
	let {
		open = $bindable(),
		title = 'Are you sure?',
		message = '',
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		onConfirm = () => {},
		onCancel = () => {}
	}: {
		open?: boolean;
		title?: string;
		message?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		onConfirm?: () => void;
		onCancel?: () => void;
	} = $props();

	function handleConfirm() {
		onConfirm();
		open = false;
	}

	function handleCancel() {
		onCancel();
		open = false;
	}

	function handleClose() {
		// Only dispatch cancel if the modal is closed by clicking the backdrop
		// or pressing Escape (handled by the dialog element itself)
		onCancel();
		open = false;
	}

	// Use a reactive statement to handle programmatic closing
	let dialogElement: HTMLDialogElement | undefined = $state();
	$effect(() => {
		if (dialogElement) {
			if (open) {
				dialogElement.showModal();
			} else {
				dialogElement.close();
			}
		}
	});
</script>

<dialog bind:this={dialogElement} class="modal" onclose={handleClose}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">{title}</h3>
		{#if message}
			<p class="py-4">{message}</p>
		{/if}
		<div class="modal-action">
			<button class="btn btn-ghost" onclick={handleCancel}>{cancelLabel}</button>
			<button class="btn btn-error" onclick={handleConfirm}>{confirmLabel}</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

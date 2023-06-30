<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';

	export let title = 'Dialog';
	export let text = 'This is a dialog';

	let dialog: HTMLDialogElement;

	onMount(() => {
		dialog.showModal();
		dialog.addEventListener('close', () => {
			dialog.remove();
		});
	});
</script>

<dialog bind:this={dialog} class="flex flex-col p-4 gap-4 rounded border border-zinc-700 bg-zinc-900">
	<div class="prose prose-invert">
		<h2>{title}</h2>
		<p>{text}</p>
	</div>
	<Button on:click={dialog.close()} emphasis="medium" class="justify-center">Close</Button>
</dialog>

<script>
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import '../app.pcss';

	let loading = false;

	beforeNavigate(() => {
		loading = true;
	});

	afterNavigate(() => {
		loading = false;
	});
</script>

{#if loading}
	<div class="m-auto animate-spin border-zinc-800 border-[0.75rem] border-t-blue-500 rounded-full w-24 h-24" />
{:else}
	<slot />
{/if}

<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div
	class="prose prose-invert mx-auto p-6 w-full max-w-[80ch] prose-tr:border-0 even:prose-tr:bg-zinc-900 prose-tr:bg-zinc-900/25 only:prose-tr:bg-zinc-900 prose-th:py-1 prose-th:px-2 first:prose-td:ps-2"
>
	<div class="not-prose flex flex-row mb-6">
		<Button emphasis="medium" size="medium" on:click={() => history.back()}>Back</Button>
	</div>
	<h1>{data.vin}</h1>
	{@html data.html}
</div>

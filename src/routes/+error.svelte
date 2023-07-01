<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
</script>

<div class="flex flex-col m-auto gap-4 w-full max-w-[60ch]">
	<div class="prose prose-invert mx-auto p-6 w-full max-w-[60ch]">
		<h1>Error {$page.status}</h1>
		<h3>{$page.error?.message}</h3>
		<Button emphasis="medium" size="medium" on:click={() => history.back()} class="justify-center w-full">Back</Button>
	</div>
</div>

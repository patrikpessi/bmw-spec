<script lang="ts">
	import { page } from '$app/stores';
	import { assets, base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { numberPlateRegex, vinRegex } from '$lib/helpers';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	let mode: 'VIN' | 'PLATE' = $page.url.searchParams.has('vin') ? 'VIN' : 'PLATE';

	async function handleNumberplateQuery(event: SubmitEvent) {
		const data = new FormData(event.target as HTMLFormElement);
		const url = new URL(`${base}/search`, $page.url);
		const plate = data.get('plate') as string;
		url.searchParams.append('plate', plate.toUpperCase());
		await goto(url);
	}

	async function handleVinQuery(event: SubmitEvent) {
		const data = new FormData(event.target as HTMLFormElement);
		const url = new URL(`${base}/search`, $page.url);
		url.searchParams.append('vin', data.get('vin') as string);
		await goto(url);
	}

	function toggleMode() {
		if (mode == 'VIN') mode = 'PLATE';
		else mode = 'VIN';
	}
</script>

<div class="prose prose-invert m-auto p-6 w-full max-w-[60ch]">
	<img alt="BMW Logo" src={`${assets}/images/BMW_logo_(white).svg.png`} class="w-24 h-24 mx-auto" />
	<h1 class="font-extrabold text-center">BMW SPEC Search</h1>
	{#if mode == 'PLATE'}
		<p>Search by <strong>Finnish</strong> licence plate</p>
	{:else}
		<p>Search by <strong>VIN</strong> number</p>
	{/if}
	<form on:submit|preventDefault={mode == 'PLATE' ? handleNumberplateQuery : handleVinQuery} class="not-prose flex flex-col gap-3">
		<div class="flex flex-row w-full">
			{#if mode == 'PLATE'}
				<Input
					type="text"
					name="plate"
					id="plate"
					placeholder="ABC-123"
					value={$page.url.searchParams.get('plate')}
					pattern={numberPlateRegex.source}
					class="rounded-e-none w-full"
					required
				/>
			{:else}
				<Input
					type="text"
					name="vin"
					id="vin"
					placeholder="17 digit VIN number"
					value={$page.url.searchParams.get('vin')}
					pattern={vinRegex.source}
					class="rounded-e-none w-full"
					required
				/>
			{/if}
			<Button type="submit" emphasis="high" class="justify-center rounded-s-none">Search</Button>
		</div>
	</form>
	<Button on:click={toggleMode} size="small" class="mt-4">Toggle search mode</Button>
</div>

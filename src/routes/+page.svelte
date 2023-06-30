<script lang="ts">
	import { page } from '$app/stores';
	import { createDialog, numberPlateRegex, vinRegex } from '$lib/helpers';
	import * as api from '$lib/api';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	let mode: 'VIN' | 'PLATE' = 'PLATE';
	let html: string;

	async function handleNumberplateQuery(event: SubmitEvent) {
		try {
			const data = new FormData(event.target as HTMLFormElement);
			html = await api.getVehicleSpecByNumberPlate(data.get('plate') as string);
		} catch (error) {
			createDialog('Error', error.message);
		}
	}

	async function handleVinQuery(event: SubmitEvent) {
		try {
			const data = new FormData(event.target as HTMLFormElement);
			html = await api.getVehicleSpecByVin(data.get('vin') as string);
		} catch (error) {
			createDialog('Error', error.message);
		}
	}

	function toggleMode() {
		if (mode == 'VIN') mode = 'PLATE';
		else mode = 'VIN';
	}
</script>

<div class="prose prose-invert mx-auto p-6 w-full max-w-[80ch]">
	<img alt="BMW Logo" src="https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg" class="w-24 h-24 mx-auto" />
	<h1 class="text-center font-extrabold">BMW SPEC Search</h1>
	<div class="not-prose flex flex-row items-center gap-4">
		<Button on:click={toggleMode} size="small">Toggle Mode</Button>
		<p>Mode {mode}</p>
	</div>
	{#if mode == 'PLATE'}
		<p>Search BMW spec by <strong>Finnish</strong> licence plate</p>
		<form on:submit={handleNumberplateQuery} class="not-prose flex flex-col gap-2">
			<div class="flex flex-col">
				<label for="plate">Licence plate number:</label>
				<Input
					type="text"
					name="plate"
					id="plate"
					placeholder="ABC-123"
					value={$page.url.searchParams.get('plate')}
					pattern={numberPlateRegex.source}
				/>
			</div>
			<Button type="submit" emphasis="high" class="justify-center">Search</Button>
		</form>
	{:else if mode == 'VIN'}
		<p>Search BMW spec by VIN number</p>
		<form on:submit={handleVinQuery} class="not-prose flex flex-col gap-2">
			<div class="flex flex-col">
				<label for="vin">VIN:</label>
				<Input
					type="text"
					name="vin"
					id="vin"
					placeholder="17 digit VIN number"
					value={$page.url.searchParams.get('vin')}
					pattern={vinRegex.source}
				/>
			</div>
			<Button type="submit" emphasis="high" class="justify-center">Search</Button>
		</form>
	{/if}
	{#if html}
		{@html html}
	{/if}
</div>

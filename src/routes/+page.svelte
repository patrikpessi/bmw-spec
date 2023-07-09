<script lang="ts">
	import { page } from '$app/stores';
	import { assets, base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { vinRegex } from '$lib/helpers';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { countries } from '$lib/api';

	let mode: 'VIN' | 'PLATE' = 'PLATE';
	let selectedCountry = countries.at(0);

	async function handleNumberplateQuery(event: SubmitEvent) {
		const data = new FormData(event.target as HTMLFormElement);
		const url = new URL(`${base}/search`, $page.url);
		const plate = data.get('plate') as string;
		url.searchParams.append('plate', plate.toUpperCase());
		const country = data.get('country') as string;
		url.searchParams.append('country', country.toUpperCase());
		await goto(url);
	}

	async function handleVinQuery(event: SubmitEvent) {
		const data = new FormData(event.target as HTMLFormElement);
		const url = new URL(`${base}/search`, $page.url);
		url.searchParams.append('vin', data.get('vin') as string);
		await goto(url);
	}

	function handleCountrySelect(event: any) {
		const { target } = event;
		selectedCountry = countries.find((country) => country.code == target.value);
	}

	function handlePlateInput(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!selectedCountry?.licensePlateValidator(target.value))
			target.setCustomValidity(`Invalid licenseplate. License plate should look like: ${selectedCountry?.licensePlateExample}`);
		else target.setCustomValidity(``);
		target.reportValidity();
	}

	function toggleMode() {
		if (mode == 'VIN') mode = 'PLATE';
		else mode = 'VIN';
	}
</script>

<div class="prose prose-invert m-auto p-6 w-full max-w-[60ch]">
	<img alt="BMW Logo" src={`${assets}/images/BMW_logo_white.png`} class="w-24 h-24 mx-auto" />
	<h1 class="font-extrabold text-center">BMW SPEC Search</h1>
	{#if mode == 'PLATE'}
		<p>Search by license plate ({selectedCountry?.name})</p>
	{:else}
		<p>Search by <strong>VIN</strong> number</p>
	{/if}
	<form on:submit|preventDefault={mode == 'PLATE' ? handleNumberplateQuery : handleVinQuery} class="not-prose flex flex-col gap-3">
		<div class="flex flex-row w-full">
			{#if mode == 'PLATE'}
				<select
					name="country"
					id="country"
					on:change={handleCountrySelect}
					class="flex flex-row items-center rounded-s bg-zinc-700 focus:outline-none focus:border-none text-base px-3 py-1"
				>
					{#each countries as country}
						<option value={country.code}>{country.code}</option>
					{/each}
				</select>
				<Input
					type="text"
					name="plate"
					id="plate"
					placeholder={selectedCountry?.licensePlateExample}
					on:input={handlePlateInput}
					class="rounded-none w-full"
					required
				/>
			{:else}
				<Input
					type="text"
					name="vin"
					id="vin"
					placeholder="17 digit VIN number"
					pattern={vinRegex.source}
					class="rounded-e-none w-full"
					required
				/>
			{/if}
			<Button type="submit" emphasis="high" class="justify-center rounded-s-none">Search</Button>
		</div>
	</form>
	<Button on:click={toggleMode} size="small" class="mt-4">
		{#if mode == 'PLATE'}
			Search by VIN instead
		{:else}
			Search by license plate instead
		{/if}
	</Button>
</div>

import type { PageLoad } from './$types';

import { getVehicleSpecByCountryAndPlate, getVehicleSpecByVin } from '$lib/api';
import { error } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	const searchParams = url.searchParams;
	try {
		if (searchParams.has('vin')) return { ...(await getVehicleSpecByVin(searchParams.get('vin') as string)) };
		if (searchParams.has('plate'))
			return { ...(await getVehicleSpecByCountryAndPlate(searchParams.get('country') as string, searchParams.get('plate') as string)) };
	} catch (err) {
		throw error(404, err?.message);
	}
	throw error(400, 'Invalid query');
}) satisfies PageLoad;

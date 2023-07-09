import { documentFromText, isValidNumberPlate, vinRegex } from '$lib/helpers';

export async function getVehicleVinByNumberPlate(plate: string) {
	if (!isValidNumberPlate(plate)) throw new Error('Invalid number plate');
	const url = 'https://corsproxy.io/?' + encodeURIComponent(`https://www.biltema.fi/auton-varaosahaku/${plate}/`);
	const res = await fetch(url);
	const text = await res.text();
	if (!text.includes(`${plate} - BMW`)) throw new Error(`Could not find a BMW with this number plate (${plate})`);
	const vinFinderRegex = /(?:alustanumero\:\s)\w+/g;
	if (!vinFinderRegex.test(text)) throw new Error('Could not find a VIN number for this number plate');
	const vin = vinFinderRegex.exec(text)?.at(0)?.replace('alustanumero: ', '') as string;
	if (vinRegex.test(text)) throw new Error(`Invalid VIN for ${plate} (VIN: ${vin})`);
	return vin;
}

export async function getVehicleSpecByVin(vin: string) {
	const url = 'https://corsproxy.io/?' + encodeURIComponent(`https://www.mdecoder.com/decode/${vin}`);
	const res = await fetch(url);
	const text = await res.text();
	const doc = documentFromText(text);
	let dataNodes = [...doc.querySelectorAll('.carInfo h4,table')];
	dataNodes = dataNodes.splice(0, dataNodes.length - 2);
	if (dataNodes.length <= 0) throw new Error('Could not load equipment list for this vehicle');
	const temp = doc.createElement('div');
	dataNodes.forEach((node) => temp.appendChild(node));
	const scripts = temp.querySelectorAll('script');
	scripts.forEach((node) => node.remove());
	const trashRows = temp.querySelectorAll('tr:has(td a strong)');
	trashRows.forEach((node) => node.remove());
	return { html: temp.innerHTML, vin };
}

export async function getVehicleSpecByNumberPlate(plate: string) {
	const vin = await getVehicleVinByNumberPlate(plate);
	return await getVehicleSpecByVin(vin);
}

import { documentFromText, vinRegex } from '$lib/helpers';

export const countries = [
	{
		name: 'Finland',
		code: 'FIN',
		licensePlateExample: 'ABC-123',
		licensePlateValidator: (plate: string) => {
			if (/^[A-ZÅÄÖ]{2,3}-[1-9]{1}[0-9]{0,2}$/.test(plate)) return true;
			return false;
		},
		vinSearchFunction: createBiltemaVinScraper('https://www.biltema.fi/auton-varaosahaku/[plate]/')
	},
	{
		name: 'Sweden',
		code: 'SWE',
		licensePlateExample: 'ABC123',
		licensePlateValidator: (plate: string) => {
			if (/^[A-ZÅÄÖ]{3}[0-9]{2}[A-ZÅÄÖ0-9]{1}$/.test(plate)) return true;
			return false;
		},
		vinSearchFunction: createBiltemaVinScraper('https://www.biltema.se/bil-reservdelar/[plate]/')
	},
	{
		name: 'Norway',
		code: 'NOR',
		licensePlateExample: 'AB12345',
		licensePlateValidator: (plate: string) => {
			// TODO: Better matcher
			if (/^[A-ZÅÄÖ]{2}[0-9]{2,5}$/.test(plate)) return true;
			return false;
		},
		vinSearchFunction: createBiltemaVinScraper('https://www.biltema.no/reservedelssok-bil/[plate]/')
	},
	{
		name: 'Denmark',
		code: 'DNK',
		licensePlateExample: 'AB12345',
		licensePlateValidator: (plate: string) => {
			// TODO: Better matcher
			if (/^[A-ZÅÄÖ]{2}[0-9]{2,5}$/.test(plate)) return true;
			return false;
		},
		vinSearchFunction: createBiltemaVinScraper('https://www.biltema.dk/reservedelsogning-bil/[plate]/')
	}
];

function createBiltemaVinScraper(biltemaURL: string) {
	return async (plate: string) => {
		biltemaURL = biltemaURL.replace('[plate]', plate);
		let url = 'https://corsproxy.io/?' + encodeURIComponent(biltemaURL);
		const res = await fetch(url);
		const text = await res.text();
		if (!text.includes(`${plate} - BMW`)) throw new Error(`Could not find a BMW with this number plate (${plate})`);
		const searchPattern = /\{[^{]+?\"VinNumber\"[^}]+?\}/;
		console.log('text', text);
		if (!searchPattern.test(text)) throw new Error('Could not find a VIN number for this number plate');
		const data = searchPattern.exec(text)?.at(0) as string;
		const vin = JSON.parse(data).value;
		if (vinRegex.test(text)) throw new Error(`Invalid VIN for ${plate} (VIN: ${vin})`);
		return vin;
	};
}

export async function getVehicleVinByCountryAndPlate(countryCode: string, plate: string) {
	const country = countries.find((country) => country.code == countryCode);
	if (!country?.licensePlateValidator(plate)) throw new Error('Invalid number plate');
	return await country.vinSearchFunction(plate);
}

export async function getVehicleSpecByVin(vin: string) {
	const url = 'https://corsproxy.io/?' + encodeURIComponent(`https://www.mdecoder.com/decode/${vin}`);
	const res = await fetch(url);
	const text = await res.text();
	const doc = documentFromText(text);
	let dataNodes = [...doc.querySelectorAll('.carInfo h4,table')];
	dataNodes = dataNodes.splice(0, dataNodes.length - 2);
	if (dataNodes.length <= 0) throw new Error(`Could not load equipment list for this vehicle (VIN: ${vin})`);
	const temp = doc.createElement('div');
	dataNodes.forEach((node) => temp.appendChild(node));
	const scripts = temp.querySelectorAll('script');
	scripts.forEach((node) => node.remove());
	const trashRows = temp.querySelectorAll('tr:has(td a strong)');
	trashRows.forEach((node) => node.remove());
	return { html: temp.innerHTML, vin };
}

export async function getVehicleSpecByCountryAndPlate(countryCode: string, plate: string) {
	const vin = await getVehicleVinByCountryAndPlate(countryCode, plate);
	return await getVehicleSpecByVin(vin);
}

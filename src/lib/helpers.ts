import Dialog from './components/Dialog.svelte';

export const numberPlateRegex = /^[A-ZÖÅÄ]{1,3}-\d{1,3}$/;
export const vinRegex = /^\w{17}$/;

export function isValidNumberPlate(plate: string): Boolean {
	return numberPlateRegex.test(plate);
}

export function isValidVin(vin: string): Boolean {
	return vinRegex.test(vin);
}

export function documentFromText(text: string): Document {
	const parser = new DOMParser();
	return parser.parseFromString(text, 'text/html');
}

export function createDialog(title: string, text: string) {
	new Dialog({
		target: document.body,
		props: {
			title,
			text
		}
	});
}

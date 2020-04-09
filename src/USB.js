const INTERFACE_NUMBER = 2;
const ENDPOINT_OUT = 4;

async function connect() {
	const filters = [
		{ vendorId: 0x2341, productId: 0x8037 } // Arduino Micro
	];

	const device = await navigator.usb.requestDevice({ filters });

	await device.open();
	await device.selectConfiguration(1);
	await device.claimInterface(INTERFACE_NUMBER);
	await device.selectAlternateInterface(INTERFACE_NUMBER, 0);
	await device.controlTransferOut({
		requestType: 'class',
		recipient: 'interface',
		request: 0x22,
		value: 0x01,
		index: INTERFACE_NUMBER
	});

	return device;
}

let device;

export const send = byte => () => {
	if (!device) {
		device = connect();
	}

	device
		// eslint-disable-next-line no-bitwise
		.then(device => device.transferOut(ENDPOINT_OUT, new Uint8Array([byte & 0xff])))
		.catch(e => {
			console.error('Failed to send value via USB', e);
		});
};

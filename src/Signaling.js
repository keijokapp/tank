const peerSubscribers = new Set();
const sdpSubscribers = new Set();
const iceSubscribers = new Set();

let client = null;
let closeTimeout = null;
let reconnectTimeout = null;

function create() {
	clearTimeout(reconnectTimeout);
	reconnectTimeout = null;

	const ws = new WebSocket(window.location.href.replace(/^http/, 'ws'));

	const timeout = setTimeout(() => {
		console.error('Server connection initialization timeout');
		ws.close();
	}, 8000);

	ws.onopen = () => {
		console.log('Server connection open');
		clearTimeout(timeout);
		client = ws;
	};

	ws.onclose = function () {
		console.error('Server connection closed');
		client = null;
		clearTimeout(timeout);
		if (!reconnectTimeout) {
			reconnectTimeout = setTimeout(create, 2000);
		}
	};

	ws.onmessage = ({ data }) => {
		clearTimeout(closeTimeout);
		closeTimeout = setTimeout(() => {
			console.error('Didn\'t receive ping');
			ws.close();
		}, 32000);

		if (data === 'ping') {
			ws.send('pong');
			return;
		}

		const message = JSON.parse(data);

		if (typeof message.source !== 'string') {
			console.warn('Received message without source');
		}

		if ('type' in message) {
			peerSubscribers.forEach(({
				operatorConstructor,
				tankConstructor,
				peerIdConstructor,
				peerType,
				peerId,
				knownPeers,
				subscriber
			}) => {
				if (!('destination' in message)) {
					client.send(JSON.stringify({
						source: peerId.value0,
						destination: message.source,
						type: peerType.constructor.name === 'Tank' ? 'tank' : 'operator'
					}));
				}

				if (!knownPeers.has(peerId) && (!('destination' in message) || message.destination === peerId)) {
					try {
						const type = message.type === 'tank' ? tankConstructor : operatorConstructor;
						subscriber(type, peerIdConstructor(message.source));
					} catch (e) {
						console.error(e);
					}
				}
			});
		}

		if (typeof message.destination === 'string') {
			sdpSubscribers.forEach(({
				peerIdConstructor, sdpConstructor, peerId, subscriber
			}) => {
				if (message.destination === peerId.value0 && 'sdp' in message) {
					try {
						subscriber(peerIdConstructor(peerId), sdpConstructor(message.sdp));
					} catch (e) {
						console.error(e);
					}
				}
			});

			iceSubscribers.forEach(({
				peerIdConstructor, iceConstructor, peerId, subscriber
			}) => {
				if (message.destination === peerId.value0 && 'ice' in message) {
					try {
						subscriber(peerIdConstructor(peerId), iceConstructor(message.ice));
					} catch (e) {
						console.error(e);
					}
				}
			});
		}
	};
}

create();

// eslint-disable-next-line max-len
exports.subscribePeerImpl = operatorConstructor => tankConstructor => peerIdConstructor => peerType => peerId => subscriber => () => {
	const subscriberWrap = {
		operatorConstructor,
		tankConstructor,
		peerIdConstructor,
		peerType: peerType.constructor.name === 'Tank' ? 'operator' : 'tank',
		peerId: peerId.value0,
		knownPeers: new Set(),
		subscriber
	};

	peerSubscribers.add(subscriberWrap);
	return () => {
		peerSubscribers.delete(subscriberWrap);
	};
};

exports.subscribeSdpImpl = peerIdConstructor => sdpConstructor => peerId => subscriber => () => {
	const subscriberWrap = {
		peerIdConstructor,
		sdpConstructor,
		peerId,
		subscriber
	};

	sdpSubscribers.add(subscriberWrap);
	return () => {
		sdpSubscribers.delete(subscriberWrap);
	};
};

exports.subscribeIceImpl = peerIdConstructor => iceConstructor => peerId => subscriber => () => {
	const subscriberWrap = {
		peerIdConstructor,
		iceConstructor,
		peerId,
		subscriber
	};

	iceSubscribers.add(subscriberWrap);
	return () => {
		iceSubscribers.delete(subscriberWrap);
	};
};

exports.sendSdp = source => destination => sdp => () => {
	if (!client) {
		console.warn('Server connection is not active');
		return;
	}

	client.send(JSON.stringify({
		source: source.value0,
		destination: destination.value0,
		sdp: sdp.value0
	}));
};

exports.sendIce = source => destination => ice => () => {
	if (!client) {
		console.warn('Server connection is not active');
		return;
	}

	client.send(JSON.stringify({
		source: source.value0,
		destination: destination.value0,
		ice: ice.value0
	}));
};

exports.peerIdImpl = peerIdConstructor => type => {
	const key = `peer-id-${type}`;
	let peerId = localStorage.getItem(key);

	if (!peerId) {
		peerId = `${Math.random().toString(36).substr(2, 9)}`;
		localStorage.setItem(key, peerId);
	}

	return peerIdConstructor(peerId);
};

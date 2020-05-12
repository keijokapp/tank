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
				peerType,
				peerId,
				knownPeers,
				subscriber
			}) => {
				if (!('destination' in message)) {
					client.send(JSON.stringify({
						source: peerId.value0,
						destination: message.source,
						type: peerType
					}));
				}

				if (!knownPeers.has(peerId) && (!('destination' in message) || message.destination === peerId)) {
					try {
						subscriber(message.type, message.source);
					} catch (e) {
						console.error(e);
					}
				}
			});
		}

		if (typeof message.destination === 'string') {
			sdpSubscribers.forEach(({ localPeer, remotePeer, subscriber }) => {
				if (message.destination === localPeer && message.source === remotePeer && 'sdp' in message) {
					try {
						subscriber(message.sdp);
					} catch (e) {
						console.error(e);
					}
				}
			});

			iceSubscribers.forEach(({ localPeer, remotePeer, subscriber }) => {
				if (message.destination === localPeer && message.source === remotePeer && 'ice' in message) {
					try {
						subscriber(message.ice);
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
		peerType: peerType.constructor.name === 'Tank' ? 'tank' : 'operator',
		peerId: peerId.value0,
		knownPeers: new Set(),
		subscriber: (peerType, peerId) => subscriber(peerType === 'tank' ? tankConstructor : operatorConstructor, peerIdConstructor(peerId))
	};

	peerSubscribers.add(subscriberWrap);
	return () => {
		peerSubscribers.delete(subscriberWrap);
	};
};

exports.subscribeSdpImpl = sdpConstructor => remotePeer => localPeer => subscriber => () => {
	const subscriberWrap = {
		localPeer: localPeer.value0,
		remotePeer: remotePeer.value0,
		subscriber: sdp => subscriber(sdpConstructor(sdp))
	};

	sdpSubscribers.add(subscriberWrap);
	return () => {
		sdpSubscribers.delete(subscriberWrap);
	};
};

exports.subscribeIceImpl = iceConstructor => remotePeer => localPeer => subscriber => () => {
	const subscriberWrap = {
		localPeer: localPeer.value0,
		remotePeer: remotePeer.value0,
		subscriber: ice => subscriber(iceConstructor(ice))
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

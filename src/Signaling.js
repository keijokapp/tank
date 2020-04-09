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

		peerSubscribers.forEach(({
			peerType,
			peerId
		}) => {
			client.send(JSON.stringify({
				source: peerId,
				type: peerType
			}));
		});
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
						source: peerId,
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
			if ('sdp' in message) {
				sdpSubscribers.forEach(({ localPeer, remotePeer, subscriber }) => {
					if (message.destination === localPeer && message.source === remotePeer) {
						Promise.resolve().then(() => {
							try {
								subscriber(message.sdp);
							} catch (e) {
								console.error(e);
							}
						});
					}
				});
			}

			if ('ice' in message) {
				iceSubscribers.forEach(({ localPeer, remotePeer, subscriber }) => {
					if (message.destination === localPeer && message.source === remotePeer) {
						Promise.resolve().then(() => {
							try {
								subscriber(message.ice);
							} catch (e) {
								console.error(e);
							}
						});
					}
				});
			}
		}
	};
}

create();

// eslint-disable-next-line max-len
export const subscribePeerImpl = operatorConstructor => tankConstructor => peerType => peerId => subscriber => () => {
	const subscriberWrap = {
		peerType: peerType.constructor.name === 'Tank' ? 'tank' : 'operator',
		peerId,
		knownPeers: new Set(),
		subscriber: (peerType, peerId) => subscriber(peerType === 'tank' ? tankConstructor : operatorConstructor)(peerId)()
	};

	peerSubscribers.add(subscriberWrap);

	return () => {
		peerSubscribers.delete(subscriberWrap);
	};
};

export const subscribeSdp = remotePeer => localPeer => subscriber => () => {
	const subscriberWrap = {
		localPeer,
		remotePeer,
		subscriber: sdp => subscriber(sdp)()
	};

	sdpSubscribers.add(subscriberWrap);

	return () => {
		sdpSubscribers.delete(subscriberWrap);
	};
};

export const subscribeIce = remotePeer => localPeer => subscriber => () => {
	const subscriberWrap = {
		localPeer,
		remotePeer,
		subscriber: ice => subscriber(ice)()
	};

	iceSubscribers.add(subscriberWrap);

	return () => {
		iceSubscribers.delete(subscriberWrap);
	};
};

export const sendSdp = source => destination => sdp => () => {
	if (!client) {
		console.warn('Server connection is not active');

		return;
	}

	client.send(JSON.stringify({ source, destination, sdp }));
};

export const sendIce = source => destination => ice => () => {
	if (!client) {
		console.warn('Server connection is not active');

		return;
	}

	client.send(JSON.stringify({ source, destination, ice }));
};

export const peerId = type => {
	const key = `peer-id-${type.constructor.name.toLowerCase()}`;
	let peerId = localStorage.getItem(key);

	if (!peerId) {
		peerId = `${Math.random().toString(36).substr(2, 9)}`;
		localStorage.setItem(key, peerId);
	}

	return peerId;
};

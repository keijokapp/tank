function createPeerConnectionImpl(offer, sendSdp, sendIce, subscribeSdp, subscribeIce) {
	const videoTrackSubscribers = new Set();
	const audioTrackSubscribers = new Set();
	const closeSubscribers = new Set();
	let ignoreOffer = false;
	let isSettingRemoteAnswerPending = false;
	let makingOffer = false;

	const pc = new RTCPeerConnection({
		iceServers: [{
			urls: ['turns:turn.keijo.ee:3478'],
			username: 'immutable_bricks',
			credential: 'BEtwbSeUbApfjqj9'
		}]
	});

	pc.addEventListener('connectionstatechange', () => {
		console.log('Connection state: %s', pc.connectionState);
		if (pc.connectionState === 'failed') {
			pc.close();
		}

		if (pc.connectionState === 'disconnected') {
			unsubscribeSdp();
			unsubscribeIce();
			videoTrackSubscribers.clear();
			audioTrackSubscribers.clear();
			closeSubscribers.clear();
			setTimeout(() => window.location.reload(), 4000);
		}
	});

	pc.addEventListener('signalingstatechange', () => {
		console.log('Signaling state: %s', pc.signalingState);
	});

	pc.addEventListener('iceconnectionstatechange', () => {
		console.log('ICE connection state: %s', pc.iceConnectionState);
	});

	pc.addEventListener('track', ({ track }) => {
		console.log('Got %s track', track.kind);
		track.addEventListener('ended', () => {
			console.log('%s track has been ended', track.kind);
		});

		if (track.kind === 'video') {
			videoTrackSubscribers.forEach(({ subscriber }) => {
				subscriber(track.clone());
			});
		}

		if (track.kind === 'audio') {
			audioTrackSubscribers.forEach(({ subscriber }) => {
				subscriber(track.clone());
			});
		}

		track.stop();
	});

	pc.addEventListener('icecandidate', ({ candidate }) => {
		if (candidate) {
			const {
				component, address, port, priority, relatedAddress, relatedPort, type, protocol
			} = candidate;
			console.log('ICE candidate: (%s %s) %s %s %s:%s %s:%s', component, priority, type, protocol, address, port, relatedAddress, relatedPort);
			sendIce(candidate);
		}
	});

	pc.addEventListener('negotiationneeded', () => {
		makingOffer = true;
		pc.setLocalDescription()
			.then(() => { sendSdp(pc.localDescription); })
			.catch(e => { console.error(e); pc.close(); })
			.then(() => { makingOffer = false; });
	});

	const unsubscribeSdp = subscribeSdp(description => {
		const readyForOffer = !makingOffer && (pc.signalingState === 'stable' || isSettingRemoteAnswerPending);
		const offerCollision = description.type === 'offer' && !readyForOffer;

		ignoreOffer = offer && offerCollision;
		if (ignoreOffer) {
			return;
		}

		isSettingRemoteAnswerPending = description.type === 'answer';

		pc.setRemoteDescription(description)
			.then(() => {
				isSettingRemoteAnswerPending = false;
				if (description.type === 'offer') {
					pc.setLocalDescription()
						.then(() => {
							sendSdp(pc.localDescription);
						});
				}
			});
	});

	const unsubscribeIce = subscribeIce(ice => {
		if (ignoreOffer) {
			console.warn('[%s] Ignoring ICE candidate', pc.signalingState);
		} else {
			console.log('[%s] Adding ICE candidate', pc.signalingState);
			pc.addIceCandidate(ice).catch(console.error);
		}
	});

	if (offer) {
		console.log('[%s] Have remote %s', pc.signalingState, offer.type);
		pc.setRemoteDescription(offer)
			.then(() => pc.setLocalDescription())
			.then(() => {
				sendSdp(pc.localDescription);
			});
	}

	return {
		addVideoTransceiver(track, options) {
			console.log('Adding video track');

			return pc.addTransceiver(track || 'video', options);
		},

		addAudioTransceiver(track, options) {
			console.log('Adding audio track');

			return pc.addTransceiver(track || 'audio', options);
		},

		subscribeVideoTrack(subscriber) {
			const subscriberObject = { subscriber };
			videoTrackSubscribers.add(subscriberObject);

			return () => {
				videoTrackSubscribers.delete(subscriberObject);
			};
		},

		subscribeAudioTrack(subscriber) {
			const subscriberObject = { subscriber };
			audioTrackSubscribers.add(subscriberObject);

			return () => {
				audioTrackSubscribers.delete(subscriberObject);
			};
		},

		subscribeClose(subscriber) {
			const subscriberObject = { subscriber };
			closeSubscribers.add(subscriberObject);

			return () => {
				closeSubscribers.delete(subscriberObject);
			};
		},

		createDataChannel(label, options) {
			console.log('Creating data channel: %s', label);
			const channel = pc.createDataChannel(label, options);
			channel.addEventListener('open', () => {
				console.log('Data channel %s is open', channel.label);
			});
			channel.addEventListener('closing', () => {
				console.log('Data channel %s is closing', channel.label);
			});
			channel.addEventListener('close', () => {
				console.log('Data channel %s is closed', channel.label);
			});

			return channel;
		}
	};
}

// eslint-disable-next-line max-len
export const createPeerConnection = offer => sendSdp => sendIce => subscribeSdp => subscribeIce => () => createPeerConnectionImpl(
	offer.value0,
	sdp => sendSdp(sdp)(),
	ice => sendIce(ice)(),
	subscriber => subscribeSdp(sdp => () => subscriber(sdp))(),
	subscriber => subscribeIce(ice => () => subscriber(ice))()
);

// eslint-disable-next-line max-len
export const addVideoTransceiver = pc => track => ({ direction }) => () => pc.addVideoTransceiver(track.value0, { direction: direction.toLowerCase() });
// eslint-disable-next-line max-len
export const addAudioTransceiver = pc => track => ({ direction }) => () => pc.addAudioTransceiver(track.value0, { direction: direction.toLowerCase() });
// eslint-disable-next-line max-len
export const subscribeVideoTrack = pc => subscriber => () => pc.subscribeVideoTrack(track => subscriber(track)());
// eslint-disable-next-line max-len
export const subscribeAudioTrack = pc => subscriber => () => pc.subscribeAudioTrack(track => subscriber(track)());
export const subscribeClose = pc => subscriber => () => pc.subscribeClose(() => subscriber()());
export const createDataChannel = pc => label => ({
	ordered, maxPacketLifeTime, maxRetransmits, protocol, negotiated, id
}) => () => pc.createDataChannel(label, {
	ordered,
	maxPacketLifeTime: maxPacketLifeTime.value0,
	maxRetransmits: maxRetransmits.value0,
	protocol,
	negotiated,
	id: id.value0
});

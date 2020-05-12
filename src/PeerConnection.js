function createPeerConnection(offer, sendSdp, sendIce, subscribeSdp, subscribeIce) {
	// This function looks disasterous because Chromiums's implementation of WebRTC is disaster
	// More information: https://bugs.chromium.org/p/chromium/issues/detail?id=980872 and issues it's being blocked on

	const videoTrackSubscribers = new Set();
	const audioTrackSubscribers = new Set();
	const closeSubscribers = new Set();
	let offerIndex = offer ? 1 : 0; // debug only
	let negotiating = false;
	let ignoring = null; // latest incoming offer being ignored
	let needsNegotiation = null;
	let answerSet = false;

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

		if (pc.connectionState === 'closed') {
			unsubscribeSdp();
			unsubscribeIce();
			videoTrackSubscribers.clear();
			audioTrackSubscribers.clear();
			closeSubscribers.clear();
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
		const sdpId = offerIndex;
		offerIndex += 2;
		if (needsNegotiation !== null) {
			console.warn('[%s] [%s] Cancelling', sdpId, pc.signalingState);
		} else if (negotiating) {
			console.warn('[%s] [%s] Deferring', sdpId, pc.signalingState);
			needsNegotiation = sdpId;
		} else {
			negotiate(sdpId);
		}
	});

	function negotiate(sdpId) {
		negotiating = true;
		answerSet = false;
		console.log('[%s] [%s] Setting local description', sdpId, pc.signalingState);
		pc.setLocalDescription()
			.then(() => {
				const offer = pc.localDescription;
				console.assert(offer.type === 'offer', 'Unexpected offer type %s', offer.type);
				console.assert(pc.signalingState === 'have-local-offer', 'Unexpected signaling state %s', pc.signalingState);
				console.log('[%s] [%s] Local %s has been set', sdpId, pc.signalingState, offer.type);
				offer.sdpId = sdpId;
				sendSdp(offer);
			})
			.catch(e => {
				console.error(e);
				pc.close();
			});
	}

	function handleRemoteOffer(offer, sdpId) {
		console.assert(offer.type === 'offer', 'Unexpected offer type %s', offer.type);
		if (offer && negotiating) {
			ignoring = sdpId;
			console.warn('[%s] [%s] Ignoring remote %s', sdpId, pc.signalingState, offer.type);
		} else {
			ignoring = null;
			console.log('[%s] [%s] Setting remote %s', sdpId, pc.signalingState, offer.type);
			const needsRollback = negotiating && !answerSet;
			negotiating = true;
			answerSet = false;
			const promise = needsRollback
				? Promise.all([pc.setLocalDescription({ type: 'rollback' }), pc.setRemoteDescription(offer)])
				: pc.setRemoteDescription(offer);
			promise
				.then(() => {
					console.log('[%s] [%s] Remote %s has been set', sdpId, pc.signalingState, offer.type);
					answerSet = true;
					return pc.setLocalDescription();
				})
				.then(() => {
					const answer = pc.localDescription;
					console.assert(pc.signalingState === 'stable');
					console.assert(answer.type === 'answer');
					console.log('[%s] [%s] Local %s has been set', sdpId, pc.signalingState, answer.type);
					answer.sdpId = sdpId;
					if (needsNegotiation !== null) {
						negotiate(needsNegotiation);
						needsNegotiation = null;
					} else {
						negotiating = false;
					}
				})
				.catch(e => {
					console.error(e);
					pc.close();
				});
		}
	}

	function handleRemoteAnswer(answer, sdpId) {
		console.assert(answer.type === 'answer', 'Unexpected answer type %s', answer.type);
		console.assert(pc.signalingState === 'have-local-offer', 'Unexpected signaling state %s', pc.signalingState);
		console.assert(negotiating);
		ignoring = null;
		console.log('[%s] [%s] Setting remote %s', sdpId, pc.signalingState, answer.type);
		answerSet = true;
		pc.setRemoteDescription(answer)
			.then(() => {
				console.log('[%s] [%s] Remote %s has been set', sdpId, pc.signalingState, answer.type);
				if (pc.signalingState === 'stable') {
					if (needsNegotiation !== null) {
						negotiate(needsNegotiation);
						needsNegotiation = null;
					} else {
						negotiating = false;
					}
				} else {
					console.warn('Signaling state is %s after setting remote answer', pc.signalingState);
					pc.addEventListener('signalingstatechange', function onsignalingstatechange() {
						pc.removeEventListener('signalingstatechange', onsignalingstatechange);
						if (pc.signalingState === 'stable') {
							if (needsNegotiation !== null) {
								negotiate(needsNegotiation);
								needsNegotiation = null;
							} else {
								negotiating = false;
							}
						} else {
							console.error(`Unexpected state ${pc.signalingState}`);
							pc.close();
						}
					});
				}
			})
			.catch(e => {
				console.error(e);
				pc.close();
			});
	}

	const unsubscribeSdp = subscribeSdp(sdp => {
		switch (sdp.type) {
		case 'offer': handleRemoteOffer(sdp, sdp.sdpId); break;
		case 'answer': handleRemoteAnswer(sdp, sdp.sdpId); break;
		default: console.error('Unexpected remote SDP type %s', sdp.type);
		}
	})();

	const unsubscribeIce = subscribeIce(ice => {
		if (ignoring !== null) {
			console.warn('[%s] Ignoring ICE candidate', ignoring);
		} else {
			console.log('[%s] Adding ICE candidate', pc.signalingState);
			pc.addIceCandidate(ice).catch(console.error);
		}
	})();

	if (offer) {
		console.log('[%s] [%s] Have remote %s', 0, pc.signalingState, offer.type);
		handleRemoteOffer(offer, 0);
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
exports.createPeerConnection = offer => sendSdp => sendIce => subscribeSdp => subscribeIce => {
	return createPeerConnection(
		offer.value0,
		sdp => sendSdp(sdp)(),
		ice => sendIce(ice)(),
		subscriber => subscribeSdp(sdp => () => subscriber(sdp))(),
		subscriber => subscribeIce(ice => () => subscriber(ice))()
	);
};

// eslint-disable-next-line max-len
exports.addVideoTransceiver = pc => track => ({ direction }) => () => pc.addVideoTransceiver(track.value0, { direction: direction.toLowerCase() });
// eslint-disable-next-line max-len
exports.addAudioTransceiver = pc => track => ({ direction }) => () => pc.addAudioTransceiver(track.value0, { direction: direction.toLowerCase() });
// eslint-disable-next-line max-len
exports.subscribeVideoTrack = pc => subscriber => () => pc.subscribeVideoTrack(track => subscriber(track)());
// eslint-disable-next-line max-len
exports.subscribeAudioTrack = pc => subscriber => () => pc.subscribeAudioTrack(track => subscriber(track)());
exports.subscribeClose = pc => subscriber => () => pc.subscribeClose(() => subscriber()())
exports.createDataChannel = pc => label => ({
	ordered, maxPacketLifeTime, maxRetransmits, protocol, negotiated, id
}) => () => pc.createDataChannel(label, {
	ordered,
	maxPacketLifeTime: maxPacketLifeTime.value0,
	maxRetransmits: maxRetransmits.value0,
	protocol,
	negotiated,
	id: id.value0
});

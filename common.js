// eslint-disable-next-line no-unused-vars
function initPlayback() {
	const tankVideo = document.getElementById('tankVideo');

	const stream = new MediaStream();
	tankVideo.srcObject = stream;

	return {
		setPlaybackVideo(track) {
			console.assert(!track || track.kind === 'video');

			stream.getVideoTracks().forEach(track => {
				stream.removeTrack(track);
			});

			if (track) {
				stream.addTrack(track);
			}
		},

		setPlaybackAudio(track) {
			console.assert(!track || track.kind === 'audio');

			stream.getAudioTracks().forEach(track => {
				stream.removeTrack(track);
			});

			if (track) {
				stream.addTrack(track);
			}
		}
	};
}

// eslint-disable-next-line no-unused-vars
function initVideoCapture() {
	const subscribers = new Set();
	let setFlashLightTimeout = false;
	let pendingFlashLight = false;
	let pendingFacingMode = 'environment';
	let track;

	function setFlashLight() {
		track.applyConstraints({
			advanced: [{ torch: pendingFlashLight }]
		}).catch(e => {
			if (e.message !== 'Unsupported constraint(s)') {
				throw e;
			}
		});
	}

	function start(facingMode) {
		if (track) {
			track.stop();
		}

		track = null;

		if (setFlashLightTimeout !== null) {
			clearTimeout(setFlashLightTimeout);
			setFlashLightTimeout = null;
		}

		navigator.mediaDevices.getUserMedia({ video: { facingMode } })
			.then(async stream => {
				const streamTracks = stream.getVideoTracks();

				if (facingMode !== pendingFacingMode) {
					streamTracks.forEach(track => {
						track.stop();
					});

					start(pendingFacingMode);
					return;
				}

				if (streamTracks.length !== 1 || streamTracks[0].kind !== 'video') {
					throw new Error('Unexpected track(s)');
				}

				[track] = streamTracks;
				setFlashLightTimeout = setTimeout(() => {
					setFlashLight();
					setFlashLightTimeout = null;
				}, 500);

				subscribers.forEach(({ subscriber }) => {
					subscriber(track);
				});
			});
	}

	return {
		setFlashLight(flashLight) {
			pendingFlashLight = flashLight;
			if (track !== null && track !== undefined && setFlashLightTimeout === null) {
				setFlashLight();
			}
		},

		setFacingMode(facingMode) {
			pendingFacingMode = facingMode;
			if (track !== null && track !== undefined) {
				start(facingMode);
			}
		},

		subscribeVideo(subscriber) {
			const subscriberObject = { subscriber };
			subscribers.add(subscriberObject);

			if (track) {
				Promise.resolve().then(() => {
					if (track && subscribers.has(subscriberObject)) {
						subscriber(track);
					}
				});
			} else if (track === undefined) {
				start(pendingFacingMode);
			}

			return () => {
				subscribers.delete(subscriberObject);
			};
		}
	};
}

// eslint-disable-next-line no-unused-vars
function initAudioCapture() {
	const subscribers = new Set();

	return subscriber => {
		const subscriberObject = { subscriber };
		subscribers.add(subscriberObject);

		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				if (subscribers.has(subscriberObject)) {
					const tracks = stream.getTracks();
					if (tracks.length !== 1 || tracks[0].kind !== 'audio') {
						throw new Error('Unexpected track(s)');
					}

					subscriber(tracks[0]);
				}
			});

		return () => {
			subscribers.delete(subscriberObject);
		};
	};
}

// eslint-disable-next-line no-unused-vars
function initAdvertiser(
	peer, subscribeServerReset, subscribeServerMessage, sendServerMessage
) {
	console.assert(typeof peer === 'string', 'Peer name is not a string');
	const knownPeers = new Set();
	const knownTransactions = new Set();
	const subscribers = new Set();
	let transaction = null;

	knownPeers.add(peer);

	subscribeServerReset(() => {
		transaction = Math.random().toString(36).substr(2, 9);
		knownTransactions.add(transaction);
		console.log('Advertising', peer, transaction);
		sendServerMessage({ peer, transaction });
	});

	subscribeServerMessage(message => {
		if (!('peer' in message) || (knownTransactions.has(message.transaction) && message.transaction !== transaction)) {
			return;
		}

		knownTransactions.add(message.transaction);

		if (message.transaction !== transaction) {
			console.log('Advertising (response)', peer, message.transaction);
			sendServerMessage({ peer, transaction: message.transaction });
		}

		if (!knownPeers.has(message.peer)) {
			console.log('Got peer', message.peer);
			knownPeers.add(message.peer);
			subscribers.forEach(({ subscriber }) => {
				try {
					subscriber(message.peer);
				} catch (e) {
					console.error(e);
				}
			});
		}
	});

	return subscriber => {
		const subscriberObject = { subscriber };
		subscribers.add(subscriberObject);
		return () => {
			subscribers.delete(subscriberObject);
		};
	};
}

// eslint-disable-next-line no-unused-vars
function initServerConnection() {
	const resetSubscribers = new Set();
	const messageSubscribers = new Set();
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
			resetSubscribers.forEach(({ subscriber }) => {
				try {
					subscriber();
				} catch (e) {
					console.error(e);
				}
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

			messageSubscribers.forEach(({ subscriber }) => {
				try {
					subscriber(message);
				} catch (e) {
					console.error(e);
				}
			});
		};
	}

	create();

	return {
		subscribeServerReset(subscriber) {
			const subscriberObject = { subscriber };
			resetSubscribers.add(subscriberObject);
			return () => {
				resetSubscribers.delete(subscriberObject);
			};
		},

		subscribeServerMessage(subscriber) {
			const subscriberObject = { subscriber };
			messageSubscribers.add(subscriberObject);
			return () => {
				messageSubscribers.delete(subscriberObject);
			};
		},

		sendServerMessage(data) {
			if (!client) {
				console.warn('Server connection is not active');
				return;
			}
			client.send(JSON.stringify(data));
		}
	};
}

function createPeerConnection(offer, sendServerMessage, subscribeServerMessage) {
	// This function looks disasterous because Chromiums's implementation of WebRTC is disaster
	// More information: https://bugs.chromium.org/p/chromium/issues/detail?id=980872 and issues it's blocked on

	const trackSubscribers = new Set();
	const dataChannelSubscribers = new Set();
	const polite = !offer;
	let offerIndex = offer ? 1 : 0; // debug only
	let connectionId = null;
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
		} else if (pc.connectionState === 'closed') {
			unsubscribe();
		}
	});

	pc.addEventListener('signalingstatechange', () => {
		console.log('Signaling state: %s', pc.signalingState);
	});

	pc.addEventListener('iceconnectionstatechange', () => {
		console.log('ICE connection state: %s', pc.iceConnectionState);
	});

	pc.addEventListener('icecandidate', ({ candidate }) => {
		if (candidate) {
			const {
				component, address, port, priority, relatedAddress, relatedPort, type, protocol
			} = candidate;
			console.log('ICE candidate: (%s %s) %s %s %s:%s %s:%s', component, priority, type, protocol, address, port, relatedAddress, relatedPort);
			sendServerMessage({ connectionId, ice: candidate });
		}
	});

	pc.addEventListener('track', ({ track }) => {
		console.log('Got %s track', track.kind);
		track.addEventListener('ended', () => {
			console.log('%s track has been ended', track.kind);
		});
		trackSubscribers.forEach(({ subscriber }) => {
			subscriber(track.clone());
		});
	});

	pc.addEventListener('datachannel', ({ channel }) => {
		console.log('Got data channel: %s', channel.label);

		channel.addEventListener('open', () => {
			console.log('Remote data channel %s is open', channel.label);
		});

		channel.addEventListener('close', () => {
			console.log('Remote data channel %s is closed', channel.label);
		});

		channel.addEventListener('closing', () => {
			console.log('Remote data channel %s is closing', channel.label);
		});

		dataChannelSubscribers.forEach(({ subscriber }) => {
			subscriber(channel);
		});
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

	async function negotiate(sdpId) {
		negotiating = true;
		answerSet = false;
		console.log('[%s] [%s] Setting local description', sdpId, pc.signalingState);
		try {
			await pc.setLocalDescription();
			const offer = pc.localDescription;
			console.assert(offer.type === 'offer', 'Unexpected offer type %s', offer.type);
			console.assert(pc.signalingState === 'have-local-offer', 'Unexpected signaling state %s', pc.signalingState);
			console.log('[%s] [%s] Local %s has been set', sdpId, pc.signalingState, offer.type);
			sendServerMessage({ connectionId, sdpId, sdp: offer });
			if (!connectionId) {
				connectionId = offer.sdp;
			}
		} catch (e) {
			console.error(e);
			pc.close();
		}
	}

	async function handleRemoteOffer(offer, sdpId) {
		console.assert(offer.type === 'offer', 'Unexpected offer type %s', offer.type);
		if (!polite && negotiating) {
			ignoring = sdpId;
			console.warn('[%s] [%s] Ignoring remote %s', sdpId, pc.signalingState, offer.type);
		} else {
			ignoring = null;
			console.log('[%s] [%s] Setting remote %s', sdpId, pc.signalingState, offer.type);
			const needsRollback = negotiating && !answerSet;
			negotiating = true;
			answerSet = false;
			try {
				if (needsRollback) {
					await Promise.all([pc.setLocalDescription({ type: 'rollback' }), pc.setRemoteDescription(offer)]);
				} else {
					await pc.setRemoteDescription(offer);
				}
				console.log('[%s] [%s] Remote %s has been set', sdpId, pc.signalingState, offer.type);
				answerSet = true;
				await pc.setLocalDescription();
				const answer = pc.localDescription;
				console.assert(pc.signalingState === 'stable');
				console.assert(answer.type === 'answer');
				console.log('[%s] [%s] Local %s has been set', sdpId, pc.signalingState, answer.type);
				sendServerMessage({ connectionId, sdpId, sdp: answer });
				if (needsNegotiation !== null) {
					negotiate(needsNegotiation);
					needsNegotiation = null;
				} else {
					negotiating = false;
				}
			} catch (e) {
				console.error(e);
				pc.close();
			}
		}
	}

	async function handleRemoteAnswer(answer, sdpId) {
		console.assert(answer.type === 'answer', 'Unexpected answer type %s', answer.type);
		console.assert(pc.signalingState === 'have-local-offer', 'Unexpected signaling state %s', pc.signalingState);
		console.assert(negotiating);
		ignoring = null;
		console.log('[%s] [%s] Setting remote %s', sdpId, pc.signalingState, answer.type);
		try {
			answerSet = true;
			await pc.setRemoteDescription(answer);
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
		} catch (e) {
			console.error(e);
			pc.close();
		}
	}

	function onmessage({
		ice, sdpId, sdp, connectionId: cid
	}) {
		if (cid !== connectionId) {
			return;
		}

		if (sdp) {
			switch (sdp.type) {
			case 'offer': handleRemoteOffer(sdp, sdpId); break;
			case 'answer': handleRemoteAnswer(sdp, sdpId); break;
			default: console.error('Unexpected remote SDP type %s', sdp.type);
			}
		}

		if (ice) {
			if (ignoring !== null) {
				console.warn('[%s] Ignoring ICE candidate', ignoring);
			} else {
				console.log('[%s] Adding ICE candidate', pc.signalingState);
				pc.addIceCandidate(ice).catch(console.error);
			}
		}
	}

	window.pc = pc;

	const unsubscribe = subscribeServerMessage(onmessage);

	if (offer) {
		console.log('[%s] [%s] Have remote %s', 0, pc.signalingState, offer.type);
		connectionId = offer.sdp;
		handleRemoteOffer(offer, 0);
	}

	return {
		addTransceiver(track, options) {
			console.log('Adding %s track', typeof track === 'string' ? track : track.kind);
			return pc.addTransceiver(track, options);
		},

		createDataChannel(label, ...args) {
			console.log('Creating data channel: %s', label);
			const channel = pc.createDataChannel(label, ...args);
			channel.addEventListener('open', () => {
				console.log('Local data channel %s is open', channel.label);
			});

			channel.addEventListener('close', () => {
				console.log('Local data channel %s is closed', channel.label);
			});

			channel.addEventListener('closing', () => {
				console.log('Local data channel %s is closing', channel.label);
			});
			return channel;
		},

		subscribeTrack(subscriber) {
			const subscriberObject = { subscriber };
			trackSubscribers.add(subscriberObject);
			return () => {
				trackSubscribers.delete(subscriberObject);
			};
		},

		subscribeDataChannel(subscriber) {
			const subscriberObject = { subscriber };
			dataChannelSubscribers.add(subscriberObject);
			return () => {
				dataChannelSubscribers.delete(subscriberObject);
			};
		}
	};
}

// eslint-disable-next-line no-unused-vars
function initPeerConnection(
	offer,
	setPlaybackVideo,
	setPlaybackAudio,
	sendServerMessage,
	subscribeServerMessage,
	subscribeVideo,
	subscribeAudio
) {
	const requestSubscribers = new Set();
	const messageSubscribers = new Set();
	let pendingSendVideo = false;
	let pendingSendAudio = false;

	const {
		addTransceiver,
		subscribeTrack,
		createDataChannel
	} = createPeerConnection(offer, sendServerMessage, subscribeServerMessage);

	const audioTransceiver = addTransceiver('audio', { direction: 'sendrecv' });
	const videoTransceiver = addTransceiver('video', { direction: 'sendrecv' });

	subscribeTrack(track => {
		if (track.kind === 'video') {
			setPlaybackVideo(track);
		}

		if (track.kind === 'audio') {
			setPlaybackAudio(track);
		}
	});

	const controlChannel = createDataChannel('control', { id: 0, negotiated: true });

	controlChannel.onmessage = ({ data }) => {
		const message = JSON.parse(data);
		if ('request' in message) {
			let sent = false;
			requestSubscribers.forEach(({ subscriber }) => {
				subscriber(message.data, data => {
					if (!sent) {
						sent = true;
						controlChannel.send(JSON.stringify({ response: message.request, data }));
					}
				});
			});
			return;
		}

		if (!('response' in message)) {
			messageSubscribers.forEach(({ subscriber }) => {
				subscriber(message.data);
			});
		}
	};

	return {
		setSendVideo(sendVideo) {
			pendingSendVideo = sendVideo;
			if (videoTransceiver.sender.track) {
				videoTransceiver.sender.track.stop();
			}
			videoTransceiver.sender.replaceTrack(null);
			if (sendVideo) {
				subscribeVideo(track => {
					if (pendingSendVideo) {
						videoTransceiver.sender.replaceTrack(track);
					} else {
						track.stop();
					}
				});
			}
		},
		setSendAudio(sendAudio) {
			pendingSendAudio = sendAudio;
			if (audioTransceiver.sender.track) {
				audioTransceiver.sender.track.stop();
			}
			audioTransceiver.sender.replaceTrack(null);
			if (sendAudio) {
				subscribeAudio(track => {
					if (pendingSendAudio) {
						audioTransceiver.sender.replaceTrack(track);
					} else {
						track.stop();
					}
				});
			}
		},
		sendMessage(data) {
			if (controlChannel.readyState !== 'open') {
				console.warn('Control channel is not open');
			} else {
				controlChannel.send(JSON.stringify({ data }));
			}
		},
		subscribeMessage(subscriber) {
			const subscriberObject = { subscriber };
			messageSubscribers.add(subscriberObject);
			return () => {
				messageSubscribers.delete(subscriberObject);
			};
		},
		sendRequest(data) {
			if (controlChannel.readyState !== 'open') {
				return Promise.reject(new Error('Control channel is not open'));
			}
			const transaction = Math.random().toString(36).substr(2, 9);
			controlChannel.send(JSON.stringify({ request: transaction, data }));
			return new Promise(resolve => {
				controlChannel.addEventListener('message', function onmessage({ data }) {
					const message = JSON.parse(data);
					if (message.response === transaction) {
						controlChannel.removeEventListener('message', onmessage);
						resolve(message.data);
					}
				});
			});
		},
		subscribeRequest(subscriber) {
			const subscriberObject = { subscriber };
			requestSubscribers.add(subscriberObject);
			return () => {
				requestSubscribers.delete(subscriberObject);
			};
		}
	};
}

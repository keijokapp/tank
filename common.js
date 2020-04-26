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
	const tracks = new Set();
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
			tracks.forEach(track => {
				track.stop();
				track.dispatchEvent(new Event('ended'));
			});
		}

		track = null;

		navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: true })
			.then(stream => {
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

				setFlashLight();

				subscribers.forEach(({ subscriber }) => {
					subscriber(cloneTrack(track));
				});
			});
	}

	function cloneTrack(track) {
		const clonedTrack = track.clone();
		clonedTrack.addEventListener('ended', () => { tracks.delete(clonedTrack); });
		tracks.add(clonedTrack);
		return clonedTrack;
	}

	return {
		setFlashLight(flashLight) {
			pendingFlashLight = flashLight;
			if (track !== null && track !== undefined) {
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
						subscriber(cloneTrack(track));
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
	let offerIndex = offer ? 1 : 0; // debug only

	const trackSubscribers = new Set();
	const dataChannelSubscribers = new Set();

	const pc = new RTCPeerConnection({
		iceServers: [{
			urls: ['turns:turn.keijo.ee:3478'],
			username: 'immutable_bricks',
			credential: 'BEtwbSeUbApfjqj9'
		}]
	});

	const polite = !offer;
	let connectionId = null;
	let negotiating = false;
	let ignoring = null; // latest incoming offer being ignored

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
		negotiating = true;
		console.log('[%s] [%s] Setting local description', sdpId, pc.signalingState);
		pc.setLocalDescription()
			.then(() => {
				const offer = pc.localDescription;
				console.assert(offer.type === 'offer', 'Unexpected offer type %s', offer.type);
				console.assert(pc.signalingState === 'have-local-offer', 'Unexpected signaling state %s', pc.signalingState);
				console.log('[%s] [%s] Local %s has been set', sdpId, pc.signalingState, offer.type);
				sendServerMessage({ connectionId, sdpId, sdp: offer });
				if (!connectionId) {
					connectionId = offer.sdp;
				}
				if (polite) {
					negotiating = false;
				}
			}, e => {
				console.error(e);
				pc.close();
			});
	});

	function handleRemoteOffer(offer, sdpId) {
		console.assert(offer.type === 'offer', 'Unexpected offer type %s', offer.type);
		if (!polite && negotiating) {
			ignoring = sdpId;
			console.warn('[%s] [%s] Ignoring remote %s', sdpId, pc.signalingState, offer.type);
		} else {
			ignoring = null;
			console.log('[%s] [%s] Setting remote %s', sdpId, pc.signalingState, offer.type);
			const rollbackPromise = negotiating ? pc.setLocalDescription({ type: 'rollback' }) : Promise.resolve();
			negotiating = true;
			Promise.all([rollbackPromise, pc.setRemoteDescription(offer)])
				.then(() => {
					console.log('[%s] [%s] Remote %s has been set', sdpId, pc.signalingState, offer.type);
					return pc.setLocalDescription();
				})
				.then(() => {
					const answer = pc.localDescription;
					console.assert(answer.type === 'answer');
					console.assert(pc.signalingState === 'stable');
					console.log('[%s] [%s] Local %s has been set', sdpId, pc.signalingState, answer.type);
					sendServerMessage({ connectionId, sdpId, sdp: answer });
					negotiating = false;
				}, e => {
					console.error(e);
					pc.close();
				});
		}
	}

	function handleRemoteAnswer(answer, sdpId) {
		console.assert(!polite || !negotiating);
		console.assert(pc.signalingState === 'have-local-offer', 'Unexpected signaling state %s', pc.signalingState);
		console.assert(answer.type === 'answer', 'Unexpected answer type %s', answer.type);
		ignoring = null;
		negotiating = false;
		console.log('[%s] [%s] Setting remote %s', sdpId, pc.signalingState, answer.type);
		pc.setRemoteDescription(answer)
			.then(() => {
				console.assert(answer.type === 'answer');
				console.assert(pc.signalingState === 'stable');
				console.log('[%s] [%s] Remote %s has been set', sdpId, pc.signalingState, answer.type);
			}, e => {
				console.error(e);
				pc.close();
			});
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

	const unsubscribe = subscribeServerMessage(onmessage);

	if (offer) {
		console.log('[%s] [%s] Have remote %s', 0, pc.signalingState, offer.type);
		connectionId = offer.sdp;
		handleRemoteOffer(offer, 0);
	}

	return {
		addTransceiver(track, options) {
			console.log('Adding %s track', track.kind);
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
	setPLaybackVideo,
	setPLaybackAudio,
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

	const audioTransceiver = addTransceiver('audio', { direction: 'sendonly' });
	const videoTransceiver = addTransceiver('video', { direction: 'sendonly' });

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
				subscribeAudio(track => {
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

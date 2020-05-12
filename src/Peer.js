function createPeer(
	{
		createDataChannel,
		addVideoTransceiver,
		addAudioTransceiver,
		subscribeVideoTrack,
		subscribeAudioTrack,
		subscribeClose
	},
	setPlaybackVideo,
	setPlaybackAudio,
	subscribeVideo,
	subscribeAudio
) {
	const requestSubscribers = new Set();
	const messageSubscribers = new Set();
	let pendingSendVideo = false;
	let pendingSendAudio = false;

	const audioTransceiver = addAudioTransceiver(null, { direction: 'sendonly' });
	const videoTransceiver = addVideoTransceiver(null, { direction: 'sendonly' });

	subscribeVideoTrack(setPlaybackVideo);
	subscribeAudioTrack(setPlaybackAudio);
	subscribeClose(() => {
		requestSubscribers.clear();
		messageSubscribers.clear();
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
		} else if (!('response' in message)) {
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
			if (controlChannel.readyState === 'open') {
				controlChannel.send(JSON.stringify({ data }));
			} else {
				console.warn('Control channel is not open');
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

// eslint-disable-next-line max-len
exports.createPeer = pc => setPlaybackVideo => setPlaybackAudio => subscribeVideo => subscribeAudio => () => {
	return createPeer(
		pc,
		track => { setPlaybackVideo(track)(); },
		track => { setPlaybackAudio(track)(); },
		subscriber => subscribeVideo(track => () => subscriber(track))(),
		subscriber => subscribeAudio(track => () => subscriber(track))()
	);
};

exports.setSendVideo = peer => sendVideo => () => peer.setSendVideo(sendVideo);
exports.setSendAudio = peer => sendAudio => () => peer.setSendAudio(sendAudio);
exports.sendMessage = peer => data => () => peer.sendMessage(data);
exports.subscribeMessage = peer => subscriber => peer.subscribeMessage(data => subscriber(data)());
exports.sendRequest = peer => data => () => peer.sendRequest(data);
exports.subscribeRequest = peer => subscriber => peer.subscribeRequest(
	(data, respond) => subscriber(data)(data => () => respond(data))()
);

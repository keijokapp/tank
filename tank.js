/*
global initPlayback,
       initAdvertiser,
       initServerConnection,
       createPeerConnection,
       initVideoCapture,
       initAudioCapture,
*/

function initPeerConnection(
	offer, sendServerMessage, subscribeServerMessage, subscribeVideo, subscribeAudio
) {
	const requestSubscribers = new Set();
	const messageSubscribers = new Set();
	let videoTransceiver = null;
	let audioTransceiver = null;
	let controlChannel = null;

	const {
		addTransceiver,
		subscribeTrack,
		subscribeDataChannel
	} = createPeerConnection(offer, sendServerMessage, subscribeServerMessage);

	subscribeAudio(track => {
		if (audioTransceiver) {
			audioTransceiver.sender.replaceTrack(track);
		} else {
			audioTransceiver = addTransceiver(track, { direction: 'sendonly' });
		}
	});

	subscribeVideo(track => {
		if (videoTransceiver) {
			videoTransceiver.sender.replaceTrack(track);
		} else {
			videoTransceiver = addTransceiver(track, { direction: 'sendonly' });
		}
	});

	subscribeTrack(track => {
		if (track.kind === 'audio') {
			setPlaybackAudio(track);
		}
	});

	subscribeDataChannel(channel => {
		if (channel.label !== 'control') {
			// channel.close();
			return;
		}

		if (controlChannel) {
			controlChannel.close();
		}

		channel.onmessage = ({ data }) => {
			const message = JSON.parse(data);

			if ('request' in message) {
				let sent = false;
				requestSubscribers.forEach(({ subscriber }) => {
					subscriber(message.data, data => {
						if (!sent) {
							sent = true;
							channel.send(JSON.stringify({
								response: message.request,
								data
							}));
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

		controlChannel = channel;
	});

	return {
		sendRequest(data) {
			if (!controlChannel) {
				return Promise.reject(new Error('Control channel is not available'));
			}

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
		},

		subscribeMessage(subscriber) {
			const subscriberObject = { subscriber };
			messageSubscribers.add(subscriberObject);
			return () => {
				messageSubscribers.delete(subscriberObject);
			};
		}
	};
}

function initConnectionListener(
	sendServerMessage, subscribeServerMessage, subscribeVideo, subscribeAudio
) {
	const requestSubscribers = new Set();
	const messageSubscribers = new Set();
	const requestSenders = new Set();

	subscribeServerMessage(({ connectionId, sdp }) => {
		if (!connectionId && sdp && sdp.type === 'offer') {
			const { sendRequest, subscribeRequest, subscribeMessage } = initPeerConnection(
				sdp, sendServerMessage, subscribeServerMessage, subscribeVideo, subscribeAudio
			);

			requestSenders.add(sendRequest);

			subscribeRequest((request, respond) => {
				requestSubscribers.forEach(({ subscriber }) => {
					subscriber(request, respond);
				});
			});

			subscribeMessage(message => {
				messageSubscribers.forEach(({ subscriber }) => {
					subscriber(message);
				});
			});
		}
	});

	return {
		sendRequest(data) {
			return Promise.all([...requestSenders].map(sendRequest => {
				return sendRequest(data).catch(e => {
					console.error('Failed to send request', e);
				});
			}));
		},

		subscribeRequest(subscriber) {
			const subscriberObject = { subscriber };
			requestSubscribers.add(subscriberObject);
			return () => {
				requestSubscribers.delete(subscriberObject);
			};
		},

		subscribeMessage(subscriber) {
			const subscriberObject = { subscriber };
			messageSubscribers.add(subscriberObject);
			return () => {
				messageSubscribers.delete(subscriberObject);
			};
		}
	};
}

// init

function initControls(subscribeMessage) {
	const subscribers = {};

	subscribeMessage(controls => {
		Object.entries(controls).forEach(([control, value]) => {
			if (control in subscribers) {
				subscribers[control].forEach(({ subscriber }) => {
					subscriber(value);
				});
			}
		});
	});

	return (control, subscriber) => {
		if (!(control in subscribers)) {
			subscribers[control] = new Set();
		}
		const subscriberObject = { subscriber };
		subscribers[control].add(subscriberObject);
		return () => {
			if (control in subscribers) {
				subscribers[control].delete(subscriberObject);
				if (subscribers[control].size === 0) {
					delete subscribers[control];
				}
			}
		};
	};
}

function initSwitches(sendRequest, subscribeRequest) {
	const subscribers = {};
	const changingSwitches = {};

	subscribeRequest((request, respond, setVideoSubscription) => {
		if ('switch' in request) {
			if (changingSwitches[request.switch]) {
				console.warn('Switch is changing');
				respond();
				return;
			}

			changingSwitches[request.switch] = true;

			if (request.switch in subscribers) {
				subscribers[request.switch].forEach(({ subscriber }) => {
					subscriber(request.value, setVideoSubscription);
				});
			}

			sendRequest(request).then(() => {
				delete changingSwitches[request.switch];
				respond();
			});
		}
	});

	return (sw, subscriber) => {
		if (!(sw in subscribers)) {
			subscribers[sw] = new Set();
		}
		const subscriberObject = { subscriber };
		subscribers[sw].add(subscriberObject);
		return () => {
			if (sw in subscribers) {
				subscribers[sw].delete(subscriberObject);
				if (subscribers[sw].size === 0) {
					delete subscribers[sw];
				}
			}
		};
	};
}

// controls

function initJoystick(subscribeControl) {
	const joystickPosition = document.getElementById('joystick-position');
	const r = 100;
	const c = 150;
	let timeout = null;

	joystickPosition.setAttribute('r', 5);
	joystickPosition.setAttribute('fill', 'blue');

	function reset(setTimer) {
		clearTimeout(timeout);
		if (setTimer) {
			timeout = setTimeout(() => {
				joystickPosition.setAttribute('cx', 150);
				joystickPosition.setAttribute('cy', 150);
				joystickPosition.setAttribute('r', 15);
				joystickPosition.setAttribute('fill', 'red');
			}, 500);
		}
		joystickPosition.setAttribute('r', 5);
		joystickPosition.setAttribute('fill', 'blue');
	}

	subscribeControl('joystickH', value => {
		reset(value !== 0);
		joystickPosition.setAttribute('cx', value * r + c);
	});

	subscribeControl('joystickV', value => {
		reset(value !== 0);
		joystickPosition.setAttribute('cy', c - value * r);
	});
}

function initActuator(id, subscribeControl) {
	const up = document.getElementById(`${id}-up`);
	const down = document.getElementById(`${id}-down`);
	let timeout = null;

	function reset(setTimer) {
		clearTimeout(timeout);
		if (setTimer) {
			timeout = setTimeout(() => {
				up.setAttribute('fill', 'red');
				down.setAttribute('fill', 'red');
			}, 500);
		}
	}
	subscribeControl(id, value => {
		reset(value !== 0);
		up.setAttribute('fill', value > 0 ? 'orange' : 'gray');
		down.setAttribute('fill', value < 0 ? 'orange' : 'gray');
	});
}

function initFlashlightSwitch(sendRequest, subscribeSwitch, setFlashlight) {
	const sw = document.getElementById('flashlight-switch');

	sw.onchange = async () => {
		sw.disabled = true;
		await sendRequest({
			switch: 'flashlight',
			value: sw.checked
		});
		sw.disabled = false;
		setFlashlight(sw.checked);
	};

	subscribeSwitch('flashlight', value => {
		sw.checked = !!value;
		setFlashlight(sw.checked);
	});
}

function initCameraSwitch(sendRequest, subscribeSwitch, setFacingMode) {
	const sw = document.getElementById('camera-switch');

	sw.onchange = async () => {
		sw.disabled = true;
		await sendRequest({
			switch: 'camera',
			value: sw.checked
		});
		sw.disabled = false;
		setFacingMode(sw.checked ? 'user' : 'environment');
	};

	subscribeSwitch('camera', value => {
		sw.checked = !!value;
		setFacingMode(sw.checked ? 'user' : 'environment');
	});
}

const { setPlaybackVideo, setPlaybackAudio } = initPlayback();
const {
	subscribeServerReset, subscribeServerMessage, sendServerMessage
} = initServerConnection();
initAdvertiser(
	`tank-${Math.random().toString(36).substr(2, 9)}`,
	subscribeServerReset, subscribeServerMessage, sendServerMessage
);
const { setFacingMode, setFlashLight, subscribeVideo } = initVideoCapture();
const subscribeAudio = initAudioCapture();
const { sendRequest, subscribeRequest, subscribeMessage } = initConnectionListener(
	sendServerMessage, subscribeServerMessage, subscribeVideo, subscribeAudio
);
const subscribeControl = initControls(subscribeMessage);
const subscribeSwitch = initSwitches(sendRequest, subscribeRequest);
initJoystick(subscribeControl);
initActuator('primary', subscribeControl);
initActuator('secondary', subscribeControl);
initFlashlightSwitch(sendRequest, subscribeSwitch, setFlashLight);
initCameraSwitch(sendRequest, subscribeSwitch, setFacingMode);

subscribeVideo(setPlaybackVideo);

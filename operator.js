import {
	initPlayback, initAdvertiser, initServerConnection, initPeerConnection, initAudioCapture
} from './common.js';

function initConnection(subscribePeer, sendServerMessage, subscribeServerMessage, subscribeAudio) {
	const pendingRequestSubscribers = new Set();
	const unsubscribeRequest = new WeakMap();
	let pendingSendAudio = false;
	let setSendAudio;
	let sendMessage;
	let sendRequest;
	let subscribeRequest;

	const unsubscribe = subscribePeer(peer => {
		if (!peer.startsWith('tank-')) {
			return;
		}
		unsubscribe();

		const connection = initPeerConnection(
			null,
			setPlaybackVideo,
			setPlaybackAudio,
			sendServerMessage,
			subscribeServerMessage,
			() => { console.error('Operator should not subscribe to video'); },
			subscribeAudio
		);
		setSendAudio = connection.setSendAudio;
		sendMessage = connection.sendMessage;
		sendRequest = connection.sendRequest;
		subscribeRequest = connection.subscribeRequest;
		setSendAudio(pendingSendAudio);
		pendingRequestSubscribers.forEach(subscriberObject => {
			unsubscribeRequest.set(subscriberObject, subscribeRequest(subscriberObject.subscriber));
		});
		pendingRequestSubscribers.clear();
	});

	return {
		setSendAudio(sendAudio) {
			if (setSendAudio) {
				setSendAudio(sendAudio);
			} else {
				pendingSendAudio = sendAudio;
			}
		},
		sendMessage(data) {
			if (sendMessage) {
				return sendMessage(data);
			}

			console.error('Peer is not available');
		},
		sendRequest(data) {
			if (sendRequest) {
				return sendRequest(data);
			}

			return Promise.reject(new Error('Peer is not available'));
		},
		subscribeRequest(subscriber) {
			if (subscribeRequest) {
				return subscribeRequest(subscriber);
			}

			const subscriberObject = { subscriber };
			pendingRequestSubscribers.add(subscriberObject);

			return () => {
				const unsubscribe = unsubscribeRequest.get(subscriberObject);
				if (unsubscribe) {
					unsubscribe();
					unsubscribeRequest.delete(subscriberObject);
				} else {
					pendingRequestSubscribers.delete(subscriberObject);
				}
			};
		}
	};
}

// init

function initControls(sendMessage) {
	const nextCommand = {};
	let controlsSendTimeout;
	let needsSend = false;

	function sendControls() {
		if (controlsSendTimeout) {
			clearTimeout(controlsSendTimeout);
		}

		needsSend = false;

		if (Object.keys(nextCommand).length === 0) {
			return;
		}

		sendMessage(nextCommand);
		controlsSendTimeout = setTimeout(sendControls, 400);
	}

	return control => {
		if (typeof control !== 'string') {
			throw new Error(`Invalid control ${control}`);
		}

		return value => {
			if (value === undefined) {
				delete nextCommand[control];
			} else {
				nextCommand[control] = value;

				if (!needsSend) {
					needsSend = true;
					Promise.resolve().then(sendControls);
				}
			}
		};
	};
}

function initSwitches(sendRequest, subscribeRequest) {
	return sw => {
		if (typeof sw !== 'string') {
			throw new Error(`Invalid switch ${sw}`);
		}

		const subscribers = new Set();
		let unsubscribe = null;

		return {
			async set(value) {
				if (value !== undefined) {
					await sendRequest({ switch: sw, value });
				}
			},

			subscribe(subscriber) {
				const subscriberObject = { subscriber };
				subscribers.add(subscriberObject);

				if (unsubscribe === null) {
					unsubscribe = subscribeRequest((request, respond) => {
						if ('switch' in request && request.switch === sw) {
							subscribers.forEach(({ subscriber }) => {
								subscriber(request.value);
							});
							respond();
						}
					});
				}

				return () => {
					subscribers.delete(subscriberObject);
					if (subscribers.length === 0) {
						unsubscribe();
						unsubscribe = null;
					}
				};
			}
		};
	};
}

// controls

function initJoystick(getControl) {
	const joystickPosition = document.getElementById('joystick-position');

	const r = 100;
	const c = 150;

	const setX = getControl('joystickH');
	const setY = getControl('joystickV');
	let zeroTimeout = null;

	return (x, y) => {
		if (zeroTimeout !== null) {
			clearTimeout(zeroTimeout);
			zeroTimeout = null;
		}

		if (x * x + y * y < 0.01) {
			x = 0;
			y = 0;
		}

		if (x * x + y * y > 1) {
			const angle = Math.atan2(y, x);
			x = Math.cos(angle);
			y = Math.sin(angle);
		}

		const canvasX = x * r + c;
		const canvasY = c - y * r;

		joystickPosition.setAttribute('cx', canvasX);
		joystickPosition.setAttribute('cy', canvasY);

		setX(x);
		setY(y);

		if (x === 0 && y === 0) {
			zeroTimeout = setTimeout(() => {
				setX();
				setY();
			}, 1000);
		}
	};
}

function initActuator(id, getControl) {
	const up = document.getElementById(`${id}-up`);
	const down = document.getElementById(`${id}-down`);

	const set = getControl(id);
	let zeroTimeout = null;

	return a => {
		if (zeroTimeout !== null) {
			clearTimeout(zeroTimeout);
			zeroTimeout = null;
		}
		up.setAttribute('fill', a > 0 ? 'orange' : 'gray');
		down.setAttribute('fill', a < 0 ? 'orange' : 'gray');
		set(Math.sign(a));
		if (a !== 0) {
			zeroTimeout = setTimeout(() => {
				set();
			}, 1000);
		}
	};
}

function initFlashlightSwitch(getSwitch) {
	const sw = document.getElementById('flashlight-switch');
	const { set, subscribe } = getSwitch('flashlight');

	subscribe(value => {
		sw.checked = !!value;
	});

	sw.onchange = () => {
		sw.disabled = true;
		set(sw.checked).then(() => {
			sw.disabled = false;
		});
	};
}

function initCameraSwitch(getSwitch) {
	const sw = document.getElementById('camera-switch');
	const { set, subscribe } = getSwitch('camera');

	subscribe(value => {
		sw.checked = !!value;
	});

	sw.onchange = () => {
		sw.disabled = true;
		set(sw.checked).then(() => {
			sw.disabled = false;
		});
	};
}

function initAudioSender(setSendAudio) {
	const sw = document.getElementById('send-audio');
	sw.onchange = () => {
		setSendAudio(sw.checked);
	};
}

function gamepadAccessors() {
	// Chrome on Android does not set gamepad `mapping` to "standard"
	// so we can't use that flag.
	if (navigator.userAgent.includes('Firefox')) {
		return {
			Up: gamepad => gamepad.axes[7] < 0,
			Down: gamepad => gamepad.axes[7] > 0,
			Left: gamepad => gamepad.axes[6] < 0,
			Right: gamepad => gamepad.axes[6] > 0,
			LeftAxisH: gamepad => gamepad.axes[3],
			LeftAxisV: gamepad => gamepad.axes[4]
		};
	}

	return {
		Up: gamepad => gamepad.buttons[12].pressed,
		Down: gamepad => gamepad.buttons[13].pressed,
		Left: gamepad => gamepad.buttons[14].pressed,
		Right: gamepad => gamepad.buttons[15].pressed,
		LeftAxisH: gamepad => gamepad.axes[2],
		LeftAxisV: gamepad => gamepad.axes[3]
	};
}

function initJoystickControl(up, down, left, right, gamepadAxisH, gamepadAxisV, set) {
	const joystick = document.getElementById('joystick');
	const joystickCenter = 150;
	const joystickRadius = 100;

	let setByMouse = false;

	joystick.onpointerdown = ({ clientX, clientY, pointerId }) => {
		// `offsetX`/`offsetY` do not work consistently across browsers
		const { left, top } = joystick.getBoundingClientRect();
		const offsetX = clientX - left;
		const offsetY = clientY - top;
		const x = (offsetX - joystickCenter) / joystickRadius;
		const y = (joystickCenter - offsetY) / joystickRadius;
		if (x * x + y * y <= 2.1) {
			joystick.setPointerCapture(pointerId);
			set(x, y);
			setByMouse = true;
		}
	};

	joystick.onpointerup = () => {
		if (setByMouse) {
			resetMouseInput();
		}
	};

	joystick.onpointermove = ({ clientX, clientY }) => {
		if (setByMouse) {
			const { left, top } = joystick.getBoundingClientRect();
			const offsetX = clientX - left;
			const offsetY = clientY - top;
			const x = (offsetX - joystickCenter) / joystickRadius;
			const y = (joystickCenter - offsetY) / joystickRadius;
			set(x, y);
		}
	};

	// Keyboard control

	const keyboardState = { };

	document.addEventListener('keydown', e => {
		if ([up, down, left, right].includes(e.code)) {
			e.preventDefault();
			if (!keyboardState[e.code]) {
				keyboardState[e.code] = true;
				if (!setByMouse) {
					setFromKeyboard();
				}
			}
		}
	});

	document.addEventListener('keyup', e => {
		if ([up, down, left, right].includes(e.code)) {
			e.preventDefault();
			if (keyboardState[e.code]) {
				delete keyboardState[e.code];
				if (!setByMouse) {
					setFromKeyboard();
				}
			}
		}
	});

	window.addEventListener('blur', () => {
		const changed = hasKeyboardInputs();

		Object.keys(keyboardState).forEach(key => delete keyboardState[key]);

		if (changed && !setByMouse) {
			setFromKeyboard();
		}
	});

	// Gamepad control
	let gamepadX = 0;
	let gamepadY = 0;
	let gamepadCount = 0;

	window.addEventListener('gamepadconnected', e => {
		const {
			index, id, buttons, axes
		} = e.gamepad;
		console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.', index, id, buttons.length, axes.length);

		gamepadCount++;

		const accessors = gamepadAccessors();
		let prevX;
		let prevY;

		function gamepadLoop() {
			const gamepad = window.navigator.getGamepads()[index];
			if (!gamepad || !gamepad.connected) {
				console.log('Gamepad %d disconnected', index);
				gamepadCount--;
				if (!gamepadCount) {
					// eslint-disable-next-line no-multi-assign
					gamepadX = gamepadY = 0;
				}

				return;
			}

			requestAnimationFrame(gamepadLoop);

			const x = accessors[gamepadAxisH](gamepad);
			const y = -accessors[gamepadAxisV](gamepad);

			if (prevX !== x || prevY !== y) {
				// eslint-disable-next-line no-multi-assign
				gamepadX = prevX = x;
				// eslint-disable-next-line no-multi-assign
				gamepadY = prevY = y;
				if (!setByMouse && !hasKeyboardInputs()) {
					set(x, y);
				}
			}
		}

		gamepadLoop();
	});

	// functions

	function resetMouseInput() {
		setByMouse = false;
		if (hasKeyboardInputs()) {
			setFromKeyboard();
		} else {
			set(gamepadX, gamepadY);
		}
	}

	function hasKeyboardInputs() {
		return [up, down, left, right].some(key => keyboardState[key]);
	}

	function setFromKeyboard() {
		if (hasKeyboardInputs()) {
			const up = keyboardState.ArrowUp ? 1 : 0;
			const down = keyboardState.ArrowDown ? 1 : 0;
			const left = keyboardState.ArrowLeft ? 1 : 0;
			const right = keyboardState.ArrowRight ? 1 : 0;
			const x = right - left;
			const y = up - down;
			set(x, y);
		} else {
			set(gamepadX, gamepadY);
		}
	}
}

function initActuatorControl(id, up, down, gamepadUp, gamepadDown, set) {
	const actuatorUp = document.getElementById(`${id}-up`);
	const actuatorDown = document.getElementById(`${id}-down`);

	let setByMouse = false;

	actuatorUp.onpointerdown = e => {
		e.target.setPointerCapture(e.pointerId);
		set(1);
		setByMouse = true;
	};

	actuatorDown.onpointerdown = e => {
		e.target.setPointerCapture(e.pointerId);
		set(-1);
		setByMouse = true;
	};

	// eslint-disable-next-line no-multi-assign
	actuatorUp.onpointerup = actuatorDown.onpointerup = () => {
		if (setByMouse) {
			resetMouseInput();
		}
	};

	// Keyboard control

	const keyboardState = { };

	document.addEventListener('keydown', e => {
		if ([up, down].includes(e.code)) {
			e.preventDefault();
			if (!keyboardState[e.code]) {
				keyboardState[e.code] = true;
				if (!setByMouse) {
					setFromKeyboard();
				}
			}
		}
	});

	document.addEventListener('keyup', e => {
		if ([up, down].includes(e.code)) {
			e.preventDefault();
			if (keyboardState[e.code]) {
				delete keyboardState[e.code];
				if (!setByMouse) {
					setFromKeyboard();
				}
			}
		}
	});

	window.addEventListener('blur', () => {
		const changed = hasKeyboardInputs();

		Object.keys(keyboardState).forEach(key => delete keyboardState[key]);

		if (changed && !setByMouse) {
			setFromKeyboard();
		}
	});

	// Gamepad control
	let gamepadDirection = 0;
	let gamepadCount = 0;

	window.addEventListener('gamepadconnected', e => {
		const { index } = e.gamepad;

		const accessors = gamepadAccessors();
		gamepadCount++;

		let prevDirection;

		function gamepadLoop() {
			const gamepad = window.navigator.getGamepads()[index];
			if (!gamepad || !gamepad.connected) {
				gamepadCount--;
				if (!gamepadCount) {
					gamepadDirection = 0;
				}

				return;
			}

			requestAnimationFrame(gamepadLoop);

			const direction = accessors[gamepadUp](gamepad) - accessors[gamepadDown](gamepad);

			if (prevDirection !== direction) {
				// eslint-disable-next-line no-multi-assign
				gamepadDirection = prevDirection = direction;
				if (!setByMouse && !hasKeyboardInputs()) {
					set(direction);
				}
			}
		}

		gamepadLoop();
	});

	// functions

	function resetMouseInput() {
		setByMouse = false;
		if (hasKeyboardInputs()) {
			setFromKeyboard();
		} else {
			set(gamepadDirection);
		}
	}

	function hasKeyboardInputs() {
		return [up, down].some(key => keyboardState[key]);
	}

	function setFromKeyboard() {
		if (hasKeyboardInputs()) {
			if (keyboardState[up]) {
				set(1);
			} else if (keyboardState[down]) {
				set(-1);
			} else {
				set(0);
			}
		} else {
			set(gamepadDirection);
		}
	}
}

const { setPlaybackVideo, setPlaybackAudio } = initPlayback();
const { subscribeServerReset, subscribeServerMessage, sendServerMessage } = initServerConnection();
const subscribePeer = initAdvertiser(
	`operator-${Math.random().toString(36).substr(2, 9)}`,
	subscribeServerReset,
	subscribeServerMessage,
	sendServerMessage
);
const subscribeAudio = initAudioCapture();
const {
	setSendAudio, sendMessage, sendRequest, subscribeRequest
} = initConnection(subscribePeer, sendServerMessage, subscribeServerMessage, subscribeAudio);

const getControl = initControls(sendMessage);
const getSwitch = initSwitches(sendRequest, subscribeRequest);
const setJoystick = initJoystick(getControl);
const setPrimary = initActuator('primary', getControl);
const setSecondary = initActuator('secondary', getControl);
initFlashlightSwitch(getSwitch);
initCameraSwitch(getSwitch);
initAudioSender(setSendAudio);

initJoystickControl('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'LeftAxisH', 'LeftAxisV', setJoystick);
initActuatorControl('primary', 'KeyW', 'KeyS', 'Up', 'Down', setPrimary);
initActuatorControl('secondary', 'KeyA', 'KeyD', 'Left', 'Right', setSecondary);

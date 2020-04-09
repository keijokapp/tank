const accessors = navigator.userAgent.includes('Firefox')
	? {
		Up(gamepad) { return gamepad.axes[7] < 0; },
		Down(gamepad) { return gamepad.axes[7] > 0; },
		Left(gamepad) { return gamepad.axes[6] < 0; },
		Right(gamepad) { return gamepad.axes[6] > 0; },
		LeftAxisH(gamepad) { return gamepad.axes[3]; },
		LeftAxisV(gamepad) { return gamepad.axes[4]; }
	}
	: {
		Up(gamepad) { return gamepad.buttons[12].value; },
		Down(gamepad) { return gamepad.buttons[13].value; },
		Left(gamepad) { return gamepad.buttons[14].value; },
		Right(gamepad) { return gamepad.buttons[15].value; },
		LeftAxisH(gamepad) { return gamepad.axes[2]; },
		LeftAxisV(gamepad) { return gamepad.axes[3]; }
	};

const subscribers = new Set();
let looping = false;

window.addEventListener('gamepadconnected', e => {
	const {
		index, id, buttons, axes
	} = e.gamepad;
	console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.', index, id, buttons.length, axes.length);

	if (!looping && subscribers.size !== 0) {
		looping = true;
		requestAnimationFrame(loop);
	}
});

window.addEventListener('gamepaddisconnected', () => {
	console.log('Gamepad disconnected');
});

function loop() {
	if (subscribers.size === 0) {
		looping = false;

		return;
	}

	const gamepads = navigator.getGamepads();

	subscribers.forEach(subscriberObject => {
		let value = 0;
		for (const gamepad of gamepads) {
			if (gamepad && gamepad.connected) {
				const gamepadValue = subscriberObject.getter(gamepad);
				if (gamepadValue) {
					value = gamepadValue;
				}
			}
		}

		if (value !== subscriberObject.previousValue) {
			subscriberObject.previousValue = value;
			subscriberObject.subscriber(value)();
		}
	});

	if (gamepads.length === 0) {
		looping = false;

		return;
	}

	requestAnimationFrame(loop);
}

export const subscribe = control => subscriber => () => {
	const subscriberObject = {
		subscriber,
		getter: accessors[control.constructor.name],
		previousValue: 0
	};
	subscribers.add(subscriberObject);
	if (!looping && navigator.getGamepads().length) {
		looping = true;
		requestAnimationFrame(loop);
	}

	return () => {
		subscribers.delete(subscriberObject);
	};
};

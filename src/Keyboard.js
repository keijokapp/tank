const keys = {};

function update(key, isDown) {
	if (!(key in keys)) {
		return false;
	}

	keys[key].forEach(subscriber => {
		if (subscriber.isDown !== isDown) {
			subscriber.isDown = isDown;
			try {
				subscriber.subscriber(isDown)();
			} catch (e) {
				console.error(e);
			}
		}
	});

	return true;
}

window.addEventListener('blur', () => {
	Object.keys(keys).forEach(key => {
		update(key, false);
	});
});

window.addEventListener('keydown', e => {
	if (update(e.code, true)) {
		e.preventDefault();
	}
});

window.addEventListener('keyup', e => {
	if (update(e.code, false)) {
		e.preventDefault();
	}
});

export const subscribe = key => subscriber => () => {
	if (!(key in keys)) {
		keys[key] = new Set();
	}

	const subscriberObject = { subscriber, isDown: false };

	keys[key].add(subscriberObject);

	return () => {
		if (!(key in keys)) {
			return;
		}

		keys[key].delete(subscriberObject);
		if (keys[key].size === 0) {
			delete keys[key];
		}
	};
};

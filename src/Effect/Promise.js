export function thenImpl(promise, onFulfilled, onRejected) {
	return promise.then(onFulfilled, onRejected);
}

export function catchImpl(promise, f) {
	return promise.catch(f);
}

export function resolveImpl(a) {
	return Promise.resolve(a);
}

export function rejectImpl(a) {
	return Promise.reject(a);
}

export function promiseToEffectImpl(promise, onFulfilled, onRejected) {
	return function () {
		return promise.then(a => onFulfilled(a)(), err => onRejected(err)());
	};
}

export function allImpl(arr) {
	return Promise.all(arr);
}

export function raceImpl(arr) {
	return Promise.race(arr);
}

export function liftEffectImpl(eff) {
	return new Promise((onSucc, onErr) => {
		let result;

		try {
			result = eff();
		} catch (err) {
			onErr(err);

			return;
		}

		onSucc(result);
	});
}

export function promiseImpl(callback) {
	return new Promise((resolve, reject) => {
		callback(a => function () {
			resolve(a);
		}, err => function () {
			reject(err);
		})();
	});
}

export function delayImpl(a, ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms, a);
	});
}

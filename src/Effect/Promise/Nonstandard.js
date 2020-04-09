export function doneImpl(onSuccess, onError, promise) {
	return function () {
		// polyfill taken from promisejs.org
		if (typeof Promise.prototype.done !== 'function') {
			// eslint-disable-next-line no-extend-native
			Promise.prototype.done = function (...args) {
				const self = args.length ? this.then.apply(this, ...args) : this;
				self.then(null, err => {
					setTimeout(() => {
						throw err;
					}, 0);
				});
			};
		}
		promise.done(onSuccess, onError);

		return null;
	};
}

export function finallyImpl(promise, eff) {
	// polyfill taken from promisejs.org
	if (typeof Promise.prototype.finally !== 'function') {
		// eslint-disable-next-line no-extend-native
		Promise.prototype.finally = function (f) {
			return this.then(
				value => Promise.resolve(f).then(() => value),
				err => Promise.resolve(f).then(() => { throw err; })
			);
		};
	}

	return promise.finally(eff());
}

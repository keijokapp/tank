exports.nextTick = callback => {
	Promise.resolve().then(callback);
};

exports.nextTick = callback => () => {
	Promise.resolve().then(callback);
};

exports.timestamp = () => {
	return Date.now();
};

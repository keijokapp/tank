exports.setPointerCapture = pointerId => element => () => {
	element.setPointerCapture(pointerId);
};

exports.releasePointerCapture = pointerId => element => () => {
	element.releasePointerCapture(pointerId);
};

exports.hasPointerCapture = pointerId => element => () => {
	return element.hasPointerCapture(pointerId);
};

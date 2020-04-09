export const setPointerCapture = pointerId => element => () => {
	element.setPointerCapture(pointerId);
};

export const releasePointerCapture = pointerId => element => () => {
	element.releasePointerCapture(pointerId);
};

export const hasPointerCapture = pointerId => element => () => element.hasPointerCapture(pointerId);

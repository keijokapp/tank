export const nextTick = callback => () => {
	Promise.resolve().then(callback);
};

export const timestamp = () => Date.now();

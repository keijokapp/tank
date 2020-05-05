const videoSubscribers = new Set();
const audioSubscribers = new Set();
let setFlashLightTimeout = false;
let pendingFlashLight = false;
let pendingFacingMode = 'environment';
let videoTrack;
let audioTrack;

function setFlashLight() {
	videoTrack.applyConstraints({
		advanced: [{ torch: pendingFlashLight }]
	}).catch(e => {
		if (e.message !== 'Unsupported constraint(s)') {
			console.error(e);
		}
	});
}

function captureVideo() {
	if (videoTrack) {
		videoTrack.stop();
	}

	videoTrack = null;

	if (setFlashLightTimeout !== null) {
		clearTimeout(setFlashLightTimeout);
		setFlashLightTimeout = null;
	}

	const facingMode = pendingFacingMode;

	navigator.mediaDevices.getUserMedia({ video: { facingMode } })
		.then(stream => {
			const streamTracks = stream.getTracks();

			if (facingMode !== pendingFacingMode) {
				streamTracks.forEach(track => {
					track.stop();
				});

				captureVideo();
				return;
			}

			if (streamTracks.length !== 1 || streamTracks[0].kind !== 'video') {
				throw new Error('Unexpected track(s)');
			}

			setFlashLightTimeout = setTimeout(() => {
				setFlashLight();
				setFlashLightTimeout = null;
			}, 500);

			[videoTrack] = streamTracks;
			videoSubscribers.forEach(({ subscriber }) => {
				try {
					subscriber(videoTrack)();
				} catch (e) {
					console.error(e);
				}
			});
		});
}

function captureAudio() {
	if (audioTrack) {
		audioTrack.stop();
	}

	audioTrack = null;

	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(stream => {
			const streamTracks = stream.getTracks();
			if (streamTracks.length !== 1 || streamTracks[0].kind !== 'audio') {
				throw new Error('Unexpected track(s)');
			}
			[audioTrack] = streamTracks;
			audioSubscribers.forEach(({ subscriber }) => {
				try {
					subscriber(audioTrack)();
				} catch (e) {
					console.error(e);
				}
			});
		});
}

exports.setFlashLight = flashLight => () => {
	pendingFlashLight = flashLight;
	if (videoTrack !== null && videoTrack !== undefined && setFlashLightTimeout === null) {
		setFlashLight();
	}
};

exports.setFacingMode = facingMode => () => {
	pendingFacingMode = facingMode;
	if (videoTrack !== null && videoTrack !== undefined) {
		captureVideo();
	}
};

exports.subscribeVideoTrack = subscriber => () => {
	const subscriberObject = { subscriber };
	videoSubscribers.add(subscriberObject);

	if (videoTrack === undefined) {
		captureVideo();
	} else if (videoTrack !== null) {
		Promise.resolve().then(() => {
			if (videoTrack && videoSubscribers.has(subscriberObject)) {
				subscriber(videoTrack)();
			}
		});
	}

	return () => {
		videoSubscribers.delete(subscriberObject);
	};
};

exports.subscribeAudioTrack = subscriber => () => {
	const subscriberObject = { subscriber };
	videoSubscribers.add(subscriberObject);

	if (audioTrack === undefined) {
		captureAudio();
	} else if (videoTrack !== null) {
		Promise.resolve().then(() => {
			if (audioTrack && audioSubscribers.has(subscriberObject)) {
				subscriber(audioTrack)();
			}
		});
	}

	return () => {
		audioSubscribers.delete(subscriberObject);
	};
};

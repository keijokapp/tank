const tankVideo = document.getElementById('tankVideo');

const stream = new MediaStream();
tankVideo.srcObject = stream;

exports.setPlaybackVideo = track => () => {
	console.assert(!track || track.kind === 'video');

	stream.getVideoTracks().forEach(track => {
		stream.removeTrack(track);
	});

	if (track) {
		stream.addTrack(track);
	}
};

exports.setPlaybackAudio = track => () => {
	console.assert(!track || track.kind === 'audio');

	stream.getAudioTracks().forEach(track => {
		stream.removeTrack(track);
	});

	if (track) {
		stream.addTrack(track);
	}
};

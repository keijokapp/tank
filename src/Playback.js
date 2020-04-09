const playback = document.getElementById('tankVideo');
const playButton = document.getElementById('play-button');
const stream = new MediaStream();

if (playback) {
	playback.srcObject = stream;

	playButton.addEventListener('click', () => {
		playback.play();
	});

	playback.addEventListener('playing', () => {
		playButton.parentElement.removeChild(playButton);
	});
}

export const setPlaybackVideo = track => () => {
	console.assert(!track || track.kind === 'video');

	stream.getVideoTracks().forEach(track => {
		stream.removeTrack(track);
	});

	if (track) {
		stream.addTrack(track);
	}
};

export const setPlaybackAudio = track => () => {
	console.assert(!track || track.kind === 'audio');

	stream.getAudioTracks().forEach(track => {
		stream.removeTrack(track);
	});

	if (track) {
		stream.addTrack(track);
	}
};

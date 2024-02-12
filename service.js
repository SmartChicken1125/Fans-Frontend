import { en, registerTranslation } from "react-native-paper-dates";
import TrackPlayer from "react-native-track-player";

registerTranslation("en", en);
module.exports = async function () {
	TrackPlayer.addEventListener("remote-play", () => TrackPlayer.play());
	TrackPlayer.addEventListener("remote-pause", () => TrackPlayer.pause());
	TrackPlayer.addEventListener("remote-next", () => TrackPlayer.skipToNext());
	TrackPlayer.addEventListener("remote-previous", () =>
		TrackPlayer.skipToPrevious(),
	);
};

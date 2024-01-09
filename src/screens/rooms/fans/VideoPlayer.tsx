import React from "react";
import { Image, StyleSheet, View } from "react-native";

const VideoPlayer: React.FC = () => {
	return (
		<View style={styles.container}>
			<Image
				source={require("@assets/images/chatroom.jpg")}
				style={styles.videoBackground}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative",
	},
	videoBackground: {
		flex: 1,
		resizeMode: "cover",
		width: "100%",
		height: "100%",
	},
	playPauseButton: {
		position: "absolute",
		alignSelf: "center",
		bottom: 20,
		backgroundColor: "rgba(255, 255, 255, 0.7)",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
	},
});

export default VideoPlayer;

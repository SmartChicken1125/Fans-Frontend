import CameraOn from "@assets/svgs/player/CameraOn";
import Expand from "@assets/svgs/player/Expand";
import MicOff from "@assets/svgs/player/MicOff";
import PhoneOn from "@assets/svgs/player/PhoneOn";
import SoundOn from "@assets/svgs/player/SoundOn";
import { FansIconButton } from "@components/controls";
import React from "react";
import { View, StyleSheet } from "react-native";

interface ChatVideoPlayerProps {
	handleMaximize: () => void;
	handleVideo: () => void;
	handleSound: () => void;
	handleMic: () => void;
	handlePhone: () => void;
}

const ChatVideoPlayer: React.FC<ChatVideoPlayerProps> = ({
	handleMaximize,
	handleVideo,
	handleSound,
	handleMic,
	handlePhone,
}) => {
	return (
		<View style={styles.controlButtonsBackground}>
			<View style={styles.controlButtons}>
				<FansIconButton
					onPress={handleMaximize}
					size={46}
					backgroundColor="bg-fans-white/50"
				>
					<Expand size={22} color="white" />
				</FansIconButton>
				<FansIconButton
					onPress={handleVideo}
					size={46}
					backgroundColor="bg-fans-white"
				>
					<CameraOn size={22} color="black" />
				</FansIconButton>
				<FansIconButton
					onPress={handleSound}
					size={46}
					backgroundColor="bg-fans-white"
				>
					<SoundOn size={22} color="black" />
				</FansIconButton>
				<FansIconButton
					onPress={handleMic}
					size={46}
					backgroundColor="bg-fans-white"
				>
					<MicOff size={22} color="black" />
				</FansIconButton>
				<FansIconButton
					onPress={handlePhone}
					size={46}
					backgroundColor="bg-fans-red"
				>
					<PhoneOn size={22} color="white" />
				</FansIconButton>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	controlButtonsBackground: {
		position: "absolute",
		top: "80%",
		alignSelf: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Grey color with 50% alpha
		borderRadius: 40, // Rounded corners
		paddingVertical: 10, // Adjust vertical padding as needed
		paddingHorizontal: "10%", // Occupy 80% horizontally
		width: "85%", // Set width to occupy 80% of the screen
	},
	controlButtons: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},
});

export default ChatVideoPlayer;

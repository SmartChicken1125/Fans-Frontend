import RoundButton from "@components/common/RoundButton";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import BuyMoreTime from "./BuyMoreTime";
import ChatVideoPlayer from "./ChatVideoPlayer";
import TestScreens from "./TestScreens";
import TributeFee from "./TributeFee";

export const ChatRoom = () => {
	const userName = "John Lennon";

	const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
	const [isTributeFeeVisible, setIsTributeFeeVisible] = useState(false);

	const handleCloseBuyModal = () => {
		setIsBuyModalVisible(false);
	};
	const handleBuyMore = () => {
		setIsBuyModalVisible(true);
	};

	const handleCloseTributeFeeModal = () => {
		setIsTributeFeeVisible(false);
	};
	const handleTributeFeeModal = () => {
		setIsTributeFeeVisible(true);
	};

	const handleMaximize = () => {
		console.log("Maximize");
	};

	const handleVideo = () => {
		console.log("handleVideo");
	};

	const handleSound = () => {
		console.log("handleSound");
	};

	const handleMic = () => {
		console.log("handleMic");
	};

	const handlePhone = () => {
		console.log("handlePhone");
	};

	return (
		<ImageBackground
			source={require("@assets/images/chatroom.jpg")}
			style={styles.container}
		>
			<View style={styles.buttonsContainer}>
				<RoundButton
					onPress={handleBuyMore}
					variant={RoundButtonType.TRANSPARENT_GREY}
				>
					Buy more time
				</RoundButton>

				<RoundButton
					onPress={handleTributeFeeModal}
					variant={RoundButtonType.TRANSPARENT_GREY}
				>
					Tip {userName}
				</RoundButton>
			</View>
			<View style={styles.videoContainer}>
				<TestScreens />
			</View>

			<View style={styles.videoContainer}>
				<ChatVideoPlayer
					handleMaximize={handleMaximize}
					handleVideo={handleVideo}
					handleSound={handleSound}
					handleMic={handleMic}
					handlePhone={handlePhone}
				/>
			</View>

			<BuyMoreTime
				isVisible={isBuyModalVisible}
				onClose={handleCloseBuyModal}
				userName={userName}
				value="15"
				time="15 min"
			/>
			<TributeFee
				isVisible={isTributeFeeVisible}
				onClose={handleCloseTributeFeeModal}
				userName={userName}
				value="15"
				time="15 min"
			/>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 20,
		// position: "absolute",
		top: 20,
		// left: 20,
		// right: 20,
	},
	videoContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-around",
	},
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
	circularButton: {
		alignItems: "center",
		justifyContent: "center",
		width: 46,
		height: 46,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		margin: 5,
	},
});

import { FansIconButton } from "@components/controls";
import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Text } from "react-native";
import CancelVideo from "./CancelVideo";
import OrderVideoCallScreen from "./OrderVideoCall";

interface TestScreensProps {}

const TestScreens: React.FC<TestScreensProps> = (
	// eslint-disable-next-line no-empty-pattern
	{
		/* Add any necessary props */
	},
) => {
	const [screens, setScreens] = useState<{ [key: string]: boolean }>({
		cancelCall: false,
		orderVideo: false,
		sound: false,
		mic: false,
		phone: false,
	});

	const handleScreenToggle = (screen: string) => {
		setScreens((prevScreens) => ({
			...prevScreens,
			[screen]: !prevScreens[screen],
		}));
	};

	const renderButtons = () => {
		const buttons = [
			{
				screen: "cancelCall",
				description: "Cancel Call",
			},
			{
				screen: "orderVideo",
				description: "Order Video Call",
			},
			{
				screen: "sound",
				description: "Sound Screen",
			},
			{
				screen: "mic",
				description: "Microphone Screen",
			},
			{
				screen: "phone",
				description: "Phone Screen",
			},
			// Add more buttons as needed
		];

		return buttons.map((button) => (
			<TouchableOpacity
				key={button.screen}
				onPress={() => handleScreenToggle(button.screen)}
				style={[
					styles.buttonContainer,
					{
						backgroundColor: screens[button.screen]
							? "#ccc"
							: "transparent",
					},
				]}
			>
				<Text style={styles.buttonText}>{button.description}</Text>
			</TouchableOpacity>
		));
	};

	return (
		<View style={styles.controlButtonsBackground}>
			<View style={styles.controlButtons}>{renderButtons()}</View>
			<CancelVideo
				isVisible={screens.cancelCall}
				onClose={() => handleScreenToggle("cancelCall")}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	controlButtonsBackground: {
		position: "absolute",
		top: "80%",
		alignSelf: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 40,
		paddingVertical: 10,
		paddingHorizontal: "10%",
		width: "85%",
	},
	controlButtons: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-around",
	},
	buttonContainer: {
		// padding: 10,
		// marginVertical: 5,
		// borderRadius: 10,
	},
	buttonText: {
		fontSize: 16,
		color: "#fff",
	},
});

export default TestScreens;

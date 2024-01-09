import { FansView, FansText } from "@components/controls";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

interface TimeIncreaseInfoProps {
	time: string;
	value: string;
	onPress?: () => void;
	isActive: boolean;
}

const TimeIncreaseInfo: React.FC<TimeIncreaseInfoProps> = ({
	time,
	value,
	onPress,
	isActive,
}) => {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.8}>
			<FansView
				style={[
					styles.roundedRectangle,
					{ borderColor: isActive ? "#a854f5" : "#f0f0f0" },
				]}
			>
				<FansText
					textAlign="center"
					fontFamily="inter-semibold"
					fontSize={16}
				>
					{time} min
				</FansText>
				<FansText
					textAlign="center"
					fontFamily="inter-semibold"
					fontSize={23}
					color="purple"
				>
					+${value}
				</FansText>
			</FansView>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	roundedRectangle: {
		width: 115,
		height: 77,
		borderRadius: 7,
		borderWidth: 2.3,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 15,
	},
});

export default TimeIncreaseInfo;

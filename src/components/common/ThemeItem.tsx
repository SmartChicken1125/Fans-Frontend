import tw from "@lib/tailwind";
import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icon library

interface ThemeItemProps {
	title?: string;
	selected: boolean;
	empty?: boolean;
	onPress: () => void;
	iconToRender: ReactNode;
	primaryColor: string;
	secondaryColor: string;
	secondaryBorderColor?: string;
}

const ThemeItem: React.FC<ThemeItemProps> = ({
	title,
	selected,
	onPress,
	empty,
	iconToRender,
	primaryColor,
	secondaryColor,
	secondaryBorderColor,
}) => {
	const borderColor = selected
		? tw.style("border border-fans-purple")
		: tw.style("border border-fans-grey");

	const secondaryBorder = secondaryBorderColor
		? secondaryBorderColor
		: "#f0f0f0";

	if (empty) {
		return (
			<TouchableOpacity style={styles.gridItemEmpty}></TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				styles.gridItem,
				{ backgroundColor: primaryColor },
				tw.style(borderColor),
			]}
		>
			<CheckedItem selected={selected} />
			<View
				style={[
					styles.iconContainer,
					{
						top: 29,
						left: 9,
						borderColor: secondaryBorder,
					},
				]}
			>
				<View style={styles.iconCircle}>{iconToRender}</View>
			</View>
			<View
				style={[
					styles.secondarySquare,
					{
						backgroundColor: secondaryColor,
						borderRadius: 7,
						width: "93%",
						height: "50%",
						position: "absolute",
						borderColor: secondaryBorder,
					},
				]}
			/>
		</TouchableOpacity>
	);
};

interface CheckedItemProps {
	selected: boolean;
}

const CheckedItem: React.FC<CheckedItemProps> = ({ selected }) => {
	return (
		<View style={selected ? styles.finishedStep : styles.emptyStep}>
			{selected && <Icon name="check" size={20} color="white" />}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	titleContainer: {
		width: "100%",
		paddingHorizontal: 16,
		paddingBottom: 8,
		backgroundColor: "transparent",
	},
	emptyStep: {
		width: 20,
		height: 20,
		borderRadius: 12.5,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: 5,
		right: 5,
		borderColor: "#f0f0f0",
		backgroundColor: "rgba(46, 46, 46, 0.5)",
	},
	finishedStep: {
		backgroundColor: "#a854f5",
		width: 20,
		height: 20,
		borderRadius: 12.5,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: 5,
		right: 5,
	},
	title: {
		fontSize: 16,
		textAlign: "center",
		color: "#000",
	},
	gridItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		padding: 16,
		marginRight: 16,
		width: 157,
		height: 186,
		borderRadius: 7,
		borderStyle: "solid",
		position: "relative",
	},
	gridItemEmpty: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
		marginRight: 16,
		borderRadius: 10,
		borderWidth: 0,
	},

	iconContainer: {
		position: "absolute",
		zIndex: 1,
	},
	secondarySquare: {
		top: 90,
		left: 9,
		zIndex: 0,
	},
	iconCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		color: "#a854f5",
	},
});

export default ThemeItem;

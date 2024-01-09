import React, { ReactNode } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList,
} from "react-native";

interface StaticGridItemProps {
	title: string;
	iconToRender: ReactNode;
	iconColor?: string;
}

const StaticGridItem: React.FC<StaticGridItemProps> = ({
	title,
	iconToRender,
	iconColor,
}) => {
	return (
		<View style={[styles.gridItem]}>
			<View
				style={[
					styles.iconContainer,
					{
						marginBottom: 16.5,
					},
				]}
			>
				<View
					style={[
						styles.iconCircle,
						{ backgroundColor: `${iconColor}99` },
					]}
				>
					<View style={styles.icon}>{iconToRender}</View>
				</View>

				<Text style={styles.title}>{title}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	gridItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
		marginRight: 16,
		width: 157,
		height: 186,
		flexDirection: "column",
	},
	finishedStep: {
		backgroundColor: "#a854f5", // Purple color
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
		marginTop: 15.5,
	},
	iconCircle: {
		width: 90.4,
		height: 90.4,
		borderRadius: 45.2,
		alignItems: "center",
		justifyContent: "center",
	},
	iconContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		zIndex: 1,
		opacity: 1,
	},
});

export default StaticGridItem;

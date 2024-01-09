import Adult from "@assets/svgs/common/Adult";
import Advice from "@assets/svgs/common/Advice";
import Consultation from "@assets/svgs/common/Consultation";
import Performance from "@assets/svgs/common/Performance";
import SexualContent from "@assets/svgs/common/SexualContent";
import StaticGridItem from "@components/common/StaticGridItem";
import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
const options = [
	{
		id: "Consultation",
		title: "Consultation",
		iconToRender: <Consultation />,
		iconColor: "#edfaea",
	},
	{
		id: "Advice",
		title: "Advice",
		iconToRender: <Advice />,
		iconColor: "#e8f6ff",
	},
	{
		id: "Performance",
		title: "Performance",
		iconToRender: <Performance />,
		iconColor: "#f6edff",
	},
	{
		id: "Adult",
		title: "18+ Adult",
		iconToRender: <Adult />,
		iconColor: "#fdebf9",
	},
	{
		id: "Sexual",
		title: "18+ Sexual",
		iconToRender: <SexualContent />,
		iconColor: "#fff3e9",
	},
	{
		id: "Spirituality",
		title: "Spirituality",
		iconToRender: <Consultation />,
		iconColor: "#fffcdb",
	},
];

export interface Option {
	id: string;
	title: string;
	iconToRender: JSX.Element;
	iconColor: string;
}

interface ProfileThemeProps {
	availableOptionIds: string[]; // List of IDs to display
}

export const ProfileThemeList: React.FC<ProfileThemeProps> = ({
	availableOptionIds,
}) => {
	const filteredOptions = options.filter((option) =>
		availableOptionIds.includes(option.id),
	);
	return (
		<View style={styles.container}>
			{filteredOptions.map((option) => (
				<View key={option.id} style={styles.optionContainer}>
					<StaticGridItem
						title={option.title}
						iconToRender={option.iconToRender}
						iconColor={option.iconColor}
					/>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "flex-start",
		flexDirection: "row",
	},
	optionContainer: {
		margin: 10,
	},
});

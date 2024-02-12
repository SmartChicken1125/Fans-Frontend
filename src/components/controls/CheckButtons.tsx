import tw from "@lib/tailwind";
import { FansCheckButtonsComponent } from "@usertypes/components";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";

export const FansCheckButtons: FansCheckButtonsComponent = (props) => {
	const { data, renderItem, onPress } = props;

	return (
		<ScrollView
			horizontal
			style={tw.style(
				"h-fans-checkbuttons",
				"bg-fans-grey dark:bg-fans-grey-43",
				"px-[5px]",
				"rounded-full",
			)}
			contentContainerStyle={tw.style("flex-row gap-[5px] items-center")}
			showsHorizontalScrollIndicator={false}
		>
			{data.map((item, index) => {
				const { id } = item;

				return (
					<TouchableOpacity onPress={() => onPress(id)} key={index}>
						{renderItem(item)}
					</TouchableOpacity>
				);
			})}
		</ScrollView>
	);
};

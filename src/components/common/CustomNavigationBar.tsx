import tw from "@lib/tailwind";
import { getHeaderTitle } from "@react-navigation/elements";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import { Text } from "react-native";
import { Appbar } from "react-native-paper";

export default function CustomNavigationBar({
	navigation,
	route,
	options,
	back,
}: NativeStackHeaderProps) {
	const title = getHeaderTitle(options, route.name);

	return (
		<Appbar.Header style={tw`border-b-[1px] border-fans-grey`}>
			{back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
			<Appbar.Content
				title={
					<Text
						style={tw`text-center text-[19px] font-inter-bold text-black leading-[26px] ${
							back ? "pr-10" : ""
						}`}
					>
						{title}
					</Text>
				}
				style={tw`mx-auto text-center`}
			/>
		</Appbar.Header>
	);
}

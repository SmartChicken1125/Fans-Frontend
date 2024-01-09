import tw from "@lib/tailwind";
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type Props = {
	title: string;
	onClick: () => void;
};

export default function OutlineButton({ title, onClick }: Props) {
	return (
		<TouchableOpacity
			onPress={() => onClick}
			style={tw`py-[7px] border border-fans-purple rounded-full flex-row justify-center px-[30px]`}
		>
			<Text style={tw`text-fans-purple text-sm font-bold`}>{title}</Text>
		</TouchableOpacity>
	);
}

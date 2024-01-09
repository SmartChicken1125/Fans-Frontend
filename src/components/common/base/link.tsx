import tw from "@lib/tailwind";
import { IFypLink } from "@usertypes/components";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { FypText } from "./text";

export const FypLink: IFypLink = (props) => {
	const router = useRouter();
	const { url, onPress, hideUnderline, style, ..._props } = props;
	return (
		<TouchableOpacity
			onPress={() => {
				onPress && onPress();
				url && router.push(url);
			}}
		>
			<FypText
				style={[tw.style(hideUnderline ? "" : "underline"), style]}
				{..._props}
			/>
		</TouchableOpacity>
	);
};

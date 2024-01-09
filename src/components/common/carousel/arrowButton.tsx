import { ChevronLeftSvg, ChevronRightSvg } from "@assets/svgs/common";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";

interface Props {
	onPress?: () => void;
	style?: ViewStyle;
	type: "left" | "right";
	hide?: boolean;
}

const ArrowButton: FC<Props> = (props) => {
	const { style, onPress, type, hide } = props;
	return (
		<IconButton
			icon={() =>
				type === "left" ? (
					<ChevronLeftSvg size={15} color="#fff" />
				) : (
					<ChevronRightSvg size={15} color="#fff" />
				)
			}
			style={[
				tw.style(
					"absolute z-10 bg-black/50 p-0 m-0 w-[25px] h-[25px] md:w-7.5 md:h-7.5",
					hide && "hidden",
				),
				style,
			]}
			onPress={onPress}
		/>
	);
};

export default ArrowButton;

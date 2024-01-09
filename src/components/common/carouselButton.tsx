import { ChevronLeftSvg, ChevronRightSvg } from "@assets/svgs/common";
import { FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { ViewStyle } from "react-native";

interface Props {
	onPress?: () => void;
	style?: ViewStyle;
	type: "left" | "right";
	hide?: boolean;
}

const CarouselButton: FC<Props> = (props) => {
	const { style, onPress, type, hide } = props;
	return (
		<FansIconButton
			size={25}
			backgroundColor="bg-fans-black/50 dark:bg-fans-white/50"
			style={[
				tw.style("absolute z-10 md:w-7.5 md:h-7.5", hide && "hidden"),
				style,
			]}
			onPress={onPress}
		>
			{type === "left" ? (
				<ChevronLeftSvg size={15} color="#fff" />
			) : (
				<ChevronRightSvg size={15} color="#fff" />
			)}
		</FansIconButton>
	);
};

export default CarouselButton;

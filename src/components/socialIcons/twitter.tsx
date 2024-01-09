import { TwitterSvg } from "@assets/svgs/common";
import tw from "@lib/tailwind";
import { ComponentSizeTypes } from "@usertypes/commonEnums";
import { getIconSize } from "@utils/common";
import { clsx } from "clsx";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	size: ComponentSizeTypes;
}

const Twitter: FC<Props> = (props) => {
	const { size } = props;

	const styles = clsx(
		"rounded-full items-center justify-center bg-[#00acee]",
		{
			"w-6 h-6": size === ComponentSizeTypes.xs,
			"w-[34px] h-[34px]": size === ComponentSizeTypes.sm, // 34px
			"w-[42px] h-[42px]": size === ComponentSizeTypes.md, // 42px
		},
	);

	return (
		<View style={tw.style(styles)}>
			<TwitterSvg
				color="#fff"
				width={getIconSize(22.22, 22.28, size).width}
				height={getIconSize(22.22, 22.28, size).height}
			/>
		</View>
	);
};

export default Twitter;

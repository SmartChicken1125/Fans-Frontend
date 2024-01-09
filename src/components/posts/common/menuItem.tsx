import { FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

interface Props extends TouchableOpacityProps {
	title: string;
	icon: React.ReactNode;
	labelClass?: string;
	endIcon?: React.ReactNode;
}

const MenuItem: FC<Props> = (props) => {
	const { title, icon, labelClass, endIcon, ...others } = props;

	return (
		<TouchableOpacity
			style={tw.style("flex-row items-center px-[18px] h-[52px]")}
			{...others}
		>
			<FansView
				width={28}
				alignItems="center"
				justifyContent="center"
				margin={{ r: 18 }}
			>
				{icon}
			</FansView>
			<FypText
				fontSize={18}
				lineHeight={24}
				style={tw.style(
					"text-fans-black dark:text-fans-white",
					labelClass,
				)}
			>
				{title}
			</FypText>
			<FansView style={tw.style("ml-auto")}>{endIcon}</FansView>
		</TouchableOpacity>
	);
};

export default MenuItem;

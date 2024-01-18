import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { FansViewProps } from "@usertypes/components";
import React, { FC } from "react";
import { Pressable, PressableProps, TextStyle, ViewStyle } from "react-native";
import { FypNullableView } from "./nullableView";
import { FypText } from "./text";

interface Props extends PressableProps {
	children: React.ReactNode;
	textStyle?: TextStyle;
	icon?: React.ReactNode;
}

export const FypButton: FC<Props> = (props) => {
	const { children, textStyle, style, icon, ..._props } = props;
	return (
		<Pressable
			style={[
				tw.style("flex-row items-center justify-center"),
				style as ViewStyle,
			]}
			{..._props}
		>
			<FypNullableView visible={!!icon}>{icon}</FypNullableView>
			<FypText style={textStyle}>{children}</FypText>
		</Pressable>
	);
};

interface IFypButton2Props extends FansViewProps {
	children: React.ReactNode;
	textStyle?: TextStyle;
	icon?: React.ReactNode;
}

export const FypButton2: FC<IFypButton2Props> = (props) => {
	const { children, textStyle, style, icon, ..._props } = props;
	return (
		<FansView
			flex="1"
			flexDirection="row"
			alignItems="center"
			justifyContent="center"
			borderRadius={42}
			height={42}
			style={[style]}
			{..._props}
		>
			<FypNullableView visible={!!icon}>{icon}</FypNullableView>
			<FypText
				fontSize={19}
				fontWeight={700}
				lineHeight={26}
				style={textStyle}
			>
				{children}
			</FypText>
		</FansView>
	);
};

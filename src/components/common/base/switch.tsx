import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IJustifyContentStyle } from "@usertypes/styles";
import React, { FC, useEffect } from "react";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { FypText } from "./text";

interface Props {
	value: boolean;
	onValueChange: (val: boolean) => void;
	primary?: boolean;
	label?: string;
	justifyContent?: IJustifyContentStyle;
	minHeight?: number;
}

export const FypSwitch: FC<Props> = (props) => {
	const {
		value,
		onValueChange,
		primary = true,
		label,
		justifyContent,
		minHeight,
	} = props;

	const offset = useSharedValue(0);

	const timingStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withTiming(offset.value * 14.4 + 3.8, {
						duration: 300,
						easing: Easing.bezier(0.5, 0.01, 0, 1),
					}),
				},
			],
		};
	});

	useEffect(() => {
		offset.value = value ? 1 : 0;
	}, [value]);

	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			justifyContent={justifyContent ?? "between"}
			style={tw.style(minHeight ? `min-h-[${minHeight}px]` : "")}
		>
			{label ? (
				<FypText fontSize={18} lineHeight={24}>
					{label}
				</FypText>
			) : null}
			<FansView
				width={40}
				height={26}
				borderRadius={26}
				position="relative"
				style={tw.style(
					primary
						? {
								"bg-fans-purple": value,
								"bg-[#b1b1b1]": !value,
						  }
						: {
								"bg-fans-green": value,
								"bg-[#b1b1b1]": !value,
						  },
				)}
				pressableProps={{
					onPress: () => onValueChange(!value),
				}}
			>
				<Animated.View
					style={[
						tw.style(
							"w-[18px] h-[18px] bg-white rounded-full absolute top-1",
						),
						timingStyles,
					]}
				></Animated.View>
			</FansView>
		</FansView>
	);
};

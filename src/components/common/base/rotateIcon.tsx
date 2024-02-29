import tw from "@lib/tailwind";
import React, { FC, useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

interface Props {
	rotated: boolean;
	children: React.ReactNode;
	style?: ViewStyle;
}

const RotateIcon: FC<Props> = (props) => {
	const { children, style, rotated } = props;
	const rotate = useSharedValue(0);

	const animationStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotate: withTiming(`${rotate.value}deg`, {
						duration: 300,
						easing: Easing.bezier(0.5, 0.01, 0, 1),
					}),
				},
			],
		};
	});

	useEffect(() => {
		rotate.value = rotated ? 180 : 0;
	}, [rotated]);

	return (
		<Animated.View
			style={[
				tw.style("items-center justify-center"),
				style,
				animationStyle,
			]}
		>
			{children}
		</Animated.View>
	);
};

export default RotateIcon;

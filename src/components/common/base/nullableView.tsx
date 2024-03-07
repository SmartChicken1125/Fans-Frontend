import React, { FC, useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

interface Props {
	visible: boolean;
	animated?: boolean;
	children: React.ReactNode;
	style?: ViewStyle;
}

export const FypNullableView: FC<Props> = (props) => {
	const { visible, children, animated, style } = props;
	const opacity = useSharedValue(1);
	const animationStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});
	if (!animated) {
		return visible ? children : null;
	}
	useEffect(() => {
		opacity.value = withTiming(visible ? 1 : 0, {
			duration: 500,
			easing: Easing.linear,
		});
	}, [visible]);
	return visible ? (
		<Animated.View style={[animationStyle, style]}>
			{children}
		</Animated.View>
	) : null;
};

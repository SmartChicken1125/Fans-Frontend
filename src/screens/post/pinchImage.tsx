import tw from "@lib/tailwind";
import React from "react";
import { View, Text, Image, Animated } from "react-native";
import {
	Gesture,
	GestureDetector,
	PinchGestureHandler,
	GestureEvent,
	PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { useSharedValue, useAnimatedStyle } from "react-native-reanimated";

const PinchImage = () => {
	const scale = useSharedValue(1);
	const savedScale = useSharedValue(1);

	const pinchGesture = Gesture.Pinch()
		.onUpdate((e) => {
			console.log(e);
			scale.value = savedScale.value * e.scale;
		})
		.onEnd(() => {
			savedScale.value = scale.value;
		});

	const handlePinch = (e: GestureEvent<PinchGestureHandlerEventPayload>) => {
		console.log(e);
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<GestureDetector gesture={pinchGesture}>
			<Animated.View
				style={[tw.style("h-30 w-30 bg-fans-purple"), animatedStyle]}
			>
				<Image
					source={require("@assets/images/background/login-banner.webp")}
					style={tw.style("w-full h-full")}
				/>
			</Animated.View>
		</GestureDetector>
	);
};

export default PinchImage;

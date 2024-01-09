import tw from "@lib/tailwind";
import React, { FC, memo } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { PROGRESS_ACTIVE_COLOR, PROGRESS_COLOR } from "../core/constants";
import { StoryProgressItemProps } from "../core/dto/componentsDTO";

const AnimatedView = Animated.createAnimatedComponent(View);

const ProgressItem: FC<StoryProgressItemProps> = ({
	progress,
	active,
	activeStory,
	index,
	width,
	progressActiveColor = PROGRESS_ACTIVE_COLOR,
	progressColor = PROGRESS_COLOR,
}) => {
	const animatedStyle = useAnimatedStyle(() => {
		if (!active.value || activeStory.value < index) {
			return { width: 0 };
		}

		if (activeStory.value > index) {
			return { width };
		}

		return { width: width * progress.value };
	});

	return (
		<View
			style={[
				tw.style("height-[3px] rounded-[8px]"),
				{ backgroundColor: progressColor, overflow: "hidden" },
				{ width },
			]}
		>
			<AnimatedView
				style={[
					tw.style("height-[3px] rounded-[8px]"),
					{
						backgroundColor: progressActiveColor,
						overflow: "hidden",
					},
					animatedStyle,
				]}
			/>
		</View>
	);
};

export default memo(ProgressItem);

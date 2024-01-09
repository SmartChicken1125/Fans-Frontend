import tw from "@lib/tailwind";
import React, { FC, memo, useState, useMemo } from "react";
import { View } from "react-native";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { StoryContentProps } from "../core/dto/componentsDTO";

const StoryContent: FC<StoryContentProps> = ({
	stories,
	active,
	activeStory,
}) => {
	const [storyIndex, setStoryIndex] = useState(0);

	const onChange = async () => {
		"worklet";

		const index = stories.findIndex(
			(item) => item.id === activeStory.value,
		);
		if (active.value && index >= 0 && index !== storyIndex) {
			runOnJS(setStoryIndex)(index);
		}
	};

	useAnimatedReaction(
		() => activeStory.value,
		(res, prev) => res !== prev && onChange(),
		[activeStory.value],
	);

	const content = useMemo(
		() => stories[storyIndex]?.renderContent?.(),
		[storyIndex],
	);

	return content ? (
		<View
			style={tw.style("absolute top-0 left-0 bottom-0 right-0")}
			pointerEvents="box-none"
		>
			{content}
		</View>
	) : null;
};

export default memo(StoryContent);

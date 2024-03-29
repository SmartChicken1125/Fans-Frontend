import tw from "@lib/tailwind";
import React, { FC, memo } from "react";
import Animated, {
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
} from "react-native-reanimated";
import StoryAnimation from "./animation";
import StoryContent from "./content";
import { WIDTH, HEIGHT } from "./core/constants";
import { StoryListProps } from "./core/dto/componentsDTO";
import StoryHeader from "./header";
import StoryImage from "./image";
import Progress from "./progress";

const StoryList: FC<StoryListProps> = ({
	id,
	stories,
	index,
	x,
	activeUser,
	activeStory,
	progress,
	seenStories,
	paused,
	onLoad,
	videoProps,
	progressColor,
	progressActiveColor,
	...props
}) => {
	const imageHeight = useSharedValue(HEIGHT);
	const isActive = useDerivedValue(() => activeUser.value === id);

	const activeStoryIndex = useDerivedValue(() =>
		stories.findIndex((item) => item.id === activeStory.value),
	);

	const animatedStyles = useAnimatedStyle(() => ({
		height: imageHeight.value,
	}));

	const onImageLayout = (height: number) => {
		imageHeight.value = height;
	};

	const lastSeenIndex = stories.findIndex(
		(item) => item.id === seenStories.value[id],
	);

	return (
		<StoryAnimation x={x} index={index}>
			<Animated.View
				style={[
					animatedStyles,
					tw.style("rounded-0"),
					{ overflow: "hidden", width: WIDTH },
				]}
			>
				<StoryImage
					stories={stories}
					activeStory={activeStory}
					defaultImage={
						stories[lastSeenIndex + 1]?.sourceUrl ??
						stories[0]?.sourceUrl
					}
					isDefaultVideo={
						(stories[lastSeenIndex + 1]?.mediaType ??
							stories[0]?.mediaType) === "video"
					}
					onImageLayout={onImageLayout}
					onLoad={onLoad}
					paused={paused}
					isActive={isActive}
					videoProps={videoProps}
				/>
				<Progress
					active={isActive}
					activeStory={activeStoryIndex}
					progress={progress}
					length={stories.length}
					progressColor={progressColor}
					progressActiveColor={progressActiveColor}
				/>
				<StoryHeader {...props} />
				<StoryContent
					stories={stories}
					active={isActive}
					activeStory={activeStory}
				/>
			</Animated.View>
		</StoryAnimation>
	);
};

export default memo(StoryList);

import tw from "@lib/tailwind";
import React, { FC, memo } from "react";
import { View } from "react-native";
import { WIDTH } from "../core/constants";
import { StoryProgressProps } from "../core/dto/componentsDTO";
import ProgressItem from "./item";

const Progress: FC<StoryProgressProps> = ({
	progress,
	active,
	activeStory,
	length,
	progressActiveColor,
	progressColor,
}) => {
	const leftValue = 16;
	const gapValue = 4;
	const width = (WIDTH - leftValue * 2 - (length - 1) * gapValue) / length;

	return (
		<View
			style={[
				tw.style("absolute top-4 left-4 h-[2px] flex-row gap-1"),
				{ width: WIDTH },
			]}
		>
			{[...Array(length).keys()].map((val) => (
				<ProgressItem
					active={active}
					activeStory={activeStory}
					progress={progress}
					index={val}
					width={width}
					key={val}
					progressActiveColor={progressActiveColor}
					progressColor={progressColor}
				/>
			))}
		</View>
	);
};

export default memo(Progress);

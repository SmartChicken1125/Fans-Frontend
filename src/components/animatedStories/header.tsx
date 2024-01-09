import { CloseSvg } from "@assets/svgs/common";
import tw from "@lib/tailwind";
import React, { FC, memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { WIDTH } from "./core/constants";
import { StoryHeaderProps } from "./core/dto/componentsDTO";

const StoryHeader: FC<StoryHeaderProps> = ({
	imgUrl,
	name,
	onClose,
	avatarSize,
	textStyle,
	buttonHandled,
	closeColor,
}) => {
	const styles = {
		width: avatarSize,
		height: avatarSize,
		borderRadius: avatarSize,
	};
	const leftValue = 16;
	const width = WIDTH - leftValue * 2;

	return (
		<View
			style={[
				tw.style(
					"absolute flex-row justify-between items-center left-4 top-8",
				),
				{ width },
			]}
		>
			<View style={tw.style("flex-row items-center gap-3")}>
				{Boolean(imgUrl) && (
					<View
						style={[
							tw.style("border-[1.5px] border-white"),
							{ overflow: "hidden" },
							{ borderRadius: styles.borderRadius },
						]}
					>
						<Image source={{ uri: imgUrl }} style={styles} />
					</View>
				)}
				{Boolean(name) && <Text style={textStyle}>{name}</Text>}
			</View>
			<TouchableOpacity
				onPress={onClose}
				hitSlop={16}
				testID="storyCloseButton"
				onPressIn={() => {
					buttonHandled.value = true;
				}}
			>
				<Text>Close</Text>
			</TouchableOpacity>
		</View>
	);
};

export default memo(StoryHeader);

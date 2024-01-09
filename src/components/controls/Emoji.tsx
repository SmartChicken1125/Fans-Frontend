import { FansEmojiComponent } from "@usertypes/components";
import React from "react";
import { FansText } from "./Text";

export const FansEmoji: FansEmojiComponent = (props) => {
	const { emoji, size, ...props_ } = props;

	const emojis = ["", "❤", "😂", "😮", "🔥", "👍", "👎"];

	return (
		<FansText fontSize={size} {...props_}>
			{emojis[emoji]}
		</FansText>
	);
};

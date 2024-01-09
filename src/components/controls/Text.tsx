import tw from "@lib/tailwind";
import { IFansText } from "@usertypes/components";
import {
	getFontSizeStyle,
	getLetterSpacingStyle,
	getLineHeightStyle,
	getTextColorStyle,
} from "@usertypes/styles";
import React from "react";
import { Text } from "react-native";

export const FansText: IFansText = (props) => {
	const {
		style,
		color,
		fontFamily = "inter-regular",
		fontSize,
		letterSpacing,
		lineHeight,
		textAlign,
		textDecorationLine,
		textTransform,
		...props_
	} = props;

	const styles = [];
	styles.push(`font-${fontFamily}`);
	color
		? styles.push(getTextColorStyle(color))
		: styles.push("text-fans-black dark:text-fans-white");
	fontSize && styles.push(getFontSizeStyle(fontSize));
	letterSpacing && styles.push(getLetterSpacingStyle(letterSpacing));
	lineHeight && styles.push(getLineHeightStyle(lineHeight));
	textAlign && styles.push(`text-${textAlign}`);
	textDecorationLine && styles.push(textDecorationLine);
	textTransform && styles.push(textTransform);

	return <Text style={[tw.style(styles), style]} {...props_} />;
};

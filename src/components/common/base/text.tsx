import tw from "@lib/tailwind";
import { IFypText } from "@usertypes/components";
import {
	getFontSizeStyle,
	getFontWeightStyle,
	getLetterSpacingStyle,
	getLineHeightStyle,
	getMarginStyle,
	getTextColorStyle,
} from "@usertypes/styles";
import React from "react";
import { Text } from "react-native";

export const FypText: IFypText = (props) => {
	const {
		style,
		color,
		fontWeight = 400,
		fontSize,
		letterSpacing,
		lineHeight,
		textAlign,
		textDecorationLine,
		textTransform,
		fontFamily,
		children,
		margin,
		...props_
	} = props;

	const styles = ["text-fans-black dark:text-fans-white"];
	styles.push(getFontWeightStyle(fontWeight, fontFamily));
	color && styles.push(getTextColorStyle(color));
	fontSize && styles.push(getFontSizeStyle(fontSize));
	letterSpacing && styles.push(getLetterSpacingStyle(letterSpacing));
	lineHeight && styles.push(getLineHeightStyle(lineHeight));
	textAlign && styles.push(`text-${textAlign}`);
	textDecorationLine && styles.push(textDecorationLine);
	textTransform && styles.push(textTransform);
	margin && styles.push(getMarginStyle(margin));

	return (
		<Text
			style={[tw.style(styles), { overflow: "hidden" }, style]}
			{...props_}
		>
			{children}
		</Text>
	);
};

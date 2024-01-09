import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Text, TextProps } from "react-native";

interface Props extends TextProps {
	variant?: "title" | "subtitle" | "text" | "link";
	marginBottom?: number;
}

const TermsText: FC<Props> = (props) => {
	const { variant = "text", marginBottom = 0, style, ...baseProps } = props;

	const styles = tw.style(
		"text-fans-black dark:text-fans-white",
		variant === "title" && "text-[23px] leading-[31px] font-bold",
		variant === "subtitle" && "text-[18px] leading-6 font-semibold",
		variant === "text" && "text-base leading-[21px]",
		variant === "link" &&
			"text-base leading-[21px] text-fans-purple underline dark:text-fans-purple",
	);

	return (
		<Text
			style={[{ marginBottom: marginBottom }, styles, style]}
			{...baseProps}
		/>
	);
};

export default TermsText;

import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View, ViewProps } from "react-native";

interface Props extends ViewProps {}

const SingleContentContainer: FC<Props> = (props) => {
	const { children, style } = props;
	return (
		<View
			style={[style, tw.style("md:max-w-[674px] md:mx-auto md:w-full")]}
		>
			{children}
		</View>
	);
};

export default SingleContentContainer;

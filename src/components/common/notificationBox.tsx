import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View, ViewProps } from "react-native";

interface Props extends ViewProps {}

const NotificationBox: FC<Props> = (props) => {
	const { style, children, ..._others } = props;
	return (
		<View
			style={[
				tw.style(
					"px-5 pt-[18px] pb-5 bg-fans-purple-light rounded-[15px]",
				),
				style,
			]}
			{..._others}
		>
			{children}
		</View>
	);
};

export default NotificationBox;

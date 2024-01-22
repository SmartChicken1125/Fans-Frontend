import tw from "@lib/tailwind";
import { FansIconButtonComponent } from "@usertypes/components";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export const FansIconButton: FansIconButtonComponent = (props) => {
	const { children, size, backgroundColor, ...props_ } = props;
	const styles = [];
	backgroundColor
		? styles.push(backgroundColor)
		: styles.push("bg-fans-grey");

	return (
		<TouchableOpacity {...props_}>
			<View
				style={[
					tw.style(
						"w-fans-iconbutton h-fans-iconbutton",
						"justify-center items-center",
						"rounded-full",
						styles,
					),
					{
						width: size,
						height: size,
					},
				]}
			>
				{children}
			</View>
		</TouchableOpacity>
	);
};

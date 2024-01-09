import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface Props extends TouchableOpacityProps {
	icon: string;
}

const EmojiCell: FC<Props> = (props) => {
	const { icon, ...other } = props;

	return (
		<TouchableOpacity {...other}>
			<Text style={tw.style("text-[20px]")}>{icon}</Text>
		</TouchableOpacity>
	);
};

export default EmojiCell;
